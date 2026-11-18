import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Cloudflare Workers have no image optimizer: serve pre-resized static
    // variants (scripts/resize-images.mjs) through a custom loader.
    loader: "custom",
    loaderFile: "./lib/imageLoader.ts",
  },
  experimental: {
    optimizePackageImports: ["framer-motion"],
  },
};

export default nextConfig;
