'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Projects from '@/components/Projects';
import Target from '@/components/Target';
import Partners from '@/components/Partners';
import Contact from '@/components/Contact';
import { FooterData } from '@/lib/models/PageData';

export default function Home() {
	const [footerData, setFooterData] = useState<FooterData | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchFooterData();
	}, []);

	const fetchFooterData = async () => {
		try {
			const response = await fetch('/api/public/footer');
			const data = await response.json();

			if (data.footerData) {
				setFooterData(data.footerData);
			} else {
				// Fallback do domyślnych danych
				setFooterData({
					_id: 'default',
					organizationName: 'Młoda Siła',
					description:
						'Stowarzyszenie młodzieżowe działające na rzecz rozwoju młodych ludzi i budowania lepszej przyszłości.',
					quickLinks: [
						{ text: 'O nas', href: '#about' },
						{ text: 'Nasze działania', href: '#projects' },
						{ text: 'Dla kogo', href: '#target' },
						{ text: 'Współpraca', href: '#partners' },
					],
					contact: {
						email: 'kontakt@mlodasila.pl',
						phone: '+48 123 456 789',
						address: 'ul. Młodych 15, Warszawa',
					},
					socialMedia: [
						{ name: 'Facebook', url: '#' },
						{ name: 'Instagram', url: '#' },
						{ name: 'LinkedIn', url: '#' },
						{ name: 'YouTube', url: '#' },
					],
					copyright: '© 2024 Stowarzyszenie Młoda Siła. Wszystkie prawa zastrzeżone.',
					createdAt: new Date(),
					updatedAt: new Date(),
				});
			}
		} catch (error) {
			console.error('Error fetching footer data:', error);
			// Fallback do domyślnych danych w przypadku błędu
			setFooterData({
				_id: 'default',
				organizationName: 'Młoda Siła',
				description:
					'Stowarzyszenie młodzieżowe działające na rzecz rozwoju młodych ludzi i budowania lepszej przyszłości.',
				quickLinks: [
					{ text: 'O nas', href: '#about' },
					{ text: 'Nasze działania', href: '#projects' },
					{ text: 'Dla kogo', href: '#target' },
					{ text: 'Współpraca', href: '#partners' },
				],
				contact: {
					email: 'kontakt@mlodasila.pl',
					phone: '+48 123 456 789',
					address: 'ul. Młodych 15, Warszawa',
				},
				socialMedia: [
					{ name: 'Facebook', url: '#' },
					{ name: 'Instagram', url: '#' },
					{ name: 'LinkedIn', url: '#' },
					{ name: 'YouTube', url: '#' },
				],
				copyright: '© 2024 Stowarzyszenie Młoda Siła. Wszystkie prawa zastrzeżone.',
				createdAt: new Date(),
				updatedAt: new Date(),
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<main className="min-h-screen">
			<Navigation />
			<Hero />
			<About />
			<Projects />
			<Target />
			<Partners />
			<Contact />

			{/* Footer */}
			<footer className="bg-gray-900 text-white py-12">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
						<div>
							<h3 className="text-2xl font-bold mb-4">
								{footerData?.organizationName || 'Młoda Siła'}
							</h3>
							<p className="text-gray-400 leading-relaxed">
								{footerData?.description ||
									'Stowarzyszenie młodzieżowe działające na rzecz rozwoju młodych ludzi i budowania lepszej przyszłości.'}
							</p>
						</div>

						<div>
							<h4 className="text-lg font-semibold mb-4">Szybkie linki</h4>
							<ul className="space-y-2 text-gray-400">
								{footerData?.quickLinks.map((link, index) => (
									<li key={index}>
										<a
											href={link.href}
											className="hover:text-white transition-colors">
											{link.text}
										</a>
									</li>
								))}
							</ul>
						</div>

						<div>
							<h4 className="text-lg font-semibold mb-4">Kontakt</h4>
							<ul className="space-y-2 text-gray-400">
								<li>{footerData?.contact.email || 'kontakt@mlodasila.pl'}</li>
								<li>{footerData?.contact.phone || '+48 123 456 789'}</li>
								<li>{footerData?.contact.address || 'ul. Młodych 15, Warszawa'}</li>
							</ul>
						</div>

						<div>
							<h4 className="text-lg font-semibold mb-4">Śledź nas</h4>
							<div className="flex space-x-4">
								{footerData?.socialMedia.map((social, index) => (
									<a
										key={index}
										href={social.url}
										className="text-gray-400 hover:text-white transition-colors">
										{social.name}
									</a>
								))}
							</div>
						</div>
					</div>

					<div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
						<p>
							{footerData?.copyright ||
								'© 2024 Stowarzyszenie Młoda Siła. Wszystkie prawa zastrzeżone.'}
						</p>
					</div>
				</div>
			</footer>
		</main>
	);
}
