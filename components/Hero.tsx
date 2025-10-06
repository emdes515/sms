'use client';

import { ArrowRight, Users, Heart, Lightbulb } from 'lucide-react';
import { useState, useEffect } from 'react';
import { HeroData, ContactData } from '@/lib/models/PageData';
import AnimatedCounter from './AnimatedCounter';
import ScrollAnimation from './ScrollAnimation';

const Hero = () => {
	const [heroData, setHeroData] = useState<HeroData | null>(null);
	const [contactData, setContactData] = useState<ContactData | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchHeroData();
		fetchContactData();
	}, []);

	const fetchHeroData = async () => {
		try {
			const response = await fetch(`/api/public/hero?t=${Date.now()}`);
			const data = await response.json();

			if (data.heroData) {
				setHeroData(data.heroData);
			} else {
				// Fallback do domyślnych danych
				setHeroData({
					_id: 'default',
					mainTitle: 'Razem budujemy',
					highlightedText: 'przyszłość',
					subtitle:
						'Stowarzyszenie Młoda Siła to miejsce, gdzie młodzi ludzie rozwijają swoje pasje, zdobywają doświadczenie i tworzą pozytywne zmiany w społeczności.',
					primaryButtonText: 'Dołącz do nas',
					secondaryButtonText: 'Zobacz nasze działania',
					stats: {
						members: {
							value: '500+',
							label: 'Aktywnych członków',
						},
						projects: {
							value: '50+',
							label: 'Zrealizowanych projektów',
						},
						volunteerHours: {
							value: '1000+',
							label: 'Godzin wolontariatu',
						},
					},
					createdAt: new Date(),
					updatedAt: new Date(),
				});
			}
		} catch (error) {
			console.error('Error fetching hero data:', error);
			// Fallback do domyślnych danych w przypadku błędu
			setHeroData({
				_id: 'default',
				mainTitle: 'Razem budujemy',
				highlightedText: 'przyszłość',
				subtitle:
					'Stowarzyszenie Młoda Siła to miejsce, gdzie młodzi ludzie rozwijają swoje pasje, zdobywają doświadczenie i tworzą pozytywne zmiany w społeczności.',
				primaryButtonText: 'Dołącz do nas',
				secondaryButtonText: 'Zobacz nasze działania',
				stats: {
					members: {
						value: '500+',
						label: 'Aktywnych członków',
					},
					projects: {
						value: '50+',
						label: 'Zrealizowanych projektów',
					},
					volunteerHours: {
						value: '1000+',
						label: 'Godzin wolontariatu',
					},
				},
				createdAt: new Date(),
				updatedAt: new Date(),
			});
		} finally {
			setLoading(false);
		}
	};

	const fetchContactData = async () => {
		try {
			const response = await fetch(`/api/public/contact?t=${Date.now()}`);
			const data = await response.json();
			if (data.contactData) {
				setContactData(data.contactData);
			}
		} catch (error) {
			console.error('Error fetching contact data:', error);
		}
	};
	const scrollToSection = (href: string) => {
		const element = document.querySelector(href);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
		}
	};

	if (loading) {
		return (
			<section
				id="hero"
				className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 xs:pt-24 sm:pt-16 md:pt-0">
				<div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600">
					<div className="absolute inset-0 bg-black/20"></div>
				</div>
				<div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
					<div className="animate-pulse">
						<div className="h-16 bg-white/20 rounded w-3/4 mx-auto mb-6"></div>
						<div className="h-8 bg-white/20 rounded w-1/2 mx-auto mb-8"></div>
						<div className="h-12 bg-white/20 rounded w-1/3 mx-auto mb-12"></div>
					</div>
				</div>
			</section>
		);
	}

	if (!heroData) {
		return null;
	}

	return (
		<section
			id="hero"
			className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 xs:pt-24 sm:pt-16 md:pt-0">
			{/* Background with enhanced gradient overlay */}
			<div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600">
				<div className="absolute inset-0 bg-black/20"></div>
			</div>

			{/* Animated background elements - same as desktop */}
			<div className="absolute inset-0 overflow-hidden">
				<div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
				<div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
			</div>

			<div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
				<div className="max-w-4xl mx-auto">
					{/* Main heading */}
					<ScrollAnimation
						animation="fadeInDown"
						delay={0.2}>
						<h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
							{heroData.mainTitle}
							<span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
								{heroData.highlightedText}
							</span>
						</h1>
					</ScrollAnimation>

					{/* Subtitle */}
					<ScrollAnimation
						animation="fadeInUp"
						delay={0.4}>
						<p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
							{heroData.subtitle}
						</p>
					</ScrollAnimation>

					{/* CTA Buttons */}
					<ScrollAnimation
						animation="fadeInUp"
						delay={0.6}>
						<div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
							<button
								onClick={() => scrollToSection('#contact')}
								className="group bg-white text-primary-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-primary-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2">
								{heroData.primaryButtonText}
								<ArrowRight
									className="group-hover:translate-x-1 transition-transform"
									size={20}
								/>
							</button>
							<button
								onClick={() => scrollToSection('#projects')}
								className="group border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-primary-600 transition-all duration-300 transform hover:scale-105">
								{heroData.secondaryButtonText}
							</button>
							<button
								onClick={() => window.open(contactData?.supportLink?.url || '#', '_blank')}
								className="group bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2">
								<Heart size={20} />
								{contactData?.supportLink?.title || 'Wesprzyj nas'}
							</button>
						</div>
					</ScrollAnimation>

					{/* Stats */}
					<ScrollAnimation
						animation="fadeInUp"
						delay={0.5}
						duration={0.8}>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto">
							<div className="text-center">
								<div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-white/20">
									<Users
										className="mx-auto text-white mb-3"
										size={32}
									/>
									<div className="text-2xl md:text-3xl font-bold text-white mb-2">
										<AnimatedCounter
											value={parseInt(heroData.stats.members.value.replace(/\D/g, ''))}
											suffix="+"
											duration={1.5}
											delay={0.6}
										/>
									</div>
									<div className="text-sm md:text-base text-white/80">
										{heroData.stats.members.label}
									</div>
								</div>
							</div>
							<div className="text-center">
								<div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-white/20">
									<Heart
										className="mx-auto text-white mb-3"
										size={32}
									/>
									<div className="text-2xl md:text-3xl font-bold text-white mb-2">
										<AnimatedCounter
											value={parseInt(heroData.stats.projects.value.replace(/\D/g, ''))}
											suffix="+"
											duration={1.5}
											delay={0.8}
										/>
									</div>
									<div className="text-sm md:text-base text-white/80">
										{heroData.stats.projects.label}
									</div>
								</div>
							</div>
							<div className="text-center">
								<div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-white/20">
									<Lightbulb
										className="mx-auto text-white mb-3"
										size={32}
									/>
									<div className="text-2xl md:text-3xl font-bold text-white mb-2">
										<AnimatedCounter
											value={parseInt(heroData.stats.volunteerHours.value.replace(/\D/g, ''))}
											suffix="+"
											duration={1.5}
											delay={1.0}
										/>
									</div>
									<div className="text-sm md:text-base text-white/80">
										{heroData.stats.volunteerHours.label}
									</div>
								</div>
							</div>
						</div>
					</ScrollAnimation>
				</div>
			</div>

			{/* Scroll indicator */}
			<div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
				<div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
					<div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
				</div>
			</div>
		</section>
	);
};

export default Hero;
