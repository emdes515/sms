'use client';

import { Building2, Users2, Award, Globe, Users, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Partner } from '@/lib/models/PageData';

const Partners = () => {
	const [partners, setPartners] = useState<Partner[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchPartners();
	}, []);

	const fetchPartners = async () => {
		try {
			const response = await fetch('/api/public/partners');
			const data = await response.json();
			setPartners(data || []);
		} catch (error) {
			console.error('Error fetching partners:', error);
		} finally {
			setLoading(false);
		}
	};

	const cooperationTypes = [
		{
			icon: (
				<Users2
					className="text-primary-600"
					size={32}
				/>
			),
			title: 'Wspólne projekty',
			description:
				'Realizujemy projekty społeczne, edukacyjne i kulturalne we współpracy z partnerami',
		},
		{
			icon: (
				<Users
					className="text-primary-600"
					size={32}
				/>
			),
			title: 'Wymiana doświadczeń',
			description: 'Dzielimy się wiedzą i najlepszymi praktykami z innymi organizacjami',
		},
		{
			icon: (
				<Award
					className="text-primary-600"
					size={32}
				/>
			),
			title: 'Wsparcie merytoryczne',
			description: 'Nasi partnerzy zapewniają ekspertów i zasoby do realizacji inicjatyw',
		},
		{
			icon: (
				<Globe
					className="text-primary-600"
					size={32}
				/>
			),
			title: 'Zasięg i promocja',
			description: 'Wspólnie docieramy do większej liczby młodych ludzi z naszymi działaniami',
		},
	];

	const howToCooperate = [
		'Skontaktuj się z nami przez formularz lub email',
		'Opisz swoją organizację i pomysły na współpracę',
		'Umówimy się na spotkanie, aby omówić szczegóły',
		'Wspólnie zaplanujemy i zrealizujemy inicjatywę',
	];

	if (loading) {
		return (
			<section
				id="partners"
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
			id="partners"
			className="py-20 bg-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="text-center mb-16">
					<h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Współpraca</h2>
					<p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
						Współpracujemy z różnymi organizacjami, instytucjami i firmami, aby realizować nasze
						cele i docierać do jak największej liczby młodych ludzi.
					</p>
				</div>

				{/* Partners Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16 partners-grid">
					{partners.map((partner, index) => (
						<div
							key={partner._id || index}
							className="bg-gray-50 rounded-2xl p-6 lg:p-8 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full partner-tile">
							<div className="text-center flex flex-col h-full partner-content">
								<div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 flex-shrink-0">
									<span className="text-primary-600 font-bold text-lg">
										{partner.logo || partner.name.charAt(0)}
									</span>
								</div>
								<h3 className="text-xl font-bold text-gray-900 mb-2 flex-shrink-0">
									{partner.name}
								</h3>
								<span className="inline-block bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium mb-4 flex-shrink-0">
									{partner.category}
								</span>
								<p className="text-gray-600 leading-relaxed flex-grow partner-description">
									{partner.description}
								</p>
							</div>
						</div>
					))}
				</div>

				{/* Cooperation Types */}
				<div className="bg-gray-50 rounded-3xl p-8 md:p-12 mb-16">
					<div className="text-center mb-12">
						<h3 className="text-3xl font-bold text-gray-900 mb-4">Jak współpracujemy</h3>
						<p className="text-xl text-gray-600">
							Nasza współpraca opiera się na wzajemnym wsparciu i wspólnym dążeniu do celów
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
						{cooperationTypes.map((type, index) => (
							<div
								key={index}
								className="text-center">
								<div className="mb-4 flex justify-center">{type.icon}</div>
								<h4 className="text-lg font-semibold text-gray-900 mb-3">{type.title}</h4>
								<p className="text-gray-600 leading-relaxed">{type.description}</p>
							</div>
						))}
					</div>
				</div>

				{/* How to Start Cooperation */}
				<div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-3xl p-8 md:p-12 text-white">
					<div className="max-w-4xl mx-auto">
						<div className="text-center mb-12">
							<h3 className="text-3xl font-bold mb-4">Chcesz zostać naszym partnerem?</h3>
							<p className="text-xl opacity-90">
								Jesteśmy otwarci na współpracę z organizacjami, które dzielą nasze wartości i chcą
								wspierać rozwój młodych ludzi
							</p>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
							<div>
								<h4 className="text-xl font-bold mb-6 flex items-center gap-3">
									<Building2 size={24} />
									Jak zacząć współpracę
								</h4>
								<div className="space-y-4">
									{howToCooperate.map((step, index) => (
										<div
											key={index}
											className="flex items-start gap-3">
											<div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
												<span className="text-sm font-bold">{index + 1}</span>
											</div>
											<span className="text-white/90">{step}</span>
										</div>
									))}
								</div>
							</div>

							<div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
								<h4 className="text-xl font-bold mb-4 flex items-center gap-3">
									<Heart size={24} />
									Korzyści współpracy
								</h4>
								<ul className="space-y-3 text-white/90">
									<li className="flex items-center gap-2">
										<div className="w-2 h-2 bg-white rounded-full"></div>
										Dostęp do młodych, zaangażowanych ludzi
									</li>
									<li className="flex items-center gap-2">
										<div className="w-2 h-2 bg-white rounded-full"></div>
										Wsparcie w realizacji projektów społecznych
									</li>
									<li className="flex items-center gap-2">
										<div className="w-2 h-2 bg-white rounded-full"></div>
										Możliwość wpływu na rozwój społeczności
									</li>
									<li className="flex items-center gap-2">
										<div className="w-2 h-2 bg-white rounded-full"></div>
										Wymiana doświadczeń i najlepszych praktyk
									</li>
								</ul>
							</div>
						</div>

						<div className="text-center mt-8">
							<button className="bg-white text-primary-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-primary-50 transition-colors duration-300">
								Skontaktuj się z nami
							</button>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Partners;
