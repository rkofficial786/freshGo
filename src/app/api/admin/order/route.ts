import { NextRequest, NextResponse } from "next/server";
import Order from "../../../../../models/Order";
import "../../../../../models/Product";
import "../../../../../models/User";
import "../../../../../models/Address";
import { connectDB } from "../../../../../db";
import Admin from "../../../../../models/Admin";
import User from "../../../../../models/User";
import Product from "../../../../../models/Product";

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
        { transactionId: regex }
      ];
    }

    if (paymentStatus) {
      const regex = new RegExp(paymentStatus, "i");
      searchCriteria.paymentStatus = regex;
    }
    if (orderStatus) {
      const regex = new RegExp(orderStatus, "i");
      searchCriteria.status = regex;
    }

    // If search includes user name, modify search criteria
    if (search) {
      const userSearchRegex = new RegExp(search, "i");
      const matchingUsers = await User.find({ 
        $or: [
          { name: userSearchRegex },
          { email: userSearchRegex },
          { mobile: userSearchRegex }
        ]
      }).select('_id');
      
      searchCriteria.$or.push({ user: { $in: matchingUsers.map(u => u._id) } });
    }

    const orders = await Order.find(searchCriteria)
      .populate({
        path: 'user',
        select: 'name email mobile' // Select specific user fields
      })
      .populate({
        path: 'shippingAddress',
        model: 'Address'
      })
      .populate({
        path: 'items.product',
        model: 'Product',
        select: 'name description category tags img stockQuantity mrp price unit'
      })
      .sort({ createdAt: -1 })
      .lean();

    // Transform orders to include comprehensive details
    const transformedOrders = orders.map(order => ({
      _id: order._id,
      orderId: order.orderId,
      user: {
        _id: order.user._id,
        name: order.user.name,
        email: order.user.email,
        mobile: order.user.mobile
      },
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
        msg: "Success", 
        orders: transformedOrders,
        total: transformedOrders.length
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching admin orders", error);
    return NextResponse.json(
      { 
        success: false, 
        msg: "Internal Server Error", 
        error: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
};