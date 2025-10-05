import { NextRequest, NextResponse } from 'next/server';
import { getAboutData, updateAboutData } from '@/lib/models/PageData';
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
		const aboutData = await getAboutData();
		return NextResponse.json({ carousel: aboutData?.carousel || null });
	} catch (error) {
		console.error('Error fetching carousel data:', error);
		return NextResponse.json({ error: 'Failed to fetch carousel data' }, { status: 500 });
	}
}

export async function PUT(request: NextRequest) {
	if (!(await verifyAdminSession())) {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}
	try {
		const body = await request.json();
		const { carousel } = body;

		console.log('Carousel PUT request - Carousel data:', JSON.stringify(carousel, null, 2));

		// Pobierz obecne dane about
		const aboutData = await getAboutData();
		if (!aboutData || !aboutData._id) {
			return NextResponse.json({ error: 'About data not found' }, { status: 404 });
		}

		// Zaktualizuj tylko sekcję karuzeli
		await updateAboutData(aboutData._id, { carousel });
		console.log('Carousel data updated successfully');
		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Error updating carousel data:', error);
		return NextResponse.json({ error: 'Failed to update carousel data' }, { status: 500 });
	}
}
