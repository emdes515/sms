import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Check if the route is an admin route
	if (pathname.startsWith('/admin')) {
		// Allow access to login page
		if (pathname === '/admin/login') {
			return NextResponse.next();
		}

		// Check for admin session cookie
		const adminSession = request.cookies.get('admin-session');

		if (!adminSession || adminSession.value !== 'authenticated') {
			return NextResponse.redirect(new URL('/admin/login', request.url));
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/admin/:path*', '/api/admin/:path*'],
};
