import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Notification from '@/models/Notification';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { userIds, title, message } = await req.json();

    const notifications = userIds.map((userId: string) => ({
      recipientId: userId,
      type: 'general',
      title,
      message,
    }));

    await Notification.insertMany(notifications);

    return NextResponse.json({ success: true, message: `Sent to ${userIds.length} users` }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
