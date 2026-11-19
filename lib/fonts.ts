import { Inter, Space_Grotesk } from "next/font/google";

/*
 * Shared by app/[locale]/layout.tsx and app/global-not-found.tsx — both must
 * use the same options, or Turbopack emits a second, preloaded copy of the
 * files. `subsets` only decides which files are preloaded: every subset stays
 * in the CSS (unicode-range), so Serbian č/ć/š/ž/đ still load latin-ext on
 * demand. Preloading only latin saves ~100 KiB of high-priority requests that
 * competed with the LCP image.
 */
export const displayFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});
