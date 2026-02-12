import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Group from '@/models/Group';

export async function GET() {
  try {
    await connectToDatabase();
    const totalGroups = await Group.countDocuments();
    const openGroups = await Group.countDocuments({ status: 'open' });
    const fullGroups = await Group.countDocuments({ status: 'full' });

    return NextResponse.json({
      success: true,
      data: { totalGroups, openGroups, fullGroups },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
