import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Cloudflare Workers have no image optimizer: serve pre-resized static
    // variants (scripts/resize-images.mjs) through a custom loader.
    loader: "custom",
    loaderFile: "./lib/imageLoader.ts",
    // Match the pre-generated variants so srcset doesn't advertise widths
    // (1920, 3840…) that all resolve to the same original.
    imageSizes: [32, 64, 128, 256],
    deviceSizes: [384, 640, 828, 1080, 1376],
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
