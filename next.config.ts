import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bidcharter.com',
        pathname: '/nft/**',
      },
    ],
  },
};

export default nextConfig;
