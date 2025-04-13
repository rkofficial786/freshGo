import { NextRequest, NextResponse } from "next/server";
import Order from "../../../../../../models/Order";
import Admin from "../../../../../../models/Admin";
import { sendOrderShippedEmail } from "../../../../../../helper/sendOrderShippedEmail";

export const PATCH = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const adminId = req.headers.get("x-admin-id");
    if (!adminId) {
      return NextResponse.json(
        { success: false, msg: "Please provide Admin Id" },
        { status: 400 }
      );
    }
    const admin = await Admin.findById(adminId);
    if (!admin || (admin.role !== "Admin" && admin.role !== "SuperAdmin")) {
      return NextResponse.json(
        { success: false, msg: "Unauthorized" },
        { status: 401 }
      );
    }
    const { id } = params;
    const body = await req.json();
    const { status, trackingId, deliveryPartner } = body;

    if (!id)
      return NextResponse.json(
        { success: false, msg: "Please provide OrderId" },
        { status: 400 }
      );
    if (!status)
      return NextResponse.json(
        { success: false, msg: "Please provide status" },
        { status: 400 }
      );

    const updateData: any = { status };
    if (trackingId) updateData.trackingId = trackingId;
    if (deliveryPartner) updateData.deliveryPartner = deliveryPartner;

    const order = await Order.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    ).populate("user");

    if (!order) {
      return NextResponse.json(
        { success: false, msg: "Order not found" },
        { status: 404 }
      );
    }
    console.log("shipping");

    // Send email for shipped orders
    if (status === "shipped") {
      const emailDetails = {
        trackingId: order?.trackingId || "12345678",
        deliveryPartner: order?.deliveryPartner || "Delhivery",
        userName: order?.user.name,
        userEmail: order?.user?.email,
        companyName: "FreshGo",
      };

      // Send mail
      await sendOrderShippedEmail(emailDetails);
    }

    return NextResponse.json(
      {
        success: true,
        msg: "Order status updated successfully",
        order,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating order status", error);
    return NextResponse.json(
      {
        success: false,
        msg: "Internal Server Error",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
};
