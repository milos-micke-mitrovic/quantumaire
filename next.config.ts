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
  // Static files get these from public/_headers; this covers rendered pages.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
    ];
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
    // app/global-not-found.tsx: there is one root layout per locale.
    globalNotFound: true,
    optimizePackageImports: ["framer-motion"],
  },
};

export default nextConfig;
