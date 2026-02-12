import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Property from '@/models/Property';

export async function GET() {
  try {
    await connectToDatabase();
    const properties = await Property.find().select('name buyersJoined totalPositions status').lean();

    return NextResponse.json({ success: true, data: properties });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
