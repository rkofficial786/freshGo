import { NextRequest, NextResponse } from "next/server";
import User from "../../../../models/User";
// import uniqid from "uniqid";
import crypto from "crypto";
import axios from "axios";
import { generateRandomId } from "../../../../helper/generateRandomId";

export const POST = async (req: NextRequest) => {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) {
        return NextResponse.json({ success: false, msg: "Please provide User Id" }, { status: 400 });
    }
    const admin = await User.findById(userId);
    if (!admin) {
        return NextResponse.json(
            { success: false, msg: "Unauthorized" },
            { status: 401 }
        );
    }
    const body = await req.json();
    const { amount } = body;

    const merchantTransactionId = "PNTN" + generateRandomId(11);
    console.log(merchantTransactionId)
    // const merchantTransactionId = "PNTNgfuyfyjjhvgy454";

    const payload = {
      merchantId: process.env.MERCHANT_ID_PROD,
      merchantTransactionId: merchantTransactionId,
      merchantUserId: process.env.MERCHANT_USER_ID,
      amount: amount * 100,
      redirectUrl: `${process.env.PROD_HOST}/success?transactionId=${merchantTransactionId}`,
      redirectMode: "REDIRECT",
      // "callbackUrl": "https://webhook.site/callback-url",
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };

    const bufferObj = Buffer.from(JSON.stringify(payload), "utf8");
    const base64Payload = bufferObj.toString("base64");
    const x_verify = crypto
      .createHash("sha256")
      .update(base64Payload + "/pg/v1/pay" + process.env.SALT_KEY_PROD)
      .digest("hex");
    const checksum = x_verify + "###" + process.env.SALT_KEY_INDEX;

    const options = {
      method: "post",
      url: `${process.env.PHONE_PE_HOST_PROD}/pg/v1/pay`,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
      },
      data: {
        request: base64Payload,
      },
    };

    try {
      const response = await axios.request(options);
      if (response?.data?.success) {
        console.log("success");

        const url = response.data?.data?.instrumentResponse?.redirectInfo?.url;

        return NextResponse.json(
          { success: true, msg: "Payment initiated", url: url },
          { status: 200 }
        );
        // return NextResponse.redirect(url);
      }
    } catch (error) {
      console.error(error);
    }

    // return NextResponse.json(
    //     { success: true, msg: "Success", merchantTransactionId, base64Payload, checksum, x_verify },
    //     { status: 200 }
    // );


    return NextResponse.json(
      { success: false, msg: "Payment Error" },
      { status: 500 }
    );
  } catch (error) {
    console.log("Error to payment", error);
    return NextResponse.json(
      { success: false, msg: "Internal Server Error" },
      { status: 500 }
    );
  }
};
