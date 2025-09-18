import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Allow production builds to succeed even if there are ESLint issues
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Allow production builds to succeed even if there are TS type errors
    ignoreBuildErrors: true,
  },
  // Silence Turbopack workspace root warning in monorepo
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
