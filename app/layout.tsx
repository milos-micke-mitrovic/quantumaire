import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import {
  Analytics,
  SearchConsoleVerification,
} from "@/components/Analytics";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { HREFLANG_MAP, LOCALES, SITE_NAME, SITE_URL } from "@/lib/seo";
import type { Locale } from "@/lib/types";

function detectLocale(pathname: string): Locale {
  const seg = pathname.split("/").find(Boolean);
  return (LOCALES as readonly string[]).includes(seg ?? "")
    ? (seg as Locale)
    : "en";
}

const display = Space_Grotesk({
  subsets: ["latin", "latin-ext"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin", "latin-ext"],
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
    "An interactive educational journey from the smallest subatomic particles to the largest structures in the universe — with the truth-status of every claim labelled honestly.",
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const h = await headers();
  const pathname = h.get("x-pathname") ?? "/";
  const locale = detectLocale(pathname);
  const lang = HREFLANG_MAP[locale];
  return (
    <html
      lang={lang}
      className={`${display.variable} ${body.variable}`}
      suppressHydrationWarning
    >
      <head>
        <SearchConsoleVerification />
        <link rel="alternate" type="application/rss+xml" href="/sitemap.xml" />
      </head>
      <body className="relative min-h-screen font-body antialiased">
        {children}
        <Analytics />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
