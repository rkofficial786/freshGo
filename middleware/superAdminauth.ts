import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

// connectDB();

export async function checkSuperAdminMiddleware(request: NextRequest) {
  const tokenCookie = request.cookies.get("token");
  const token = tokenCookie ? tokenCookie.value : null;

  if (!token) {
    const url = new URL("/login/admin", request.url); // Construct the absolute URL
    return NextResponse.redirect(url);
  }

  try {
    const secretKey = new TextEncoder().encode(JWT_SECRET);
    const { payload } = (await jwtVerify(token, secretKey)) as JwtPayload;
    // const admin = await Admin.findById(payload.id);
    const admin = payload;
    console.log(admin.role, "admin");
    if (!admin || admin.role !== "SuperAdmin") {
      const url = new URL("/login/admin", request.url); // Construct the absolute URL
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  } catch (error) {
    console.log(error);
    const url = new URL("/login/admin", request.url); // Construct the absolute URL
    return NextResponse.redirect(url);
  }
}
