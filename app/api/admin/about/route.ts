import { NextRequest, NextResponse } from 'next/server';
import { getAboutData, createAboutData, updateAboutData } from '@/lib/models/PageData';
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
		const aboutData = await getAboutData();
		return NextResponse.json({ aboutData });
	} catch (error) {
		console.error('Error fetching about data:', error);
		return NextResponse.json({ error: 'Failed to fetch about data' }, { status: 500 });
	}
}

export async function POST(request: NextRequest) {
	if (!(await verifyAdminSession())) {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}
	try {
		const body = await request.json();
		const aboutData = await createAboutData(body);
		return NextResponse.json({ aboutData });
	} catch (error) {
		console.error('Error creating about data:', error);
		return NextResponse.json({ error: 'Failed to create about data' }, { status: 500 });
	}
}

export async function PUT(request: NextRequest) {
	if (!(await verifyAdminSession())) {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}
	try {
		const body = await request.json();
		const { _id, ...updateData } = body;

		console.log('About PUT request - ID:', _id);
		console.log('About PUT request - Update data:', JSON.stringify(updateData, null, 2));

		if (!_id) {
			return NextResponse.json({ error: 'ID is required' }, { status: 400 });
		}

		await updateAboutData(_id, updateData);
		console.log('About data updated successfully');
		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Error updating about data:', error);
		return NextResponse.json({ error: 'Failed to update about data' }, { status: 500 });
	}
}
