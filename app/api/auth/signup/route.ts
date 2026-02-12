import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { signToken, signRefreshToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { firstName, lastName, email, phone, password } = await req.json();

    if (!firstName || !phone) {
      return NextResponse.json(
        { success: false, message: 'Name and phone are required' },
        { status: 400 }
      );
    }

    const existing = await User.findOne({
      $or: [
        ...(email ? [{ email: email.toLowerCase() }] : []),
        { phone },
      ],
    });
    if (existing) {
      return NextResponse.json(
        { success: false, message: 'User with this email or phone already exists' },
        { status: 409 }
      );
    }

    const user = await User.create({
      firstName,
      lastName: lastName || '',
      email: email ? email.toLowerCase() : '',
      phone,
      password: password || undefined,
    });

    const token = signToken({ userId: user._id, role: user.role });
    const refreshToken = signRefreshToken({ userId: user._id });

    return NextResponse.json(
      {
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
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
