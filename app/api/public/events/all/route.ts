import { NextResponse } from 'next/server';
import { getAllEvents } from '@/lib/models/PageData';

export async function GET() {
	try {
		const events = await getAllEvents();
		return NextResponse.json(events);
	} catch (error) {
		console.error('Error fetching all events:', error);
		return NextResponse.json(
			{ message: 'Wystąpił błąd podczas pobierania wszystkich wydarzeń' },
			{ status: 500 }
		);
	}
}
