'use client';

import { useState, useEffect } from 'react';
import { TargetData } from '@/lib/models/PageData';
import { FixedSaveButton } from '@/components/FixedSaveButton';
import { useNotifications } from '@/components/NotificationSystem';
import { EmojiPicker } from '@/components/EmojiPicker';

export default function TargetAdminPage() {
	const [targetData, setTargetData] = useState<TargetData | null>(null);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const { addNotification } = useNotifications();

	useEffect(() => {
		fetchTargetData();
	}, []);

	const fetchTargetData = async () => {
		try {
			const response = await fetch('/api/admin/target');
			const data = await response.json();
			setTargetData(data.targetData);
		} catch (error) {
			console.error('Error fetching target data:', error);
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
		console.log('handleSave called, targetData:', targetData);
		if (!targetData) return;

		setSaving(true);
		try {
			const response = await fetch('/api/admin/target', {
				method: targetData._id ? 'PUT' : 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					...targetData,
					id: targetData._id, // Map _id to id for API
				}),
			});

			if (response.ok) {
				if (!targetData._id) {
					fetchTargetData(); // Refresh to get the ID
				}
			} else {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Błąd podczas zapisywania');
			}
		} catch (error) {
			console.error('Error saving target data:', error);
			throw error;
		} finally {
			setSaving(false);
		}
	};

	const updateField = (field: string, value: any) => {
		setTargetData((prev) => {
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

	const addTargetGroup = () => {
		console.log('addTargetGroup called, targetData:', targetData);
		if (!targetData) return;

		try {
			const newGroup = {
				title: '',
				description: '',
				icon: 'User',
				benefits: [''],
			};
			setTargetData((prev) =>
				prev
					? {
							...prev,
							targetGroups: [...(prev.targetGroups || []), newGroup],
					  }
					: null
			);

			addNotification({
				type: 'success',
				title: 'Dodano grupę',
				message: 'Nowa grupa docelowa została dodana',
				duration: 3000,
			});
		} catch (error) {
			console.error('Error adding target group:', error);
			addNotification({
				type: 'error',
				title: 'Błąd dodawania',
				message: 'Wystąpił błąd podczas dodawania grupy',
				duration: 5000,
			});
		}
	};

	const removeTargetGroup = (index: number) => {
		if (!targetData || !targetData.targetGroups) return;

		try {
			setTargetData((prev) => {
				if (!prev || !prev.targetGroups) return prev;

				return {
					...prev,
					targetGroups: prev.targetGroups.filter((_, i) => i !== index),
				};
			});

			addNotification({
				type: 'success',
				title: 'Usunięto grupę',
				message: 'Grupa została pomyślnie usunięta',
				duration: 3000,
			});
		} catch (error) {
			console.error('Error removing target group:', error);
			addNotification({
				type: 'error',
				title: 'Błąd usuwania',
				message: 'Wystąpił błąd podczas usuwania grupy',
				duration: 5000,
			});
		}
	};

	const addBenefit = (groupIndex: number) => {
		if (!targetData || !targetData.targetGroups || !targetData.targetGroups[groupIndex]) return;

		try {
			const newGroups = [...targetData.targetGroups];
			newGroups[groupIndex] = {
				...newGroups[groupIndex],
				benefits: [...newGroups[groupIndex].benefits, ''],
			};
			setTargetData((prev) => (prev ? { ...prev, targetGroups: newGroups } : null));

			addNotification({
				type: 'success',
				title: 'Dodano korzyść',
				message: 'Nowa korzyść została dodana',
				duration: 3000,
			});
		} catch (error) {
			console.error('Error adding benefit:', error);
			addNotification({
				type: 'error',
				title: 'Błąd dodawania',
				message: 'Wystąpił błąd podczas dodawania korzyści',
				duration: 5000,
			});
		}
	};

	const removeBenefit = (groupIndex: number, benefitIndex: number) => {
		if (!targetData || !targetData.targetGroups || !targetData.targetGroups[groupIndex]) return;

		try {
			const newGroups = [...targetData.targetGroups];
			newGroups[groupIndex] = {
				...newGroups[groupIndex],
				benefits: newGroups[groupIndex].benefits.filter((_, i) => i !== benefitIndex),
			};
			setTargetData((prev) => (prev ? { ...prev, targetGroups: newGroups } : null));

			addNotification({
				type: 'success',
				title: 'Usunięto korzyść',
				message: 'Korzyść została pomyślnie usunięta',
				duration: 3000,
			});
		} catch (error) {
			console.error('Error removing benefit:', error);
			addNotification({
				type: 'error',
				title: 'Błąd usuwania',
				message: 'Wystąpił błąd podczas usuwania korzyści',
				duration: 5000,
			});
		}
	};

	const addGeneralBenefit = () => {
		if (!targetData) return;
		const newBenefit = {
			title: '',
			description: '',
			icon: 'Star',
		};
		setTargetData((prev) =>
			prev
				? {
						...prev,
						generalBenefits: [...prev.generalBenefits, newBenefit],
				  }
				: null
		);
	};

	const removeGeneralBenefit = (index: number) => {
		if (!targetData) return;
		setTargetData((prev) =>
			prev
				? {
						...prev,
						generalBenefits: prev.generalBenefits.filter((_, i) => i !== index),
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

	if (!targetData) {
		console.log('Target data is null, initializing with default data');
		// Initialize with default data
		const defaultData: TargetData = {
			title: 'Dla kogo',
			description:
				'Nasze stowarzyszenie jest otwarte dla wszystkich młodych ludzi, którzy chcą się rozwijać, pomagać innym i budować lepszą przyszłość.',
			targetGroups: [
				{
					title: 'Uczniowie szkół średnich',
					description: 'Rozwijaj swoje pasje, zdobywaj nowe umiejętności i buduj CV już w szkole',
					icon: 'GraduationCap',
					benefits: [
						'Warsztaty rozwoju osobistego',
						'Mentoring od starszych kolegów',
						'Certyfikaty uczestnictwa',
						'Możliwość realizacji własnych projektów',
					],
				},
				{
					title: 'Studenci',
					description: 'Praktyczne doświadczenie, networking i rozwój kompetencji zawodowych',
					icon: 'User',
					benefits: [
						'Projekty z prawdziwymi organizacjami',
						'Kontakty w branży',
						'Warsztaty umiejętności miękkich',
						'Możliwość prowadzenia własnych inicjatyw',
					],
				},
			],
			generalBenefits: [
				{
					title: 'Rozwój osobisty',
					description: 'Warsztaty, szkolenia i mentoring pomagają w rozwoju umiejętności miękkich',
					icon: 'Star',
				},
				{
					title: 'Praktyczne doświadczenie',
					description: 'Realne projekty i zadania, które wyglądają dobrze w CV',
					icon: 'CheckCircle',
				},
			],
			cta: {
				title: 'Gotowy na nową przygodę?',
				description: 'Dołącz do naszej społeczności i zacznij realizować swoje marzenia już dziś!',
				primaryButton: 'Dołącz teraz',
				secondaryButton: 'Dowiedz się więcej',
			},
			createdAt: new Date(),
			updatedAt: new Date(),
		};
		setTargetData(defaultData);
	}

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="bg-white rounded-lg shadow-sm">
					<div className="px-6 py-4 border-b border-gray-200">
						<h1 className="text-2xl font-bold text-gray-900">Edycja sekcji "Dla kogo"</h1>
					</div>

					<div className="p-6 space-y-8">
						{/* Basic Info */}
						<div className="space-y-4">
							<h2 className="text-lg font-semibold text-gray-900">Podstawowe informacje</h2>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Tytuł sekcji</label>
								<input
									type="text"
									value={targetData?.title || ''}
									onChange={(e) => updateField('title', e.target.value)}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Opis</label>
								<textarea
									value={targetData?.description || ''}
									onChange={(e) => updateField('description', e.target.value)}
									rows={3}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
								/>
							</div>
						</div>

						{/* Target Groups */}
						<div className="space-y-4">
							<div className="flex justify-between items-center">
								<h2 className="text-lg font-semibold text-gray-900">Grupy docelowe</h2>
								<button
									onClick={addTargetGroup}
									className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
									Dodaj grupę
								</button>
							</div>
							{targetData?.targetGroups.map((group, index) => (
								<div
									key={index}
									className="border border-gray-200 rounded-lg p-4">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">Tytuł</label>
											<input
												type="text"
												value={group.title}
												onChange={(e) => {
													const newGroups = [...(targetData?.targetGroups || [])];
													newGroups[index] = { ...group, title: e.target.value };
													updateField('targetGroups', newGroups);
												}}
												className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
											/>
										</div>
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Ikona (emoji)
											</label>
											<EmojiPicker
												onEmojiSelect={(emoji) => {
													const newGroups = [...(targetData?.targetGroups || [])];
													newGroups[index] = { ...group, icon: emoji };
													updateField('targetGroups', newGroups);
												}}
												selectedEmoji={group.icon}
												className="w-full"
											/>
										</div>
									</div>
									<div className="mb-4">
										<label className="block text-sm font-medium text-gray-700 mb-2">Opis</label>
										<textarea
											value={group.description}
											onChange={(e) => {
												const newGroups = [...(targetData?.targetGroups || [])];
												newGroups[index] = { ...group, description: e.target.value };
												updateField('targetGroups', newGroups);
											}}
											rows={2}
											className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
										/>
									</div>
									<div>
										<div className="flex justify-between items-center mb-2">
											<label className="block text-sm font-medium text-gray-700">Korzyści</label>
											<button
												onClick={() => addBenefit(index)}
												className="px-3 py-1 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm">
												Dodaj korzyść
											</button>
										</div>
										{group.benefits.map((benefit, benefitIndex) => (
											<div
												key={benefitIndex}
												className="flex gap-2 mb-2">
												<input
													type="text"
													value={benefit}
													onChange={(e) => {
														const newGroups = [...(targetData?.targetGroups || [])];
														newGroups[index].benefits[benefitIndex] = e.target.value;
														updateField('targetGroups', newGroups);
													}}
													className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
												/>
												<button
													onClick={() => removeBenefit(index, benefitIndex)}
													className="px-3 py-2 text-red-600 hover:text-red-800">
													Usuń
												</button>
											</div>
										))}
									</div>
									<button
										onClick={() => removeTargetGroup(index)}
										className="mt-2 text-red-600 hover:text-red-800">
										Usuń grupę
									</button>
								</div>
							))}
						</div>

						{/* General Benefits */}
						<div className="space-y-4">
							<div className="flex justify-between items-center">
								<h2 className="text-lg font-semibold text-gray-900">Ogólne korzyści</h2>
								<button
									onClick={addGeneralBenefit}
									className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
									Dodaj korzyść
								</button>
							</div>
							{targetData?.generalBenefits.map((benefit, index) => (
								<div
									key={index}
									className="border border-gray-200 rounded-lg p-4">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">Tytuł</label>
											<input
												type="text"
												value={benefit.title}
												onChange={(e) => {
													const newBenefits = [...(targetData?.generalBenefits || [])];
													newBenefits[index] = { ...benefit, title: e.target.value };
													updateField('generalBenefits', newBenefits);
												}}
												className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
											/>
										</div>
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Ikona (emoji)
											</label>
											<EmojiPicker
												onEmojiSelect={(emoji) => {
													const newBenefits = [...(targetData?.generalBenefits || [])];
													newBenefits[index] = { ...benefit, icon: emoji };
													updateField('generalBenefits', newBenefits);
												}}
												selectedEmoji={benefit.icon}
												className="w-full"
											/>
										</div>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">Opis</label>
										<textarea
											value={benefit.description}
											onChange={(e) => {
												const newBenefits = [...(targetData?.generalBenefits || [])];
												newBenefits[index] = { ...benefit, description: e.target.value };
												updateField('generalBenefits', newBenefits);
											}}
											rows={2}
											className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
										/>
									</div>
									<button
										onClick={() => removeGeneralBenefit(index)}
										className="mt-2 text-red-600 hover:text-red-800">
										Usuń
									</button>
								</div>
							))}
						</div>

						{/* CTA Section */}
						<div className="space-y-4">
							<h2 className="text-lg font-semibold text-gray-900">Sekcja Call-to-Action</h2>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Tytuł</label>
								<input
									type="text"
									value={targetData?.cta.title || ''}
									onChange={(e) => updateField('cta.title', e.target.value)}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Opis</label>
								<textarea
									value={targetData?.cta.description || ''}
									onChange={(e) => updateField('cta.description', e.target.value)}
									rows={3}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
								/>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Tekst głównego przycisku
									</label>
									<input
										type="text"
										value={targetData?.cta.primaryButton || ''}
										onChange={(e) => updateField('cta.primaryButton', e.target.value)}
										className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Tekst drugiego przycisku
									</label>
									<input
										type="text"
										value={targetData?.cta.secondaryButton || ''}
										onChange={(e) => updateField('cta.secondaryButton', e.target.value)}
										className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Fixed Save Button */}
			<FixedSaveButton
				onSave={handleSave}
				disabled={!targetData}
				saving={saving}
			/>
		</div>
	);
}
