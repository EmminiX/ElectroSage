/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable strict mode for better performance and debugging
  reactStrictMode: true,

  // Optimize images
  images: {
    formats: ['image/webp', 'image/avif'],
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(self), geolocation=()',
          },
        ],
      },
    ];
  },

  // Experimental features for better performance
  experimental: {
    optimizeCss: true,
  },

  // TypeScript configuration
  typescript: {
    // Allow builds to complete even with TypeScript errors for faster iteration
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig

