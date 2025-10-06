import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { put, del } from '@vercel/blob';

export async function GET() {
	try {
		const db = await getDatabase();
		const images = await db.collection('images').find({}).sort({ createdAt: -1 }).toArray();

		return NextResponse.json(images);
	} catch (error) {
		console.error('Error fetching images:', error);
		return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 });
	}
}

export async function POST(request: NextRequest) {
	try {
		console.log('Image upload API called');
		const formData = await request.formData();
		const file = formData.get('file') as File;
		const title = formData.get('title') as string;
		const description = formData.get('description') as string;

		console.log(
			'File received:',
			file ? { name: file.name, size: file.size, type: file.type } : 'No file'
		);
		console.log('Title:', title);
		console.log('Description:', description);

		if (!file) {
			console.log('No file provided');
			return NextResponse.json({ error: 'No file provided' }, { status: 400 });
		}

		// Validate file type
		if (!file.type.startsWith('image/')) {
			return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
		}

		// Validate file size (max 5MB)
		if (file.size > 5 * 1024 * 1024) {
			return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 });
		}

		// Generate unique filename
		const timestamp = Date.now();
		const fileExtension = file.name.split('.').pop();
		const filename = `images/${timestamp}-${Math.random()
			.toString(36)
			.substring(2)}.${fileExtension}`;
		console.log('Uploading file to Vercel Blob:', filename);

		// Upload to Vercel Blob
		const blob = await put(filename, file, { access: 'public' });
		console.log('File uploaded to Vercel Blob successfully:', blob.url);

		// Save to database
		console.log('Connecting to database');
		const db = await getDatabase();
		const imageData = {
			filename,
			originalName: file.name,
			title: title || file.name,
			description: description || '',
			url: blob.url,
			blobUrl: blob.url,
			size: file.size,
			mimeType: file.type,
			createdAt: new Date(),
		};

		console.log('Saving to database:', imageData);
		const result = await db.collection('images').insertOne(imageData);
		console.log('Database save result:', result);

		const response = {
			...imageData,
			_id: result.insertedId,
		};
		console.log('Returning response:', response);
		return NextResponse.json(response);
	} catch (error) {
		console.error('Error uploading image:', error);
		return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
	}
}
