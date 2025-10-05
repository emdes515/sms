import { NextRequest, NextResponse } from 'next/server';
import { getAllWards, createWard } from '@/lib/models/PageData';
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
		const wards = await getAllWards();
		return NextResponse.json(wards);
	} catch (error) {
		console.error('Error fetching wards:', error);
		return NextResponse.json(
			{ message: 'Wystąpił błąd podczas pobierania podopiecznych' },
			{ status: 500 }
		);
	}
}

export async function POST(request: NextRequest) {
	if (!(await verifyAdminSession())) {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}
	try {
		const wardData = await request.json();
		const ward = await createWard(wardData);
		return NextResponse.json(ward);
	} catch (error) {
		console.error('Error creating ward:', error);
		return NextResponse.json(
			{ message: 'Wystąpił błąd podczas tworzenia podopiecznego' },
			{ status: 500 }
		);
	}
}
