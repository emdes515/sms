import nodemailer from 'nodemailer';
import { getNotificationSettings } from './models/PageData';

interface EmailData {
	name: string;
	email: string;
	subject: string;
	message: string;
	date: string;
}

export async function sendNotificationEmail(emailData: EmailData): Promise<boolean> {
	try {
		const settings = await getNotificationSettings();

		if (
			!settings ||
			!settings.emailNotifications.enabled ||
			!settings.emailNotifications.adminEmail
		) {
			console.log('Email notifications disabled or no admin email configured');
			return false;
		}

		// Create transporter
		const transporter = nodemailer.createTransport({
			host: process.env.SMTP_HOST || 'smtp.gmail.com',
			port: parseInt(process.env.SMTP_PORT || '587'),
			secure: process.env.SMTP_SECURE === 'true',
			auth: {
				user: process.env.SMTP_USER,
				pass: process.env.SMTP_PASS,
			},
		});

		// Replace template variables
		let emailBody = settings.emailNotifications.template;
		emailBody = emailBody.replace(/\{\{name\}\}/g, emailData.name);
		emailBody = emailBody.replace(/\{\{email\}\}/g, emailData.email);
		emailBody = emailBody.replace(/\{\{subject\}\}/g, emailData.subject);
		emailBody = emailBody.replace(/\{\{message\}\}/g, emailData.message);
		emailBody = emailBody.replace(/\{\{date\}\}/g, emailData.date);

		// Send email
		const info = await transporter.sendMail({
			from: process.env.SMTP_FROM || process.env.SMTP_USER,
			to: settings.emailNotifications.adminEmail,
			subject: settings.emailNotifications.subject,
			text: emailBody,
			html: emailBody.replace(/\n/g, '<br>'),
		});

		console.log('Email sent successfully:', info.messageId);
		return true;
	} catch (error) {
		console.error('Error sending email:', error);
		return false;
	}
}

export async function sendContactFormEmail(emailData: EmailData): Promise<boolean> {
	try {
		// Create transporter
		const transporter = nodemailer.createTransport({
			host: process.env.SMTP_HOST || 'smtp.gmail.com',
			port: parseInt(process.env.SMTP_PORT || '587'),
			secure: process.env.SMTP_SECURE === 'true',
			auth: {
				user: process.env.SMTP_USER,
				pass: process.env.SMTP_PASS,
			},
		});

		const emailBody = `
Nowa wiadomość z formularza kontaktowego

Od: ${emailData.name} (${emailData.email})
Temat: ${emailData.subject}

Treść wiadomości:
${emailData.message}

Data wysłania: ${emailData.date}
		`.trim();

		// Send email
		const info = await transporter.sendMail({
			from: process.env.SMTP_FROM || process.env.SMTP_USER,
			to: process.env.ADMIN_EMAIL || 'admin@example.com',
			subject: `Nowa wiadomość: ${emailData.subject}`,
			text: emailBody,
			html: emailBody.replace(/\n/g, '<br>'),
		});

		console.log('Contact form email sent successfully:', info.messageId);
		return true;
	} catch (error) {
		console.error('Error sending contact form email:', error);
		return false;
	}
}
