# Mobile Navigation Guide

## Overview

This guide explains the mobile navigation system implemented in the SMS project, including the
hamburger menu and responsive design improvements.

## Key Features

### 1. **Hamburger Menu**

- Animated hamburger icon that rotates when opened
- Smooth slide-in animation from the right
- Backdrop overlay with click-to-close functionality
- Keyboard navigation support (Escape key to close)

### 2. **Mobile-First Design**

- Fixed navbar that doesn't cover hero content
- Responsive text sizing for mobile devices
- Touch-friendly navigation items
- Proper spacing and padding for mobile

### 3. **Accessibility Features**

- ARIA labels for screen readers
- Keyboard navigation support
- Focus management
- High contrast support

## Components

### Navigation Component

The main navigation component with:

- Fixed positioning with backdrop blur
- Scroll-based background changes
- Desktop and mobile navigation
- Logo and brand positioning

### MobileNavigation Component

Dedicated mobile navigation with:

- Slide-in animation from right
- Icon-based navigation items
- Brand header with logo
- Footer with organization info

## Mobile Navigation Features

### 1. **Animated Hamburger Menu**

```tsx
<motion.div
	animate={{ rotate: isOpen ? 180 : 0 }}
	transition={{ duration: 0.2 }}>
	{isOpen ? <X size={24} /> : <Menu size={24} />}
</motion.div>
```

### 2. **Slide-in Animation**

```tsx
<motion.div
  initial={{ opacity: 0, x: '100%' }}
  animate={{ opacity: 1, x: 0 }}
  exit={{ opacity: 0, x: '100%' }}
  transition={{ duration: 0.3, ease: 'easeInOut' }}>
```

### 3. **Staggered Menu Items**

```tsx
<motion.button
  initial={{ opacity: 0, x: 20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ delay: index * 0.1 }}>
```

## Responsive Design

### Mobile (< 768px)

- **Navbar**: Fixed at top with `pt-16` padding on hero
- **Text**: Smaller sizes (`text-3xl` vs `text-4xl`)
- **Menu**: Full-screen slide-in from right
- **Touch**: Large touch targets (48px minimum)

### Tablet (768px - 1024px)

- **Navbar**: Standard desktop navigation
- **Text**: Medium sizes (`text-4xl` to `text-6xl`)
- **Menu**: Hidden (desktop navigation shown)

### Desktop (> 1024px)

- **Navbar**: Full desktop navigation
- **Text**: Large sizes (`text-6xl` to `text-7xl`)
- **Menu**: Hidden (desktop navigation shown)

## Hero Section Improvements

### Mobile Padding

```tsx
<section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 md:pt-0">
```

### Responsive Text Sizing

```tsx
<h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
```

### Responsive Subtitle

```tsx
<p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
```

## Navigation Items

### Desktop Navigation

- Horizontal layout
- Hover effects
- Smooth transitions
- Active state indicators

### Mobile Navigation

- Vertical layout with icons
- Touch-friendly buttons
- Smooth animations
- Brand header

## Animation Details

### 1. **Hamburger Icon Animation**

- **Duration**: 0.2s
- **Easing**: Default
- **Rotation**: 0° to 180°
- **Icon Change**: Menu ↔ X

### 2. **Menu Slide Animation**

- **Duration**: 0.3s
- **Easing**: easeInOut
- **Direction**: Right to left
- **Width**: 320px (max 85vw)

### 3. **Menu Items Animation**

- **Duration**: 0.1s per item
- **Delay**: Staggered (index \* 0.1s)
- **Direction**: Right to left
- **Opacity**: 0 to 1

## Accessibility Features

### 1. **Keyboard Navigation**

```tsx
useEffect(() => {
	const handleEscape = (event: KeyboardEvent) => {
		if (event.key === 'Escape' && isOpen) {
			setIsOpen(false);
		}
	};
	document.addEventListener('keydown', handleEscape);
	return () => document.removeEventListener('keydown', handleEscape);
}, [isOpen]);
```

### 2. **ARIA Labels**

```tsx
<button
	onClick={onClose}
	aria-label="Zamknij menu">
	<X size={24} />
</button>
```

### 3. **Focus Management**

- Menu opens with focus on first item
- Escape key closes menu
- Tab navigation within menu
- Focus trap when menu is open

## Performance Optimizations

### 1. **Body Scroll Prevention**

```tsx
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
```

### 2. **Event Cleanup**

- Proper event listener cleanup
- Memory leak prevention
- Component unmount handling

### 3. **Animation Performance**

- GPU-accelerated transforms
- Optimized transition properties
- Reduced repaints and reflows

## Usage Examples

### Basic Navigation

```tsx
<Navigation />
```

### Mobile Navigation

```tsx
<MobileNavigation
	isOpen={isOpen}
	onClose={() => setIsOpen(false)}
/>
```

### Hero with Mobile Padding

```tsx
<section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 md:pt-0">
```

## Best Practices

### 1. **Mobile-First Design**

- Start with mobile layout
- Progressive enhancement for larger screens
- Touch-friendly interactions
- Proper spacing and sizing

### 2. **Animation Performance**

- Use transform and opacity for animations
- Avoid animating layout properties
- Use will-change for complex animations
- Test on lower-end devices

### 3. **Accessibility**

- Provide alternative text for icons
- Ensure keyboard navigation
- Test with screen readers
- Maintain focus management

### 4. **User Experience**

- Clear visual feedback
- Intuitive interactions
- Consistent behavior
- Fast response times

## Testing Checklist

### Mobile (< 768px)

- [ ] Hamburger menu opens and closes smoothly
- [ ] Menu items are touch-friendly
- [ ] Hero text is not covered by navbar
- [ ] Animations are smooth and performant
- [ ] Keyboard navigation works
- [ ] Screen reader compatibility

### Tablet (768px - 1024px)

- [ ] Desktop navigation is visible
- [ ] Hamburger menu is hidden
- [ ] Text sizing is appropriate
- [ ] Touch interactions work

### Desktop (> 1024px)

- [ ] Full desktop navigation
- [ ] No mobile menu visible
- [ ] Proper hover effects
- [ ] Smooth scrolling

### Accessibility

- [ ] Keyboard navigation works
- [ ] Screen reader compatibility
- [ ] Focus management
- [ ] ARIA labels present
- [ ] High contrast support

## Troubleshooting

### Common Issues

1. **Menu not opening on mobile**

   - Check if mobile breakpoint is correct
   - Verify event handlers are attached
   - Check for JavaScript errors

2. **Animations not smooth**

   - Use transform instead of position
   - Check for conflicting CSS
   - Test on actual devices

3. **Hero text covered by navbar**

   - Ensure `pt-16` is applied on mobile
   - Check navbar height
   - Verify responsive classes

4. **Menu not closing**
   - Check event listener cleanup
   - Verify state management
   - Test keyboard navigation

### Debug Mode

```tsx
// Add console logging for debugging
console.log('Menu state:', isOpen);
console.log('Screen width:', window.innerWidth);
```

## Future Enhancements

- Gesture-based navigation
- Voice navigation support
- Advanced animations
- Performance monitoring
- A/B testing for UX improvements
