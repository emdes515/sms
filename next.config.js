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
};

module.exports = nextConfig;
