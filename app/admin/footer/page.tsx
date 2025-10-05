'use client';

import { useState, useEffect } from 'react';
import { FooterData } from '@/lib/models/PageData';

export default function FooterAdminPage() {
	const [footerData, setFooterData] = useState<FooterData | null>(null);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

	useEffect(() => {
		fetchFooterData();
	}, []);

	const fetchFooterData = async () => {
		try {
			const response = await fetch('/api/admin/footer');
			const data = await response.json();
			setFooterData(data.footerData);
		} catch (error) {
			console.error('Error fetching footer data:', error);
			setMessage({ type: 'error', text: 'Błąd podczas ładowania danych' });
		} finally {
			setLoading(false);
		}
	};

	const handleSave = async () => {
		if (!footerData) return;

		setSaving(true);
		try {
			const response = await fetch('/api/admin/footer', {
				method: footerData._id ? 'PUT' : 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(footerData),
			});

			if (response.ok) {
				setMessage({ type: 'success', text: 'Dane zostały zapisane' });
				if (!footerData._id) {
					fetchFooterData(); // Refresh to get the ID
				}
			} else {
				const errorData = await response.json();
				setMessage({
					type: 'error',
					text: `Błąd: ${errorData.message || 'Błąd podczas zapisywania'}`,
				});
			}
		} catch (error) {
			console.error('Error saving footer data:', error);
			setMessage({ type: 'error', text: 'Błąd podczas zapisywania' });
		} finally {
			setSaving(false);
		}
	};

	const updateField = (field: string, value: any) => {
		setFooterData((prev) => {
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

	const addQuickLink = () => {
		if (!footerData) return;
		const newLink = {
			text: '',
			href: '',
		};
		setFooterData((prev) =>
			prev
				? {
						...prev,
						quickLinks: [...prev.quickLinks, newLink],
				  }
				: null
		);
	};

	const removeQuickLink = (index: number) => {
		if (!footerData) return;
		setFooterData((prev) =>
			prev
				? {
						...prev,
						quickLinks: prev.quickLinks.filter((_, i) => i !== index),
				  }
				: null
		);
	};

	const addSocialMedia = () => {
		if (!footerData) return;
		const newSocial = {
			name: '',
			url: '',
		};
		setFooterData((prev) =>
			prev
				? {
						...prev,
						socialMedia: [...prev.socialMedia, newSocial],
				  }
				: null
		);
	};

	const removeSocialMedia = (index: number) => {
		if (!footerData) return;
		setFooterData((prev) =>
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

	if (!footerData) {
		// Initialize with default data
		const defaultData: FooterData = {
			organizationName: 'Młoda Siła',
			description:
				'Stowarzyszenie młodzieżowe działające na rzecz rozwoju młodych ludzi i budowania lepszej przyszłości.',
			quickLinks: [
				{ text: 'O nas', href: '#about' },
				{ text: 'Nasze działania', href: '#projects' },
				{ text: 'Dla kogo', href: '#target' },
				{ text: 'Współpraca', href: '#partners' },
			],
			contact: {
				email: 'kontakt@mlodasila.pl',
				phone: '+48 123 456 789',
				address: 'ul. Młodych 15, Warszawa',
			},
			socialMedia: [
				{ name: 'Facebook', url: '#' },
				{ name: 'Instagram', url: '#' },
				{ name: 'LinkedIn', url: '#' },
				{ name: 'YouTube', url: '#' },
			],
			copyright: '© 2024 Stowarzyszenie Młoda Siła. Wszystkie prawa zastrzeżone.',
			createdAt: new Date(),
			updatedAt: new Date(),
		};
		setFooterData(defaultData);
	}

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="bg-white rounded-lg shadow-sm">
					<div className="px-6 py-4 border-b border-gray-200">
						<h1 className="text-2xl font-bold text-gray-900">Edycja stopki</h1>
					</div>

					<div className="p-6 space-y-8">
						{message && (
							<div
								className={`p-4 rounded-md ${
									message.type === 'success'
										? 'bg-green-50 text-green-800'
										: 'bg-red-50 text-red-800'
								}`}>
								{message.text}
							</div>
						)}

						{/* Organization Info */}
						<div className="space-y-4">
							<h2 className="text-lg font-semibold text-gray-900">Informacje o organizacji</h2>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Nazwa organizacji
								</label>
								<input
									type="text"
									value={footerData?.organizationName || ''}
									onChange={(e) => updateField('organizationName', e.target.value)}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Opis</label>
								<textarea
									value={footerData?.description || ''}
									onChange={(e) => updateField('description', e.target.value)}
									rows={3}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
								/>
							</div>
						</div>

						{/* Quick Links */}
						<div className="space-y-4">
							<div className="flex justify-between items-center">
								<h2 className="text-lg font-semibold text-gray-900">Szybkie linki</h2>
								<button
									onClick={addQuickLink}
									className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
									Dodaj link
								</button>
							</div>
							{footerData?.quickLinks.map((link, index) => (
								<div
									key={index}
									className="border border-gray-200 rounded-lg p-4">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Tekst linku
											</label>
											<input
												type="text"
												value={link.text}
												onChange={(e) => {
													const newLinks = [...(footerData?.quickLinks || [])];
													newLinks[index] = { ...link, text: e.target.value };
													updateField('quickLinks', newLinks);
												}}
												className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
											/>
										</div>
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
											<input
												type="text"
												value={link.href}
												onChange={(e) => {
													const newLinks = [...(footerData?.quickLinks || [])];
													newLinks[index] = { ...link, href: e.target.value };
													updateField('quickLinks', newLinks);
												}}
												className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
											/>
										</div>
									</div>
									<button
										onClick={() => removeQuickLink(index)}
										className="mt-2 text-red-600 hover:text-red-800">
										Usuń link
									</button>
								</div>
							))}
						</div>

						{/* Contact Info */}
						<div className="space-y-4">
							<h2 className="text-lg font-semibold text-gray-900">Dane kontaktowe</h2>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
									<input
										type="email"
										value={footerData?.contact.email || ''}
										onChange={(e) => updateField('contact.email', e.target.value)}
										className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
									<input
										type="tel"
										value={footerData?.contact.phone || ''}
										onChange={(e) => updateField('contact.phone', e.target.value)}
										className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Adres</label>
									<input
										type="text"
										value={footerData?.contact.address || ''}
										onChange={(e) => updateField('contact.address', e.target.value)}
										className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
									/>
								</div>
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
							{footerData?.socialMedia.map((social, index) => (
								<div
									key={index}
									className="border border-gray-200 rounded-lg p-4">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">Nazwa</label>
											<input
												type="text"
												value={social.name}
												onChange={(e) => {
													const newSocials = [...(footerData?.socialMedia || [])];
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
													const newSocials = [...(footerData?.socialMedia || [])];
													newSocials[index] = { ...social, url: e.target.value };
													updateField('socialMedia', newSocials);
												}}
												className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
											/>
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

						{/* Copyright */}
						<div className="space-y-4">
							<h2 className="text-lg font-semibold text-gray-900">Copyright</h2>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Tekst copyright
								</label>
								<input
									type="text"
									value={footerData?.copyright || ''}
									onChange={(e) => updateField('copyright', e.target.value)}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
								/>
							</div>
						</div>

						{/* Save Button */}
						<div className="flex justify-end">
							<button
								onClick={handleSave}
								disabled={saving}
								className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50">
								{saving ? 'Zapisywanie...' : 'Zapisz zmiany'}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
