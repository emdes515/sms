import { NextResponse } from 'next/server';
import { getPartners } from '@/lib/models/PageData';

export async function GET() {
	try {
		const partners = await getPartners();
		return NextResponse.json(partners);
	} catch (error) {
		console.error('Error fetching partners:', error);
		return NextResponse.json(
			{ message: 'Wystąpił błąd podczas pobierania partnerów' },
			{ status: 500 }
		);
	}
}
