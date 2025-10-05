import { NextRequest, NextResponse } from 'next/server';
import { getContactData, createContactData, updateContactData } from '@/lib/models/PageData';
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
		const contactData = await getContactData();
		return NextResponse.json({ contactData });
	} catch (error) {
		console.error('Error fetching contact data:', error);
		return NextResponse.json({ error: 'Failed to fetch contact data' }, { status: 500 });
	}
}

export async function POST(request: NextRequest) {
	if (!(await verifyAdminSession())) {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}
	try {
		const body = await request.json();
		const contactData = await createContactData(body);
		return NextResponse.json({ contactData });
	} catch (error) {
		console.error('Error creating contact data:', error);
		return NextResponse.json({ error: 'Failed to create contact data' }, { status: 500 });
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

		await updateContactData(id, updateData);
		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Error updating contact data:', error);
		return NextResponse.json({ error: 'Failed to update contact data' }, { status: 500 });
	}
}
