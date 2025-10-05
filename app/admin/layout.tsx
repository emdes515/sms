'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
	LayoutDashboard,
	Edit3,
	FolderOpen,
	Calendar,
	Users,
	MessageSquare,
	LogOut,
	Settings,
	Info,
	Phone,
	Target,
	FileText,
	Image,
	Heart,
	Bell,
	Sliders,
} from 'lucide-react';
import { NotificationProvider } from '@/components/NotificationSystem';

interface AdminLayoutProps {
	children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
	const router = useRouter();
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		checkAuth();
	}, []);

	const checkAuth = async () => {
		try {
			const response = await fetch('/api/auth/verify');
			if (response.ok) {
				setIsAuthenticated(true);
			} else {
				router.push('/admin/login');
			}
		} catch (error) {
			console.error('Auth check error:', error);
			router.push('/admin/login');
		} finally {
			setLoading(false);
		}
	};

	const handleLogout = async () => {
		try {
			await fetch('/api/auth/logout', { method: 'POST' });
			router.push('/admin/login');
		} catch (error) {
			console.error('Logout error:', error);
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
			</div>
		);
	}

	if (!isAuthenticated) {
		return null;
	}

	const menuItems = [
		{ href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
		{ href: '/admin/hero', label: 'Tekst główny', icon: Edit3 },
		{ href: '/admin/about', label: 'O nas', icon: Info },
		{ href: '/admin/carousel', label: 'Karuzela', icon: Sliders },
		{ href: '/admin/contact', label: 'Kontakt', icon: Phone },
		{ href: '/admin/target', label: 'Dla kogo', icon: Target },
		{ href: '/admin/footer', label: 'Stopka', icon: FileText },
		{ href: '/admin/images', label: 'Zdjęcia', icon: Image },
		{ href: '/admin/projects', label: 'Projekty', icon: FolderOpen },
		{ href: '/admin/events', label: 'Wydarzenia', icon: Calendar },
		{ href: '/admin/wards', label: 'Podopieczni', icon: Heart },
		{ href: '/admin/partners', label: 'Partnerzy', icon: Users },
		{ href: '/admin/messages', label: 'Wiadomości', icon: MessageSquare },
		{ href: '/admin/notifications', label: 'Powiadomienia', icon: Bell },
	];

	return (
		<NotificationProvider>
			<div className="min-h-screen bg-gray-50">
				{/* Header */}
				<div className="bg-white shadow-sm border-b">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="flex justify-between items-center h-16">
							<div className="flex items-center">
								<h1 className="text-xl font-semibold text-gray-900">Panel Administratora</h1>
							</div>
							<button
								onClick={handleLogout}
								className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
								<LogOut size={16} />
								Wyloguj
							</button>
						</div>
					</div>
				</div>

				<div className="flex">
					{/* Sidebar */}
					<div className="w-64 bg-white shadow-sm min-h-screen">
						<nav className="mt-8">
							<div className="px-4 space-y-1">
								{menuItems.map((item) => {
									const Icon = item.icon;
									return (
										<a
											key={item.href}
											href={item.href}
											className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
											<Icon size={18} />
											{item.label}
										</a>
									);
								})}
							</div>
						</nav>
					</div>

					{/* Main Content */}
					<div className="flex-1 p-8">{children}</div>
				</div>
			</div>
		</NotificationProvider>
	);
};

export default AdminLayout;
