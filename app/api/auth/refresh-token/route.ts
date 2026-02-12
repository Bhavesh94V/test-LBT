import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest, verifyRefreshToken, signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const refreshToken = getTokenFromRequest(req);
    if (!refreshToken) {
      return NextResponse.json({ success: false, message: 'No refresh token' }, { status: 401 });
    }

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      return NextResponse.json({ success: false, message: 'Invalid refresh token' }, { status: 401 });
    }

    const newToken = signToken({ userId: decoded.userId, role: decoded.role });
    return NextResponse.json({ success: true, data: { token: newToken } });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
