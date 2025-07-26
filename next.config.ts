import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'imgur.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'files.cdn.printful.com',
        pathname: '/**',
      },
      {
        
        protocol: 'https',
        hostname: 'i.imgur.com',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
