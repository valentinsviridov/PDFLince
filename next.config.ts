import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  turbopack: {
    resolveAlias: {
      'pdf-lib': 'pdf-lib/dist/pdf-lib.min.js',
    },
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'pdf-lib': 'pdf-lib/dist/pdf-lib.min.js',
    };
    return config;
  },
};

export default nextConfig;
