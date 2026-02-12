import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import Inquiry from '@/models/Inquiry';
import Group from '@/models/Group';
import Payment from '@/models/Payment';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const decoded = getUserFromRequest(req);
    if (!decoded) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const [user, inquiries, payments] = await Promise.all([
      User.findById(decoded.userId).select('-password -otp -otpExpires').populate('shortlistedProperties').lean(),
      Inquiry.find({ userId: decoded.userId }).populate('propertyId', 'name image location').sort({ createdAt: -1 }).limit(10).lean(),
      Payment.find({ userId: decoded.userId }).populate('propertyId', 'name').sort({ createdAt: -1 }).limit(10).lean(),
    ]);

    // Find groups the user is a member of
    const groups = await Group.find({ 'members.userId': decoded.userId })
      .populate('propertyId', 'name image location')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: {
        user,
        inquiries,
        groups,
        payments,
        shortlisted: user?.shortlistedProperties || [],
        stats: {
          totalInquiries: inquiries.length,
          totalGroups: groups.length,
          totalPayments: payments.length,
          shortlistedCount: user?.shortlistedProperties?.length || 0,
        },
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
