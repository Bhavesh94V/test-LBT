import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Group from '@/models/Group';
import User from '@/models/User';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const decoded = getUserFromRequest(req);
    if (!decoded) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const { id } = await params;
    const group = await Group.findById(id);
    if (!group) {
      return NextResponse.json({ success: false, message: 'Group not found' }, { status: 404 });
    }

    if (group.locked || group.status === 'full') {
      return NextResponse.json({ success: false, message: 'Group is full or locked' }, { status: 400 });
    }

    // Check if already a member
    const alreadyMember = group.members.some(
      (m: any) => m.userId.toString() === decoded.userId
    );
    if (alreadyMember) {
      return NextResponse.json({ success: false, message: 'Already a member' }, { status: 400 });
    }

    const user = await User.findById(decoded.userId);
    group.members.push({
      userId: decoded.userId,
      userName: `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
      email: user?.email || '',
      phone: user?.phone || '',
      configuration: '',
      joinedAt: new Date(),
      paymentStatus: 'pending',
    });
    group.membersJoined = group.members.length;
    group.availableSlots = group.totalSlots - group.membersJoined;
    if (group.availableSlots <= 0) group.status = 'full';
    await group.save();

    return NextResponse.json({ success: true, data: group });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
