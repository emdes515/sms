/** @type {import('next').NextConfig} */
const nextConfig = {
	// App Router is now stable in Next.js 14
	experimental: {
		serverComponentsExternalPackages: ['fs', 'path'],
	},
};

module.exports = nextConfig;
