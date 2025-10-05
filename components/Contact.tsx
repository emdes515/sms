'use client';

import { useState, useEffect } from 'react';
import {
	Mail,
	Phone,
	MapPin,
	Clock,
	Send,
	Facebook,
	Instagram,
	Linkedin,
	Youtube,
} from 'lucide-react';
import { ContactData } from '@/lib/models/PageData';

const Contact = () => {
	const [contactData, setContactData] = useState<ContactData | null>(null);
	const [loading, setLoading] = useState(true);
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		subject: '',
		message: '',
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

	useEffect(() => {
		fetchContactData();
	}, []);

	const fetchContactData = async () => {
		try {
			const response = await fetch('/api/public/contact');
			const data = await response.json();

			if (data.contactData) {
				setContactData(data.contactData);
			} else {
				// Fallback do domyślnych danych
				setContactData({
					_id: 'default',
					title: 'Kontakt',
					description:
						'Masz pytania? Chcesz dołączyć do nas? A może masz pomysł na współpracę? Skontaktuj się z nami - chętnie porozmawiamy!',
					contactInfo: {
						email: ['kontakt@mlodasila.pl', 'info@mlodasila.pl'],
						phone: ['+48 123 456 789', '+48 987 654 321'],
						address: ['ul. Młodych 15', '00-001 Warszawa'],
						hours: ['Pon-Pt: 9:00-17:00', 'Sob: 10:00-14:00'],
					},
					socialMedia: [
						{ name: 'Facebook', url: '#', icon: 'Facebook' },
						{ name: 'Instagram', url: '#', icon: 'Instagram' },
						{ name: 'LinkedIn', url: '#', icon: 'Linkedin' },
						{ name: 'YouTube', url: '#', icon: 'Youtube' },
					],
					newsletter: {
						title: 'Newsletter',
						description: 'Bądź na bieżąco z naszymi działaniami i nadchodzącymi wydarzeniami',
					},
					createdAt: new Date(),
					updatedAt: new Date(),
				});
			}
		} catch (error) {
			console.error('Error fetching contact data:', error);
			// Fallback do domyślnych danych w przypadku błędu
			setContactData({
				_id: 'default',
				title: 'Kontakt',
				description:
					'Masz pytania? Chcesz dołączyć do nas? A może masz pomysł na współpracę? Skontaktuj się z nami - chętnie porozmawiamy!',
				contactInfo: {
					email: ['kontakt@mlodasila.pl', 'info@mlodasila.pl'],
					phone: ['+48 123 456 789', '+48 987 654 321'],
					address: ['ul. Młodych 15', '00-001 Warszawa'],
					hours: ['Pon-Pt: 9:00-17:00', 'Sob: 10:00-14:00'],
				},
				socialMedia: [
					{ name: 'Facebook', url: '#', icon: 'Facebook' },
					{ name: 'Instagram', url: '#', icon: 'Instagram' },
					{ name: 'LinkedIn', url: '#', icon: 'Linkedin' },
					{ name: 'YouTube', url: '#', icon: 'Youtube' },
				],
				newsletter: {
					title: 'Newsletter',
					description: 'Bądź na bieżąco z naszymi działaniami i nadchodzącymi wydarzeniami',
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
			Facebook,
			Instagram,
			Linkedin,
			Youtube,
		};
		const IconComponent = iconMap[iconName] || Facebook;
		return <IconComponent size={24} />;
	};

	if (loading) {
		return (
			<section
				id="contact"
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

	if (!contactData) {
		return null;
	}

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		// Simulate form submission
		setTimeout(() => {
			setIsSubmitting(false);
			setSubmitStatus('success');
			setFormData({ name: '', email: '', subject: '', message: '' });

			// Reset status after 3 seconds
			setTimeout(() => setSubmitStatus('idle'), 3000);
		}, 1000);
	};

	const contactInfo = [
		{
			icon: (
				<Mail
					className="text-primary-600"
					size={24}
				/>
			),
			title: 'Email',
			details: contactData.contactInfo.email,
			description: 'Napisz do nas w każdej sprawie',
		},
		{
			icon: (
				<Phone
					className="text-primary-600"
					size={24}
				/>
			),
			title: 'Telefon',
			details: contactData.contactInfo.phone,
			description: 'Zadzwoń w godzinach 9:00-17:00',
		},
		{
			icon: (
				<MapPin
					className="text-primary-600"
					size={24}
				/>
			),
			title: 'Adres',
			details: contactData.contactInfo.address,
			description: 'Odwiedź nas w biurze',
		},
		{
			icon: (
				<Clock
					className="text-primary-600"
					size={24}
				/>
			),
			title: 'Godziny pracy',
			details: contactData.contactInfo.hours,
			description: 'Jesteśmy dostępni dla Ciebie',
		},
	];

	const socialMedia = contactData.socialMedia.map((social) => ({
		name: social.name,
		icon: getIconComponent(social.icon),
		url: social.url,
		color:
			social.name === 'Facebook'
				? 'hover:text-blue-600'
				: social.name === 'Instagram'
				? 'hover:text-pink-600'
				: social.name === 'LinkedIn'
				? 'hover:text-blue-700'
				: 'hover:text-red-600',
	}));

	return (
		<section
			id="contact"
			className="py-20 bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="text-center mb-16">
					<h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">{contactData.title}</h2>
					<p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
						{contactData.description}
					</p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
					{/* Contact Form */}
					<div className="bg-white rounded-3xl shadow-xl p-8">
						<h3 className="text-2xl font-bold text-gray-900 mb-6">Napisz do nas</h3>

						<form
							onSubmit={handleSubmit}
							className="space-y-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<label
										htmlFor="name"
										className="block text-sm font-medium text-gray-700 mb-2">
										Imię i nazwisko *
									</label>
									<input
										type="text"
										id="name"
										name="name"
										value={formData.name}
										onChange={handleInputChange}
										required
										className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
										placeholder="Twoje imię i nazwisko"
									/>
								</div>

								<div>
									<label
										htmlFor="email"
										className="block text-sm font-medium text-gray-700 mb-2">
										Email *
									</label>
									<input
										type="email"
										id="email"
										name="email"
										value={formData.email}
										onChange={handleInputChange}
										required
										className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
										placeholder="twoj@email.pl"
									/>
								</div>
							</div>

							<div>
								<label
									htmlFor="subject"
									className="block text-sm font-medium text-gray-700 mb-2">
									Temat *
								</label>
								<select
									id="subject"
									name="subject"
									value={formData.subject}
									onChange={handleInputChange}
									required
									className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors">
									<option value="">Wybierz temat</option>
									<option value="membership">Chcę dołączyć do stowarzyszenia</option>
									<option value="volunteer">Chcę zostać wolontariuszem</option>
									<option value="cooperation">Propozycja współpracy</option>
									<option value="project">Pomysł na projekt</option>
									<option value="question">Pytanie ogólne</option>
									<option value="other">Inne</option>
								</select>
							</div>

							<div>
								<label
									htmlFor="message"
									className="block text-sm font-medium text-gray-700 mb-2">
									Wiadomość *
								</label>
								<textarea
									id="message"
									name="message"
									value={formData.message}
									onChange={handleInputChange}
									required
									rows={6}
									className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none"
									placeholder="Opisz swoją sprawę, pytanie lub pomysł..."
								/>
							</div>

							<button
								type="submit"
								disabled={isSubmitting}
								className="w-full bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 flex items-center justify-center gap-2">
								{isSubmitting ? (
									<>
										<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
										Wysyłanie...
									</>
								) : (
									<>
										Wyślij wiadomość
										<Send size={20} />
									</>
								)}
							</button>

							{submitStatus === 'success' && (
								<div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
									Dziękujemy! Twoja wiadomość została wysłana. Odpowiemy w ciągu 24 godzin.
								</div>
							)}

							{submitStatus === 'error' && (
								<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
									Wystąpił błąd podczas wysyłania wiadomości. Spróbuj ponownie.
								</div>
							)}
						</form>
					</div>

					{/* Contact Information */}
					<div className="space-y-8">
						{/* Contact Details */}
						<div className="bg-white rounded-3xl shadow-xl p-8">
							<h3 className="text-2xl font-bold text-gray-900 mb-6">Dane kontaktowe</h3>

							<div className="space-y-6">
								{contactInfo.map((info, index) => (
									<div
										key={index}
										className="flex items-start gap-4">
										<div className="flex-shrink-0">{info.icon}</div>
										<div>
											<h4 className="font-semibold text-gray-900 mb-2">{info.title}</h4>
											<div className="space-y-1">
												{info.details.map((detail, detailIndex) => (
													<div
														key={detailIndex}
														className="text-gray-600">
														{detail}
													</div>
												))}
											</div>
											<p className="text-sm text-gray-500 mt-2">{info.description}</p>
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Social Media */}
						<div className="bg-white rounded-3xl shadow-xl p-8">
							<h3 className="text-2xl font-bold text-gray-900 mb-6">Śledź nas</h3>

							<div className="grid grid-cols-2 gap-4">
								{socialMedia.map((social, index) => (
									<a
										key={index}
										href={social.url}
										className={`flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all duration-300 ${social.color}`}>
										{social.icon}
										<span className="font-medium">{social.name}</span>
									</a>
								))}
							</div>
						</div>

						{/* Newsletter */}
						<div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-3xl p-8 text-white">
							<h3 className="text-2xl font-bold mb-4">{contactData.newsletter.title}</h3>
							<p className="mb-6 opacity-90">{contactData.newsletter.description}</p>

							<div className="flex gap-3">
								<input
									type="email"
									placeholder="Twój email"
									className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
								/>
								<button className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors duration-300">
									Zapisz się
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Contact;
