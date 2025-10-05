import { NextRequest, NextResponse } from 'next/server';
import { updateWard, deleteWard } from '@/lib/models/PageData';
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
		const wardData = await request.json();
		await updateWard(params.id, wardData);
		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Error updating ward:', error);
		return NextResponse.json(
			{ message: 'Wystąpił błąd podczas aktualizacji podopiecznego' },
			{ status: 500 }
		);
	}
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
	if (!(await verifyAdminSession())) {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}
	try {
		await deleteWard(params.id);
		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Error deleting ward:', error);
		return NextResponse.json(
			{ message: 'Wystąpił błąd podczas usuwania podopiecznego' },
			{ status: 500 }
		);
	}
}
