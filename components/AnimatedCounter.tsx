'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface AnimatedCounterProps {
	value: number;
	duration?: number;
	delay?: number;
	className?: string;
	prefix?: string;
	suffix?: string;
	reduceMotion?: boolean;
}

const AnimatedCounter = ({
	value,
	duration = 2,
	delay = 0,
	className = '',
	prefix = '',
	suffix = '',
	reduceMotion = false,
}: AnimatedCounterProps) => {
	const [count, setCount] = useState(0);
	const [isMobile, setIsMobile] = useState(false);
	const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
	const ref = useRef(null);

	// Responsive margin for mobile
	const isInView = useInView(ref, {
		once: true,
		margin: isMobile ? '-50px' : '-100px',
	});

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

	useEffect(() => {
		if (isInView) {
			// Skip animation if reduced motion is preferred
			if (prefersReducedMotion || reduceMotion) {
				setCount(value);
				return;
			}

			const startTime = Date.now();
			const startValue = 0;
			const endValue = value;

			// Adjust duration for mobile
			const responsiveDuration = isMobile ? Math.min(duration, 1.5) : duration;

			const animate = () => {
				const elapsed = Date.now() - startTime;
				const progress = Math.min(elapsed / (responsiveDuration * 1000), 1);

				// Easing function for smooth animation
				const easeOutCubic = 1 - Math.pow(1 - progress, 3);
				const currentValue = Math.floor(startValue + (endValue - startValue) * easeOutCubic);

				setCount(currentValue);

				if (progress < 1) {
					requestAnimationFrame(animate);
				} else {
					setCount(endValue);
				}
			};

			// Adjust delay for mobile
			const responsiveDelay = isMobile ? Math.min(delay, 0.2) : delay;

			const timeoutId = setTimeout(() => {
				requestAnimationFrame(animate);
			}, responsiveDelay * 1000);

			return () => clearTimeout(timeoutId);
		}
	}, [isInView, value, duration, delay, isMobile, prefersReducedMotion, reduceMotion]);

	// Responsive animation properties
	const getAnimationProps = () => {
		if (prefersReducedMotion || reduceMotion) {
			return {
				initial: { opacity: 0 },
				animate: isInView ? { opacity: 1 } : { opacity: 0 },
				transition: { duration: 0.1 },
			};
		}

		return {
			initial: { opacity: 0, y: isMobile ? 10 : 20 },
			animate: isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: isMobile ? 10 : 20 },
			transition: {
				duration: isMobile ? 0.4 : 0.6,
				delay: isMobile ? Math.min(delay, 0.2) : delay,
			},
		};
	};

	return (
		<motion.span
			ref={ref}
			className={className}
			{...getAnimationProps()}>
			{prefix}
			{count}
			{suffix}
		</motion.span>
	);
};

export default AnimatedCounter;
