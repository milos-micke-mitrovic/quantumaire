import type { Metadata } from "next";
import type { Locale, Stop } from "./types";
import { STOPS } from "./content";
import { tServer } from "./i18n-server";

/**
 * Central SEO config. Update SITE_URL via the NEXT_PUBLIC_SITE_URL env var
 * once a production domain is chosen.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://quantumaire.space"
).replace(/\/$/, "");

export const SITE_NAME = "Quantumaire";

export const DEFAULT_OG_IMAGE = `${SITE_URL}/og/quantumaire-cover.png`;
export const TWITTER_HANDLE = "@quantumaire";

/** First public release of the journey. Used for schema.org datePublished. */
export const SITE_PUBLISHED = "2025-09-01";
/** Build-time modification stamp baked into JSON-LD. */
export const SITE_MODIFIED = new Date().toISOString().slice(0, 10);

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
    relatedStopUrls?: string[];
  }
) {
  const url = absoluteUrl(locale, `stop/${stop.id}`);
  const citations = (stop.sources ?? []).map((s) => ({
    "@type": "CreativeWork",
    name: s.label,
    url: s.url,
  }));

  const imageObject: Record<string, unknown> = {
    "@type": "ImageObject",
    url: `${SITE_URL}${stop.image.src}`,
    caption: payload.altText,
    representativeOfPage: true,
  };
  if (stop.image.credit) imageObject.creditText = stop.image.credit;

  const keywords: string[] = [];
  if (stop.tags) keywords.push(...stop.tags);
  if (payload.facts) keywords.push(...payload.facts);

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
    educationalUse: ["selfStudy", "popularScience"],
    creditText: badgeToCreditText(stop.badge, locale),
    author: {
      "@type": "EducationalOrganization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@type": "EducationalOrganization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/icon.svg` },
    },
    image: imageObject,
    primaryImageOfPage: imageObject,
    about: payload.name,
    datePublished: SITE_PUBLISHED,
    dateModified: SITE_MODIFIED,
    audience: {
      "@type": "EducationalAudience",
      educationalRole: "general public",
    },
    accessibilityFeature: [
      "alternativeText",
      "readingOrder",
      "tableOfContents",
      "highContrastDisplay",
    ],
    accessibilityHazard: "none",
    accessMode: ["textual", "visual"],
    accessModeSufficient: ["textual"],
    isAccessibleForFree: true,
  };

  if (keywords.length > 0) base.keywords = keywords.join(", ");
  if (citations.length > 0) base.citation = citations;
  if (payload.relatedStopUrls && payload.relatedStopUrls.length > 0) {
    base.mentions = payload.relatedStopUrls.map((u) => ({
      "@type": "Thing",
      url: u,
    }));
  }
  return base;
}

/** FAQPage schema generated from per-category stop list — boosts AI answer engines. */
export function categoryFaqJsonLd(
  locale: Locale,
  categoryName: string,
  stops: Stop[]
) {
  if (stops.length === 0) return null;

  const sized = stops.filter((s) => typeof s.sizeMeters === "number");
  const sortedBySize = [...sized].sort(
    (a, b) => (a.sizeMeters as number) - (b.sizeMeters as number)
  );
  const smallest = sortedBySize[0];
  const largest = sortedBySize[sortedBySize.length - 1];

  const stopNames = stops
    .map((s) => tServer(locale, `${s.i18nKey}.name`))
    .join(", ");

  const faqs: Array<{ q: string; a: string }> = [];

  faqs.push({
    q: tServer(locale, "faq.category.included", { category: categoryName }),
    a: stopNames,
  });

  if (smallest) {
    const name = tServer(locale, `${smallest.i18nKey}.name`);
    const tagline = tServer(locale, `${smallest.i18nKey}.tagline`);
    faqs.push({
      q: tServer(locale, "faq.category.smallest", { category: categoryName }),
      a: `${name} — ${tagline}`,
    });
  }
  if (largest && largest.id !== smallest?.id) {
    const name = tServer(locale, `${largest.i18nKey}.name`);
    const tagline = tServer(locale, `${largest.i18nKey}.tagline`);
    faqs.push({
      q: tServer(locale, "faq.category.largest", { category: categoryName }),
      a: `${name} — ${tagline}`,
    });
  }

  return faqJsonLd(faqs);
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
