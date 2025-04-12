import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../../db";
import Order from "../../../../models/Order";
import Coupon from "../../../../models/Coupon";
import Product from "../../../../models/Product";
import User from "../../../../models/User";
import "../../../../models/Address";
import "../../../../models/Exchange";
import Address from "../../../../models/Address";

connectDB();

// Helper function to generate exerciseId
const generateOrderId = async (): Promise<string> => {
  const lastOrder = await Order.findOne().sort({ createdAt: -1 });
  if (lastOrder && lastOrder !== null && lastOrder.orderId) {
    const lastIdNumber = parseInt(lastOrder.orderId.split("-")[1]);
    const newIdNumber = lastIdNumber + 1;
    return `ON-${newIdNumber.toString().padStart(6, "0")}`;
  }
  return "ON-000001";
};

export const POST = async (req: NextRequest) => {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json(
        { success: false, msg: "Please provide User Id" },
        { status: 400 }
      );
    }
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, msg: "Unauthorized" },
        { status: 401 }
      );
    }
    const body = await req.json();
    const { productDetails, couponCode } = body;
    console.log(couponCode, "couponcode");

    // Validate input
    if (
      !userId ||
      !productDetails ||
      !Array.isArray(productDetails) ||
      productDetails.length === 0
    ) {
      return NextResponse.json(
        { success: false, msg: "Invalid input" },
        { status: 400 }
      );
    }

    // Fetch unique product details from the database
    const uniqueProductIds = [
      ...new Set(productDetails.map((pd) => pd.product)),
    ];
    const products = await Product.find({ _id: { $in: uniqueProductIds } });

    if (products.length !== uniqueProductIds.length) {
      return NextResponse.json(
        { success: false, msg: "Some products not found" },
        { status: 404 }
      );
    }

    // Calculate total actual price and total offer price
    let totalActualPrice = 0;
    let totalOfferPrice = 0;
    let totalQuantity = 0;
    let shippingCost = 0;

    const outOfStockProducts: string[] = [];
    const processedProductDetails = productDetails
      .map((pd) => {
        const product = products.find((p) => p._id.toString() === pd.product);

        if (product) {
          const quantity = pd.count || 1;
          const selectedSize = pd.size;

          // Find the size object from the product's sizes array
          const sizeObj = product.sizes.find(
            (size: any) => size._id.toString() === selectedSize
          );

          if (!sizeObj || sizeObj.stock < quantity) {
            outOfStockProducts.push(product._id.toString());
            return null;
          } else {
            // Update total prices
            totalActualPrice += product.actualPrice * quantity;
            if (quantity % 4 === 0 && sizeObj.comboPrice) {
              totalOfferPrice += sizeObj.comboPrice * (quantity / 4);
            } else if (quantity > 4 && sizeObj.comboPrice) {
              const forComboPrice =
                sizeObj.comboPrice * Math.floor(quantity / 4);
              const remainingProductPrice =
                (sizeObj.offerPrice || product.actualPrice) * (quantity % 4);
              totalOfferPrice += remainingProductPrice + forComboPrice;
            } else {
              totalOfferPrice +=
                (sizeObj.offerPrice || product.actualPrice) * quantity;
            }
            totalQuantity += quantity;
            shippingCost =
              totalQuantity === 0 ? 0 : 45 + 24 * (totalQuantity - 1);

            // Return the product and size details statically
            return {
              product: product,
              size: sizeObj,
              count: quantity,
            };
          }
        }
        return null;
      })
      .filter((pd) => pd !== null);

    // If there are out-of-stock products, return them in the response
    if (outOfStockProducts.length > 0) {
      return NextResponse.json(
        {
          success: false,
          msg: "Some products are out of stock",
          outOfStockProducts,
        },
        { status: 400 }
      );
    }

    // Calculate discount based on the coupon code
    let discount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({ couponCode });
      console.log(coupon, "coupon");
      if (coupon) {
        const isValid =
          coupon.validity &&
          new Date(coupon.validity) > new Date() &&
          coupon.availableFor > coupon.userCount &&
          coupon.purchaseAmount <= totalOfferPrice;

        console.log(isValid, "isvalid");
        const hasUserUsedCoupon = coupon.user.includes(userId);
        if (isValid && (!hasUserUsedCoupon || coupon.multiUse)) {
          if (coupon.type === "percentage") {
            discount = (totalOfferPrice * coupon.off) / 100;
            discount = Math.min(discount, coupon.amount);
          } else if (coupon.type === "flat") {
            discount = coupon.off;
            discount = Math.min(discount, coupon.amount);
          }
          // discount = Math.min(discount, totalOfferPrice); // Discount should not exceed total offer price

          // If multiUse is false, add userId to coupon's userId array
          if (!coupon.multiUse) {
            coupon.user.push(userId);
          }
          // Increment userCount
          coupon.userCount += 1;
          await coupon.save();
        }
      }
    }

    const generatedOrderId = await generateOrderId();

    // Calculate Shipping Cost
    // const shippingCost = processedProductDetails.reduce((sum, v)=>sum+(v.count*70), 0);

    // shippingCost = shippingCost;

    // Calculate the total payable price
    let totalPayablePrice = totalOfferPrice - discount + shippingCost;
    totalPayablePrice = Math.max(totalPayablePrice, 1);

    const shippingAddress = await Address.findById(user.defaultAddress);

    // Create and save the order
    const newOrder = new Order({
      orderId: generatedOrderId,
      user: userId,
      productDetails: processedProductDetails,
      totalPrice: totalActualPrice,
      payablePrice: totalPayablePrice,
      off: discount,
      shippingAddress,
    });

    await newOrder.save();

    // Return the total payable price in the response
    return NextResponse.json(
      {
        success: true,
        msg: "Order created successfully",
        orderDetails: newOrder,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error to create order", error);
    return NextResponse.json(
      { success: false, msg: "Internal Server Error" },
      { status: 500 }
    );
  }
};

export const GET = async (req: NextRequest) => {
  try {
    const userId = req.headers.get("x-user-id");

    const orders = await Order.find({ user: userId }).populate(["user"]).lean();
    // Manually populate the size details from the product's sizes array
    //  const populatedOrders = await Promise.all(
    //   orders.map(async (order: any) => {
    //     const populatedProductDetails = await Promise.all(
    //       order.productDetails.map(async (detail: any) => {
    //         const product = detail.product;
    //         const sizeDetail = product.sizes.find(
    //           (size: any) => String(size._id) === String(detail.size)
    //         );
    //         return {
    //           ...detail,
    //           sizeDetail, // Attach the size detail to the order
    //         };
    //       })
    //     );
    //     return {
    //       ...order,
    //       productDetails: populatedProductDetails,
    //     };
    //   })
    // );
    return NextResponse.json(
      { success: true, msg: "Success", orders: orders },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error to get order", error);
    return NextResponse.json(
      { success: false, msg: "Internal Server Error" },
      { status: 500 }
    );
  }
};
