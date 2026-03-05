import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config, context) => {
    config.watchOptions = {
      poll: 1000, // Quét file 1 giây 1 lần
      aggregateTimeout: 300,
    };
    return config;
  },
  reactCompiler: true,
};

export default nextConfig;
