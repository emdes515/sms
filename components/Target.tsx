'use client';

import { useState, useEffect } from 'react';
import { User, GraduationCap, Briefcase, Heart, Star, CheckCircle, ArrowRight } from 'lucide-react';
import { TargetData } from '@/lib/models/PageData';

const Target = () => {
	const [targetData, setTargetData] = useState<TargetData | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchTargetData();
	}, []);

	const fetchTargetData = async () => {
		try {
			const response = await fetch('/api/public/target');
			const data = await response.json();

			if (data.targetData) {
				setTargetData(data.targetData);
			} else {
				// Fallback do domyślnych danych
				setTargetData({
					_id: 'default',
					title: 'Dla kogo',
					description:
						'Nasze stowarzyszenie jest otwarte dla wszystkich młodych ludzi, którzy chcą się rozwijać, pomagać innym i budować lepszą przyszłość.',
					targetGroups: [
						{
							title: 'Uczniowie szkół średnich',
							description:
								'Rozwijaj swoje pasje, zdobywaj nowe umiejętności i buduj CV już w szkole',
							icon: 'GraduationCap',
							benefits: [
								'Warsztaty rozwoju osobistego',
								'Mentoring od starszych kolegów',
								'Certyfikaty uczestnictwa',
								'Możliwość realizacji własnych projektów',
							],
						},
						{
							title: 'Studenci',
							description: 'Praktyczne doświadczenie, networking i rozwój kompetencji zawodowych',
							icon: 'User',
							benefits: [
								'Projekty z prawdziwymi organizacjami',
								'Kontakty w branży',
								'Warsztaty umiejętności miękkich',
								'Możliwość prowadzenia własnych inicjatyw',
							],
						},
						{
							title: 'Młodzi profesjonaliści',
							description: 'Rozwijaj się zawodowo, dziel się wiedzą i buduj swoją markę osobistą',
							icon: 'Briefcase',
							benefits: [
								'Mentoring młodszych członków',
								'Warsztaty leadership',
								'Networking z innymi profesjonalistami',
								'Możliwość wpływania na strategię organizacji',
							],
						},
						{
							title: 'Wolontariusze',
							description:
								'Pomagaj innym, rozwijaj empatię i zdobywaj doświadczenie w pracy społecznej',
							icon: 'Heart',
							benefits: [
								'Różnorodne projekty społeczne',
								'Szkolenia z zakresu pomocy',
								'Certyfikaty wolontariatu',
								'Możliwość wyjazdów i wymian',
							],
						},
					],
					generalBenefits: [
						{
							title: 'Rozwój osobisty',
							description:
								'Warsztaty, szkolenia i mentoring pomagają w rozwoju umiejętności miękkich',
							icon: 'Star',
						},
						{
							title: 'Praktyczne doświadczenie',
							description: 'Realne projekty i zadania, które wyglądają dobrze w CV',
							icon: 'CheckCircle',
						},
						{
							title: 'Wpływ na społeczność',
							description: 'Możliwość pozytywnego wpływu na lokalną społeczność',
							icon: 'Heart',
						},
						{
							title: 'Nowe znajomości',
							description: 'Poznaj ludzi o podobnych zainteresowaniach i celach',
							icon: 'User',
						},
					],
					cta: {
						title: 'Gotowy na nową przygodę?',
						description:
							'Dołącz do naszej społeczności i zacznij realizować swoje marzenia już dziś!',
						primaryButton: 'Dołącz teraz',
						secondaryButton: 'Dowiedz się więcej',
					},
					createdAt: new Date(),
					updatedAt: new Date(),
				});
			}
		} catch (error) {
			console.error('Error fetching target data:', error);
			// Fallback do domyślnych danych w przypadku błędu
			setTargetData({
				_id: 'default',
				title: 'Dla kogo',
				description:
					'Nasze stowarzyszenie jest otwarte dla wszystkich młodych ludzi, którzy chcą się rozwijać, pomagać innym i budować lepszą przyszłość.',
				targetGroups: [
					{
						title: 'Uczniowie szkół średnich',
						description: 'Rozwijaj swoje pasje, zdobywaj nowe umiejętności i buduj CV już w szkole',
						icon: 'GraduationCap',
						benefits: [
							'Warsztaty rozwoju osobistego',
							'Mentoring od starszych kolegów',
							'Certyfikaty uczestnictwa',
							'Możliwość realizacji własnych projektów',
						],
					},
					{
						title: 'Studenci',
						description: 'Praktyczne doświadczenie, networking i rozwój kompetencji zawodowych',
						icon: 'User',
						benefits: [
							'Projekty z prawdziwymi organizacjami',
							'Kontakty w branży',
							'Warsztaty umiejętności miękkich',
							'Możliwość prowadzenia własnych inicjatyw',
						],
					},
					{
						title: 'Młodzi profesjonaliści',
						description: 'Rozwijaj się zawodowo, dziel się wiedzą i buduj swoją markę osobistą',
						icon: 'Briefcase',
						benefits: [
							'Mentoring młodszych członków',
							'Warsztaty leadership',
							'Networking z innymi profesjonalistami',
							'Możliwość wpływania na strategię organizacji',
						],
					},
					{
						title: 'Wolontariusze',
						description:
							'Pomagaj innym, rozwijaj empatię i zdobywaj doświadczenie w pracy społecznej',
						icon: 'Heart',
						benefits: [
							'Różnorodne projekty społeczne',
							'Szkolenia z zakresu pomocy',
							'Certyfikaty wolontariatu',
							'Możliwość wyjazdów i wymian',
						],
					},
				],
				generalBenefits: [
					{
						title: 'Rozwój osobisty',
						description:
							'Warsztaty, szkolenia i mentoring pomagają w rozwoju umiejętności miękkich',
						icon: 'Star',
					},
					{
						title: 'Praktyczne doświadczenie',
						description: 'Realne projekty i zadania, które wyglądają dobrze w CV',
						icon: 'CheckCircle',
					},
					{
						title: 'Wpływ na społeczność',
						description: 'Możliwość pozytywnego wpływu na lokalną społeczność',
						icon: 'Heart',
					},
					{
						title: 'Nowe znajomości',
						description: 'Poznaj ludzi o podobnych zainteresowaniach i celach',
						icon: 'User',
					},
				],
				cta: {
					title: 'Gotowy na nową przygodę?',
					description:
						'Dołącz do naszej społeczności i zacznij realizować swoje marzenia już dziś!',
					primaryButton: 'Dołącz teraz',
					secondaryButton: 'Dowiedz się więcej',
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
			User,
			GraduationCap,
			Briefcase,
			Heart,
			Star,
			CheckCircle,
		};
		const IconComponent = iconMap[iconName] || User;
		return (
			<IconComponent
				className="text-primary-600"
				size={40}
			/>
		);
	};

	const getGeneralBenefitIcon = (iconName: string) => {
		const iconMap: { [key: string]: any } = {
			Star,
			CheckCircle,
			Heart,
			User,
		};
		const IconComponent = iconMap[iconName] || Star;
		return (
			<IconComponent
				className="text-yellow-500"
				size={24}
			/>
		);
	};

	if (loading) {
		return (
			<section
				id="target"
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

	if (!targetData) {
		return null;
	}

	return (
		<section
			id="target"
			className="py-20 bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="text-center mb-16">
					<h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">{targetData.title}</h2>
					<p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
						{targetData.description}
					</p>
				</div>

				{/* Target Groups */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
					{targetData.targetGroups.map((group, index) => (
						<div
							key={index}
							className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
							<div className="flex items-start gap-4 mb-6">
								<div className="flex-shrink-0">{getIconComponent(group.icon)}</div>
								<div>
									<h3 className="text-2xl font-bold text-gray-900 mb-3">{group.title}</h3>
									<p className="text-gray-600 leading-relaxed">{group.description}</p>
								</div>
							</div>

							<div className="space-y-3">
								<h4 className="font-semibold text-gray-900 mb-3">Korzyści:</h4>
								{group.benefits.map((benefit, benefitIndex) => (
									<div
										key={benefitIndex}
										className="flex items-center gap-3">
										<CheckCircle
											className="text-green-500 flex-shrink-0"
											size={20}
										/>
										<span className="text-gray-700">{benefit}</span>
									</div>
								))}
							</div>
						</div>
					))}
				</div>

				{/* General Benefits */}
				<div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-16">
					<div className="text-center mb-12">
						<h3 className="text-3xl font-bold text-gray-900 mb-4">
							Dlaczego warto do nas dołączyć?
						</h3>
						<p className="text-xl text-gray-600">
							Niezależnie od tego, kim jesteś, znajdziesz u nas miejsce do rozwoju i realizacji
							swoich celów
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
						{targetData.generalBenefits.map((benefit, index) => (
							<div
								key={index}
								className="text-center">
								<div className="mb-4 flex justify-center">
									{getGeneralBenefitIcon(benefit.icon)}
								</div>
								<h4 className="text-lg font-semibold text-gray-900 mb-3">{benefit.title}</h4>
								<p className="text-gray-600 leading-relaxed">{benefit.description}</p>
							</div>
						))}
					</div>
				</div>

				{/* CTA Section */}
				<div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-3xl p-8 md:p-12 text-white text-center">
					<h3 className="text-3xl font-bold mb-4">{targetData.cta.title}</h3>
					<p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">{targetData.cta.description}</p>

					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<button className="bg-white text-primary-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-primary-50 transition-colors duration-300 flex items-center gap-2 justify-center">
							{targetData.cta.primaryButton}
							<ArrowRight size={20} />
						</button>
						<button className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-primary-600 transition-colors duration-300">
							{targetData.cta.secondaryButton}
						</button>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Target;
