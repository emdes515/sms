import { NextRequest, NextResponse } from 'next/server';
import { getHeroData, createHeroData, updateHeroData } from '@/lib/models/PageData';
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

export async function PUT(request: NextRequest) {
	if (!(await verifyAdminSession())) {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}
	try {
		const heroData = await request.json();

		// Sprawdź czy dane Hero już istnieją
		const existingData = await getHeroData();

		if (existingData) {
			// Aktualizuj istniejące dane
			await updateHeroData(existingData._id!, heroData);
		} else {
			// Utwórz nowe dane
			await createHeroData(heroData);
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Error updating hero data:', error);
		return NextResponse.json(
			{ message: 'Wystąpił błąd podczas zapisywania danych' },
			{ status: 500 }
		);
	}
}
