'use client';

import { Calendar, Users, MapPin, ArrowRight, BookOpen, Heart, Globe, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Project, Event, Partner, Ward } from '@/lib/models/PageData';
import ScrollAnimation from './ScrollAnimation';

const Projects = () => {
	const [activeTab, setActiveTab] = useState('projects');
	const [projects, setProjects] = useState<Project[]>([]);
	const [allProjects, setAllProjects] = useState<Project[]>([]);
	const [events, setEvents] = useState<Event[]>([]);
	const [allEvents, setAllEvents] = useState<Event[]>([]);
	const [wards, setWards] = useState<Ward[]>([]);
	const [allWards, setAllWards] = useState<Ward[]>([]);
	const [partners, setPartners] = useState<Partner[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		try {
			const [
				projectsRes,
				allProjectsRes,
				eventsRes,
				allEventsRes,
				wardsRes,
				allWardsRes,
				partnersRes,
			] = await Promise.all([
				fetch('/api/public/projects'),
				fetch('/api/public/projects/all'),
				fetch('/api/public/events'),
				fetch('/api/public/events/all'),
				fetch('/api/public/wards'),
				fetch('/api/public/wards/all'),
				fetch('/api/public/partners'),
			]);

			const [
				projectsData,
				allProjectsData,
				eventsData,
				allEventsData,
				wardsData,
				allWardsData,
				partnersData,
			] = await Promise.all([
				projectsRes.json(),
				allProjectsRes.json(),
				eventsRes.json(),
				allEventsRes.json(),
				wardsRes.json(),
				allWardsRes.json(),
				partnersRes.json(),
			]);

			setProjects(projectsData || []);
			setAllProjects(allProjectsData || []);
			setEvents(eventsData || []);
			setAllEvents(allEventsData || []);
			setWards(wardsData || []);
			setAllWards(allWardsData || []);
			setPartners(partnersData || []);
		} catch (error) {
			console.error('Error fetching data:', error);
		} finally {
			setLoading(false);
		}
	};

	const getProjectIcon = (iconName: string) => {
		const iconMap: { [key: string]: any } = {
			Users,
			Globe,
			Zap,
			Heart,
			BookOpen,
			Calendar,
		};
		const IconComponent = iconMap[iconName] || Users;
		return (
			<IconComponent
				className="text-primary-600"
				size={32}
			/>
		);
	};

	if (loading) {
		return (
			<section
				id="projects"
				className="py-20 bg-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center">
						<div className="animate-pulse">
							<div className="h-16 bg-gray-200 rounded w-1/3 mx-auto mb-6"></div>
							<div className="h-8 bg-gray-200 rounded w-2/3 mx-auto mb-8"></div>
						</div>
					</div>
				</div>
			</section>
		);
	}

	return (
		<section
			id="projects"
			className="py-20 bg-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<ScrollAnimation
					animation="fadeInUp"
					delay={0.2}>
					<div className="text-center mb-16">
						<h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Nasze działania</h2>
						<p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
							Realizujemy różnorodne projekty i inicjatywy, które rozwijają umiejętności młodych
							ludzi i pozytywnie wpływają na społeczność lokalną.
						</p>

						{/* Tabs */}
						<div className="flex justify-center">
							{/* Desktop/Tablet Tabs - Horizontal */}
							<div className="hidden sm:flex bg-gray-100 rounded-full p-1">
								<button
									onClick={() => setActiveTab('projects')}
									className={`px-4 lg:px-6 py-2 lg:py-3 rounded-full font-medium transition-all duration-300 text-sm lg:text-base ${
										activeTab === 'projects'
											? 'bg-primary-600 text-white shadow-lg'
											: 'text-gray-600 hover:text-gray-900'
									}`}>
									Projekty
								</button>
								<button
									onClick={() => setActiveTab('events')}
									className={`px-4 lg:px-6 py-2 lg:py-3 rounded-full font-medium transition-all duration-300 text-sm lg:text-base ${
										activeTab === 'events'
											? 'bg-primary-600 text-white shadow-lg'
											: 'text-gray-600 hover:text-gray-900'
									}`}>
									Wydarzenia
								</button>
								<button
									onClick={() => setActiveTab('wards')}
									className={`px-4 lg:px-6 py-2 lg:py-3 rounded-full font-medium transition-all duration-300 text-sm lg:text-base ${
										activeTab === 'wards'
											? 'bg-primary-600 text-white shadow-lg'
											: 'text-gray-600 hover:text-gray-900'
									}`}>
									Podopieczni
								</button>
								<button
									onClick={() => setActiveTab('supporters')}
									className={`px-4 lg:px-6 py-2 lg:py-3 rounded-full font-medium transition-all duration-300 text-sm lg:text-base ${
										activeTab === 'supporters'
											? 'bg-primary-600 text-white shadow-lg'
											: 'text-gray-600 hover:text-gray-900'
									}`}>
									Partnerzy
								</button>
							</div>

							{/* Mobile Tabs - Vertical Stack */}
							<div className="sm:hidden w-full max-w-sm mx-auto projects-tabs">
								<div className="bg-gray-100 rounded-2xl p-2 space-y-1">
									<button
										onClick={() => setActiveTab('projects')}
										className={`w-full px-4 py-3 rounded-xl font-medium transition-all duration-300 text-sm ${
											activeTab === 'projects'
												? 'bg-primary-600 text-white shadow-lg'
												: 'text-gray-600 hover:text-gray-900 hover:bg-white'
										}`}>
										Projekty
									</button>
									<button
										onClick={() => setActiveTab('events')}
										className={`w-full px-4 py-3 rounded-xl font-medium transition-all duration-300 text-sm ${
											activeTab === 'events'
												? 'bg-primary-600 text-white shadow-lg'
												: 'text-gray-600 hover:text-gray-900 hover:bg-white'
										}`}>
										Wydarzenia
									</button>
									<button
										onClick={() => setActiveTab('wards')}
										className={`w-full px-4 py-3 rounded-xl font-medium transition-all duration-300 text-sm ${
											activeTab === 'wards'
												? 'bg-primary-600 text-white shadow-lg'
												: 'text-gray-600 hover:text-gray-900 hover:bg-white'
										}`}>
										Podopieczni
									</button>
									<button
										onClick={() => setActiveTab('supporters')}
										className={`w-full px-4 py-3 rounded-xl font-medium transition-all duration-300 text-sm ${
											activeTab === 'supporters'
												? 'bg-primary-600 text-white shadow-lg'
												: 'text-gray-600 hover:text-gray-900 hover:bg-white'
										}`}>
										Partnerzy
									</button>
								</div>
							</div>
						</div>
					</div>
				</ScrollAnimation>

				{/* Tab Content */}
				{activeTab === 'projects' && (
					<>
						{/* Projects Grid */}
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16">
							{projects.map((project, index) => (
								<ScrollAnimation
									key={project._id || index}
									animation="fadeInUp"
									delay={0.4 + index * 0.1}
									duration={0.6}>
									<div className="bg-gray-50 rounded-2xl p-6 md:p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
										{project.image && (
											<div className="mb-6">
												<img
													src={project.image}
													alt={project.title}
													className="w-full h-48 object-cover rounded-xl"
												/>
											</div>
										)}
										<div className="mb-6">
											<div className="flex items-center gap-3 mb-4">
												{getProjectIcon(project.icon)}
												<span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
													{project.category}
												</span>
											</div>
											<h3 className="text-xl font-bold text-gray-900 mb-3">{project.title}</h3>
											<p className="text-gray-600 leading-relaxed mb-4">{project.description}</p>
										</div>

										<div className="space-y-2 text-sm text-gray-500">
											<div className="flex items-center gap-2">
												<Users size={16} />
												<span>{project.participants}</span>
											</div>
											<div className="flex items-center gap-2">
												<Calendar size={16} />
												<span>{project.duration}</span>
											</div>
										</div>
									</div>
								</ScrollAnimation>
							))}
						</div>

						{/* Archive Projects */}
						{allProjects.filter((project) => !project.isActive).length > 0 && (
							<div className="mt-12 bg-gray-50 rounded-3xl p-8 md:p-12">
								<div className="text-center mb-8">
									<h3 className="text-3xl font-bold mb-4 text-gray-900">Archiwum projektów</h3>
									<p className="text-xl text-gray-600">
										Przypomnij sobie nasze zrealizowane inicjatywy i projekty
									</p>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
									{allProjects
										.filter((project) => !project.isActive)
										.slice(0, 6)
										.map((project, index) => (
											<div
												key={project._id || index}
												className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
												{project.image && (
													<div className="mb-4">
														<img
															src={project.image}
															alt={project.title}
															className="w-full h-32 object-cover rounded-xl"
														/>
													</div>
												)}
												<div className="mb-4">
													<div className="flex items-center gap-3 mb-4">
														{getProjectIcon(project.icon)}
														<span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
															{project.category}
														</span>
														<span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
															Archiwum
														</span>
													</div>
													<h3 className="text-lg font-bold text-gray-700 mb-3">{project.title}</h3>
													<p className="text-gray-500 text-sm leading-relaxed mb-4">
														{project.description}
													</p>
												</div>

												<div className="space-y-2 text-sm text-gray-400">
													<div className="flex items-center gap-2">
														<Users size={16} />
														<span>{project.participants}</span>
													</div>
													<div className="flex items-center gap-2">
														<Calendar size={16} />
														<span>{project.duration}</span>
													</div>
												</div>
											</div>
										))}
								</div>

								{allProjects.filter((project) => !project.isActive).length > 6 && (
									<div className="text-center mt-8">
										<button className="bg-primary-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-700 transition-colors duration-300 flex items-center gap-2 mx-auto">
											Zobacz więcej projektów z archiwum
											<ArrowRight size={20} />
										</button>
									</div>
								)}
							</div>
						)}
					</>
				)}

				{activeTab === 'events' && (
					<>
						{/* Active Events */}
						<div className="mb-8">
							<h2 className="text-xl font-semibold text-gray-900 mb-4">Nadchodzące wydarzenia</h2>
							<div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-3xl p-8 md:p-12 text-white">
								<div className="text-center mb-8">
									<h3 className="text-3xl font-bold mb-4">Nadchodzące wydarzenia</h3>
									<p className="text-xl opacity-90">
										Dołącz do naszych najbliższych inicjatyw i spotkań
									</p>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
									{events.slice(0, 3).map((event, index) => (
										<div
											key={event._id || index}
											className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
											{event.image && (
												<div className="mb-4">
													<img
														src={event.image}
														alt={event.title}
														className="w-full h-32 object-cover rounded-xl"
													/>
												</div>
											)}
											<div className="flex items-center gap-3 mb-3">
												<Calendar
													className="text-white"
													size={20}
												/>
												<span className="font-semibold">
													{event.date}
													{event.time && <span className="ml-2 text-white/80">({event.time})</span>}
												</span>
											</div>
											<h4 className="text-lg font-bold mb-2">{event.title}</h4>
											<div className="flex items-center gap-2 mb-3 text-white/80">
												<MapPin size={16} />
												<span className="text-sm">{event.location}</span>
											</div>
											<p className="text-white/90 text-sm leading-relaxed">{event.description}</p>
										</div>
									))}
								</div>

								<div className="text-center mt-8">
									<button className="bg-white text-primary-600 px-8 py-3 rounded-full font-semibold hover:bg-primary-50 transition-colors duration-300 flex items-center gap-2 mx-auto">
										Zobacz wszystkie wydarzenia
										<ArrowRight size={20} />
									</button>
								</div>
							</div>
						</div>

						{/* Archive Events */}
						{allEvents.filter((event) => !event.isActive).length > 0 && (
							<div>
								<h2 className="text-xl font-semibold text-gray-900 mb-4">Archiwum wydarzeń</h2>
								<div className="bg-gray-50 rounded-3xl p-8 md:p-12">
									<div className="text-center mb-8">
										<h3 className="text-3xl font-bold mb-4 text-gray-900">Archiwum wydarzeń</h3>
										<p className="text-xl text-gray-600">
											Przypomnij sobie nasze przeszłe inicjatywy i spotkania
										</p>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
										{allEvents
											.filter((event) => !event.isActive)
											.slice(0, 6)
											.map((event, index) => (
												<div
													key={event._id || index}
													className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
													{event.image && (
														<div className="mb-4">
															<img
																src={event.image}
																alt={event.title}
																className="w-full h-32 object-cover rounded-xl"
															/>
														</div>
													)}
													<div className="flex items-center gap-3 mb-3">
														<Calendar
															className="text-gray-500"
															size={20}
														/>
														<span className="font-semibold text-gray-600">{event.date}</span>
														<span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
															Archiwum
														</span>
													</div>
													<h4 className="text-lg font-bold mb-2 text-gray-900">{event.title}</h4>
													<div className="flex items-center gap-2 mb-3 text-gray-500">
														<MapPin size={16} />
														<span className="text-sm">{event.location}</span>
													</div>
													<p className="text-gray-600 text-sm leading-relaxed">
														{event.description}
													</p>
												</div>
											))}
									</div>

									{allEvents.filter((event) => !event.isActive).length > 6 && (
										<div className="text-center mt-8">
											<button className="bg-primary-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-700 transition-colors duration-300 flex items-center gap-2 mx-auto">
												Zobacz więcej wydarzeń z archiwum
												<ArrowRight size={20} />
											</button>
										</div>
									)}
								</div>
							</div>
						)}
					</>
				)}

				{activeTab === 'wards' && (
					<>
						{/* Active Wards */}
						<div className="mb-8">
							<h2 className="text-xl font-semibold text-gray-900 mb-4">Nasi podopieczni</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
								{wards.map((ward, index) => (
									<div
										key={ward._id || index}
										className="bg-gray-50 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
										{ward.image && (
											<div className="mb-6">
												<img
													src={ward.image}
													alt={ward.name}
													className="w-full h-48 object-cover rounded-xl"
												/>
											</div>
										)}
										<div className="mb-6">
											<div className="flex items-center gap-3 mb-4">
												<div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
													<Heart
														className="text-primary-600"
														size={24}
													/>
												</div>
												<span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
													Podopieczny
												</span>
											</div>
											<h3 className="text-xl font-bold text-gray-900 mb-3">{ward.name}</h3>
											<p className="text-gray-600 leading-relaxed mb-4">{ward.description}</p>
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Archive Wards */}
						{allWards.filter((ward) => !ward.isActive).length > 0 && (
							<div className="mt-12 bg-gray-50 rounded-3xl p-8 md:p-12">
								<div className="text-center mb-8">
									<h3 className="text-3xl font-bold mb-4 text-gray-900">Archiwum podopiecznych</h3>
									<p className="text-xl text-gray-600">
										Przypomnij sobie naszych byłych podopiecznych
									</p>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
									{allWards
										.filter((ward) => !ward.isActive)
										.slice(0, 6)
										.map((ward, index) => (
											<div
												key={ward._id || index}
												className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
												{ward.image && (
													<div className="mb-4">
														<img
															src={ward.image}
															alt={ward.name}
															className="w-full h-32 object-cover rounded-xl"
														/>
													</div>
												)}
												<div className="mb-4">
													<div className="flex items-center gap-3 mb-4">
														<div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
															<Heart
																className="text-gray-600"
																size={20}
															/>
														</div>
														<span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
															Podopieczny
														</span>
														<span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
															Archiwum
														</span>
													</div>
													<h3 className="text-lg font-bold text-gray-700 mb-3">{ward.name}</h3>
													<p className="text-gray-500 text-sm leading-relaxed mb-4">
														{ward.description}
													</p>
												</div>
											</div>
										))}
								</div>

								{allWards.filter((ward) => !ward.isActive).length > 6 && (
									<div className="text-center mt-8">
										<button className="bg-primary-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-700 transition-colors duration-300 flex items-center gap-2 mx-auto">
											Zobacz więcej podopiecznych z archiwum
											<ArrowRight size={20} />
										</button>
									</div>
								)}
							</div>
						)}
					</>
				)}

				{activeTab === 'supporters' && (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
						{partners.map((partner, index) => (
							<div
								key={partner._id || index}
								className="bg-gray-50 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
								<div className="mb-6">
									<div className="flex items-center gap-3 mb-4">
										<div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
											<span className="text-primary-600 font-bold text-lg">
												{partner.logo || partner.name.charAt(0)}
											</span>
										</div>
										<span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
											{partner.category}
										</span>
									</div>
									<h3 className="text-xl font-bold text-gray-900 mb-3">{partner.name}</h3>
									<p className="text-gray-600 leading-relaxed mb-4">{partner.description}</p>
								</div>

								<div className="space-y-2 text-sm text-gray-500">
									<div className="flex items-center gap-2">
										<span>🤝</span>
										<span>{partner.type}</span>
									</div>
									<div className="flex items-center gap-2">
										<span>⭐</span>
										<span>Partner strategiczny</span>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</section>
	);
};

export default Projects;
