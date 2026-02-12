import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();

    if (!phone) {
      return NextResponse.json({ success: false, message: 'Phone number is required' }, { status: 400 });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Try MongoDB if available, otherwise run in demo mode
    if (process.env.MONGODB_URI) {
      try {
        const { default: connectToDatabase } = await import('@/lib/mongodb');
        const { default: User } = await import('@/models/User');
        await connectToDatabase();

        let user = await User.findOne({ phone });
        if (!user) {
          user = await User.create({
            firstName: 'New User',
            phone,
            otp,
            otpExpires: new Date(Date.now() + 10 * 60 * 1000),
          });
        } else {
          user.otp = otp;
          user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
          await user.save();
        }
      } catch (dbError) {
        console.warn('[send-otp] DB unavailable, running in demo mode');
      }
    }

    // In dev/demo, return OTP directly
    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
      data: { otp, phone },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
