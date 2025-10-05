import { NextResponse } from 'next/server';
import { getAllWards } from '@/lib/models/PageData';

export async function GET() {
	try {
		const wards = await getAllWards();
		return NextResponse.json(wards);
	} catch (error) {
		console.error('Error fetching all wards:', error);
		return NextResponse.json(
			{ message: 'Wystąpił błąd podczas pobierania wszystkich podopiecznych' },
			{ status: 500 }
		);
	}
}
