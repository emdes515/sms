import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { unlink } from 'fs/promises';
import { join } from 'path';

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
	try {
		const db = await getDatabase();
		const imageId = new ObjectId(params.id);

		// Get image data first
		const image = await db.collection('images').findOne({ _id: imageId });
		if (!image) {
			return NextResponse.json({ error: 'Image not found' }, { status: 404 });
		}

		// Delete file from filesystem
		try {
			const filepath = join(process.cwd(), 'public', image.url);
			await unlink(filepath);
		} catch (fileError) {
			console.warn('Could not delete file from filesystem:', fileError);
		}

		// Delete from database
		await db.collection('images').deleteOne({ _id: imageId });

		return NextResponse.json({ message: 'Image deleted successfully' });
	} catch (error) {
		console.error('Error deleting image:', error);
		return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
	}
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
	try {
		const db = await getDatabase();
		const imageId = new ObjectId(params.id);
		const body = await request.json();

		const { title, description } = body;

		const result = await db.collection('images').updateOne(
			{ _id: imageId },
			{
				$set: {
					title: title || '',
					description: description || '',
					updatedAt: new Date(),
				},
			}
		);

		if (result.matchedCount === 0) {
			return NextResponse.json({ error: 'Image not found' }, { status: 404 });
		}

		return NextResponse.json({ message: 'Image updated successfully' });
	} catch (error) {
		console.error('Error updating image:', error);
		return NextResponse.json({ error: 'Failed to update image' }, { status: 500 });
	}
}
