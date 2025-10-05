'use client';

import { useState, useEffect, useRef } from 'react';
import { Upload, Image as ImageIcon, Trash2, Edit3, X, Check } from 'lucide-react';

interface ImageData {
	_id: string;
	filename: string;
	originalName: string;
	title: string;
	description: string;
	url: string;
	size: number;
	mimeType: string;
	createdAt: string;
}

const ImagesAdminPage = () => {
	const [images, setImages] = useState<ImageData[]>([]);
	const [loading, setLoading] = useState(true);
	const [uploading, setUploading] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editTitle, setEditTitle] = useState('');
	const [editDescription, setEditDescription] = useState('');
	const fileInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		fetchImages();
	}, []);

	const fetchImages = async () => {
		try {
			const response = await fetch('/api/admin/images');
			const data = await response.json();
			setImages(data);
		} catch (error) {
			console.error('Error fetching images:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		setUploading(true);
		const formData = new FormData();
		formData.append('file', file);
		formData.append('title', file.name.split('.')[0]);
		formData.append('description', '');

		try {
			const response = await fetch('/api/admin/images', {
				method: 'POST',
				body: formData,
			});

			if (response.ok) {
				const newImage = await response.json();
				setImages([newImage, ...images]);
			} else {
				const error = await response.json();
				alert(`Błąd podczas przesyłania: ${error.error}`);
			}
		} catch (error) {
			console.error('Upload error:', error);
			alert('Błąd podczas przesyłania pliku');
		} finally {
			setUploading(false);
			if (fileInputRef.current) {
				fileInputRef.current.value = '';
			}
		}
	};

	const handleDelete = async (id: string) => {
		if (!confirm('Czy na pewno chcesz usunąć to zdjęcie?')) return;

		try {
			const response = await fetch(`/api/admin/images/${id}`, {
				method: 'DELETE',
			});

			if (response.ok) {
				setImages(images.filter((img) => img._id !== id));
			} else {
				alert('Błąd podczas usuwania zdjęcia');
			}
		} catch (error) {
			console.error('Delete error:', error);
			alert('Błąd podczas usuwania zdjęcia');
		}
	};

	const handleEdit = (image: ImageData) => {
		setEditingId(image._id);
		setEditTitle(image.title);
		setEditDescription(image.description);
	};

	const handleSaveEdit = async () => {
		if (!editingId) return;

		try {
			const response = await fetch(`/api/admin/images/${editingId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					title: editTitle,
					description: editDescription,
				}),
			});

			if (response.ok) {
				setImages(
					images.map((img) =>
						img._id === editingId ? { ...img, title: editTitle, description: editDescription } : img
					)
				);
				setEditingId(null);
			} else {
				alert('Błąd podczas aktualizacji zdjęcia');
			}
		} catch (error) {
			console.error('Update error:', error);
			alert('Błąd podczas aktualizacji zdjęcia');
		}
	};

	const formatFileSize = (bytes: number) => {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
	};

	const copyToClipboard = (url: string) => {
		navigator.clipboard.writeText(`${window.location.origin}${url}`);
		alert('URL skopiowany do schowka!');
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Zarządzanie zdjęciami</h1>
					<p className="mt-2 text-gray-600">
						Przesyłaj i zarządzaj zdjęciami, które można wykorzystać w treści strony.
					</p>
				</div>
				<button
					onClick={() => fileInputRef.current?.click()}
					disabled={uploading}
					className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors">
					<Upload size={18} />
					{uploading ? 'Przesyłanie...' : 'Prześlij zdjęcie'}
				</button>
			</div>

			<label
				htmlFor="file-upload-main"
				className="sr-only">
				Prześlij zdjęcie
			</label>
			<input
				id="file-upload-main"
				ref={fileInputRef}
				type="file"
				accept="image/*"
				onChange={handleFileUpload}
				className="hidden"
			/>

			{/* Upload Area */}
			<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
				<div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
					<ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
					<div className="mt-4">
						<label
							htmlFor="file-upload"
							className="cursor-pointer">
							<span className="mt-2 block text-sm font-medium text-gray-900">
								Kliknij aby wybrać zdjęcie lub przeciągnij tutaj
							</span>
							<span className="mt-1 block text-sm text-gray-500">PNG, JPG, GIF do 5MB</span>
						</label>
					</div>
				</div>
			</div>

			{/* Images Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{images.map((image) => (
					<div
						key={image._id}
						className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
						<div className="aspect-square relative">
							<img
								src={image.url}
								alt={image.title}
								className="w-full h-full object-cover"
							/>
							<div className="absolute top-2 right-2 flex gap-1">
								<button
									onClick={() => handleEdit(image)}
									className="p-1 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors"
									title="Edytuj zdjęcie">
									<Edit3 size={14} />
								</button>
								<button
									onClick={() => handleDelete(image._id)}
									className="p-1 bg-white rounded-full shadow-sm hover:bg-red-50 text-red-600 transition-colors"
									title="Usuń zdjęcie">
									<Trash2 size={14} />
								</button>
							</div>
						</div>

						<div className="p-4">
							{editingId === image._id ? (
								<div className="space-y-2">
									<label
										htmlFor={`title-${image._id}`}
										className="sr-only">
										Tytuł zdjęcia
									</label>
									<input
										id={`title-${image._id}`}
										type="text"
										value={editTitle}
										onChange={(e) => setEditTitle(e.target.value)}
										className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
										placeholder="Tytuł zdjęcia"
									/>
									<label
										htmlFor={`description-${image._id}`}
										className="sr-only">
										Opis zdjęcia
									</label>
									<textarea
										id={`description-${image._id}`}
										value={editDescription}
										onChange={(e) => setEditDescription(e.target.value)}
										className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
										placeholder="Opis zdjęcia"
										rows={2}
									/>
									<div className="flex gap-2">
										<button
											onClick={handleSaveEdit}
											className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">
											<Check size={14} />
											Zapisz
										</button>
										<button
											onClick={() => setEditingId(null)}
											className="flex items-center gap-1 px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700">
											<X size={14} />
											Anuluj
										</button>
									</div>
								</div>
							) : (
								<div>
									<h3 className="font-medium text-gray-900 truncate">{image.title}</h3>
									{image.description && (
										<p className="text-sm text-gray-600 mt-1 line-clamp-2">{image.description}</p>
									)}
									<div className="mt-2 text-xs text-gray-500">
										{formatFileSize(image.size)} •{' '}
										{new Date(image.createdAt).toLocaleDateString('pl-PL')}
									</div>
									<button
										onClick={() => copyToClipboard(image.url)}
										className="mt-2 text-xs text-primary-600 hover:text-primary-700">
										Kopiuj URL
									</button>
								</div>
							)}
						</div>
					</div>
				))}
			</div>

			{images.length === 0 && (
				<div className="text-center py-12">
					<ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
					<h3 className="mt-2 text-sm font-medium text-gray-900">Brak zdjęć</h3>
					<p className="mt-1 text-sm text-gray-500">Rozpocznij od przesłania pierwszego zdjęcia.</p>
				</div>
			)}
		</div>
	);
};

export default ImagesAdminPage;
