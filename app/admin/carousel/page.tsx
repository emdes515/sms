'use client';

import { useState, useEffect } from 'react';
import {
	Play,
	Pause,
	Settings,
	Image as ImageIcon,
	Plus,
	Edit,
	Trash2,
	ArrowUp,
	ArrowDown,
	Save,
	X,
} from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';
import { FixedSaveButton } from '@/components/FixedSaveButton';
import { useNotifications } from '@/components/NotificationSystem';

interface CarouselImage {
	_id?: string;
	url: string;
	alt: string;
	title?: string;
	description?: string;
	order: number;
}

interface CarouselData {
	enabled: boolean;
	autoplay: boolean;
	autoplaySpeed: number;
	images: CarouselImage[];
}

export default function CarouselAdminPage() {
	const [carouselData, setCarouselData] = useState<CarouselData>({
		enabled: false,
		autoplay: true,
		autoplaySpeed: 5000,
		images: [],
	});
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [editingImage, setEditingImage] = useState<CarouselImage | null>(null);
	const [showImageForm, setShowImageForm] = useState(false);
	const { addNotification } = useNotifications();

	useEffect(() => {
		fetchCarouselData();
	}, []);

	const fetchCarouselData = async () => {
		try {
			const response = await fetch('/api/admin/carousel');
			const data = await response.json();
			if (data.carousel) {
				setCarouselData(data.carousel);
			}
		} catch (error) {
			console.error('Error fetching carousel data:', error);
			addNotification({
				type: 'error',
				title: 'Błąd ładowania',
				message: 'Błąd podczas ładowania danych karuzeli',
				duration: 5000,
			});
		} finally {
			setLoading(false);
		}
	};

	const handleSave = async () => {
		setSaving(true);
		try {
			const response = await fetch('/api/admin/carousel', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ carousel: carouselData }),
			});

			if (response.ok) {
				addNotification({
					type: 'success',
					title: 'Sukces',
					message: 'Ustawienia karuzeli zostały zapisane',
					duration: 3000,
				});
			} else {
				throw new Error('Failed to save carousel data');
			}
		} catch (error) {
			console.error('Error saving carousel data:', error);
			addNotification({
				type: 'error',
				title: 'Błąd zapisywania',
				message: 'Błąd podczas zapisywania ustawień karuzeli',
				duration: 5000,
			});
		} finally {
			setSaving(false);
		}
	};

	const handleImageUpload = async (url: string) => {
		const newImage: CarouselImage = {
			_id: Date.now().toString(),
			url,
			alt: '',
			title: '',
			description: '',
			order: carouselData.images.length,
		};

		setCarouselData((prev) => ({
			...prev,
			images: [...prev.images, newImage],
		}));

		setShowImageForm(false);
		addNotification({
			type: 'success',
			title: 'Sukces',
			message: 'Obraz został dodany do karuzeli',
			duration: 3000,
		});
	};

	const handleEditImage = (image: CarouselImage) => {
		setEditingImage(image);
	};

	const handleUpdateImage = async (updatedImage: CarouselImage) => {
		setCarouselData((prev) => ({
			...prev,
			images: prev.images.map((img) => (img._id === updatedImage._id ? updatedImage : img)),
		}));
		setEditingImage(null);
		addNotification({
			type: 'success',
			title: 'Sukces',
			message: 'Obraz został zaktualizowany',
			duration: 3000,
		});
	};

	const handleDeleteImage = async (imageId: string) => {
		if (confirm('Czy na pewno chcesz usunąć ten obraz z karuzeli?')) {
			setCarouselData((prev) => ({
				...prev,
				images: prev.images.filter((img) => img._id !== imageId),
			}));
			addNotification({
				type: 'success',
				title: 'Sukces',
				message: 'Obraz został usunięty z karuzeli',
				duration: 3000,
			});
		}
	};

	const handleMoveImage = (imageId: string, direction: 'up' | 'down') => {
		const images = [...carouselData.images];
		const currentIndex = images.findIndex((img) => img._id === imageId);

		if (currentIndex === -1) return;

		const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

		if (newIndex < 0 || newIndex >= images.length) return;

		// Zamień miejscami
		[images[currentIndex], images[newIndex]] = [images[newIndex], images[currentIndex]];

		// Zaktualizuj kolejność
		images.forEach((img, index) => {
			img.order = index;
		});

		setCarouselData((prev) => ({
			...prev,
			images,
		}));
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
				<h1 className="text-3xl font-bold text-gray-900">Zarządzanie karuzelą</h1>
				<p className="mt-2 text-gray-600">Konfiguruj karuzelę ze zdjęciami w sekcji "O nas"</p>
			</div>

			{/* Ustawienia karuzeli */}
			<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
				<h2 className="text-lg font-semibold text-gray-900 mb-4">Ustawienia karuzeli</h2>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<label className="text-sm font-medium text-gray-700">Włącz karuzelę</label>
							<button
								onClick={() => setCarouselData((prev) => ({ ...prev, enabled: !prev.enabled }))}
								className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
									carouselData.enabled ? 'bg-primary-600' : 'bg-gray-200'
								}`}
								aria-label={carouselData.enabled ? 'Wyłącz karuzelę' : 'Włącz karuzelę'}>
								<span
									className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
										carouselData.enabled ? 'translate-x-6' : 'translate-x-1'
									}`}
								/>
							</button>
						</div>

						<div className="flex items-center justify-between">
							<label className="text-sm font-medium text-gray-700">Automatyczne odtwarzanie</label>
							<button
								onClick={() => setCarouselData((prev) => ({ ...prev, autoplay: !prev.autoplay }))}
								className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
									carouselData.autoplay ? 'bg-primary-600' : 'bg-gray-200'
								}`}
								aria-label={
									carouselData.autoplay
										? 'Wyłącz automatyczne odtwarzanie'
										: 'Włącz automatyczne odtwarzanie'
								}>
								<span
									className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
										carouselData.autoplay ? 'translate-x-6' : 'translate-x-1'
									}`}
								/>
							</button>
						</div>
					</div>

					<div className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Prędkość automatycznego odtwarzania (ms)
							</label>
							<input
								type="number"
								value={carouselData.autoplaySpeed}
								onChange={(e) =>
									setCarouselData((prev) => ({
										...prev,
										autoplaySpeed: parseInt(e.target.value) || 5000,
									}))
								}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
								min="1000"
								max="30000"
								step="1000"
								aria-label="Prędkość automatycznego odtwarzania w milisekundach"
							/>
						</div>
					</div>
				</div>
			</div>

			{/* Lista obrazów */}
			<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-lg font-semibold text-gray-900">Obrazy w karuzeli</h2>
					<button
						onClick={() => setShowImageForm(true)}
						className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors">
						<Plus size={16} />
						Dodaj obraz
					</button>
				</div>

				{carouselData.images.length === 0 ? (
					<div className="text-center py-8 text-gray-500">
						<ImageIcon
							size={48}
							className="mx-auto mb-4 text-gray-300"
						/>
						<p>Brak obrazów w karuzeli</p>
						<p className="text-sm">Kliknij "Dodaj obraz" aby rozpocząć</p>
					</div>
				) : (
					<div className="space-y-4">
						{carouselData.images
							.sort((a, b) => a.order - b.order)
							.map((image, index) => (
								<div
									key={image._id}
									className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
									<div className="flex-shrink-0">
										<img
											src={image.url}
											alt={image.alt}
											className="w-16 h-16 object-cover rounded-lg"
										/>
									</div>

									<div className="flex-1 min-w-0">
										<h3 className="text-sm font-medium text-gray-900 truncate">
											{image.title || image.alt || 'Bez tytułu'}
										</h3>
										<p className="text-sm text-gray-500 truncate">
											{image.description || 'Bez opisu'}
										</p>
										<p className="text-xs text-gray-400">Kolejność: {image.order + 1}</p>
									</div>

									<div className="flex items-center gap-2">
										<button
											onClick={() => handleMoveImage(image._id!, 'up')}
											disabled={index === 0}
											className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
											aria-label="Przenieś obraz w górę">
											<ArrowUp size={16} />
										</button>
										<button
											onClick={() => handleMoveImage(image._id!, 'down')}
											disabled={index === carouselData.images.length - 1}
											className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
											aria-label="Przenieś obraz w dół">
											<ArrowDown size={16} />
										</button>
										<button
											onClick={() => handleEditImage(image)}
											className="p-2 text-gray-400 hover:text-primary-600"
											aria-label="Edytuj obraz">
											<Edit size={16} />
										</button>
										<button
											onClick={() => handleDeleteImage(image._id!)}
											className="p-2 text-gray-400 hover:text-red-600"
											aria-label="Usuń obraz">
											<Trash2 size={16} />
										</button>
									</div>
								</div>
							))}
					</div>
				)}
			</div>

			{/* Formularz dodawania obrazu */}
			{showImageForm && (
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-lg font-semibold text-gray-900">Dodaj nowy obraz</h3>
						<button
							onClick={() => setShowImageForm(false)}
							className="p-2 text-gray-400 hover:text-gray-600"
							aria-label="Zamknij formularz">
							<X size={20} />
						</button>
					</div>
					<ImageUpload onImageSelect={handleImageUpload} />
				</div>
			)}

			{/* Formularz edycji obrazu */}
			{editingImage && (
				<ImageEditForm
					image={editingImage}
					onSave={handleUpdateImage}
					onCancel={() => setEditingImage(null)}
				/>
			)}

			<FixedSaveButton
				onSave={handleSave}
				saving={saving}
			/>
		</div>
	);
}

interface ImageEditFormProps {
	image: CarouselImage;
	onSave: (image: CarouselImage) => void;
	onCancel: () => void;
}

function ImageEditForm({ image, onSave, onCancel }: ImageEditFormProps) {
	const [formData, setFormData] = useState({
		alt: image.alt,
		title: image.title || '',
		description: image.description || '',
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSave({
			...image,
			...formData,
		});
	};

	return (
		<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
			<div className="flex items-center justify-between mb-4">
				<h3 className="text-lg font-semibold text-gray-900">Edytuj obraz</h3>
				<button
					onClick={onCancel}
					className="p-2 text-gray-400 hover:text-gray-600"
					aria-label="Zamknij formularz edycji">
					<X size={20} />
				</button>
			</div>

			<div className="flex gap-6">
				<div className="flex-shrink-0">
					<img
						src={image.url}
						alt={image.alt}
						className="w-32 h-32 object-cover rounded-lg"
					/>
				</div>

				<form
					onSubmit={handleSubmit}
					className="flex-1 space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Alt text (wymagane)
						</label>
						<input
							type="text"
							value={formData.alt}
							onChange={(e) => setFormData((prev) => ({ ...prev, alt: e.target.value }))}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
							required
							aria-label="Alt text dla obrazu"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Tytuł (opcjonalny)
						</label>
						<input
							type="text"
							value={formData.title}
							onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
							aria-label="Tytuł obrazu"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Opis (opcjonalny)
						</label>
						<textarea
							value={formData.description}
							onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
							rows={3}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
							aria-label="Opis obrazu"
						/>
					</div>

					<div className="flex gap-3">
						<button
							type="submit"
							className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors">
							<Save size={16} />
							Zapisz
						</button>
						<button
							type="button"
							onClick={onCancel}
							className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
							Anuluj
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
