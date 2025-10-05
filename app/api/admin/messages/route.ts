import { NextRequest, NextResponse } from 'next/server';
import { getContactMessages } from '@/lib/models/PageData';
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
		const messages = await getContactMessages();
		return NextResponse.json(messages);
	} catch (error) {
		console.error('Error fetching messages:', error);
		return NextResponse.json(
			{ message: 'Wystąpił błąd podczas pobierania wiadomości' },
			{ status: 500 }
		);
	}
}
