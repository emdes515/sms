'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

interface ScrollAnimationProps {
	children: React.ReactNode;
	className?: string;
	animation?: 'fadeInUp' | 'fadeInDown' | 'fadeInLeft' | 'fadeInRight' | 'scaleIn' | 'slideInUp';
	delay?: number;
	duration?: number;
	threshold?: number;
	reduceMotion?: boolean;
}

const animationVariants = {
	fadeInUp: {
		hidden: { opacity: 0, y: 50 },
		visible: { opacity: 1, y: 0 },
	},
	fadeInDown: {
		hidden: { opacity: 0, y: -50 },
		visible: { opacity: 1, y: 0 },
	},
	fadeInLeft: {
		hidden: { opacity: 0, x: -50 },
		visible: { opacity: 1, x: 0 },
	},
	fadeInRight: {
		hidden: { opacity: 0, x: 50 },
		visible: { opacity: 1, x: 0 },
	},
	scaleIn: {
		hidden: { opacity: 0, scale: 0.8 },
		visible: { opacity: 1, scale: 1 },
	},
	slideInUp: {
		hidden: { opacity: 0, y: 100 },
		visible: { opacity: 1, y: 0 },
	},
};

// Responsive animation variants for mobile
const mobileAnimationVariants = {
	fadeInUp: {
		hidden: { opacity: 0, y: 30 },
		visible: { opacity: 1, y: 0 },
	},
	fadeInDown: {
		hidden: { opacity: 0, y: -30 },
		visible: { opacity: 1, y: 0 },
	},
	fadeInLeft: {
		hidden: { opacity: 0, x: -30 },
		visible: { opacity: 1, x: 0 },
	},
	fadeInRight: {
		hidden: { opacity: 0, x: 30 },
		visible: { opacity: 1, x: 0 },
	},
	scaleIn: {
		hidden: { opacity: 0, scale: 0.9 },
		visible: { opacity: 1, scale: 1 },
	},
	slideInUp: {
		hidden: { opacity: 0, y: 50 },
		visible: { opacity: 1, y: 0 },
	},
};

const ScrollAnimation = ({
	children,
	className = '',
	animation = 'fadeInUp',
	delay = 0,
	duration = 0.6,
	threshold = 0.1,
	reduceMotion = false,
}: ScrollAnimationProps) => {
	const ref = useRef(null);
	const [isMobile, setIsMobile] = useState(false);
	const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

	// Check for mobile device and reduced motion preference
	useEffect(() => {
		const checkDevice = () => {
			setIsMobile(window.innerWidth < 768);
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

	const isInView = useInView(ref, {
		once: true,
		margin: isMobile ? '-20px' : '-50px',
		amount: threshold,
	});

	// Use appropriate animation variants based on device and preferences
	const getAnimationVariants = () => {
		if (prefersReducedMotion || reduceMotion) {
			return {
				hidden: { opacity: 0 },
				visible: { opacity: 1 },
			};
		}
		return isMobile ? mobileAnimationVariants[animation] : animationVariants[animation];
	};

	// Adjust duration and delay for mobile
	const getResponsiveDuration = () => {
		if (prefersReducedMotion || reduceMotion) return 0.1;
		return isMobile ? Math.min(duration, 0.4) : duration;
	};

	const getResponsiveDelay = () => {
		if (prefersReducedMotion || reduceMotion) return 0;
		return isMobile ? Math.min(delay, 0.3) : delay;
	};

	return (
		<motion.div
			ref={ref}
			className={className}
			variants={getAnimationVariants()}
			initial="hidden"
			animate={isInView ? 'visible' : 'hidden'}
			transition={{
				duration: getResponsiveDuration(),
				delay: getResponsiveDelay(),
				ease: 'easeOut',
			}}>
			{children}
		</motion.div>
	);
};

export default ScrollAnimation;
