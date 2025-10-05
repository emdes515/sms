import { NextRequest, NextResponse } from 'next/server';
import { getFooterData, createFooterData, updateFooterData } from '@/lib/models/PageData';
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
		const footerData = await getFooterData();
		return NextResponse.json({ footerData });
	} catch (error) {
		console.error('Error fetching footer data:', error);
		return NextResponse.json({ error: 'Failed to fetch footer data' }, { status: 500 });
	}
}

export async function POST(request: NextRequest) {
	if (!(await verifyAdminSession())) {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}
	try {
		const body = await request.json();
		const footerData = await createFooterData(body);
		return NextResponse.json({ footerData });
	} catch (error) {
		console.error('Error creating footer data:', error);
		return NextResponse.json({ error: 'Failed to create footer data' }, { status: 500 });
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

		await updateFooterData(id, updateData);
		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Error updating footer data:', error);
		return NextResponse.json({ error: 'Failed to update footer data' }, { status: 500 });
	}
}
