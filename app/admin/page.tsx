'use client';

import { useState, useEffect } from 'react';
import {
	Users,
	FolderOpen,
	Calendar,
	MessageSquare,
	TrendingUp,
	Clock,
	Target,
	FileText,
} from 'lucide-react';
import AnimatedCounter from '@/components/AnimatedCounter';

interface DashboardStats {
	projects: number;
	events: number;
	partners: number;
	messages: number;
}

const AdminDashboard = () => {
	const [stats, setStats] = useState<DashboardStats>({
		projects: 0,
		events: 0,
		partners: 0,
		messages: 0,
	});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchStats();
	}, []);

	const fetchStats = async () => {
		try {
			const [projectsRes, eventsRes, partnersRes, messagesRes] = await Promise.all([
				fetch('/api/admin/projects'),
				fetch('/api/admin/events'),
				fetch('/api/admin/partners'),
				fetch('/api/admin/messages'),
			]);

			const [projects, events, partners, messages] = await Promise.all([
				projectsRes.json(),
				eventsRes.json(),
				partnersRes.json(),
				messagesRes.json(),
			]);

			setStats({
				projects: projects.length || 0,
				events: events.length || 0,
				partners: partners.length || 0,
				messages: messages.length || 0,
			});
		} catch (error) {
			console.error('Error fetching stats:', error);
		} finally {
			setLoading(false);
		}
	};

	const statCards = [
		{
			title: 'Projekty',
			value: stats.projects,
			icon: FolderOpen,
			color: 'bg-blue-500',
			href: '/admin/projects',
		},
		{
			title: 'Wydarzenia',
			value: stats.events,
			icon: Calendar,
			color: 'bg-green-500',
			href: '/admin/events',
		},
		{
			title: 'Partnerzy',
			value: stats.partners,
			icon: Users,
			color: 'bg-purple-500',
			href: '/admin/partners',
		},
		{
			title: 'Wiadomości',
			value: stats.messages,
			icon: MessageSquare,
			color: 'bg-orange-500',
			href: '/admin/messages',
		},
	];

	if (loading) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
			</div>
		);
	}

	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
				<p className="mt-2 text-gray-600">
					Witaj w panelu administratora. Tutaj możesz zarządzać treścią strony.
				</p>
			</div>

			{/* Stats Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{statCards.map((stat, index) => {
					const Icon = stat.icon;
					return (
						<a
							key={index}
							href={stat.href}
							className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
							<div className="flex items-center">
								<div className={`p-3 rounded-lg ${stat.color}`}>
									<Icon className="h-6 w-6 text-white" />
								</div>
								<div className="ml-4">
									<p className="text-sm font-medium text-gray-600">{stat.title}</p>
									<p className="text-2xl font-semibold text-gray-900">
										<AnimatedCounter
											value={stat.value}
											duration={1.2}
											delay={index * 0.15}
										/>
									</p>
								</div>
							</div>
						</a>
					);
				})}
			</div>

			{/* Landing Page Sections */}
			<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
				<h2 className="text-lg font-semibold text-gray-900 mb-4">Sekcje landing page</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					<a
						href="/admin/hero"
						className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
						<TrendingUp className="h-5 w-5 text-primary-600 mr-3" />
						<span className="text-sm font-medium">Sekcja główna (Hero)</span>
					</a>
					<a
						href="/admin/about"
						className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
						<Users className="h-5 w-5 text-primary-600 mr-3" />
						<span className="text-sm font-medium">O nas</span>
					</a>
					<a
						href="/admin/contact"
						className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
						<MessageSquare className="h-5 w-5 text-primary-600 mr-3" />
						<span className="text-sm font-medium">Kontakt</span>
					</a>
					<a
						href="/admin/target"
						className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
						<Target className="h-5 w-5 text-primary-600 mr-3" />
						<span className="text-sm font-medium">Dla kogo</span>
					</a>
					<a
						href="/admin/footer"
						className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
						<FileText className="h-5 w-5 text-primary-600 mr-3" />
						<span className="text-sm font-medium">Stopka</span>
					</a>
				</div>
			</div>

			{/* Content Management */}
			<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
				<h2 className="text-lg font-semibold text-gray-900 mb-4">Zarządzanie treścią</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
					<a
						href="/admin/projects"
						className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
						<FolderOpen className="h-5 w-5 text-primary-600 mr-3" />
						<span className="text-sm font-medium">Projekty</span>
					</a>
					<a
						href="/admin/events"
						className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
						<Calendar className="h-5 w-5 text-primary-600 mr-3" />
						<span className="text-sm font-medium">Wydarzenia</span>
					</a>
					<a
						href="/admin/partners"
						className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
						<Users className="h-5 w-5 text-primary-600 mr-3" />
						<span className="text-sm font-medium">Partnerzy</span>
					</a>
					<a
						href="/admin/messages"
						className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
						<MessageSquare className="h-5 w-5 text-primary-600 mr-3" />
						<span className="text-sm font-medium">Wiadomości</span>
					</a>
				</div>
			</div>

			{/* Recent Activity */}
			<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
				<h2 className="text-lg font-semibold text-gray-900 mb-4">Ostatnie aktywności</h2>
				<div className="space-y-3">
					<div className="flex items-center text-sm text-gray-600">
						<Clock className="h-4 w-4 mr-2" />
						<span>Panel administratora został uruchomiony</span>
					</div>
					<div className="flex items-center text-sm text-gray-600">
						<Users className="h-4 w-4 mr-2" />
						<span>Zalogowano do systemu</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdminDashboard;
