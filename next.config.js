/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		serverComponentsExternalPackages: ['fs', 'path'],
		buildTrace: false,
	},
	images: {
		domains: ['localhost'],
		formats: ['image/webp', 'image/avif'],
	},
	poweredByHeader: false,
	compress: true,
};

module.exports = nextConfig;
