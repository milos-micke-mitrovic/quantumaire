import { execSync } from "node:child_process";
import type { NextConfig } from "next";

// Date of the last commit that touched site content — the honest
// "dateModified" for JSON-LD and the sitemap's <lastmod>.
function contentModified(): string {
  try {
    return execSync("git log -1 --format=%cs -- content locales", {
      encoding: "utf8",
    }).trim();
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: { CONTENT_MODIFIED: contentModified() },
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
    // Human Mind + Ancient History were merged into Humankind.
    const merged = ["human-mind", "ancient-history"].map((slug) => ({
      source: `/:locale(en|sr)/category/${slug}`,
      destination: "/:locale/category/humankind",
      permanent: true,
    }));
    return [
      ...merged,
      ...[
      ["star", "stars"],
      ["black-hole", "black-holes"],
      ["planet", "planet-sizes-compared"],
      ["nebula", "nebulae"],
      ["satellite", "moons"],
    ].map(([tag, guide]) => ({
      source: `/:locale(en|sr)/tag/${tag}`,
      destination: `/:locale/topics/${guide}`,
      permanent: true,
    })),
    ];
  },
  experimental: {
    // app/global-not-found.tsx: there is one root layout per locale.
    globalNotFound: true,
    optimizePackageImports: ["framer-motion"],
  },
};

export default nextConfig;
