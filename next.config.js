/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // ✅ Contabo Server (Real images)
      {
        protocol: 'http',
        hostname: '194.163.140.30',
        port: '5000',
        pathname: '/browse/**',
      },
      // ✅ Localhost (Development)
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/browse/**',
      },
      // ✅ Production domain
      {
        protocol: 'https',
        hostname: 'maskanlux.uz',
        pathname: '/browse/**',
      },
      // ✅ Unsplash (Placeholder images)
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      // ✅ Pexels (Alternative placeholders)
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        pathname: '/**',
      },
      // ✅ Placeholder.com
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        pathname: '/**',
      },
      // ✅ Any other CDN you might use
      {
        protocol: 'https',
        hostname: '*.cloudinary.com',
        pathname: '/**',
      },
    ],

    // ✅ Image optimization settings
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60, // Cache for 60 seconds
  },

  // Turbopack specific
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
};

module.exports = nextConfig;