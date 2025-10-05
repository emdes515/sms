import { NextRequest, NextResponse } from 'next/server';
import { updateContactMessage, deleteContactMessage } from '@/lib/models/PageData';
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
		const messageData = await request.json();
		await updateContactMessage(params.id, messageData);
		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Error updating message:', error);
		return NextResponse.json(
			{ message: 'Wystąpił błąd podczas aktualizacji wiadomości' },
			{ status: 500 }
		);
	}
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
	if (!(await verifyAdminSession())) {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}
	try {
		await deleteContactMessage(params.id);
		return NextResponse.json({ message: 'Wiadomość usunięta pomyślnie' });
	} catch (error) {
		console.error('Error deleting message:', error);
		return NextResponse.json(
			{ message: 'Wystąpił błąd podczas usuwania wiadomości' },
			{ status: 500 }
		);
	}
}
