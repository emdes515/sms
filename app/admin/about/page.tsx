'use client';

import { useState, useEffect } from 'react';
import { AboutData } from '@/lib/models/PageData';
import ImageUpload from '@/components/ImageUpload';
import { FixedSaveButton } from '@/components/FixedSaveButton';
import { useNotifications } from '@/components/NotificationSystem';

export default function AboutAdminPage() {
	const [aboutData, setAboutData] = useState<AboutData | null>(null);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const { addNotification } = useNotifications();

	useEffect(() => {
		fetchAboutData();
	}, []);

	const fetchAboutData = async () => {
		try {
			const response = await fetch('/api/admin/about');
			const data = await response.json();
			setAboutData(data.aboutData);
		} catch (error) {
			console.error('Error fetching about data:', error);
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
		if (!aboutData) return;

		setSaving(true);
		try {
			const response = await fetch('/api/admin/about', {
				method: aboutData._id ? 'PUT' : 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(aboutData),
			});

			if (response.ok) {
				if (!aboutData._id) {
					fetchAboutData(); // Refresh to get the ID
				}
			} else {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Błąd podczas zapisywania');
			}
		} catch (error) {
			console.error('Error saving about data:', error);
			throw error;
		} finally {
			setSaving(false);
		}
	};

	const updateField = (field: string, value: any) => {
		setAboutData((prev) => {
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

	const addValue = () => {
		if (!aboutData) return;
		const newValue = {
			title: '',
			description: '',
			icon: 'Target',
		};
		setAboutData((prev) =>
			prev
				? {
						...prev,
						values: [...prev.values, newValue],
				  }
				: null
		);
	};

	const removeValue = (index: number) => {
		if (!aboutData) return;
		setAboutData((prev) =>
			prev
				? {
						...prev,
						values: prev.values.filter((_, i) => i !== index),
				  }
				: null
		);
	};

	const addManagementMember = () => {
		if (!aboutData) return;
		const newMember = {
			name: '',
			position: '',
			description: '',
			image: '',
			experience: '',
			education: '',
		};
		setAboutData((prev) =>
			prev
				? {
						...prev,
						management: {
							...prev.management,
							members: [...prev.management.members, newMember],
						},
				  }
				: null
		);
	};

	const removeManagementMember = (index: number) => {
		if (!aboutData) return;
		setAboutData((prev) =>
			prev
				? {
						...prev,
						management: {
							...prev.management,
							members: prev.management.members.filter((_, i) => i !== index),
						},
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

	if (!aboutData) {
		// Initialize with default data
		const defaultData: AboutData = {
			title: 'O nas',
			description:
				'Stowarzyszenie Młoda Siła to organizacja młodzieżowa, która od 2015 roku aktywnie działa na rzecz rozwoju młodych ludzi i budowania lepszej przyszłości.',
			mission: {
				title: 'Nasza misja',
				description:
					'Wierzymy, że młodzi ludzie mają nieograniczony potencjał do tworzenia pozytywnych zmian. Naszym celem jest stworzenie przestrzeni, gdzie mogą rozwijać swoje umiejętności, zdobywać doświadczenie i budować lepszą przyszłość dla siebie i swojej społeczności.',
			},
			values: [
				{
					title: 'Cel',
					description: 'Rozwijamy potencjał młodych ludzi i budujemy silną społeczność',
					icon: 'Target',
				},
				{
					title: 'Wspólnota',
					description: 'Tworzymy przestrzeń, gdzie każdy może znaleźć swoje miejsce',
					icon: 'Users',
				},
				{
					title: 'Pasja',
					description: 'Działamy z entuzjazmem i zaangażowaniem w to, co robimy',
					icon: 'Heart',
				},
			],
			achievements: {
				title: 'Nasze osiągnięcia',
				description:
					'Dzięki zaangażowaniu naszych członków i wsparciu partnerów udało nam się zrealizować wiele wartościowych projektów',
				stats: [
					{ value: '8+', label: 'Lat działalności' },
					{ value: '500+', label: 'Aktywnych członków' },
					{ value: '50+', label: 'Zrealizowanych projektów' },
					{ value: '15+', label: 'Partnerów współpracujących' },
				],
			},
			management: {
				title: 'Zarząd',
				description:
					'Poznaj nasz zespół zarządzający, który z pasją i zaangażowaniem kieruje działalnością stowarzyszenia',
				members: [
					{
						name: 'Anna Kowalska',
						position: 'Prezes',
						description:
							'Absolwentka psychologii społecznej, od 5 lat zaangażowana w rozwój młodzieży',
						image: '/uploads/1759587252678-ontjzbtf8e.jpg',
						experience: '5 lat doświadczenia',
						education: 'Psychologia społeczna UW',
					},
				],
			},
			carousel: {
				enabled: true,
				autoplay: true,
				autoplaySpeed: 5000,
				images: [],
			},
			createdAt: new Date(),
			updatedAt: new Date(),
		};
		setAboutData(defaultData);
	}

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="bg-white rounded-lg shadow-sm">
					<div className="px-6 py-4 border-b border-gray-200">
						<h1 className="text-2xl font-bold text-gray-900">Edycja sekcji "O nas"</h1>
					</div>

					<div className="p-6 space-y-8">
						{/* Basic Info */}
						<div className="space-y-4">
							<h2 className="text-lg font-semibold text-gray-900">Podstawowe informacje</h2>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Tytuł sekcji</label>
								<input
									type="text"
									value={aboutData?.title || ''}
									onChange={(e) => updateField('title', e.target.value)}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Opis</label>
								<textarea
									value={aboutData?.description || ''}
									onChange={(e) => updateField('description', e.target.value)}
									rows={3}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
								/>
							</div>
						</div>

						{/* Mission */}
						<div className="space-y-4">
							<h2 className="text-lg font-semibold text-gray-900">Misja</h2>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Tytuł misji</label>
								<input
									type="text"
									value={aboutData?.mission.title || ''}
									onChange={(e) => updateField('mission.title', e.target.value)}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Opis misji</label>
								<textarea
									value={aboutData?.mission.description || ''}
									onChange={(e) => updateField('mission.description', e.target.value)}
									rows={4}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
								/>
							</div>
						</div>

						{/* Values */}
						<div className="space-y-4">
							<div className="flex justify-between items-center">
								<h2 className="text-lg font-semibold text-gray-900">Wartości</h2>
								<button
									onClick={addValue}
									className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
									Dodaj wartość
								</button>
							</div>
							{aboutData?.values.map((value, index) => (
								<div
									key={index}
									className="border border-gray-200 rounded-lg p-4">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">Tytuł</label>
											<input
												type="text"
												value={value.title}
												onChange={(e) => {
													const newValues = [...(aboutData?.values || [])];
													newValues[index] = { ...value, title: e.target.value };
													updateField('values', newValues);
												}}
												className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
											/>
										</div>
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">Ikona</label>
											<select
												value={value.icon}
												onChange={(e) => {
													const newValues = [...(aboutData?.values || [])];
													newValues[index] = { ...value, icon: e.target.value };
													updateField('values', newValues);
												}}
												className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
												<option value="Target">Target</option>
												<option value="Users">Users</option>
												<option value="Heart">Heart</option>
												<option value="Lightbulb">Lightbulb</option>
												<option value="Award">Award</option>
												<option value="Users2">Users2</option>
											</select>
										</div>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">Opis</label>
										<textarea
											value={value.description}
											onChange={(e) => {
												const newValues = [...(aboutData?.values || [])];
												newValues[index] = { ...value, description: e.target.value };
												updateField('values', newValues);
											}}
											rows={2}
											className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
										/>
									</div>
									<button
										onClick={() => removeValue(index)}
										className="mt-2 text-red-600 hover:text-red-800">
										Usuń
									</button>
								</div>
							))}
						</div>

						{/* Achievements */}
						<div className="space-y-4">
							<h2 className="text-lg font-semibold text-gray-900">Osiągnięcia</h2>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Tytuł</label>
								<input
									type="text"
									value={aboutData?.achievements.title || ''}
									onChange={(e) => updateField('achievements.title', e.target.value)}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Opis</label>
								<textarea
									value={aboutData?.achievements.description || ''}
									onChange={(e) => updateField('achievements.description', e.target.value)}
									rows={3}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
								/>
							</div>
						</div>

						{/* Management */}
						<div className="space-y-4">
							<div className="flex justify-between items-center">
								<h2 className="text-lg font-semibold text-gray-900">Zarząd</h2>
								<button
									onClick={addManagementMember}
									className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
									Dodaj członka
								</button>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Tytuł sekcji</label>
								<input
									type="text"
									value={aboutData?.management.title || ''}
									onChange={(e) => updateField('management.title', e.target.value)}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Opis sekcji</label>
								<textarea
									value={aboutData?.management.description || ''}
									onChange={(e) => updateField('management.description', e.target.value)}
									rows={2}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
								/>
							</div>
							{aboutData?.management.members.map((member, index) => (
								<div
									key={index}
									className="border border-gray-200 rounded-lg p-4">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Imię i nazwisko
											</label>
											<input
												type="text"
												value={member.name}
												onChange={(e) => {
													const newMembers = [...(aboutData?.management.members || [])];
													newMembers[index] = { ...member, name: e.target.value };
													updateField('management.members', newMembers);
												}}
												className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
											/>
										</div>
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Stanowisko
											</label>
											<input
												type="text"
												value={member.position}
												onChange={(e) => {
													const newMembers = [...(aboutData?.management.members || [])];
													newMembers[index] = { ...member, position: e.target.value };
													updateField('management.members', newMembers);
												}}
												className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
											/>
										</div>
									</div>
									<div className="mb-4">
										<label className="block text-sm font-medium text-gray-700 mb-2">Opis</label>
										<textarea
											value={member.description}
											onChange={(e) => {
												const newMembers = [...(aboutData?.management.members || [])];
												newMembers[index] = { ...member, description: e.target.value };
												updateField('management.members', newMembers);
											}}
											rows={2}
											className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
										/>
									</div>
									<div className="mb-4">
										<label className="block text-sm font-medium text-gray-700 mb-2">Zdjęcie</label>
										<ImageUpload
											onImageSelect={(imageUrl) => {
												const newMembers = [...(aboutData?.management.members || [])];
												newMembers[index] = { ...member, image: imageUrl };
												updateField('management.members', newMembers);
											}}
											selectedImage={member.image}
										/>
									</div>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Doświadczenie
											</label>
											<input
												type="text"
												value={member.experience}
												onChange={(e) => {
													const newMembers = [...(aboutData?.management.members || [])];
													newMembers[index] = { ...member, experience: e.target.value };
													updateField('management.members', newMembers);
												}}
												className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
											/>
										</div>
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Wykształcenie
											</label>
											<input
												type="text"
												value={member.education}
												onChange={(e) => {
													const newMembers = [...(aboutData?.management.members || [])];
													newMembers[index] = { ...member, education: e.target.value };
													updateField('management.members', newMembers);
												}}
												className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
											/>
										</div>
									</div>
									<button
										onClick={() => removeManagementMember(index)}
										className="text-red-600 hover:text-red-800">
										Usuń członka
									</button>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>

			{/* Fixed Save Button */}
			<FixedSaveButton
				onSave={handleSave}
				disabled={!aboutData}
				saving={saving}
			/>
		</div>
	);
}
