import { NextResponse } from 'next/server';
import { getAllProjects } from '@/lib/models/PageData';

export async function GET() {
	try {
		const projects = await getAllProjects();
		return NextResponse.json(projects);
	} catch (error) {
		console.error('Error fetching all projects:', error);
		return NextResponse.json(
			{ message: 'Wystąpił błąd podczas pobierania wszystkich projektów' },
			{ status: 500 }
		);
	}
}
