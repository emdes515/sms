'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Home, Users, Briefcase, Target, Users2, Mail } from 'lucide-react';

interface MobileNavigationProps {
	isOpen: boolean;
	onClose: () => void;
}

const MobileNavigation = ({ isOpen, onClose }: MobileNavigationProps) => {
	const [isMobile, setIsMobile] = useState(true);

	const navItems = [
		{ name: 'Strona główna', href: '#hero', icon: Home },
		{ name: 'O nas', href: '#about', icon: Users },
		{ name: 'Nasze działania', href: '#projects', icon: Briefcase },
		{ name: 'Dla kogo', href: '#target', icon: Target },
		{ name: 'Współpraca', href: '#partners', icon: Users2 },
		{ name: 'Kontakt', href: '#contact', icon: Mail },
	];

	// For tablet view, show remaining items
	const remainingItems = navItems.slice(3);

	useEffect(() => {
		const checkScreenSize = () => {
			setIsMobile(window.innerWidth < 768);
		};

		checkScreenSize();
		window.addEventListener('resize', checkScreenSize);

		return () => window.removeEventListener('resize', checkScreenSize);
	}, []);

	const scrollToSection = (href: string) => {
		const element = document.querySelector(href);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
		}
		onClose();
	};

	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'unset';
		}

		return () => {
			document.body.style.overflow = 'unset';
		};
	}, [isOpen]);

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					{/* Backdrop */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
						className="fixed inset-0 bg-black/50 z-40"
						onClick={onClose}
					/>

					{/* Mobile Menu */}
					<motion.div
						initial={{ opacity: 0, x: '100%' }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: '100%' }}
						transition={{ duration: 0.3, ease: 'easeInOut' }}
						className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-50">
						{/* Header */}
						<div className="flex items-center justify-between p-6 border-b border-gray-200">
							<div className="flex items-center space-x-3">
								<img
									src="/imgs/sms_logo.png"
									alt="Młoda Siła"
									className="h-8 w-auto"
								/>
								<span className="text-lg font-semibold text-gray-900">Młoda Siła</span>
							</div>
							<button
								onClick={onClose}
								className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
								aria-label="Zamknij menu">
								<X size={24} />
							</button>
						</div>

						{/* Navigation Items */}
						<div className="p-4 md:p-6 space-y-2">
							{/* Show all items on mobile, remaining items on tablet */}
							{(isMobile ? navItems : remainingItems).map((item, index) => {
								const Icon = item.icon;
								return (
									<motion.button
										key={item.name}
										initial={{ opacity: 0, x: 20 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: index * 0.1 }}
										onClick={() => scrollToSection(item.href)}
										className="flex items-center space-x-3 w-full text-left px-3 md:px-4 py-2 md:py-3 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200 group">
										<Icon
											size={18}
											className="text-gray-500 group-hover:text-primary-600 transition-colors md:w-5 md:h-5"
										/>
										<span className="text-sm md:text-base text-gray-700 group-hover:text-primary-600 font-medium">
											{item.name}
										</span>
									</motion.button>
								);
							})}
						</div>

						{/* Footer */}
						<div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200">
							<div className="text-center">
								<p className="text-sm text-gray-500">Stowarzyszenie Młoda Siła</p>
								<p className="text-xs text-gray-400 mt-1">Razem budujemy przyszłość</p>
							</div>
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
};

export default MobileNavigation;
