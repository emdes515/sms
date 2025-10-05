import { NextRequest, NextResponse } from 'next/server';
import { updateEvent, deleteEvent } from '@/lib/models/PageData';
import { cookies } from 'next/headers';

async function verifyAdminSession() {
	const cookieStore = cookies();
	const session = cookieStore.get('admin-session');
	return session && session.value === 'authenticated';
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
	if (!(await verifyAdminSession())) {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}
	try {
		const eventData = await request.json();
		await updateEvent(params.id, eventData);
		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Error updating event:', error);
		return NextResponse.json(
			{ message: 'Wystąpił błąd podczas aktualizacji wydarzenia' },
			{ status: 500 }
		);
	}
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
	if (!(await verifyAdminSession())) {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}
	try {
		await deleteEvent(params.id);
		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Error deleting event:', error);
		return NextResponse.json(
			{ message: 'Wystąpił błąd podczas usuwania wydarzenia' },
			{ status: 500 }
		);
	}
}
