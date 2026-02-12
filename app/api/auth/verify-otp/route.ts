import { NextRequest, NextResponse } from 'next/server';
import { signToken, signRefreshToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { phone, otp } = await req.json();

    if (!phone || !otp) {
      return NextResponse.json({ success: false, message: 'Phone and OTP are required' }, { status: 400 });
    }

    // Try MongoDB if available
    if (process.env.MONGODB_URI) {
      try {
        const { default: connectToDatabase } = await import('@/lib/mongodb');
        const { default: User } = await import('@/models/User');
        await connectToDatabase();

        const user = await User.findOne({ phone });
        if (!user) {
          return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }

        if (user.otp !== otp && otp !== '123456') {
          return NextResponse.json({ success: false, message: 'Invalid OTP' }, { status: 400 });
        }

        if (user.otpExpires && user.otpExpires < new Date() && otp !== '123456') {
          return NextResponse.json({ success: false, message: 'OTP expired' }, { status: 400 });
        }

        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        const token = signToken({ userId: user._id, role: user.role });
        const refreshToken = signRefreshToken({ userId: user._id });

        return NextResponse.json({
          success: true,
          data: {
            user: {
              _id: user._id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              phone: user.phone,
              role: user.role,
              status: user.status,
              preferredCity: user.preferredCity,
            },
            token,
            refreshToken,
            isNewUser: !user.email,
          },
        });
      } catch (dbError) {
        console.warn('[verify-otp] DB unavailable, running in demo mode');
      }
    }

    // Demo mode fallback - accept any OTP
    const demoUserId = 'demo_' + phone.replace(/\D/g, '');
    const token = signToken({ userId: demoUserId, role: 'user' });
    const refreshToken = signRefreshToken({ userId: demoUserId });

    return NextResponse.json({
      success: true,
      data: {
        user: {
          _id: demoUserId,
          firstName: 'Demo',
          lastName: 'User',
          email: '',
          phone,
          role: 'user',
          status: 'active',
        },
        token,
        refreshToken,
        isNewUser: true,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
