import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(req: NextRequest, { params }: { params: Promise<{ propertyId: string }> }) {
  try {
    const decoded = getUserFromRequest(req);
    if (!decoded) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const { propertyId } = await params;
    await User.findByIdAndUpdate(decoded.userId, {
      $addToSet: { shortlistedProperties: propertyId },
    });
    return NextResponse.json({ success: true, message: 'Added to shortlist' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ propertyId: string }> }) {
  try {
    const decoded = getUserFromRequest(req);
    if (!decoded) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const { propertyId } = await params;
    await User.findByIdAndUpdate(decoded.userId, {
      $pull: { shortlistedProperties: propertyId },
    });
    return NextResponse.json({ success: true, message: 'Removed from shortlist' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
