/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '194.163.140.30',
        port: '5000',
        pathname: '/browse/**',
      },
      {
        protocol: 'https',
        hostname: 'maskanlux.uz',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },

  // ✅ Internationalization
  i18n: undefined, // We handle i18n via middleware

  // ✅ Production optimizations
  compress: true,
  poweredByHeader: false,

  // ✅ Experimental features
  experimental: {
    optimizePackageImports: ['lucide-react', 'antd'],
  },

  // ✅ Headers for security and caching
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
        ],
      },
      // ✅ Cache static assets
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // ✅ Cache images
      {
        source: '/_next/image/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // ✅ Redirects
  async redirects() {
    return [
      // Redirect root to default locale
      {
        source: '/',
        destination: '/uz',
        permanent: false,
      },
      // Redirect old URLs if any
      // {
      //   source: '/old-path',
      //   destination: '/uz/new-path',
      //   permanent: true,
      // },
    ];
  },

  // ✅ Webpack optimizations
  webpack: (config, { isServer }) => {
    // Optimize bundle size
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    return config;
  },

  // ✅ Logging
  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  // ✅ Output standalone for Docker deployment (optional)
  // output: 'standalone',
};

module.exports = nextConfig;