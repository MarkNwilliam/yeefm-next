import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // 👈 Add this line for standalone feature

  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true, // 👈 This skips TypeScript errors
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
    unoptimized: true,
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
    };


export default nextConfig;