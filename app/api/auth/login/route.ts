import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { signToken, signRefreshToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { email, phone, password } = await req.json();

    if (!password || (!email && !phone)) {
      return NextResponse.json(
        { success: false, message: 'Email/phone and password are required' },
        { status: 400 }
      );
    }

    const query = email ? { email: email.toLowerCase() } : { phone };
    const user = await User.findOne(query);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }

    if (!user.password) {
      return NextResponse.json(
        { success: false, message: 'Please use OTP login for this account' },
        { status: 400 }
      );
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }

    if (user.status !== 'active') {
      return NextResponse.json({ success: false, message: 'Account is suspended' }, { status: 403 });
    }

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
        },
        token,
        refreshToken,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
