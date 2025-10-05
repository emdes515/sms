import { NextRequest, NextResponse } from 'next/server';
import { getTargetData, createTargetData, updateTargetData } from '@/lib/models/PageData';
import { cookies } from 'next/headers';

async function verifyAdminSession() {
	const cookieStore = cookies();
	const session = cookieStore.get('admin-session');
	return session && session.value === 'authenticated';
}

export async function GET() {
	if (!(await verifyAdminSession())) {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}
	try {
		const targetData = await getTargetData();
		return NextResponse.json({ targetData });
	} catch (error) {
		console.error('Error fetching target data:', error);
		return NextResponse.json({ error: 'Failed to fetch target data' }, { status: 500 });
	}
}

export async function POST(request: NextRequest) {
	if (!(await verifyAdminSession())) {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}
	try {
		const body = await request.json();
		const targetData = await createTargetData(body);
		return NextResponse.json({ targetData });
	} catch (error) {
		console.error('Error creating target data:', error);
		return NextResponse.json({ error: 'Failed to create target data' }, { status: 500 });
	}
}

export async function PUT(request: NextRequest) {
	if (!(await verifyAdminSession())) {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}
	try {
		const body = await request.json();
		const { id, ...updateData } = body;

		if (!id) {
			return NextResponse.json({ error: 'ID is required' }, { status: 400 });
		}

		await updateTargetData(id, updateData);
		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Error updating target data:', error);
		return NextResponse.json({ error: 'Failed to update target data' }, { status: 500 });
	}
}
