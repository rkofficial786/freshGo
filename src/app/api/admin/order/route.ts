import { NextRequest, NextResponse } from "next/server";
import Order from "../../../../../models/Order";
import "../../../../../models/Product";
import "../../../../../models/User";
import "../../../../../models/Address";
import { connectDB } from "../../../../../db";
import Admin from "../../../../../models/Admin";

import User from "../../../../../models/User";

connectDB();

export const GET = async (req: NextRequest) => {
  try {
    const adminId = req.headers.get('x-admin-id');
    if (!adminId) {
      return NextResponse.json({ success: false, msg: "Please provide Admin Id" }, { status: 400 });
    }
    const admin = await Admin.findById(adminId);
    if (!admin || (admin.role !== "Sales person" && admin.role !== "Admin" && admin.role !== "SuperAdmin")) {
      return NextResponse.json(
        { success: false, msg: "Unauthorized" },
        { status: 401 }
      );
    }

    const url = new URL(req.url);
    const search = url.searchParams.get("search");
    const paymentStatus = url.searchParams.get("paymentStatus");
    const orderStatus = url.searchParams.get("orderStatus");

    const searchCriteria: any = {};

    if (search) {
      const regex = new RegExp(search, "i"); // 'i' for case-insensitive
      searchCriteria.$or = [
        { orderId: regex },
        { transactionId: regex },
        {productDetails: {$in: {'product.name': regex}}}, // Match by product name
        { user: { $in: await User.find({ name: regex }).select('_id') } } // Match by user name
      ];
    }

    if (paymentStatus) {
      const regex = new RegExp(paymentStatus, "i");
      searchCriteria.paymentStatus = regex;
    }
    if (orderStatus) {
      const regex = new RegExp(orderStatus, "i");
      searchCriteria.currentStatus = regex;
    }

    const orders = await Order.find(searchCriteria)
      .populate(["user", "exchangeReason"])
      .sort({ createdAt: -1 }).lean();

    // // Manually populate the size details from the product's sizes array
    // const populatedOrders = await Promise.all(
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
