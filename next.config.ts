import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // 👈 Add this line for standalone feature
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true, // 👈 This skips TypeScript errors
  },
  env: {
    NEXT_PUBLIC_API_KEY: process.env.NEXT_PUBLIC_API_KEY,
    NEXT_PUBLIC_AUTH_DOMAIN: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
    NEXT_PUBLIC_PROJECT_ID: process.env.NEXT_PUBLIC_PROJECT_ID,
    NEXT_PUBLIC_STORAGE_BUCKET: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
    NEXT_PUBLIC_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
    NEXT_PUBLIC_APP_ID: process.env.NEXT_PUBLIC_APP_ID,
  },

  async redirects() {
    return [
      {
        source: '/ebooks/:path*',
        destination: '/books/:path*',
        permanent: true, // 301 redirect
      },
      // Optional: Redirect just /ebooks to /books (if someone visits the base path)
      {
        source: '/ebooks',
        destination: '/books',
        permanent: true,
      },
      // Optional: Handle trailing slash
      {
        source: '/ebooks/',
        destination: '/books',
        permanent: true,
      },
    ];
  },
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'yeeplatform.blob.core.windows.net',
        pathname: '/**',
      },
      // Add your CDN domain if you're using one
      {
        protocol: 'https',
        hostname: 'yeefmpremiumcontentfrontdoor-cyfpezerhzbmhzbr.z02.azurefd.net',
        pathname: '/**',
      },
    ],

     // 🎯 Advanced image optimization settings
     formats: ['image/avif', 'image/webp'], // 60-80% smaller files
     deviceSizes: [640, 750, 828, 1080, 1200, 1920], // Optimized for common screens
     imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // Component sizes
     minimumCacheTTL: 2592000, // 30 days cache (performance + freshness balance)
     dangerouslyAllowSVG: true,
     contentDispositionType: 'attachment',
     contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
     // 🔥 Additional optimizations
     loader: 'default',
     path: '/_next/image',
     domains: [], // Keep empty, use remotePatterns instead
     unoptimized: false, // Ensure optimization is enabled
    },
    // 🚀 THE ONE MOST IMPACTFUL OPTIMIZATION
    experimental: {
      optimizePackageImports: [
        '@/components',
        '@/lib', 
        'lucide-react',
        'react'
      ],
      // Enables faster page transitions and prefetching
      turbo: {
        rules: {
          '*.svg': {
            loaders: ['@svgr/webpack'],
            as: '*.js',
          },
        },
      },
      // Optimizes server components and reduces bundle size
      serverComponentsExternalPackages: ['sharp'],
      // Enables partial prerendering for faster page loads
      ppr: false, // Set to true once stable in your Next.js version
    },
};

export default nextConfig;