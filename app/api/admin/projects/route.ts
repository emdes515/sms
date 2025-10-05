import { NextRequest, NextResponse } from 'next/server';
import { getAllProjects, createProject } from '@/lib/models/PageData';
import { cookies } from 'next/headers';

async function verifyAdminSession() {
	const cookieStore = cookies();
	const session = cookieStore.get('admin-session');
	return session && session.value === 'authenticated';
}

export async function GET() {
	if (!(await verifyAdminSession())) {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}
	try {
		const projects = await getAllProjects();
		return NextResponse.json(projects);
	} catch (error) {
		console.error('Error fetching projects:', error);
		return NextResponse.json(
			{ message: 'Wystąpił błąd podczas pobierania projektów' },
			{ status: 500 }
		);
	}
}

export async function POST(request: NextRequest) {
	if (!(await verifyAdminSession())) {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}
	try {
		const projectData = await request.json();
		const project = await createProject(projectData);
		return NextResponse.json(project);
	} catch (error) {
		console.error('Error creating project:', error);
		return NextResponse.json(
			{ message: 'Wystąpił błąd podczas tworzenia projektu' },
			{ status: 500 }
		);
	}
}
