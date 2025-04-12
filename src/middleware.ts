// middleware/index.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { adminAuthMiddleware } from "../middleware/adminAuth";
import { userAuthMiddleware } from "../middleware/userAuth";
import { checkAdminMiddleware } from "../middleware/checkAdmin";
import { checkSuperAdminMiddleware } from "../middleware/superAdminauth";

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  if (
    request.nextUrl.pathname.startsWith("/admin/roles") ||
    request.nextUrl.pathname.startsWith("/admin/coupan")
  ) {
    const checkSuperAdmin = await checkSuperAdminMiddleware(request);
    return checkSuperAdmin;
  } else if (request.nextUrl.pathname.startsWith("/admin")) {
    const checkAdminResponse = await checkAdminMiddleware(request);
    return checkAdminResponse;
  } else if (request.nextUrl.pathname.startsWith("/api/admin/")) {
    const adminResponse = await adminAuthMiddleware(request, res);
    if (adminResponse.status !== 200) {
      return adminResponse;
    }
  } else {
    const userResponse = await userAuthMiddleware(request, res);
    if (userResponse.status !== 200) {
      return userResponse;
    }
  }

  return res;
}

export const config = {
  matcher: [
    "/api/address/:path*",
    "/api/user/:path*",
    "/api/payment",
    "/admin/roles",
    "/admin/coupon",
    "/api/order/:path*",
    "/api/coupon/:code/:path*",
    "/api/admin/:path*",
    "/admin/:path*",
  ],
};
