import { NextResponse } from 'next/server';
import { getHeroData } from '@/lib/models/PageData';

export async function GET() {
	try {
		const heroData = await getHeroData();
		return NextResponse.json({ heroData });
	} catch (error) {
		console.error('Error fetching hero data:', error);
		return NextResponse.json(
			{ message: 'Wystąpił błąd podczas pobierania danych' },
			{ status: 500 }
		);
	}
}
