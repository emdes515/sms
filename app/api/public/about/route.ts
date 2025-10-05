import { NextResponse } from 'next/server';
import { getAboutData } from '@/lib/models/PageData';

export async function GET() {
	try {
		const aboutData = await getAboutData();
		return NextResponse.json({ aboutData });
	} catch (error) {
		console.error('Error fetching about data:', error);
		return NextResponse.json({ error: 'Failed to fetch about data' }, { status: 500 });
	}
}
