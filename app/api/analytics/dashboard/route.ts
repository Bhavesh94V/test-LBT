import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Property from '@/models/Property';
import User from '@/models/User';
import Inquiry from '@/models/Inquiry';
import Group from '@/models/Group';
import Payment from '@/models/Payment';

export async function GET() {
  try {
    await connectToDatabase();

    const [totalProperties, totalUsers, totalInquiries, totalGroups, totalPayments] = await Promise.all([
      Property.countDocuments(),
      User.countDocuments({ role: 'user' }),
      Inquiry.countDocuments(),
      Group.countDocuments(),
      Payment.countDocuments(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalProperties,
        totalUsers,
        totalInquiries,
        totalGroups,
        totalPayments,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
