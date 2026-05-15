import type { MetadataRoute } from "next";
import { SITE_NAME } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — From quarks to the observable universe`,
    short_name: SITE_NAME,
    description:
      "Interactive educational journey across 44 orders of magnitude — quantum to cosmic — with truth-status labels.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#03030a",
    theme_color: "#03030a",
    orientation: "portrait",
    categories: ["education", "science", "reference"],
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
