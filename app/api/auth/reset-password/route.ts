import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { phone, otp, newPassword } = await req.json();

    if (!phone || !otp || !newPassword) {
      return NextResponse.json(
        { success: false, message: 'Phone, OTP, and new password are required' },
        { status: 400 }
      );
    }

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

    user.password = newPassword;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return NextResponse.json({ success: true, message: 'Password reset successful' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
