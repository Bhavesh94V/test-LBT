import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Group from '@/models/Group';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const groups = await Group.find({ propertyId: id })
      .populate('propertyId', 'name location')
      .sort({ groupNumber: 1 })
      .lean();
    return NextResponse.json({ success: true, data: { groups } });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
