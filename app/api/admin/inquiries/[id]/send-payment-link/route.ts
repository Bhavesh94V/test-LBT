import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Inquiry from '@/models/Inquiry';
import Payment from '@/models/Payment';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await req.json();

    const inquiry = await Inquiry.findById(id);
    if (!inquiry) {
      return NextResponse.json({ success: false, message: 'Inquiry not found' }, { status: 404 });
    }

    inquiry.status = 'payment_link_sent';
    inquiry.paymentLink = body.paymentLink || body.externalLink || '';
    inquiry.paymentMethod = body.paymentMethod || 'bank_transfer';
    await inquiry.save();

    // Create a payment record
    await Payment.create({
      inquiryId: inquiry._id,
      userId: inquiry.userId,
      propertyId: inquiry.propertyId,
      amount: body.amount || '0',
      configuration: inquiry.configuration,
      status: 'link_sent',
      paymentMethod: body.paymentMethod || 'bank_transfer',
      paymentLink: body.paymentLink || '',
      externalLink: body.externalLink || '',
      expiresAt: body.expiryDays
        ? new Date(Date.now() + body.expiryDays * 24 * 60 * 60 * 1000)
        : undefined,
    });

    return NextResponse.json({ success: true, data: inquiry, message: 'Payment link sent' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
