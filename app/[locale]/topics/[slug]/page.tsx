import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { SiteFooter } from "@/components/SiteFooter";
import { TopicView } from "@/components/TopicView";
import { TOPICS, getTopic } from "@/lib/topics";
import { tServer } from "@/lib/i18n-server";
import {
  articleJsonLd,
  breadcrumbJsonLd,
  buildPageMetadata,
  LOCALES,
} from "@/lib/seo";
import type { Locale } from "@/lib/types";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  const out: Array<{ locale: string; slug: string }> = [];
  for (const locale of LOCALES) {
    for (const topic of TOPICS) {
      out.push({ locale, slug: topic.slug });
    }
  }
  return out;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!LOCALES.includes(locale as Locale)) return {};
  const topic = getTopic(slug);
  if (!topic) return {};
  const typed = locale as Locale;
  return buildPageMetadata({
    locale: typed,
    path: `topics/${slug}`,
    title: tServer(typed, `${topic.i18nKey}.title`),
    description: tServer(typed, `${topic.i18nKey}.tagline`),
  });
}

export default async function TopicPage({ params }: PageProps) {
  const { locale, slug } = await params;
  if (!LOCALES.includes(locale as Locale)) notFound();
  const topic = getTopic(slug);
  if (!topic) notFound();
  const typed = locale as Locale;

  const title = tServer(typed, `${topic.i18nKey}.title`);
  const tagline = tServer(typed, `${topic.i18nKey}.tagline`);
  const intro = tServer(typed, `${topic.i18nKey}.intro`);

  const articleLd = {
    ...articleJsonLd(typed, `topics/${slug}`, {
      headline: title,
      description: tagline,
      body: intro,
      section: tServer(typed, "topicsIndex.title"),
    }),
    citation: topic.sources.map((s) => ({
      "@type": "CreativeWork",
      name: s.label,
      url: s.url,
    })),
  };

  return (
    <>
      <JsonLd
        data={[
          articleLd,
          breadcrumbJsonLd(typed, [
            { name: tServer(typed, "common.title"), path: "" },
            { name: tServer(typed, "topicsIndex.title"), path: "topics" },
            { name: title, path: `topics/${slug}` },
          ]),
        ]}
      />
      <TopicView topic={topic} />
      <SiteFooter />
    </>
  );
}
