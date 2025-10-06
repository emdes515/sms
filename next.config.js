/** @type {import('next').NextConfig} */
const nextConfig = {
	// App Router is now stable in Next.js 14
	experimental: {
		serverComponentsExternalPackages: ['fs', 'path'],
	},
	// Vercel optimizations
	images: {
		domains: ['localhost'],
		formats: ['image/webp', 'image/avif'],
	},
	// Enable static exports for better performance
	output: 'standalone',
	// Optimize for Vercel
	poweredByHeader: false,
	compress: true,
};

module.exports = nextConfig;
