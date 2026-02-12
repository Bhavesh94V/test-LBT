import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Inquiry from '@/models/Inquiry';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const { reason } = await req.json();
    const inquiry = await Inquiry.findByIdAndUpdate(
      id,
      { status: 'rejected', rejectionReason: reason, rejectedAt: new Date() },
      { new: true }
    ).lean();
    return NextResponse.json({ success: true, data: inquiry });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
