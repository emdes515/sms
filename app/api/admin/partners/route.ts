import { NextRequest, NextResponse } from 'next/server';
import { getPartners, createPartner } from '@/lib/models/PageData';
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

export async function POST(request: NextRequest) {
	if (!(await verifyAdminSession())) {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}
	try {
		const partnerData = await request.json();
		const partner = await createPartner(partnerData);
		return NextResponse.json(partner);
	} catch (error) {
		console.error('Error creating partner:', error);
		return NextResponse.json(
			{ message: 'Wystąpił błąd podczas tworzenia partnera' },
			{ status: 500 }
		);
	}
}
