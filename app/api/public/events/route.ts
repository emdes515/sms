import { NextResponse } from 'next/server';
import { getEvents } from '@/lib/models/PageData';

export async function GET() {
	try {
		const events = await getEvents();
		return NextResponse.json(events);
	} catch (error) {
		console.error('Error fetching events:', error);
		return NextResponse.json(
			{ message: 'Wystąpił błąd podczas pobierania wydarzeń' },
			{ status: 500 }
		);
	}
}
