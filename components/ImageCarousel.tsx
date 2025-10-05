'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

interface CarouselImage {
	_id?: string;
	url: string;
	alt: string;
	title?: string;
	description?: string;
	order: number;
}

interface CarouselProps {
	images: CarouselImage[];
	autoplay?: boolean;
	autoplaySpeed?: number;
	enabled?: boolean;
}

const ImageCarousel = ({
	images,
	autoplay = true,
	autoplaySpeed = 5000,
	enabled = true,
}: CarouselProps) => {
	// console.log('ImageCarousel rendering with props:', { images, autoplay, autoplaySpeed, enabled });
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isPlaying, setIsPlaying] = useState(autoplay);
	const [isHovered, setIsHovered] = useState(false);

	// Sortuj obrazy według kolejności
	const sortedImages = [...images].sort((a, b) => a.order - b.order);

	useEffect(() => {
		if (!enabled || !isPlaying || sortedImages.length <= 1) return;

		const interval = setInterval(() => {
			setCurrentIndex((prevIndex) => (prevIndex + 1) % sortedImages.length);
		}, autoplaySpeed);

		return () => clearInterval(interval);
	}, [isPlaying, sortedImages.length, autoplaySpeed, enabled]);

	const goToPrevious = () => {
		setCurrentIndex((prevIndex) => (prevIndex - 1 + sortedImages.length) % sortedImages.length);
	};

	const goToNext = () => {
		setCurrentIndex((prevIndex) => (prevIndex + 1) % sortedImages.length);
	};

	const goToSlide = (index: number) => {
		setCurrentIndex(index);
	};

	const togglePlayPause = () => {
		setIsPlaying(!isPlaying);
	};

	if (!enabled || sortedImages.length === 0) {
		// console.log('ImageCarousel: not enabled or no images', {
		// 	enabled,
		// 	imagesLength: sortedImages.length,
		// });
		return null;
	}

	if (sortedImages.length === 1) {
		// console.log('ImageCarousel: rendering single image');
		return (
			<div className="relative w-full h-96 md:h-[500px] rounded-2xl overflow-hidden shadow-xl">
				<img
					src={sortedImages[0].url}
					alt={sortedImages[0].alt}
					className="w-full h-full object-cover"
				/>
				{(sortedImages[0].title || sortedImages[0].description) && (
					<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
						{sortedImages[0].title && (
							<h3 className="text-white text-xl font-semibold mb-2">{sortedImages[0].title}</h3>
						)}
						{sortedImages[0].description && (
							<p className="text-white/90 text-sm">{sortedImages[0].description}</p>
						)}
					</div>
				)}
			</div>
		);
	}

	// console.log('ImageCarousel: rendering full carousel');
	return (
		<div
			className="relative w-full h-96 md:h-[500px] rounded-2xl overflow-hidden shadow-xl group"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}>
			{/* Główny obraz */}
			<div className="relative w-full h-full">
				<img
					src={sortedImages[currentIndex].url}
					alt={sortedImages[currentIndex].alt}
					className="w-full h-full object-cover transition-transform duration-500"
				/>

				{/* Overlay z tekstem */}
				{(sortedImages[currentIndex].title || sortedImages[currentIndex].description) && (
					<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
						{sortedImages[currentIndex].title && (
							<h3 className="text-white text-xl font-semibold mb-2">
								{sortedImages[currentIndex].title}
							</h3>
						)}
						{sortedImages[currentIndex].description && (
							<p className="text-white/90 text-sm">{sortedImages[currentIndex].description}</p>
						)}
					</div>
				)}

				{/* Kontrolki nawigacji */}
				<div className="absolute inset-0 flex items-center justify-between p-4">
					<button
						onClick={goToPrevious}
						className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
						aria-label="Poprzedni obraz">
						<ChevronLeft size={24} />
					</button>
					<button
						onClick={goToNext}
						className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
						aria-label="Następny obraz">
						<ChevronRight size={24} />
					</button>
				</div>

				{/* Kontrolka play/pause */}
				<div className="absolute top-4 right-4">
					<button
						onClick={togglePlayPause}
						className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-300"
						aria-label={
							isPlaying ? 'Zatrzymaj automatyczne odtwarzanie' : 'Włącz automatyczne odtwarzanie'
						}>
						{isPlaying ? <Pause size={20} /> : <Play size={20} />}
					</button>
				</div>
			</div>

			{/* Wskaźniki (kropki) */}
			<div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
				{sortedImages.map((_, index) => (
					<button
						key={index}
						onClick={() => goToSlide(index)}
						className={`w-3 h-3 rounded-full transition-all duration-300 ${
							index === currentIndex ? 'bg-white scale-110' : 'bg-white/50 hover:bg-white/70'
						}`}
						aria-label={`Przejdź do obrazu ${index + 1}`}
					/>
				))}
			</div>

			{/* Licznik slajdów */}
			<div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
				{currentIndex + 1} / {sortedImages.length}
			</div>
		</div>
	);
};

export default ImageCarousel;
