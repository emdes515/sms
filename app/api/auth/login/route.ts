import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

const ADMIN_PIN = process.env.ADMIN_PIN || '12345678901'; // 11-cyfrowy PIN

export async function POST(request: NextRequest) {
	try {
		const { pin } = await request.json();

		if (!pin || pin.length !== 11 || !/^\d{11}$/.test(pin)) {
			return NextResponse.json({ message: 'PIN musi składać się z 11 cyfr' }, { status: 400 });
		}

		if (pin !== ADMIN_PIN) {
			return NextResponse.json({ message: 'Nieprawidłowy PIN' }, { status: 401 });
		}

		const cookieStore = cookies();
		cookieStore.set('admin-session', 'authenticated', {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 24 * 60 * 60, // 24 godziny
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Login error:', error);
		return NextResponse.json({ message: 'Wystąpił błąd podczas logowania' }, { status: 500 });
	}
}
