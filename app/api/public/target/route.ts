import { NextResponse } from 'next/server';
import { getTargetData } from '@/lib/models/PageData';

export async function GET() {
	try {
		const targetData = await getTargetData();
		return NextResponse.json({ targetData });
	} catch (error) {
		console.error('Error fetching target data:', error);
		return NextResponse.json({ error: 'Failed to fetch target data' }, { status: 500 });
	}
}
