import { NextRequest, NextResponse } from "next/server";
import Order from "../../../../../models/Order";
import "../../../../../models/User";
import { connectDB } from "../../../../../db";

import User from "../../../../../models/User";


connectDB();

export const POST = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json(
        { success: false, msg: "Please provide Admin Id" },
        { status: 400 }
      );
    }
    const admin = await User.findById(userId);
    if (!admin) {
      return NextResponse.json(
        { success: false, msg: "Unauthorized" },
        { status: 401 }
      );
    }
    const { id } = params;
    const body = await req.json();

    const { transactionId } = body;
    // const { payment_intent } = body;
    if (!id || !transactionId) {
      return NextResponse.json(
        { success: false, msg: "Invalid input" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, msg: "Payment Error" },
      { status: 500 }
    );
  } catch (error) {
    console.log("Error to update order", error);
    return NextResponse.json(
      { success: false, msg: "Internal Server Error" },
      { status: 500 }
    );
  }
};

export const PUT = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params;
    if (!id)
      return NextResponse.json(
        { success: false, msg: "Please provide an id" },
        { status: 400 }
      );
    const order = await Order.findByIdAndUpdate(
      id,
      { $set: { currentStatus: "Cancelled" } },
      { new: true }
    );
    if (!order)
      return NextResponse.json(
        { success: false, msg: "Order not found" },
        { status: 404 }
      );
    return NextResponse.json(
      { success: true, msg: "Success", order },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error to cancel order", error);
    return NextResponse.json(
      { success: false, msg: "Internal Server Error" },
      { status: 500 }
    );
  }
};
