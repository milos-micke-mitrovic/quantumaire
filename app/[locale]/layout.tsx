import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import {
  Analytics,
  SearchConsoleVerification,
} from "@/components/Analytics";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { I18nProvider } from "@/lib/i18n";
import { getClientDictionary } from "@/lib/i18n-server";
import { JsonLd } from "@/components/JsonLd";
import { MotionProvider } from "@/components/MotionProvider";
import { BackToTop } from "@/components/BackToTop";
import { ReadingProgress } from "@/components/ReadingProgress";
import { ShortcutsOverlay } from "@/components/ShortcutsOverlay";
import { SiteHeader } from "@/components/SiteHeader";
import { SkipToContent } from "@/components/SkipToContent";
import { Starfield } from "@/components/Starfield";
import type { Locale } from "@/lib/types";
import {
  HREFLANG_MAP,
  LOCALES,
  SITE_NAME,
  SITE_URL,
  organizationJsonLd,
  websiteJsonLd,
} from "@/lib/seo";

/*
 * This is the root layout (one per locale), so `<html lang>` is known at
 * build time and every page can be prerendered. Paths outside a locale are
 * redirected by middleware; unmatched ones get app/global-not-found.tsx.
 */

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export const dynamicParams = false;

/*
 * `subsets` only decides which files are preloaded: every subset stays in the
 * CSS (unicode-range), so Serbian č/ć/š/ž/đ still load latin-ext on demand.
 * Preloading only latin saves ~100 KiB of high-priority requests that
 * competed with the LCP image.
 */
const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — From quarks to the observable universe`,
    template: `%s · ${SITE_NAME}`,
  },
  description:
    "Everything from the Planck length to the observable universe, compared by size — with the truth-status of every claim labelled honestly.",
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  keywords: [
    "scale of the universe",
    "interactive science",
    "quantum to cosmic",
    "quarks",
    "atoms",
    "DNA",
    "neutron star",
    "UY Scuti",
    "dark matter",
    "dark energy",
    "Milky Way",
    "observable universe",
    "educational",
    "science visualization",
    "quantumaire",
  ],
  formatDetection: { telephone: false, email: false, address: false },
  referrer: "origin-when-cross-origin",
  category: "education",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#03030a" },
    { media: "(prefers-color-scheme: dark)", color: "#03030a" },
  ],
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark",
};

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;
  if (!LOCALES.includes(locale as Locale)) notFound();
  const typed = locale as Locale;

  return (
    <html
      lang={HREFLANG_MAP[typed]}
      className={`${display.variable} ${body.variable}`}
      suppressHydrationWarning
    >
      <head>
        <SearchConsoleVerification />
        <link rel="alternate" type="application/rss+xml" href="/sitemap.xml" />
      </head>
      <body className="relative min-h-screen font-body antialiased">
        <I18nProvider locale={typed} dictionary={getClientDictionary(typed)}>
          <MotionProvider>
            <JsonLd data={[organizationJsonLd(typed), websiteJsonLd(typed)]} />
            <SkipToContent />
            <Starfield />
            <ReadingProgress />
            <SiteHeader />
            <div id="main-content" tabIndex={-1} className="outline-none">
              {children}
            </div>
            <BackToTop />
            <ShortcutsOverlay />
          </MotionProvider>
        </I18nProvider>
        <Analytics />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
