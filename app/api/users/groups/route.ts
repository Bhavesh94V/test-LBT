import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Group from '@/models/Group';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const decoded = getUserFromRequest(req);
    if (!decoded) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const groups = await Group.find({ 'members.userId': decoded.userId })
      .populate('propertyId', 'name image location priceRange')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: { groups } });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
