'use client';

import { useState, useEffect } from 'react';
import { HeroData } from '@/lib/models/PageData';
import { FixedSaveButton } from '@/components/FixedSaveButton';
import { useNotifications } from '@/components/NotificationSystem';

const HeroEditor = () => {
	const [heroData, setHeroData] = useState<HeroData | null>(null);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const { addNotification } = useNotifications();

	useEffect(() => {
		fetchHeroData();
	}, []);

	const fetchHeroData = async () => {
		try {
			const response = await fetch('/api/admin/hero');
			if (response.ok) {
				const data = await response.json();
				setHeroData(data.heroData);
			}
		} catch (error) {
			console.error('Error fetching hero data:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleSave = async () => {
		if (!heroData) return;

		setSaving(true);

		try {
			const response = await fetch('/api/admin/hero', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(heroData),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Wystąpił błąd podczas zapisywania');
			}
		} catch (error) {
			console.error('Error saving hero data:', error);
			throw error;
		} finally {
			setSaving(false);
		}
	};

	const handleInputChange = (field: string, value: string) => {
		if (!heroData) return;

		if (field.startsWith('stats.')) {
			const [stat, subfield] = field.split('.');
			setHeroData({
				...heroData,
				stats: {
					...heroData.stats,
					[stat]: {
						...heroData.stats[stat as keyof typeof heroData.stats],
						[subfield]: value,
					},
				},
			});
		} else {
			setHeroData({
				...heroData,
				[field]: value,
			});
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
			</div>
		);
	}

	if (!heroData) {
		return (
			<div className="text-center py-12">
				<p className="text-gray-500">Nie można załadować danych</p>
			</div>
		);
	}

	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-3xl font-bold text-gray-900">Edytor tekstu głównego</h1>
				<p className="mt-2 text-gray-600">Edytuj treść sekcji Hero na stronie głównej</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{/* Główny tekst */}
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
					<h2 className="text-lg font-semibold text-gray-900 mb-4">Główny tekst</h2>
					<div className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">Tytuł główny</label>
							<input
								type="text"
								value={heroData.mainTitle}
								onChange={(e) => handleInputChange('mainTitle', e.target.value)}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Podświetlony tekst
							</label>
							<input
								type="text"
								value={heroData.highlightedText}
								onChange={(e) => handleInputChange('highlightedText', e.target.value)}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">Podtytuł</label>
							<textarea
								value={heroData.subtitle}
								onChange={(e) => handleInputChange('subtitle', e.target.value)}
								rows={3}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
							/>
						</div>
					</div>
				</div>

				{/* Przyciski */}
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
					<h2 className="text-lg font-semibold text-gray-900 mb-4">Przyciski</h2>
					<div className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Tekst przycisku głównego
							</label>
							<input
								type="text"
								value={heroData.primaryButtonText}
								onChange={(e) => handleInputChange('primaryButtonText', e.target.value)}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Tekst przycisku drugiego
							</label>
							<input
								type="text"
								value={heroData.secondaryButtonText}
								onChange={(e) => handleInputChange('secondaryButtonText', e.target.value)}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
							/>
						</div>
					</div>
				</div>

				{/* Statystyki */}
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 lg:col-span-2">
					<h2 className="text-lg font-semibold text-gray-900 mb-4">Statystyki</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Członkowie - wartość
							</label>
							<input
								type="text"
								value={heroData.stats.members.value}
								onChange={(e) => handleInputChange('stats.members.value', e.target.value)}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
							/>
							<label className="block text-sm font-medium text-gray-700 mb-2 mt-2">
								Członkowie - opis
							</label>
							<input
								type="text"
								value={heroData.stats.members.label}
								onChange={(e) => handleInputChange('stats.members.label', e.target.value)}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Projekty - wartość
							</label>
							<input
								type="text"
								value={heroData.stats.projects.value}
								onChange={(e) => handleInputChange('stats.projects.value', e.target.value)}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
							/>
							<label className="block text-sm font-medium text-gray-700 mb-2 mt-2">
								Projekty - opis
							</label>
							<input
								type="text"
								value={heroData.stats.projects.label}
								onChange={(e) => handleInputChange('stats.projects.label', e.target.value)}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Godziny wolontariatu - wartość
							</label>
							<input
								type="text"
								value={heroData.stats.volunteerHours.value}
								onChange={(e) => handleInputChange('stats.volunteerHours.value', e.target.value)}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
							/>
							<label className="block text-sm font-medium text-gray-700 mb-2 mt-2">
								Godziny wolontariatu - opis
							</label>
							<input
								type="text"
								value={heroData.stats.volunteerHours.label}
								onChange={(e) => handleInputChange('stats.volunteerHours.label', e.target.value)}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
							/>
						</div>
					</div>
				</div>
			</div>

			{/* Fixed Save Button */}
			<FixedSaveButton
				onSave={handleSave}
				disabled={!heroData}
				saving={saving}
			/>
		</div>
	);
};

export default HeroEditor;
