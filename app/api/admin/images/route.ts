import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

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
		const formData = await request.formData();
		const file = formData.get('file') as File;
		const title = formData.get('title') as string;
		const description = formData.get('description') as string;

		if (!file) {
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

		// Create uploads directory if it doesn't exist
		const uploadsDir = join(process.cwd(), 'public', 'uploads');
		if (!existsSync(uploadsDir)) {
			await mkdir(uploadsDir, { recursive: true });
		}

		// Generate unique filename
		const timestamp = Date.now();
		const fileExtension = file.name.split('.').pop();
		const filename = `${timestamp}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
		const filepath = join(uploadsDir, filename);

		// Save file
		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);
		await writeFile(filepath, buffer);

		// Save to database
		const db = await getDatabase();
		const imageData = {
			filename,
			originalName: file.name,
			title: title || file.name,
			description: description || '',
			url: `/uploads/${filename}`,
			size: file.size,
			mimeType: file.type,
			createdAt: new Date(),
		};

		const result = await db.collection('images').insertOne(imageData);

		return NextResponse.json({
			...imageData,
			_id: result.insertedId,
		});
	} catch (error) {
		console.error('Error uploading image:', error);
		return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
	}
}
