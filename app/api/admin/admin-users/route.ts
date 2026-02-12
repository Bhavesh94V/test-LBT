import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Admin from '@/models/Admin';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const admins = await Admin.find().select('-password').sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: admins });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    
    // Check if admin with this email already exists
    const existing = await Admin.findOne({ email: body.email?.toLowerCase() });
    if (existing) {
      return NextResponse.json({ success: false, message: 'Admin with this email already exists' }, { status: 400 });
    }

    const admin = await Admin.create({
      ...body,
      email: body.email?.toLowerCase(),
      password: body.password || 'admin123',
    });

    const adminObj = admin.toObject();
    delete adminObj.password;

    return NextResponse.json({ success: true, data: adminObj }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
