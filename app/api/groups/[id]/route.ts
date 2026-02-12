import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Group from '@/models/Group';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const group = await Group.findById(id).populate('propertyId').lean();
    if (!group) {
      return NextResponse.json({ success: false, message: 'Group not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: group });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await req.json();
    const group = await Group.findByIdAndUpdate(id, body, { new: true }).lean();
    return NextResponse.json({ success: true, data: group });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    await Group.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Group deleted' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
