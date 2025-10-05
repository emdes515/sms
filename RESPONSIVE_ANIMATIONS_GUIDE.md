# Responsive Animations Guide

## Overview

This guide explains the responsive animation system implemented in the SMS project to ensure optimal
performance and user experience across all devices.

## Key Features

### 1. **Device Detection**

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### 2. **Accessibility Support**

- Respects `prefers-reduced-motion` setting
- Reduces animation intensity for users with motion sensitivity
- Provides fallback animations for accessibility

### 3. **Performance Optimizations**

- Shorter animation durations on mobile devices
- Reduced animation distances for mobile
- Optimized scroll detection margins
- Staggered delays to prevent overwhelming animations

## Animation Components

### ScrollAnimation Component

```typescript
interface ScrollAnimationProps {
	children: React.ReactNode;
	className?: string;
	animation?: 'fadeInUp' | 'fadeInDown' | 'fadeInLeft' | 'fadeInRight' | 'scaleIn' | 'slideInUp';
	delay?: number;
	duration?: number;
	threshold?: number;
	reduceMotion?: boolean;
}
```

**Responsive Features:**

- **Mobile**: Reduced animation distances (30px vs 50px)
- **Duration**: Automatically shortened on mobile (max 0.4s)
- **Delay**: Capped at 0.3s on mobile
- **Margin**: Smaller scroll detection margin (-20px vs -50px)

### AnimatedCounter Component

```typescript
interface AnimatedCounterProps {
	value: number;
	duration?: number;
	delay?: number;
	className?: string;
	prefix?: string;
	suffix?: string;
	reduceMotion?: boolean;
}
```

**Responsive Features:**

- **Mobile**: Shorter duration (max 1.5s vs 2s)
- **Reduced Motion**: Instant display without animation
- **Delay**: Capped at 0.2s on mobile
- **Margin**: Smaller scroll detection margin (-50px vs -100px)

## Usage Examples

### Basic Scroll Animation

```tsx
<ScrollAnimation
	animation="fadeInUp"
	delay={0.2}>
	<div>Your content here</div>
</ScrollAnimation>
```

### Responsive Counter

```tsx
<AnimatedCounter
	value={500}
	suffix="+"
	duration={1.5}
	delay={0.6}
/>
```

### Custom Responsive Configuration

```tsx
const responsiveConfig = {
	mobile: {
		duration: 0.3,
		delay: 0.1,
		threshold: 0.1,
	},
	tablet: {
		duration: 0.5,
		delay: 0.2,
		threshold: 0.1,
	},
	desktop: {
		duration: 0.8,
		delay: 0.3,
		threshold: 0.1,
	},
};
```

## Animation Types

### 1. **fadeInUp** (Default)

- **Desktop**: 50px upward movement
- **Mobile**: 30px upward movement
- **Use case**: General content sections

### 2. **fadeInDown**

- **Desktop**: 50px downward movement
- **Mobile**: 30px downward movement
- **Use case**: Headers, titles

### 3. **fadeInLeft/Right**

- **Desktop**: 50px horizontal movement
- **Mobile**: 30px horizontal movement
- **Use case**: Side content, navigation

### 4. **scaleIn**

- **Desktop**: 0.8 to 1.0 scale
- **Mobile**: 0.9 to 1.0 scale
- **Use case**: Cards, buttons, icons

### 5. **slideInUp**

- **Desktop**: 100px upward movement
- **Mobile**: 50px upward movement
- **Use case**: Large content blocks

## Performance Considerations

### Mobile Optimizations

- Reduced animation distances
- Shorter durations
- Smaller delays
- Optimized scroll detection
- Respect for reduced motion preferences

### Desktop Enhancements

- Full animation distances
- Longer durations for smoothness
- Staggered delays for visual hierarchy
- Enhanced scroll detection

## Accessibility Features

### Reduced Motion Support

```css
@media (prefers-reduced-motion: reduce) {
	/* Animations are automatically reduced or disabled */
}
```

### Keyboard Navigation

- Animations don't interfere with keyboard navigation
- Focus states remain visible
- Screen reader compatibility

## Best Practices

### 1. **Use Appropriate Delays**

```tsx
// Good: Staggered delays for multiple elements
{
	items.map((item, index) => (
		<ScrollAnimation
			key={index}
			delay={0.2 + index * 0.1}>
			{item}
		</ScrollAnimation>
	));
}
```

### 2. **Choose Right Animation Type**

```tsx
// Headers
<ScrollAnimation animation="fadeInDown">

// Content sections
<ScrollAnimation animation="fadeInUp">

// Cards/Buttons
<ScrollAnimation animation="scaleIn">

// Large blocks
<ScrollAnimation animation="slideInUp">
```

### 3. **Responsive Timing**

```tsx
// Mobile-friendly timing
<ScrollAnimation
  delay={0.2}        // Short delay
  duration={0.6}     // Quick animation
>
```

### 4. **Counter Animations**

```tsx
// Responsive counter with appropriate timing
<AnimatedCounter
	value={500}
	duration={1.5} // Shorter on mobile
	delay={0.4} // Reduced delay
	suffix="+"
/>
```

## Testing Checklist

### Mobile (< 768px)

- [ ] Animations are shorter and snappier
- [ ] Reduced motion preferences are respected
- [ ] No performance issues on slower devices
- [ ] Touch interactions work smoothly

### Tablet (768px - 1024px)

- [ ] Balanced animation timing
- [ ] Good performance on mid-range devices
- [ ] Proper scroll detection

### Desktop (> 1024px)

- [ ] Full animation experience
- [ ] Smooth performance
- [ ] Proper visual hierarchy with staggered delays

### Accessibility

- [ ] Reduced motion preferences respected
- [ ] Keyboard navigation unaffected
- [ ] Screen reader compatibility
- [ ] No motion-induced discomfort

## Troubleshooting

### Common Issues

1. **Animations too slow on mobile**

   - Check if duration is properly capped
   - Verify mobile detection is working

2. **Animations not triggering**

   - Check scroll detection margins
   - Verify threshold settings

3. **Performance issues**
   - Reduce animation complexity
   - Check for too many simultaneous animations
   - Verify reduced motion support

### Debug Mode

```tsx
// Add debug logging
<ScrollAnimation
  onAnimationStart={() => console.log('Animation started')}
  onAnimationComplete={() => console.log('Animation completed')}
>
```

## Future Enhancements

- Intersection Observer optimization
- GPU acceleration hints
- Advanced easing functions
- Animation queuing system
- Performance monitoring
