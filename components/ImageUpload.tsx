'use client';

import { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, X, Check } from 'lucide-react';

interface ImageUploadProps {
	onImageSelect: (imageUrl: string) => void;
	selectedImage?: string;
	className?: string;
}

const ImageUpload = ({ onImageSelect, selectedImage, className = '' }: ImageUploadProps) => {
	const [uploading, setUploading] = useState(false);
	const [showGallery, setShowGallery] = useState(false);
	const [images, setImages] = useState<any[]>([]);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
		console.log('handleFileUpload called');
		const file = event.target.files?.[0];
		console.log('Selected file:', file);
		if (!file) {
			console.log('No file selected');
			return;
		}

		// Validate file type
		if (!file.type.startsWith('image/')) {
			alert('Proszę wybrać plik obrazu (JPG, PNG, GIF)');
			return;
		}

		// Validate file size (max 5MB)
		if (file.size > 5 * 1024 * 1024) {
			alert('Plik jest za duży. Maksymalny rozmiar to 5MB');
			return;
		}

		setUploading(true);
		const formData = new FormData();
		formData.append('file', file);
		formData.append('title', file.name.split('.')[0]);
		formData.append('description', '');

		try {
			console.log('Uploading file:', file.name, 'Size:', file.size, 'Type:', file.type);

			const response = await fetch('/api/admin/images', {
				method: 'POST',
				body: formData,
			});

			console.log('Upload response status:', response.status);

			if (response.ok) {
				const newImage = await response.json();
				console.log('Upload successful:', newImage);
				onImageSelect(newImage.url);
			} else {
				const error = await response.json();
				console.error('Upload error response:', error);
				alert(`Błąd podczas przesyłania: ${error.error || 'Nieznany błąd'}`);
			}
		} catch (error) {
			console.error('Upload error:', error);
			alert(
				`Błąd podczas przesyłania pliku: ${
					error instanceof Error ? error.message : 'Nieznany błąd'
				}`
			);
		} finally {
			setUploading(false);
			if (fileInputRef.current) {
				fileInputRef.current.value = '';
			}
		}
	};

	const fetchImages = async () => {
		try {
			const response = await fetch('/api/admin/images');
			const data = await response.json();
			setImages(data);
		} catch (error) {
			console.error('Error fetching images:', error);
		}
	};

	const handleGalleryOpen = () => {
		fetchImages();
		setShowGallery(true);
	};

	const handleImageSelect = (imageUrl: string) => {
		onImageSelect(imageUrl);
		setShowGallery(false);
	};

	return (
		<div className={`space-y-4 ${className}`}>
			{selectedImage ? (
				<div className="relative">
					<img
						src={selectedImage}
						alt="Selected"
						className="w-full h-48 object-cover rounded-lg border border-gray-200"
					/>
					<button
						onClick={() => onImageSelect('')}
						className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
						title="Usuń zdjęcie">
						<X size={16} />
					</button>
				</div>
			) : (
				<div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
					<ImageIcon className="mx-auto h-8 w-8 text-gray-400" />
					<p className="mt-2 text-sm text-gray-600">Brak wybranego zdjęcia</p>
				</div>
			)}

			<div className="flex gap-2">
				<button
					type="button"
					onClick={() => {
						console.log('Upload button clicked');
						console.log('File input ref:', fileInputRef.current);
						fileInputRef.current?.click();
					}}
					disabled={uploading}
					className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors">
					<Upload size={16} />
					{uploading ? 'Przesyłanie...' : 'Prześlij nowe'}
				</button>

				<button
					type="button"
					onClick={handleGalleryOpen}
					className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
					<ImageIcon size={16} />
					Wybierz z galerii
				</button>
			</div>

			<label
				htmlFor="file-upload"
				className="sr-only">
				Prześlij zdjęcie
			</label>
			<input
				id="file-upload"
				ref={fileInputRef}
				type="file"
				accept="image/*"
				onChange={(e) => {
					console.log('File input onChange triggered');
					handleFileUpload(e);
				}}
				className="hidden"
			/>

			{/* Gallery Modal */}
			{showGallery && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white rounded-lg p-6 max-w-4xl max-h-[80vh] overflow-y-auto">
						<div className="flex justify-between items-center mb-4">
							<h3 className="text-lg font-semibold">Wybierz zdjęcie z galerii</h3>
							<button
								onClick={() => setShowGallery(false)}
								className="text-gray-500 hover:text-gray-700"
								title="Zamknij galerię">
								<X size={20} />
							</button>
						</div>

						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
							{images.map((image) => (
								<button
									key={image._id}
									onClick={() => handleImageSelect(image.url)}
									className="aspect-square relative group">
									<img
										src={image.url}
										alt={image.title}
										className="w-full h-full object-cover rounded-lg border border-gray-200 group-hover:border-primary-500 transition-colors"
									/>
									<div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
										<Check
											className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
											size={24}
										/>
									</div>
								</button>
							))}
						</div>

						{images.length === 0 && (
							<div className="text-center py-8">
								<ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
								<p className="mt-2 text-gray-600">Brak zdjęć w galerii</p>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default ImageUpload;
