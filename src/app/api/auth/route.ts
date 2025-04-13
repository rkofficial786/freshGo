import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "../../../../helper/sendEmail";
import { generateOTP } from "../../../../helper/generateOTP";
import User from "../../../../models/User";
import { connectDB } from "../../../../db";

connectDB();

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { email, name, role } = body;
    if (!email)
      return NextResponse.json(
        { success: false, msg: "Please provide an email" },
        { status: 400 }
      );

    // if(phone.length > 10) {
    //     phone.replace("+91", "");
    // }

    const otp = generateOTP();
    const otpExp = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

    let user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      user = new User({
        name,
        // phone: phone.toLowerCase(),
        email: email.toLowerCase(),
        otp,
        otpExp,
        role,
      });
    } else {
      user.otp = otp;
      user.otpExp = otpExp;
    }

    await user.save();
    await sendEmail(email, otp);
    // await sendOtp(phone, otp.toString());

    return NextResponse.json(
      { success: true, msg: "OTP sent to email", otp },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error to login user", error);
    return NextResponse.json(
      { success: false, msg: "Internal Server Error" },
      { status: 500 }
    );
  }
};
