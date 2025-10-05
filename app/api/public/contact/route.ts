import { NextResponse } from 'next/server';
import { getContactData } from '@/lib/models/PageData';

export async function GET() {
	try {
		const contactData = await getContactData();
		return NextResponse.json({ contactData });
	} catch (error) {
		console.error('Error fetching contact data:', error);
		return NextResponse.json({ error: 'Failed to fetch contact data' }, { status: 500 });
	}
}
