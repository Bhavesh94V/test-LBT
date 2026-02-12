import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { phone, fullName, email, preferredCity } = await req.json();

    if (!phone || !fullName) {
      return NextResponse.json({ success: false, message: 'Phone and name are required' }, { status: 400 });
    }

    // Check if user already exists
    let user = await User.findOne({ phone });
    if (user) {
      return NextResponse.json({ success: true, data: { user, isExisting: true }, message: 'User already exists' });
    }

    const names = fullName.split(' ');
    user = await User.create({
      firstName: names[0] || fullName,
      lastName: names.slice(1).join(' ') || '',
      phone,
      email: email || '',
      preferredCity: preferredCity || '',
    });

    return NextResponse.json({ success: true, data: { user, isNewUser: true }, message: 'Registration successful' }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
