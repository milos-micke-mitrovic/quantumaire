import type { MetadataRoute } from "next";
import { CATEGORIES, STOPS, categorySlug } from "@/lib/content";
import { TAG_PAGES } from "@/lib/tags";
import { TOPICS } from "@/lib/topics";
import { DEFAULT_LOCALE, LOCALES, SITE_MODIFIED, SITE_URL } from "@/lib/seo";

function alternates(path: string) {
  const url = (l: string) => `${SITE_URL}/${l}${path ? `/${path}` : ""}`;
  return {
    languages: {
      ...Object.fromEntries(
        LOCALES.map((l) => [l === "sr" ? "sr-Latn-RS" : "en", url(l)])
      ),
      "x-default": url(DEFAULT_LOCALE),
    },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    entries.push({
      url: `${SITE_URL}/${locale}`,
      lastModified: SITE_MODIFIED,
      changeFrequency: "weekly",
      priority: 1.0,
      alternates: alternates(""),
    });

    entries.push({
      url: `${SITE_URL}/${locale}/about`,
      lastModified: SITE_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: alternates("about"),
    });

    entries.push({
      url: `${SITE_URL}/${locale}/glossary`,
      lastModified: SITE_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: alternates("glossary"),
    });

    entries.push({
      url: `${SITE_URL}/${locale}/tools/scale`,
      lastModified: SITE_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: alternates("tools/scale"),
    });

    entries.push({
      url: `${SITE_URL}/${locale}/tools/between`,
      lastModified: SITE_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: alternates("tools/between"),
    });

    entries.push({
      url: `${SITE_URL}/${locale}/compare`,
      lastModified: SITE_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: alternates("compare"),
    });

    entries.push({
      url: `${SITE_URL}/${locale}/topics`,
      lastModified: SITE_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.75,
      alternates: alternates("topics"),
    });

    for (const topic of TOPICS) {
      entries.push({
        url: `${SITE_URL}/${locale}/topics/${topic.slug}`,
        lastModified: SITE_MODIFIED,
      changeFrequency: "monthly",
        priority: 0.8,
        alternates: alternates(`topics/${topic.slug}`),
      });
    }

    for (const cat of CATEGORIES) {
      const slug = categorySlug(cat);
      entries.push({
        url: `${SITE_URL}/${locale}/category/${slug}`,
        lastModified: SITE_MODIFIED,
      changeFrequency: "monthly",
        priority: 0.75,
        alternates: alternates(`category/${slug}`),
      });
    }

    for (const tag of TAG_PAGES) {
      entries.push({
        url: `${SITE_URL}/${locale}/tag/${tag}`,
        lastModified: SITE_MODIFIED,
      changeFrequency: "monthly",
        priority: 0.7,
        alternates: alternates(`tag/${tag}`),
      });
    }

    for (const stop of STOPS) {
      entries.push({
        url: `${SITE_URL}/${locale}/stop/${stop.id}`,
        lastModified: SITE_MODIFIED,
      changeFrequency: "monthly",
        priority: 0.85,
        alternates: alternates(`stop/${stop.id}`),
      });
    }
  }

  return entries;
}
