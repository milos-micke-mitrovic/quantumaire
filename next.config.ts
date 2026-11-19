import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Cloudflare Workers have no image optimizer: serve pre-resized static
    // variants (scripts/resize-images.mjs) through a custom loader.
    loader: "custom",
    loaderFile: "./lib/imageLoader.ts",
  },
  // Tags now covered by a guide: their short-lived /tag/ pages redirect.
  async redirects() {
    return [
      ["star", "stars"],
      ["black-hole", "black-holes"],
      ["planet", "planet-sizes-compared"],
    ].map(([tag, guide]) => ({
      source: `/:locale(en|sr)/tag/${tag}`,
      destination: `/:locale/topics/${guide}`,
      permanent: true,
    }));
  },
  experimental: {
    optimizePackageImports: ["framer-motion"],
  },
};

export default nextConfig;
