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
	// Disable SWC minification to avoid stack overflow
	swcMinify: false,
	// Use standalone output for Vercel
	output: 'standalone',
};

module.exports = nextConfig;
