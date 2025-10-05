import { NextResponse } from 'next/server';
import { getProjects } from '@/lib/models/PageData';

export async function GET() {
	try {
		const projects = await getProjects();
		return NextResponse.json(projects);
	} catch (error) {
		console.error('Error fetching projects:', error);
		return NextResponse.json(
			{ message: 'Wystąpił błąd podczas pobierania projektów' },
			{ status: 500 }
		);
	}
}
