import { NextRequest, NextResponse } from 'next/server';
import { updatePartner, deletePartner } from '@/lib/models/PageData';
import { cookies } from 'next/headers';

async function verifyAdminSession() {
	const cookieStore = cookies();
	const session = cookieStore.get('admin-session');
	return session && session.value === 'authenticated';
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
	if (!(await verifyAdminSession())) {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}
	try {
		const partnerData = await request.json();
		await updatePartner(params.id, partnerData);
		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Error updating partner:', error);
		return NextResponse.json(
			{ message: 'Wystąpił błąd podczas aktualizacji partnera' },
			{ status: 500 }
		);
	}
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
	if (!(await verifyAdminSession())) {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}
	try {
		await deletePartner(params.id);
		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Error deleting partner:', error);
		return NextResponse.json(
			{ message: 'Wystąpił błąd podczas usuwania partnera' },
			{ status: 500 }
		);
	}
}
