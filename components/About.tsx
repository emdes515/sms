'use client';

import { useState, useEffect } from 'react';
import {
	Target,
	Users,
	Heart,
	Lightbulb,
	Award,
	Users2,
	Crown,
	Briefcase,
	GraduationCap,
} from 'lucide-react';
import { AboutData } from '@/lib/models/PageData';

const About = () => {
	const [aboutData, setAboutData] = useState<AboutData | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchAboutData();
	}, []);

	const fetchAboutData = async () => {
		try {
			const response = await fetch(`/api/public/about?t=${Date.now()}`);
			const data = await response.json();

			console.log('About API Response:', data);
			console.log('About data exists:', !!data.aboutData);
			console.log('Management members count:', data.aboutData?.management?.members?.length || 0);

			if (data.aboutData) {
				setAboutData(data.aboutData);
			} else {
				// Fallback do domyślnych danych
				setAboutData({
					_id: 'default',
					title: 'O nas',
					description:
						'Stowarzyszenie Młoda Siła to organizacja młodzieżowa, która od 2015 roku aktywnie działa na rzecz rozwoju młodych ludzi i budowania lepszej przyszłości.',
					mission: {
						title: 'Nasza misja',
						description:
							'Wierzymy, że młodzi ludzie mają nieograniczony potencjał do tworzenia pozytywnych zmian. Naszym celem jest stworzenie przestrzeni, gdzie mogą rozwijać swoje umiejętności, zdobywać doświadczenie i budować lepszą przyszłość dla siebie i swojej społeczności.',
					},
					values: [
						{
							title: 'Cel',
							description: 'Rozwijamy potencjał młodych ludzi i budujemy silną społeczność',
							icon: 'Target',
						},
						{
							title: 'Wspólnota',
							description: 'Tworzymy przestrzeń, gdzie każdy może znaleźć swoje miejsce',
							icon: 'Users',
						},
						{
							title: 'Pasja',
							description: 'Działamy z entuzjazmem i zaangażowaniem w to, co robimy',
							icon: 'Heart',
						},
						{
							title: 'Innowacja',
							description: 'Szukamy nowych rozwiązań i kreatywnych podejść',
							icon: 'Lightbulb',
						},
						{
							title: 'Jakość',
							description: 'Stawiamy na wysokie standardy we wszystkich naszych działaniach',
							icon: 'Award',
						},
						{
							title: 'Współpraca',
							description: 'Wierzymy w siłę zespołu i wzajemnego wsparcia',
							icon: 'Users2',
						},
					],
					achievements: {
						title: 'Nasze osiągnięcia',
						description:
							'Dzięki zaangażowaniu naszych członków i wsparciu partnerów udało nam się zrealizować wiele wartościowych projektów',
						stats: [
							{ value: '8+', label: 'Lat działalności' },
							{ value: '500+', label: 'Aktywnych członków' },
							{ value: '50+', label: 'Zrealizowanych projektów' },
							{ value: '15+', label: 'Partnerów współpracujących' },
						],
					},
					management: {
						title: 'Zarząd',
						description:
							'Poznaj nasz zespół zarządzający, który z pasją i zaangażowaniem kieruje działalnością stowarzyszenia',
						members: [
							{
								name: 'Anna Kowalska',
								position: 'Prezes',
								description:
									'Absolwentka psychologii społecznej, od 5 lat zaangażowana w rozwój młodzieży',
								image: '/uploads/1759587252678-ontjzbtf8e.jpg',
								experience: '5 lat doświadczenia',
								education: 'Psychologia społeczna UW',
							},
							{
								name: 'Michał Nowak',
								position: 'Wiceprezes',
								description:
									'Specjalista ds. projektów edukacyjnych, koordynator programów mentoringowych',
								image: '👨‍💼',
								experience: '4 lata doświadczenia',
								education: 'Pedagogika UJ',
							},
							{
								name: 'Katarzyna Wiśniewska',
								position: 'Sekretarz',
								description:
									'Odpowiedzialna za administrację i współpracę z partnerami zewnętrznymi',
								image: '👩‍💻',
								experience: '3 lata doświadczenia',
								education: 'Zarządzanie SGH',
							},
							{
								name: 'Piotr Zieliński',
								position: 'Skarbnik',
								description: 'Kontroler finansowy, odpowiedzialny za budżet i sprawozdawczość',
								image: '👨‍💻',
								experience: '6 lat doświadczenia',
								education: 'Finanse i rachunkowość',
							},
							{
								name: 'Magdalena Krawczyk',
								position: 'Członek Zarządu',
								description: 'Koordynatorka projektów społecznych i wolontariatu',
								image: '👩‍🎓',
								experience: '4 lata doświadczenia',
								education: 'Socjologia UW',
							},
							{
								name: 'Tomasz Lewandowski',
								position: 'Członek Zarządu',
								description: 'Specjalista ds. technologii i innowacji w edukacji',
								image: '👨‍🔬',
								experience: '3 lata doświadczenia',
								education: 'Informatyka PW',
							},
						],
					},
					createdAt: new Date(),
					updatedAt: new Date(),
				});
			}
		} catch (error) {
			console.error('Error fetching about data:', error);
			// Fallback do domyślnych danych w przypadku błędu
			setAboutData({
				_id: 'default',
				title: 'O nas',
				description:
					'Stowarzyszenie Młoda Siła to organizacja młodzieżowa, która od 2015 roku aktywnie działa na rzecz rozwoju młodych ludzi i budowania lepszej przyszłości.',
				mission: {
					title: 'Nasza misja',
					description:
						'Wierzymy, że młodzi ludzie mają nieograniczony potencjał do tworzenia pozytywnych zmian. Naszym celem jest stworzenie przestrzeni, gdzie mogą rozwijać swoje umiejętności, zdobywać doświadczenie i budować lepszą przyszłość dla siebie i swojej społeczności.',
				},
				values: [
					{
						title: 'Cel',
						description: 'Rozwijamy potencjał młodych ludzi i budujemy silną społeczność',
						icon: 'Target',
					},
					{
						title: 'Wspólnota',
						description: 'Tworzymy przestrzeń, gdzie każdy może znaleźć swoje miejsce',
						icon: 'Users',
					},
					{
						title: 'Pasja',
						description: 'Działamy z entuzjazmem i zaangażowaniem w to, co robimy',
						icon: 'Heart',
					},
					{
						title: 'Innowacja',
						description: 'Szukamy nowych rozwiązań i kreatywnych podejść',
						icon: 'Lightbulb',
					},
					{
						title: 'Jakość',
						description: 'Stawiamy na wysokie standardy we wszystkich naszych działaniach',
						icon: 'Award',
					},
					{
						title: 'Współpraca',
						description: 'Wierzymy w siłę zespołu i wzajemnego wsparcia',
						icon: 'Users2',
					},
				],
				achievements: {
					title: 'Nasze osiągnięcia',
					description:
						'Dzięki zaangażowaniu naszych członków i wsparciu partnerów udało nam się zrealizować wiele wartościowych projektów',
					stats: [
						{ value: '8+', label: 'Lat działalności' },
						{ value: '500+', label: 'Aktywnych członków' },
						{ value: '50+', label: 'Zrealizowanych projektów' },
						{ value: '15+', label: 'Partnerów współpracujących' },
					],
				},
				management: {
					title: 'Zarząd',
					description:
						'Poznaj nasz zespół zarządzający, który z pasją i zaangażowaniem kieruje działalnością stowarzyszenia',
					members: [
						{
							name: 'Anna Kowalska',
							position: 'Prezes',
							description:
								'Absolwentka psychologii społecznej, od 5 lat zaangażowana w rozwój młodzieży',
							image: '/uploads/1759587252678-ontjzbtf8e.jpg',
							experience: '5 lat doświadczenia',
							education: 'Psychologia społeczna UW',
						},
						{
							name: 'Michał Nowak',
							position: 'Wiceprezes',
							description:
								'Specjalista ds. projektów edukacyjnych, koordynator programów mentoringowych',
							image: '👨‍💼',
							experience: '4 lata doświadczenia',
							education: 'Pedagogika UJ',
						},
						{
							name: 'Katarzyna Wiśniewska',
							position: 'Sekretarz',
							description: 'Odpowiedzialna za administrację i współpracę z partnerami zewnętrznymi',
							image: '👩‍💻',
							experience: '3 lata doświadczenia',
							education: 'Zarządzanie SGH',
						},
						{
							name: 'Piotr Zieliński',
							position: 'Skarbnik',
							description: 'Kontroler finansowy, odpowiedzialny za budżet i sprawozdawczość',
							image: '👨‍💻',
							experience: '6 lat doświadczenia',
							education: 'Finanse i rachunkowość',
						},
						{
							name: 'Magdalena Krawczyk',
							position: 'Członek Zarządu',
							description: 'Koordynatorka projektów społecznych i wolontariatu',
							image: '👩‍🎓',
							experience: '4 lata doświadczenia',
							education: 'Socjologia UW',
						},
						{
							name: 'Tomasz Lewandowski',
							position: 'Członek Zarządu',
							description: 'Specjalista ds. technologii i innowacji w edukacji',
							image: '👨‍🔬',
							experience: '3 lata doświadczenia',
							education: 'Informatyka PW',
						},
					],
				},
				createdAt: new Date(),
				updatedAt: new Date(),
			});
		} finally {
			setLoading(false);
		}
	};

	const getIconComponent = (iconName: string) => {
		const iconMap: { [key: string]: any } = {
			Target,
			Users,
			Heart,
			Lightbulb,
			Award,
			Users2,
		};
		const IconComponent = iconMap[iconName] || Target;
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
				id="about"
				className="py-20 bg-gray-50">
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

	if (!aboutData) {
		return null;
	}

	return (
		<section
			id="about"
			className="py-20 bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="text-center mb-16">
					<h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">{aboutData.title}</h2>
					<p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
						{aboutData.description}
					</p>
				</div>

				{/* Mission Statement */}
				<div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-16">
					<div className="text-center">
						<h3 className="text-3xl font-bold text-gray-900 mb-6">{aboutData.mission.title}</h3>
						<p className="text-xl text-gray-700 leading-relaxed max-w-4xl mx-auto">
							"{aboutData.mission.description}"
						</p>
					</div>
				</div>

				{/* Values Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
					{aboutData.values.map((value, index) => (
						<div
							key={index}
							className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
							<div className="text-center">
								<div className="mb-4 flex justify-center">{getIconComponent(value.icon)}</div>
								<h4 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h4>
								<p className="text-gray-600 leading-relaxed">{value.description}</p>
							</div>
						</div>
					))}
				</div>

				{/* Achievements */}
				<div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-3xl p-8 md:p-12 text-white">
					<div className="text-center mb-8">
						<h3 className="text-3xl font-bold mb-4">{aboutData.achievements.title}</h3>
						<p className="text-xl opacity-90">{aboutData.achievements.description}</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
						{aboutData.achievements.stats.map((stat, index) => (
							<div key={index}>
								<div className="text-4xl font-bold mb-2">{stat.value}</div>
								<div className="text-lg opacity-90">{stat.label}</div>
							</div>
						))}
					</div>
				</div>

				{/* Management Section */}
				<div className="mt-16">
					<div className="text-center mb-12">
						<h3 className="text-3xl font-bold text-gray-900 mb-4">{aboutData.management.title}</h3>
						<p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
							{aboutData.management.description}
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{aboutData.management.members.map((member, index) => (
							<div
								key={index}
								className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
								<div className="text-center">
									<div className="mb-4">
										{member.image && member.image.startsWith('/') ? (
											<img
												src={member.image}
												alt={member.name}
												className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-primary-100 shadow-lg"
											/>
										) : (
											<div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center mx-auto border-4 border-primary-200">
												<span className="text-4xl">{member.image || '👤'}</span>
											</div>
										)}
									</div>
									<div className="mb-4">
										<div className="flex items-center justify-center gap-2 mb-2">
											<Crown
												className="text-primary-600"
												size={20}
											/>
											<span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
												{member.position}
											</span>
										</div>
										<h4 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h4>
										<p className="text-gray-600 leading-relaxed mb-4">{member.description}</p>
									</div>

									<div className="space-y-2 text-sm text-gray-500">
										<div className="flex items-center gap-2">
											<Briefcase size={16} />
											<span>{member.experience}</span>
										</div>
										<div className="flex items-center gap-2">
											<GraduationCap size={16} />
											<span>{member.education}</span>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
};

export default About;
