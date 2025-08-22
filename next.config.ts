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
};

export default nextConfig;