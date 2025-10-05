import { NextResponse } from 'next/server';
import { getWards } from '@/lib/models/PageData';

export async function GET() {
	try {
		const wards = await getWards();
		return NextResponse.json(wards);
	} catch (error) {
		console.error('Error fetching wards:', error);
		return NextResponse.json(
			{ message: 'Wystąpił błąd podczas pobierania podopiecznych' },
			{ status: 500 }
		);
	}
}
