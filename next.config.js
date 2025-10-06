/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		serverComponentsExternalPackages: ['fs', 'path'],
	},
	images: {
		domains: ['localhost'],
		formats: ['image/webp', 'image/avif'],
	},
	poweredByHeader: false,
	compress: true,
	// Disable all build optimizations that cause stack overflow
	swcMinify: false,
	// Remove output: 'standalone' to avoid build traces
	// output: 'standalone',
	// Disable static optimization
	generateStaticParams: false,
	// Force dynamic rendering
	forceSwcTransforms: false,
};

module.exports = nextConfig;
