import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Inquiry from '@/models/Inquiry';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const status = searchParams.get('status');

    const filter: any = {};
    if (status) filter.status = status;

    const total = await Inquiry.countDocuments(filter);
    const inquiries = await Inquiry.find(filter)
      .populate('propertyId', 'name location image')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      data: inquiries,
      pagination: { total, page, pages: Math.ceil(total / limit) },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    // Map frontend field names to model
    const inquiryData: any = {
      propertyId: body.propertyId || undefined,
      userName: body.fullName || body.userName || '',
      email: body.email || '',
      phone: body.phone || '',
      city: body.city || '',
      configuration: body.configurationInterested || body.configuration || '',
      budgetRange: typeof body.budgetRange === 'object' 
        ? `${body.budgetRange.min}-${body.budgetRange.max}` 
        : (body.budgetRange || ''),
      message: body.comments || body.message || '',
      subject: body.subject || '',
      status: 'pending',
    };

    // Attach user if authenticated
    const decoded = getUserFromRequest(req);
    if (decoded) {
      inquiryData.userId = decoded.userId;
    }

    const inquiry = await Inquiry.create(inquiryData);
    return NextResponse.json({ success: true, data: inquiry }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
