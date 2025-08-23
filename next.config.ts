import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // 👈 Add this line for standalone feature
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true, // 👈 This skips TypeScript errors
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