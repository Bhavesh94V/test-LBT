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

    const [
      totalProperties,
      totalUsers,
      totalInquiries,
      totalGroups,
      totalPayments,
      pendingInquiries,
      activeGroups,
      verifiedPayments,
    ] = await Promise.all([
      Property.countDocuments(),
      User.countDocuments({ role: 'user' }),
      Inquiry.countDocuments(),
      Group.countDocuments(),
      Payment.countDocuments(),
      Inquiry.countDocuments({ status: 'pending' }),
      Group.countDocuments({ status: 'open' }),
      Payment.countDocuments({ status: 'verified' }),
    ]);

    // Recent inquiries
    const recentInquiries = await Inquiry.find()
      .populate('propertyId', 'name')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // Recent users
    const recentUsers = await User.find({ role: 'user' })
      .select('-password -otp')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalProperties,
          totalUsers,
          totalInquiries,
          totalGroups,
          totalPayments,
          pendingInquiries,
          activeGroups,
          verifiedPayments,
        },
        recentInquiries,
        recentUsers,
        // Mock revenue data for charts
        monthlyRevenue: [
          { month: 'Jan', revenue: 125000 },
          { month: 'Feb', revenue: 180000 },
          { month: 'Mar', revenue: 220000 },
          { month: 'Apr', revenue: 190000 },
          { month: 'May', revenue: 310000 },
          { month: 'Jun', revenue: 280000 },
        ],
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
