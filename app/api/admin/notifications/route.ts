import { NextRequest, NextResponse } from 'next/server';
import {
	getNotificationSettings,
	createNotificationSettings,
	updateNotificationSettings,
} from '@/lib/models/PageData';
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
		const settings = await getNotificationSettings();
		return NextResponse.json(settings);
	} catch (error) {
		console.error('Error fetching notification settings:', error);
		return NextResponse.json(
			{ message: 'Wystąpił błąd podczas pobierania ustawień powiadomień' },
			{ status: 500 }
		);
	}
}

export async function POST(request: NextRequest) {
	if (!(await verifyAdminSession())) {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}
	try {
		const body = await request.json();
		const settings = await createNotificationSettings(body);
		return NextResponse.json({ settings });
	} catch (error) {
		console.error('Error creating notification settings:', error);
		return NextResponse.json({ error: 'Failed to create notification settings' }, { status: 500 });
	}
}

export async function PUT(request: NextRequest) {
	if (!(await verifyAdminSession())) {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}
	try {
		const body = await request.json();
		const { _id, ...updateData } = body;

		if (!_id || _id === null) {
			return NextResponse.json({ error: 'ID is required' }, { status: 400 });
		}

		await updateNotificationSettings(_id, updateData);
		return NextResponse.json({ message: 'Ustawienia powiadomień zaktualizowane' });
	} catch (error) {
		console.error('Error updating notification settings:', error);
		return NextResponse.json({ error: 'Failed to update notification settings' }, { status: 500 });
	}
}
