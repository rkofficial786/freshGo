// middleware/userAuth.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

// connectDB();

export async function userAuthMiddleware(request: NextRequest, res: NextResponse) {
  const tokenCookie = request.cookies.get('token');
  const token = tokenCookie ? tokenCookie.value : null;

  if (!token) {
    return NextResponse.json({ success: false, msg: 'Unauthorized' }, { status: 401 });
  }

  try {
    const secretKey = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secretKey) as JwtPayload;
    // const user = await User.findById(payload.id);
    const user = payload
    if (!user) {
      return NextResponse.json({ success: false, msg: 'Unauthorized' }, { status: 401 });
    }

    res.headers.set('x-user-id', payload.id as string);
    return res;
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, msg: 'Invalid token', error }, { status: 401 });
  }
}
