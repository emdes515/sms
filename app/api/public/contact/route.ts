import { NextRequest, NextResponse } from 'next/server';
import { getContactData, createContactMessage } from '@/lib/models/PageData';
import { sendNotificationEmail } from '@/lib/email';

export async function GET() {
	try {
		const contactData = await getContactData();
		return NextResponse.json({ contactData });
	} catch (error) {
		console.error('Error fetching contact data:', error);
		return NextResponse.json({ error: 'Failed to fetch contact data' }, { status: 500 });
	}
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { name, email, subject, message } = body;

		// Validate required fields
		if (!name || !email || !subject || !message) {
			return NextResponse.json({ error: 'Wszystkie pola są wymagane' }, { status: 400 });
		}

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return NextResponse.json({ error: 'Nieprawidłowy format adresu email' }, { status: 400 });
		}

		// Create contact message
		const contactMessage = await createContactMessage({
			name,
			email,
			subject,
			message,
			status: 'new',
		});

		// Send notification email
		const emailData = {
			name,
			email,
			subject,
			message,
			date: new Date().toLocaleString('pl-PL'),
		};

		// Try to send notification email (don't fail if email sending fails)
		try {
			await sendNotificationEmail(emailData);
		} catch (error) {
			console.error('Failed to send notification email:', error);
			// Continue execution even if email fails
		}

		return NextResponse.json({
			message: 'Wiadomość została wysłana pomyślnie',
			success: true,
		});
	} catch (error) {
		console.error('Error processing contact form:', error);
		return NextResponse.json(
			{ error: 'Wystąpił błąd podczas wysyłania wiadomości' },
			{ status: 500 }
		);
	}
}
