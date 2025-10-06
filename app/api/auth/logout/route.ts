import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST() {
	try {
		const cookieStore = cookies();
		cookieStore.delete('admin-session');

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Logout error:', error);
		return NextResponse.json({ message: 'Wystąpił błąd podczas wylogowywania' }, { status: 500 });
	}
}
