'use client';

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';
import MobileNavigation from './MobileNavigation';

const Navigation = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 50);
		};
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	// Close mobile menu on escape key
	useEffect(() => {
		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === 'Escape' && isOpen) {
				setIsOpen(false);
			}
		};

		document.addEventListener('keydown', handleEscape);
		return () => document.removeEventListener('keydown', handleEscape);
	}, [isOpen]);

	const navItems = [
		{ name: 'O nas', href: '#about' },
		{ name: 'Nasze działania', href: '#projects' },
		{ name: 'Dla kogo', href: '#target' },
		{ name: 'Współpraca', href: '#partners' },
		{ name: 'Kontakt', href: '#contact' },
	];

	const scrollToSection = (href: string) => {
		const element = document.querySelector(href);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
		}
		setIsOpen(false);
	};

	return (
		<>
			<nav
				className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
					scrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-md'
				}`}>
				<div className="max-w-7xl mx-auto px-1 xs:px-2 sm:px-4 md:px-6 lg:px-8">
					<div className="flex justify-between items-center h-14 xs:h-16 w-full gap-1 xs:gap-2">
						{/* Logo */}
						<div className="flex-shrink-0 flex items-center min-w-0 flex-1">
							<a
								href="#hero"
								onClick={() => scrollToSection('#hero')}
								className="flex items-center">
								<img
									src="/imgs/sms_logo.png"
									alt="Młoda Siła"
									className="h-5 xs:h-6 sm:h-7 md:h-8 lg:h-10 w-auto max-w-[60px] xs:max-w-[80px] sm:max-w-[100px] md:max-w-[120px] lg:max-w-none nav-logo"
								/>
							</a>
						</div>

						{/* Desktop Navigation */}
						<div className="hidden lg:block">
							<div className="ml-6 xl:ml-10 flex items-baseline space-x-4 xl:space-x-8">
								{navItems.map((item) => (
									<button
										key={item.name}
										onClick={() => scrollToSection(item.href)}
										className="text-gray-700 hover:text-primary-600 px-2 xl:px-3 py-2 text-xs xl:text-sm font-medium transition-colors duration-200 whitespace-nowrap">
										{item.name}
									</button>
								))}
							</div>
						</div>

						{/* Tablet Navigation - condensed */}
						<div className="hidden md:block lg:hidden">
							<div className="ml-4 flex items-baseline space-x-2">
								{navItems.slice(0, 3).map((item) => (
									<button
										key={item.name}
										onClick={() => scrollToSection(item.href)}
										className="text-gray-700 hover:text-primary-600 px-2 py-2 text-xs font-medium transition-colors duration-200 whitespace-nowrap">
										{item.name}
									</button>
								))}
								<button
									onClick={() => setIsOpen(!isOpen)}
									className="text-gray-700 hover:text-primary-600 px-2 py-2 text-xs font-medium transition-colors duration-200">
									Więcej
								</button>
							</div>
						</div>

						{/* Mobile menu button */}
						<div className="md:hidden flex items-center flex-shrink-0">
							<button
								onClick={() => setIsOpen(!isOpen)}
								className="text-gray-700 hover:text-primary-600 p-1 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 bg-white/80 backdrop-blur-sm border border-gray-200 w-[32px] h-[32px] xs:w-[36px] xs:h-[36px] flex items-center justify-center mobile-menu-button"
								aria-label={isOpen ? 'Zamknij menu' : 'Otwórz menu'}>
								<motion.div
									animate={{ rotate: isOpen ? 180 : 0 }}
									transition={{ duration: 0.2 }}>
									{isOpen ? (
										<X
											size={16}
											className="xs:w-5 xs:h-5"
										/>
									) : (
										<Menu
											size={16}
											className="xs:w-5 xs:h-5"
										/>
									)}
								</motion.div>
							</button>
						</div>
					</div>
				</div>
			</nav>

			{/* Mobile Navigation */}
			<MobileNavigation
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
			/>
		</>
	);
};

export default Navigation;
