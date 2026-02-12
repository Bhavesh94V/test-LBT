import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Payment from '@/models/Payment';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const { transactionId, verificationNotes } = await req.json();
    const decoded = getUserFromRequest(req);

    const payment = await Payment.findByIdAndUpdate(
      id,
      {
        status: 'verified',
        transactionId,
        verificationNotes,
        verifiedAt: new Date(),
        verifiedBy: decoded?.userId,
      },
      { new: true }
    ).lean();

    return NextResponse.json({ success: true, data: payment });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
