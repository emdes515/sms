'use client';

import { useState, useEffect } from 'react';
import { ContactData } from '@/lib/models/PageData';
import { FixedSaveButton } from '@/components/FixedSaveButton';
import { useNotifications } from '@/components/NotificationSystem';

export default function ContactAdminPage() {
	const [contactData, setContactData] = useState<ContactData | null>(null);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const { addNotification } = useNotifications();

	useEffect(() => {
		fetchContactData();
	}, []);

	const fetchContactData = async () => {
		try {
			const response = await fetch('/api/admin/contact');
			const data = await response.json();
			setContactData(data.contactData);
		} catch (error) {
			console.error('Error fetching contact data:', error);
			addNotification({
				type: 'error',
				title: 'Błąd ładowania',
				message: 'Błąd podczas ładowania danych',
				duration: 5000,
			});
		} finally {
			setLoading(false);
		}
	};

	const handleSave = async () => {
		if (!contactData) return;

		setSaving(true);
		try {
			const response = await fetch('/api/admin/contact', {
				method: contactData._id ? 'PUT' : 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(contactData),
			});

			if (response.ok) {
				if (!contactData._id) {
					fetchContactData(); // Refresh to get the ID
				}
			} else {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Błąd podczas zapisywania');
			}
		} catch (error) {
			console.error('Error saving contact data:', error);
			throw error;
		} finally {
			setSaving(false);
		}
	};

	const updateField = (field: string, value: any) => {
		setContactData((prev) => {
			if (!prev) return null;

			const keys = field.split('.');
			const newData = { ...prev };
			let current = newData as any;

			for (let i = 0; i < keys.length - 1; i++) {
				if (!current[keys[i]]) current[keys[i]] = {};
				current = current[keys[i]];
			}

			current[keys[keys.length - 1]] = value;
			return newData;
		});
	};

	const addEmail = () => {
		if (!contactData) return;
		setContactData((prev) =>
			prev
				? {
						...prev,
						contactInfo: {
							...prev.contactInfo,
							email: [...prev.contactInfo.email, ''],
						},
				  }
				: null
		);
	};

	const removeEmail = (index: number) => {
		if (!contactData) return;
		setContactData((prev) =>
			prev
				? {
						...prev,
						contactInfo: {
							...prev.contactInfo,
							email: prev.contactInfo.email.filter((_, i) => i !== index),
						},
				  }
				: null
		);
	};

	const addPhone = () => {
		if (!contactData) return;
		setContactData((prev) =>
			prev
				? {
						...prev,
						contactInfo: {
							...prev.contactInfo,
							phone: [...prev.contactInfo.phone, ''],
						},
				  }
				: null
		);
	};

	const removePhone = (index: number) => {
		if (!contactData) return;
		setContactData((prev) =>
			prev
				? {
						...prev,
						contactInfo: {
							...prev.contactInfo,
							phone: prev.contactInfo.phone.filter((_, i) => i !== index),
						},
				  }
				: null
		);
	};

	const addSocialMedia = () => {
		if (!contactData) return;
		const newSocial = {
			name: '',
			url: '',
			icon: 'Facebook',
		};
		setContactData((prev) =>
			prev
				? {
						...prev,
						socialMedia: [...prev.socialMedia, newSocial],
				  }
				: null
		);
	};

	const removeSocialMedia = (index: number) => {
		if (!contactData) return;
		setContactData((prev) =>
			prev
				? {
						...prev,
						socialMedia: prev.socialMedia.filter((_, i) => i !== index),
				  }
				: null
		);
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
					<p className="mt-4 text-gray-600">Ładowanie...</p>
				</div>
			</div>
		);
	}

	if (!contactData) {
		// Initialize with default data
		const defaultData: ContactData = {
			title: 'Kontakt',
			description:
				'Masz pytania? Chcesz dołączyć do nas? A może masz pomysł na współpracę? Skontaktuj się z nami - chętnie porozmawiamy!',
			contactInfo: {
				email: ['kontakt@mlodasila.pl', 'info@mlodasila.pl'],
				phone: ['+48 123 456 789', '+48 987 654 321'],
				address: ['ul. Młodych 15', '00-001 Warszawa'],
				hours: ['Pon-Pt: 9:00-17:00', 'Sob: 10:00-14:00'],
			},
			socialMedia: [
				{ name: 'Facebook', url: '#', icon: 'Facebook' },
				{ name: 'Instagram', url: '#', icon: 'Instagram' },
				{ name: 'LinkedIn', url: '#', icon: 'Linkedin' },
				{ name: 'YouTube', url: '#', icon: 'Youtube' },
			],
			newsletter: {
				title: 'Newsletter',
				description: 'Bądź na bieżąco z naszymi działaniami i nadchodzącymi wydarzeniami',
			},
			createdAt: new Date(),
			updatedAt: new Date(),
		};
		setContactData(defaultData);
	}

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="bg-white rounded-lg shadow-sm">
					<div className="px-6 py-4 border-b border-gray-200">
						<h1 className="text-2xl font-bold text-gray-900">Edycja sekcji "Kontakt"</h1>
					</div>

					<div className="p-6 space-y-8">
						{/* Basic Info */}
						<div className="space-y-4">
							<h2 className="text-lg font-semibold text-gray-900">Podstawowe informacje</h2>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Tytuł sekcji</label>
								<input
									type="text"
									value={contactData?.title || ''}
									onChange={(e) => updateField('title', e.target.value)}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Opis</label>
								<textarea
									value={contactData?.description || ''}
									onChange={(e) => updateField('description', e.target.value)}
									rows={3}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
								/>
							</div>
						</div>

						{/* Contact Info */}
						<div className="space-y-4">
							<h2 className="text-lg font-semibold text-gray-900">Dane kontaktowe</h2>

							{/* Email */}
							<div>
								<div className="flex justify-between items-center mb-2">
									<label className="block text-sm font-medium text-gray-700">Adresy email</label>
									<button
										onClick={addEmail}
										className="px-3 py-1 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm">
										Dodaj email
									</button>
								</div>
								{contactData?.contactInfo.email.map((email, index) => (
									<div
										key={index}
										className="flex gap-2 mb-2">
										<input
											type="email"
											value={email}
											onChange={(e) => {
												const newEmails = [...(contactData?.contactInfo.email || [])];
												newEmails[index] = e.target.value;
												updateField('contactInfo.email', newEmails);
											}}
											className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
										/>
										<button
											onClick={() => removeEmail(index)}
											className="px-3 py-2 text-red-600 hover:text-red-800">
											Usuń
										</button>
									</div>
								))}
							</div>

							{/* Phone */}
							<div>
								<div className="flex justify-between items-center mb-2">
									<label className="block text-sm font-medium text-gray-700">Numery telefonu</label>
									<button
										onClick={addPhone}
										className="px-3 py-1 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm">
										Dodaj telefon
									</button>
								</div>
								{contactData?.contactInfo.phone.map((phone, index) => (
									<div
										key={index}
										className="flex gap-2 mb-2">
										<input
											type="tel"
											value={phone}
											onChange={(e) => {
												const newPhones = [...(contactData?.contactInfo.phone || [])];
												newPhones[index] = e.target.value;
												updateField('contactInfo.phone', newPhones);
											}}
											className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
										/>
										<button
											onClick={() => removePhone(index)}
											className="px-3 py-2 text-red-600 hover:text-red-800">
											Usuń
										</button>
									</div>
								))}
							</div>

							{/* Address */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Adres</label>
								{contactData?.contactInfo.address.map((line, index) => (
									<input
										key={index}
										type="text"
										value={line}
										onChange={(e) => {
											const newAddress = [...(contactData?.contactInfo.address || [])];
											newAddress[index] = e.target.value;
											updateField('contactInfo.address', newAddress);
										}}
										className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 mb-2"
									/>
								))}
							</div>

							{/* Hours */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Godziny pracy
								</label>
								{contactData?.contactInfo.hours.map((hour, index) => (
									<input
										key={index}
										type="text"
										value={hour}
										onChange={(e) => {
											const newHours = [...(contactData?.contactInfo.hours || [])];
											newHours[index] = e.target.value;
											updateField('contactInfo.hours', newHours);
										}}
										className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 mb-2"
									/>
								))}
							</div>
						</div>

						{/* Social Media */}
						<div className="space-y-4">
							<div className="flex justify-between items-center">
								<h2 className="text-lg font-semibold text-gray-900">Social Media</h2>
								<button
									onClick={addSocialMedia}
									className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
									Dodaj social media
								</button>
							</div>
							{contactData?.socialMedia.map((social, index) => (
								<div
									key={index}
									className="border border-gray-200 rounded-lg p-4">
									<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">Nazwa</label>
											<input
												type="text"
												value={social.name}
												onChange={(e) => {
													const newSocials = [...(contactData?.socialMedia || [])];
													newSocials[index] = { ...social, name: e.target.value };
													updateField('socialMedia', newSocials);
												}}
												className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
											/>
										</div>
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
											<input
												type="url"
												value={social.url}
												onChange={(e) => {
													const newSocials = [...(contactData?.socialMedia || [])];
													newSocials[index] = { ...social, url: e.target.value };
													updateField('socialMedia', newSocials);
												}}
												className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
											/>
										</div>
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">Ikona</label>
											<select
												value={social.icon}
												onChange={(e) => {
													const newSocials = [...(contactData?.socialMedia || [])];
													newSocials[index] = { ...social, icon: e.target.value };
													updateField('socialMedia', newSocials);
												}}
												className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
												<option value="Facebook">Facebook</option>
												<option value="Instagram">Instagram</option>
												<option value="Linkedin">LinkedIn</option>
												<option value="Youtube">YouTube</option>
												<option value="Twitter">Twitter</option>
												<option value="TikTok">TikTok</option>
											</select>
										</div>
									</div>
									<button
										onClick={() => removeSocialMedia(index)}
										className="mt-2 text-red-600 hover:text-red-800">
										Usuń
									</button>
								</div>
							))}
						</div>

						{/* Newsletter */}
						<div className="space-y-4">
							<h2 className="text-lg font-semibold text-gray-900">Newsletter</h2>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Tytuł</label>
								<input
									type="text"
									value={contactData?.newsletter.title || ''}
									onChange={(e) => updateField('newsletter.title', e.target.value)}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Opis</label>
								<textarea
									value={contactData?.newsletter.description || ''}
									onChange={(e) => updateField('newsletter.description', e.target.value)}
									rows={3}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Fixed Save Button */}
			<FixedSaveButton
				onSave={handleSave}
				disabled={!contactData}
				saving={saving}
			/>
		</div>
	);
}
