import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Payment from '@/models/Payment';

export async function GET() {
  try {
    await connectToDatabase();
    const payments = await Payment.find({ status: { $in: ['verified', 'completed'] } }).lean();

    const totalRevenue = payments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);

    return NextResponse.json({
      success: true,
      data: {
        totalRevenue,
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
