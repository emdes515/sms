import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
	try {
		const cookieStore = cookies();
		const session = cookieStore.get('admin-session');

		if (session && session.value === 'authenticated') {
			return NextResponse.json({ authenticated: true });
		}

		return NextResponse.json({ authenticated: false }, { status: 401 });
	} catch (error) {
		console.error('Auth verification error:', error);
		return NextResponse.json({ authenticated: false }, { status: 401 });
	}
}
