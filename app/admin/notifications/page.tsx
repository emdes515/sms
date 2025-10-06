'use client';

import { useState, useEffect } from 'react';
import { Mail, Save, Settings } from 'lucide-react';
import { NotificationSettings } from '@/lib/models/PageData';

const NotificationSettingsPage = () => {
	const [settings, setSettings] = useState<NotificationSettings | null>(null);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [message, setMessage] = useState('');

	useEffect(() => {
		fetchSettings();
	}, []);

	const fetchSettings = async () => {
		try {
			const response = await fetch('/api/admin/notifications');
			if (response.ok) {
				const data = await response.json();
				if (data) {
					setSettings(data);
				} else {
					// Create default settings if none exist
					setSettings({
						_id: null,
						emailNotifications: {
							enabled: false,
							adminEmail: '',
							subject: 'Nowa wiadomość z formularza kontaktowego',
							template:
								'Otrzymano nową wiadomość od {{name}} ({{email}})\n\nTemat: {{subject}}\n\nTreść:\n{{message}}\n\nData: {{date}}',
						},
						createdAt: new Date(),
						updatedAt: new Date(),
					});
				}
			}
		} catch (error) {
			console.error('Error fetching notification settings:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleSave = async () => {
		setSaving(true);
		try {
			const response = await fetch('/api/admin/notifications', {
				method: settings?._id && settings._id !== null ? 'PUT' : 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(settings),
			});

			if (response.ok) {
				const data = await response.json();
				if (data.settings) {
					setSettings(data.settings);
				}
				setMessage('Ustawienia powiadomień zapisane!');
				setTimeout(() => setMessage(''), 3000);
			} else {
				setMessage('Wystąpił błąd podczas zapisywania ustawień');
			}
		} catch (error) {
			setMessage('Wystąpił błąd podczas zapisywania ustawień');
		} finally {
			setSaving(false);
		}
	};

	const handleInputChange = (field: string, value: any) => {
		setSettings((prev) => {
			if (!prev) return prev;

			if (field.includes('.')) {
				const [parent, child] = field.split('.');
				return {
					...prev,
					[parent]: {
						...(prev[parent as keyof NotificationSettings] as any || {}),
						[child]: value,
					},
				};
			}

			return {
				...prev,
				[field]: value,
			};
		});
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
			</div>
		);
	}

	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-3xl font-bold text-gray-900">Ustawienia powiadomień</h1>
				<p className="mt-2 text-gray-600">Skonfiguruj powiadomienia email dla nowych wiadomości</p>
			</div>

			{message && (
				<div
					className={`p-4 rounded-lg ${
						message.includes('błąd')
							? 'bg-red-50 text-red-700 border border-red-200'
							: 'bg-green-50 text-green-700 border border-green-200'
					}`}>
					{message}
				</div>
			)}

			{settings && (
				<div className="bg-white rounded-lg shadow-sm border border-gray-200">
					<div className="p-6">
						<div className="flex items-center gap-3 mb-6">
							<Settings className="h-6 w-6 text-primary-600" />
							<h2 className="text-xl font-semibold text-gray-900">Powiadomienia email</h2>
						</div>

						<div className="space-y-6">
							{/* Enable/Disable Notifications */}
							<div className="flex items-center justify-between">
								<div>
									<label className="text-sm font-medium text-gray-700">
										Włącz powiadomienia email
									</label>
									<p className="text-sm text-gray-500">
										Otrzymuj powiadomienia o nowych wiadomościach
									</p>
								</div>
								<label className="relative inline-flex items-center cursor-pointer">
									<input
										type="checkbox"
										checked={settings.emailNotifications.enabled}
										onChange={(e) =>
											handleInputChange('emailNotifications.enabled', e.target.checked)
										}
										className="sr-only peer"
										aria-label="Włącz powiadomienia email"
									/>
									<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
								</label>
							</div>

							{/* Admin Email */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Email administratora
								</label>
								<div className="relative">
									<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
									<input
										type="email"
										value={settings.emailNotifications.adminEmail}
										onChange={(e) =>
											handleInputChange('emailNotifications.adminEmail', e.target.value)
										}
										className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
										placeholder="admin@example.com"
									/>
								</div>
								<p className="text-sm text-gray-500 mt-1">
									Adres email, na który będą wysyłane powiadomienia
								</p>
							</div>

							{/* Email Subject */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Temat wiadomości
								</label>
								<input
									type="text"
									value={settings.emailNotifications.subject}
									onChange={(e) => handleInputChange('emailNotifications.subject', e.target.value)}
									className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
									placeholder="Nowa wiadomość z formularza kontaktowego"
								/>
							</div>

							{/* Email Template */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Szablon wiadomości
								</label>
								<textarea
									value={settings.emailNotifications.template}
									onChange={(e) => handleInputChange('emailNotifications.template', e.target.value)}
									rows={8}
									className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
									placeholder="Otrzymano nową wiadomość od {{name}} ({{email}})&#10;&#10;Temat: {{subject}}&#10;&#10;Treść:&#10;{{message}}&#10;&#10;Data: {{date}}"
								/>
								<div className="mt-2 text-sm text-gray-500">
									<p className="font-medium mb-1">Dostępne zmienne:</p>
									<ul className="list-disc list-inside space-y-1">
										<li>
											<code className="bg-gray-100 px-1 rounded">{'{{ name }}'}</code> - imię
											nadawcy
										</li>
										<li>
											<code className="bg-gray-100 px-1 rounded">{'{{ email }}'}</code> - email
											nadawcy
										</li>
										<li>
											<code className="bg-gray-100 px-1 rounded">{'{{ subject }}'}</code> - temat
											wiadomości
										</li>
										<li>
											<code className="bg-gray-100 px-1 rounded">{'{{ message }}'}</code> - treść
											wiadomości
										</li>
										<li>
											<code className="bg-gray-100 px-1 rounded">{'{{ date }}'}</code> - data
											wysłania
										</li>
									</ul>
								</div>
							</div>
						</div>

						<div className="mt-8 flex justify-end">
							<button
								onClick={handleSave}
								disabled={saving}
								className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed">
								<Save className="h-4 w-4" />
								{saving ? 'Zapisywanie...' : 'Zapisz ustawienia'}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default NotificationSettingsPage;
