import { NextRequest, NextResponse } from 'next/server';
import { updateProject, deleteProject } from '@/lib/models/PageData';
import { cookies } from 'next/headers';

async function verifyAdminSession() {
	const cookieStore = cookies();
	const session = cookieStore.get('admin-session');
	return session && session.value === 'authenticated';
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
	if (!(await verifyAdminSession())) {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}
	try {
		const projectData = await request.json();
		await updateProject(params.id, projectData);
		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Error updating project:', error);
		return NextResponse.json(
			{ message: 'Wystąpił błąd podczas aktualizacji projektu' },
			{ status: 500 }
		);
	}
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
	if (!(await verifyAdminSession())) {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}
	try {
		await deleteProject(params.id);
		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Error deleting project:', error);
		return NextResponse.json(
			{ message: 'Wystąpił błąd podczas usuwania projektu' },
			{ status: 500 }
		);
	}
}
