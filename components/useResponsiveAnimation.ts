'use client';

import { useState, useEffect } from 'react';

interface ResponsiveAnimationConfig {
	mobile?: {
		duration?: number;
		delay?: number;
		threshold?: number;
	};
	tablet?: {
		duration?: number;
		delay?: number;
		threshold?: number;
	};
	desktop?: {
		duration?: number;
		delay?: number;
		threshold?: number;
	};
}

export const useResponsiveAnimation = (config: ResponsiveAnimationConfig = {}) => {
	const [isMobile, setIsMobile] = useState(false);
	const [isTablet, setIsTablet] = useState(false);
	const [isDesktop, setIsDesktop] = useState(false);
	const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

	useEffect(() => {
		const checkDevice = () => {
			const width = window.innerWidth;
			setIsMobile(width < 768);
			setIsTablet(width >= 768 && width < 1024);
			setIsDesktop(width >= 1024);
		};

		const checkReducedMotion = () => {
			setPrefersReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
		};

		checkDevice();
		checkReducedMotion();

		window.addEventListener('resize', checkDevice);
		const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
		mediaQuery.addEventListener('change', checkReducedMotion);

		return () => {
			window.removeEventListener('resize', checkDevice);
			mediaQuery.removeEventListener('change', checkReducedMotion);
		};
	}, []);

	const getResponsiveConfig = () => {
		if (prefersReducedMotion) {
			return {
				duration: 0.1,
				delay: 0,
				threshold: 0.1,
			};
		}

		if (isMobile && config.mobile) {
			return {
				duration: config.mobile.duration || 0.4,
				delay: config.mobile.delay || 0.1,
				threshold: config.mobile.threshold || 0.1,
			};
		}

		if (isTablet && config.tablet) {
			return {
				duration: config.tablet.duration || 0.6,
				delay: config.tablet.delay || 0.2,
				threshold: config.tablet.threshold || 0.1,
			};
		}

		if (isDesktop && config.desktop) {
			return {
				duration: config.desktop.duration || 0.8,
				delay: config.desktop.delay || 0.3,
				threshold: config.desktop.threshold || 0.1,
			};
		}

		// Default fallback
		return {
			duration: 0.6,
			delay: 0.2,
			threshold: 0.1,
		};
	};

	return {
		isMobile,
		isTablet,
		isDesktop,
		prefersReducedMotion,
		config: getResponsiveConfig(),
	};
};
