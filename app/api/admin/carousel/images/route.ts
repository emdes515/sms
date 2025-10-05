import { NextRequest, NextResponse } from 'next/server';
import { getAboutData, updateAboutData } from '@/lib/models/PageData';
import { cookies } from 'next/headers';

async function verifyAdminSession() {
	const cookieStore = cookies();
	const session = cookieStore.get('admin-session');
	return session && session.value === 'authenticated';
}

export async function POST(request: NextRequest) {
	if (!(await verifyAdminSession())) {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}
	try {
		const body = await request.json();
		const { url, alt, title, description } = body;

		console.log('Adding new carousel image:', { url, alt, title, description });

		// Pobierz obecne dane about
		const aboutData = await getAboutData();
		if (!aboutData || !aboutData._id) {
			return NextResponse.json({ error: 'About data not found' }, { status: 404 });
		}

		// Stwórz nowy obraz z unikalnym ID i kolejnością
		const newImage = {
			_id: Date.now().toString(), // Tymczasowe ID
			url,
			alt,
			title: title || '',
			description: description || '',
			order: aboutData.carousel?.images?.length || 0,
		};

		// Dodaj nowy obraz do karuzeli
		const updatedCarousel = {
			...aboutData.carousel,
			images: [...(aboutData.carousel?.images || []), newImage],
		};

		await updateAboutData(aboutData._id, { carousel: updatedCarousel });
		console.log('Carousel image added successfully');
		return NextResponse.json({ success: true, image: newImage });
	} catch (error) {
		console.error('Error adding carousel image:', error);
		return NextResponse.json({ error: 'Failed to add carousel image' }, { status: 500 });
	}
}

export async function PUT(request: NextRequest) {
	if (!(await verifyAdminSession())) {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}
	try {
		const body = await request.json();
		const { imageId, url, alt, title, description, order } = body;

		console.log('Updating carousel image:', { imageId, url, alt, title, description, order });

		// Pobierz obecne dane about
		const aboutData = await getAboutData();
		if (!aboutData || !aboutData._id) {
			return NextResponse.json({ error: 'About data not found' }, { status: 404 });
		}

		// Znajdź i zaktualizuj obraz
		const updatedImages =
			aboutData.carousel?.images?.map((img) => {
				if (img._id === imageId) {
					return {
						...img,
						url: url || img.url,
						alt: alt || img.alt,
						title: title !== undefined ? title : img.title,
						description: description !== undefined ? description : img.description,
						order: order !== undefined ? order : img.order,
					};
				}
				return img;
			}) || [];

		// Sortuj według kolejności
		updatedImages.sort((a, b) => a.order - b.order);

		const updatedCarousel = {
			...aboutData.carousel,
			images: updatedImages,
		};

		await updateAboutData(aboutData._id, { carousel: updatedCarousel });
		console.log('Carousel image updated successfully');
		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Error updating carousel image:', error);
		return NextResponse.json({ error: 'Failed to update carousel image' }, { status: 500 });
	}
}

export async function DELETE(request: NextRequest) {
	if (!(await verifyAdminSession())) {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}
	try {
		const { searchParams } = new URL(request.url);
		const imageId = searchParams.get('imageId');

		if (!imageId) {
			return NextResponse.json({ error: 'Image ID is required' }, { status: 400 });
		}

		console.log('Deleting carousel image:', imageId);

		// Pobierz obecne dane about
		const aboutData = await getAboutData();
		if (!aboutData || !aboutData._id) {
			return NextResponse.json({ error: 'About data not found' }, { status: 404 });
		}

		// Usuń obraz z karuzeli
		const updatedImages = aboutData.carousel?.images?.filter((img) => img._id !== imageId) || [];

		const updatedCarousel = {
			...aboutData.carousel,
			images: updatedImages,
		};

		await updateAboutData(aboutData._id, { carousel: updatedCarousel });
		console.log('Carousel image deleted successfully');
		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Error deleting carousel image:', error);
		return NextResponse.json({ error: 'Failed to delete carousel image' }, { status: 500 });
	}
}
