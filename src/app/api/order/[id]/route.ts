import { NextRequest, NextResponse } from "next/server";
import Product from "../../../../../models/Product";
import Order from "../../../../../models/Order";
import "../../../../../models/User";
import { connectDB } from "../../../../../db";
// import Stripe from "stripe";
import {
  OrderDetails,
  sendAdminOrderEmail,
} from "../../../../../helper/sendAdminOrderEmail";
import { sendUserOrderEmail } from "../../../../../helper/sendUserOrderEmail";
import User from "../../../../../models/User";
import axios from "axios";
import crypto from "crypto";
import { generateRandomId } from "../../../../../helper/generateRandomId";

connectDB();
// const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY as string);
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
    // const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent);
    // const paymentMethod = await stripe.paymentMethods.retrieve(
    //   paymentIntent.payment_method as string
    // );

    const xVerify = crypto
      .createHash("sha256")
      .update(
        `/pg/v1/status/${process.env.MERCHANT_ID_PROD}/${transactionId}` +
        process.env.SALT_KEY_PROD
      )
      .digest("hex");
    const checksum = xVerify + "###" + process.env.SALT_KEY_INDEX;

    const options = {
      method: "get",
      url: `${process.env.PHONE_PE_HOST_PROD}/pg/v1/status/${process.env.MERCHANT_ID_PROD}/${transactionId}`,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-MERCHANT-ID": process.env.MERCHANT_ID_PROD,
        "X-VERIFY": checksum,
      },
    };

    const response = await axios.request(options);
  console.log(response,"response hai bhai");
  
    if (response?.data?.success) {
      // Find the order by ID
      const order = await Order.findById(id).populate(["user"]);

      if (!order) {
        return NextResponse.json(
          { success: false, msg: "Order not found" },
          { status: 404 }
        );
      }

      // Update the order
      order.transactionId = response.data?.data?.transactionId;
      order.paymentStatus = response.data?.data?.state;
      order.paymentMethod = response.data?.data?.paymentInstrument?.type;
      // order.transactionId = paymentIntent.id;
      // order.paymentStatus = paymentIntent.status;
      // order.paymentMethod = paymentMethod.type;

      await order.save();

      // Increment sell count for each product in the order
      for (const productDetail of order.productDetails) {
        await Product.findOneAndUpdate(
          { _id: productDetail.product, "sizes._id": productDetail.size },
          {
            $inc: {
              "sizes.$.sellCount": productDetail.count,
              "sizes.$.stock": -productDetail.count,
            },
          },
          { new: true }
        );
      }

      // Send Email
      const orderDetails: OrderDetails = {
        orderId: id,
        customerName: order?.user?.name,
        customerEmail: order?.user?.email,
        totalAmount: order?.payablePrice,
        orderDate: new Date(order?.updatedAt).toLocaleString(),
      };

      if (order.paymentStatus==="COMPLETED") {
        await sendUserOrderEmail(order);
        await sendAdminOrderEmail(orderDetails);
      }

      // Dtdc integration

      try {
        const customerNo = generateRandomId(15);
        const consignments = order.productDetails.map((v, i) => {
          const obj = {
            customer_code: "HL3670",
            load_type: "NON-DOCUMENT",
            service_type_id: "B2C SMART EXPRESS",
            dimension_unit: "cm",
            length: "70",
            width: "70",
            height: "20",
            weight_unit: "kg",
            weight: "0.25",
            description: v.product.name,
            num_pieces: v.count,
            declared_value: v.product.actualPrice,
            origin_details: {
              name: "shreya",
              phone: 8885533619,
              address_line_1: "Shop no, 12, lane, beside anil trading company, near car by car parking ground, Pan Bazar,",
              address_line_2: "Old Gudi, Old Bhoiguda, Rani Gunj, Secunderabad, Telangana",
              pincode: 500003,
              city: "Secunderabad",
              state: "Telangana",
            },
            destination_details: {
              name: order.shippingAddress.name,
              phone: order.shippingAddress.mobile,
              alternate_phone: "",
              address_line_1: order.shippingAddress.address,
              address_line_2: "",
              pincode: order.shippingAddress.zipCode,
              city: order.shippingAddress.state,
              state: order.shippingAddress.state,
            },
            customer_reference_number: customerNo,
            commodity_id: 99,
            reference_number: ""
          };
          return obj;
        });

        const dtdcPayload = {
          consignments
        };

        const dtdcOptions = {
          method: "post",
          url: `${process.env.DTDC_BASE_URL}/api/customer/integration/consignment/softdata`,
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            "api-key": process.env.API_KEY,
          },
          data: dtdcPayload,
        };

        const dtdcRes = await axios.request(dtdcOptions);
        console.log(dtdcRes.status, dtdcRes.data, "dtdc response");

        if (dtdcRes.data?.data?.[0].success) {
          await Order.findByIdAndUpdate(id, { $set: { dtdc: { referenceNumber: dtdcRes.data.data[0].reference_number, customerReferenceNumber: dtdcRes.data.data[0].customer_reference_number } } }, {new: true})
        } else {
          return NextResponse.json(
            { success: true, msg: "Order updated successfully but Internal error in DTDC", order },
            { status: 200 }
          );
        }
      } catch (error) {
        return NextResponse.json(
          { success: true, msg: "Order updated successfully but Internal error in DTDC", order },
          { status: 200 }
        );
      }

      return NextResponse.json(
        { success: true, msg: "Order updated successfully", order },
        { status: 200 }
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
