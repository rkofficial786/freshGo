import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../../../db";
import Admin from "../../../../../models/Admin";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import cookie from "cookie";

connectDB();
export const POST = async (req: NextRequest) => {
  try {
    const { email, password } = await req.json();

    // Find admin by email
    let admin = await Admin.findOne({ email });
    if (!admin) {
      return NextResponse.json(
        { success: false, msg: "Admin not found!" },
        { status: 404 }
      );
    } else {
      // Check if password matches
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return NextResponse.json(
          { success: false, msg: "Invalid credentials" },
          { status: 401 }
        );
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "30d" }
    );

    // Set the cookie options
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
      path: "/",
      // Remove the domain restriction if testing locally
      // domain: process.env.NODE_ENV === "production" ? ".shreyacollection.in" : undefined
    };

    // Create and configure the response
    const response = NextResponse.json(
      {
        success: true,
        msg: "Login successful",
        token: token,
        id: admin._id,
        user: {
          name: admin.name,
          role: admin.role,
        },
      },
      { status: 200 }
    );

    // Set the cookie directly on the response
    response.cookies.set({
      name: "token",
      value: token,
      ...cookieOptions
    });

    return response;
  } catch (error) {
    console.log("Error to get user details ", error);
    return NextResponse.json(
      { success: false, msg: "Internal Server Error" },
      { status: 500 }
    );
  }
};