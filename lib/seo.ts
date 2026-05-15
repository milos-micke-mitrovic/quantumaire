import type { Metadata } from "next";
import type { Locale, Stop } from "./types";
import { STOPS } from "./content";
import { tServer } from "./i18n-server";

/**
 * Central SEO config. Update SITE_URL via the NEXT_PUBLIC_SITE_URL env var
 * once a production domain is chosen.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://quantumaire.com"
).replace(/\/$/, "");

export const SITE_NAME = "Quantumaire";

export const DEFAULT_OG_IMAGE = `${SITE_URL}/og/quantumaire-cover.png`;
export const TWITTER_HANDLE = "@quantumaire";

export const LOCALES: Locale[] = ["en", "sr"];
export const DEFAULT_LOCALE: Locale = "en";

export const HREFLANG_MAP: Record<Locale, string> = {
  en: "en",
  sr: "sr-Latn-RS",
};

export function localePath(locale: Locale, path = ""): string {
  const clean = path.replace(/^\/+/, "");
  return clean ? `/${locale}/${clean}` : `/${locale}`;
}

export function absoluteUrl(locale: Locale, path = ""): string {
  return `${SITE_URL}${localePath(locale, path)}`;
}

export interface PageSeoInput {
  locale: Locale;
  /** Slug path beneath the locale, e.g. "stop/quark". Empty string = home. */
  path?: string;
  title: string;
  description: string;
  /** Override the og:image URL for this page. */
  image?: string;
  /** Optional alt text for og:image. */
  imageAlt?: string;
  /** Allow indexing. Defaults to true. */
  index?: boolean;
}

/**
 * Build a complete <head> metadata object: canonical, alternates (incl.
 * hreflang), OpenGraph, Twitter, robots.
 */
export function buildPageMetadata(input: PageSeoInput): Metadata {
  const {
    locale,
    path = "",
    title,
    description,
    image = DEFAULT_OG_IMAGE,
    imageAlt = title,
    index = true,
  } = input;

  const canonical = absoluteUrl(locale, path);

  const languages: Record<string, string> = {};
  for (const l of LOCALES) {
    languages[HREFLANG_MAP[l]] = absoluteUrl(l, path);
  }
  languages["x-default"] = absoluteUrl(DEFAULT_LOCALE, path);

  return {
    title,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      type: "website",
      url: canonical,
      title,
      description,
      siteName: SITE_NAME,
      locale: locale === "sr" ? "sr_RS" : "en_US",
      alternateLocale: LOCALES.filter((l) => l !== locale).map((l) =>
        l === "sr" ? "sr_RS" : "en_US"
      ),
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: TWITTER_HANDLE,
    },
    robots: index
      ? {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-snippet": -1,
            "max-image-preview": "large",
            "max-video-preview": -1,
          },
        }
      : { index: false, follow: false },
  };
}

/* ------------------------------------------------------------------ */
/* JSON-LD builders                                                    */
/* ------------------------------------------------------------------ */

export function organizationJsonLd(locale: Locale = DEFAULT_LOCALE) {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
    sameAs: [],
    description: tServer(locale, "common.subtagline"),
    inLanguage: HREFLANG_MAP[locale],
  };
}

export function websiteJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: absoluteUrl(locale, ""),
    inLanguage: HREFLANG_MAP[locale],
    publisher: { "@type": "Organization", name: SITE_NAME },
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/${locale}?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

function badgeToCreditText(badge: Stop["badge"], locale: Locale): string {
  return tServer(locale, `badges.${badge}.tooltip`);
}

export function stopJsonLd(
  stop: Stop,
  locale: Locale,
  payload: {
    name: string;
    description: string;
    body: string;
    altText: string;
    facts?: string[];
  }
) {
  const url = absoluteUrl(locale, `stop/${stop.id}`);
  const citations = (stop.sources ?? []).map((s) => ({
    "@type": "CreativeWork",
    name: s.label,
    url: s.url,
  }));

  const base: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    "@id": url,
    name: payload.name,
    headline: payload.name,
    description: payload.description,
    abstract: payload.body,
    inLanguage: HREFLANG_MAP[locale],
    url,
    isPartOf: {
      "@type": "Course",
      name: SITE_NAME,
      url: absoluteUrl(locale, ""),
    },
    educationalLevel: "general",
    learningResourceType: "Article",
    creditText: badgeToCreditText(stop.badge, locale),
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    image: `${SITE_URL}${stop.image.src}`,
    about: payload.name,
  };

  if (citations.length > 0) base.citation = citations;
  if (payload.facts && payload.facts.length > 0) {
    base.keywords = payload.facts.join("; ");
  }
  return base;
}

export function breadcrumbJsonLd(
  locale: Locale,
  trail: Array<{ name: string; path: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(locale, item.path),
    })),
  };
}

/** Site-level FAQ for AI answer engines. */
export function faqJsonLd(
  faqs: Array<{ q: string; a: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function itemListJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${SITE_NAME} — stops`,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: STOPS.length,
    itemListElement: STOPS.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: absoluteUrl(locale, `stop/${s.id}`),
      name: tServer(locale, `${s.i18nKey}.name`),
    })),
  };
}
