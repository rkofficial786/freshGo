import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../../db";
import Order from "../../../../models/Order";
import Product from "../../../../models/Product";
import User from "../../../../models/User";
import "../../../../models/Address";

connectDB();

// Helper function to generate order ID
const generateOrderId = async () => {
  const lastOrder = await Order.findOne().sort({ createdAt: -1 });
  if (lastOrder && lastOrder.orderId) {
    const lastIdNumber = parseInt(lastOrder.orderId.split("-")[1]);
    const newIdNumber = lastIdNumber + 1;
    return `GRO-${newIdNumber.toString().padStart(6, "0")}`;
  }
  return "GRO-000001";
};

export const POST = async (req: NextRequest) => {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json(
        { success: false, msg: "Please login to place an order" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId).populate("defaultAddress");
    if (!user) {
      return NextResponse.json(
        { success: false, msg: "User not found" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      items,
      couponDiscount = 0,
      shippingAddressId,
      paymentMethod = "COD",
    } = body;

    // Validate input
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, msg: "Your cart is empty" },
        { status: 400 }
      );
    }

    // Fetch product details from the database
    const productIds = items.map((item) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    // Calculate order totals
    let subtotal = 0;
    let mrpTotal = 0;
    let shippingCost = 40; // Default shipping cost

    // Process order items
    const orderItems = items
      .map((item) => {
        const product = products.find(
          (p) => p._id.toString() === item.productId
        );

        if (!product) return null;

        // Calculate item price
        const itemTotal = product.price * item.quantity;
        const itemMrp = (product.mrp || product.price) * item.quantity;

        subtotal += itemTotal;
        mrpTotal += itemMrp;

        return {
          product: product._id,
          name: product.name,
          price: product.price,
          mrp: product.mrp || product.price,
          quantity: item.quantity,
          total: itemTotal,
          img: product.img,
        };
      })
      .filter((item) => item !== null);

    // Apply free shipping if order subtotal > 499
    if (subtotal > 499) {
      shippingCost = 0;
    }

    // Calculate tax (GST - 5%)
    const tax = Math.round((subtotal - couponDiscount) * 0.05 * 100) / 100;

    // Calculate the total payable amount
    const total =
      Math.round((subtotal - couponDiscount + shippingCost + tax) * 100) / 100;

    // Get shipping address - either specified one or default
    let shippingAddress;

    if (shippingAddressId) {
      shippingAddress = user.address?.find(
        (addr) => addr._id.toString() === shippingAddressId
      );
    } else if (user.defaultAddress) {
      shippingAddress = user.defaultAddress;
    }

    if (!shippingAddress) {
      return NextResponse.json(
        { success: false, msg: "Please add a delivery address" },
        { status: 400 }
      );
    }

    // Generate order ID
    const orderId = await generateOrderId();

    // Create estimated delivery date (5 days from now)
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 5);

    // Create the order
    const newOrder = new Order({
      orderId,
      user: userId,
      items: orderItems,
      mrpTotal,
      subtotal,
      productDiscount: mrpTotal - subtotal,
      couponDiscount,
      tax,
      shippingCost,
      total,
      shippingAddress,
      status: "pending",
      paymentStatus: "pending",
      paymentMethod,
      expectedDelivery: deliveryDate,
    });

    await newOrder.save();

    // Update product stock
    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stockQuantity: -item.quantity },
      });
    }

    return NextResponse.json(
      {
        success: true,
        msg: "Your order has been placed successfully!",
        order: {
          orderId: newOrder.orderId,
          total: newOrder.total,
          items: orderItems.length,
          status: "pending",
          expectedDelivery: deliveryDate,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { success: false, msg: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
};

export const GET = async (req: NextRequest) => {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json(
        { success: false, msg: "Please login to view your orders" },
        { status: 400 }
      );
    }

    // Get query parameters
    const url = new URL(req.url);
    const orderId = url.searchParams.get("orderId");
    
    if (orderId) {
      // Return a specific order with all details
      const order = await Order.findOne({ 
        orderId, 
        user: userId 
      })
      .populate({
        path: 'shippingAddress',
        model: 'Address'
      })
      .populate({
        path: 'items.product',
        model: 'Product',
        select: 'name description category tags img stockQuantity mrp price unit'
      });
      
      if (!order) {
        return NextResponse.json(
          { success: false, msg: "Order not found" },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { 
          success: true, 
          order: {
            _id: order._id,
            orderId: order.orderId,
            user: order.user,
            items: order.items.map(item => ({
              _id: item._id,
              product: {
                _id: item.product._id,
                name: item.product.name,
                description: item.product.description,
                category: item.product.category,
                tags: item.product.tags,
                img: item.product.img,
                stockQuantity: item.product.stockQuantity,
                mrp: item.product.mrp,
                price: item.product.price,
                unit: item.product.unit
              },
              name: item.name,
              price: item.price,
              mrp: item.mrp,
              quantity: item.quantity,
              total: item.total,
              img: item.img
            })),
            mrpTotal: order.mrpTotal,
            subtotal: order.subtotal,
            productDiscount: order.productDiscount,
            couponDiscount: order.couponDiscount,
            tax: order.tax,
            shippingCost: order.shippingCost,
            total: order.total,
            shippingAddress: {
              _id: order.shippingAddress._id,
              name: order.shippingAddress.name,
              address: order.shippingAddress.address,
              mobile: order.shippingAddress.mobile,
              country: order.shippingAddress.country,
              state: order.shippingAddress.state,
              addressType: order.shippingAddress.addressType,
              zipCode: order.shippingAddress.zipCode
            },
            status: order.status,
            paymentStatus: order.paymentStatus,
            paymentMethod: order.paymentMethod,
            expectedDelivery: order.expectedDelivery,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt
          }
        },
        { status: 200 }
      );
    } else {
      // Return all orders for the user with comprehensive details
      const orders = await Order.find({ user: userId })
        .sort({ createdAt: -1 })
        .populate({
          path: 'shippingAddress',
          model: 'Address'
        })
        .populate({
          path: 'items.product',
          model: 'Product',
          select: 'name description category tags img stockQuantity mrp price unit'
        });
      
      // Transform orders to include comprehensive details
      const transformedOrders = orders.map(order => ({
        _id: order._id,
        orderId: order.orderId,
        items: order.items.map(item => ({
          _id: item._id,
          product: {
            _id: item.product._id,
            name: item.product.name,
            description: item.product.description,
            category: item.product.category,
            tags: item.product.tags,
            img: item.product.img,
            stockQuantity: item.product.stockQuantity,
            mrp: item.product.mrp,
            price: item.product.price,
            unit: item.product.unit
          },
          name: item.name,
          price: item.price,
          mrp: item.mrp,
          quantity: item.quantity,
          total: item.total,
          img: item.img
        })),
        mrpTotal: order.mrpTotal,
        subtotal: order.subtotal,
        productDiscount: order.productDiscount,
        couponDiscount: order.couponDiscount,
        tax: order.tax,
        shippingCost: order.shippingCost,
        total: order.total,
        shippingAddress: {
          _id: order.shippingAddress._id,
          name: order.shippingAddress.name,
          address: order.shippingAddress.address,
          mobile: order.shippingAddress.mobile,
          country: order.shippingAddress.country,
          state: order.shippingAddress.state,
          addressType: order.shippingAddress.addressType,
          zipCode: order.shippingAddress.zipCode
        },
        status: order.status,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        expectedDelivery: order.expectedDelivery,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      }));
      
      return NextResponse.json(
        { 
          success: true, 
          orders: transformedOrders 
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { success: false, msg: "Failed to fetch orders", error: error.message },
      { status: 500 }
    );
  }
};