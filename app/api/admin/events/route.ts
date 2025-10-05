import { NextRequest, NextResponse } from 'next/server';
import { getAllEvents, createEvent } from '@/lib/models/PageData';
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
		const events = await getAllEvents();
		return NextResponse.json(events);
	} catch (error) {
		console.error('Error fetching events:', error);
		return NextResponse.json(
			{ message: 'Wystąpił błąd podczas pobierania wydarzeń' },
			{ status: 500 }
		);
	}
}

export async function POST(request: NextRequest) {
	if (!(await verifyAdminSession())) {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}
	try {
		const eventData = await request.json();
		const event = await createEvent(eventData);
		return NextResponse.json(event);
	} catch (error) {
		console.error('Error creating event:', error);
		return NextResponse.json(
			{ message: 'Wystąpił błąd podczas tworzenia wydarzenia' },
			{ status: 500 }
		);
	}
}
