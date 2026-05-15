import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { StopDetail } from "@/components/StopDetail";
import { SiteFooter } from "@/components/SiteFooter";
import {
  STOPS,
  getNeighbors,
  getRelatedStops,
  getStop,
} from "@/lib/content";
import { tServer } from "@/lib/i18n-server";
import {
  breadcrumbJsonLd,
  buildPageMetadata,
  LOCALES,
  stopJsonLd,
} from "@/lib/seo";
import type { Locale } from "@/lib/types";

interface PageProps {
  params: Promise<{ locale: string; id: string }>;
}

export function generateStaticParams() {
  const out: Array<{ locale: string; id: string }> = [];
  for (const locale of LOCALES) {
    for (const stop of STOPS) {
      out.push({ locale, id: stop.id });
    }
  }
  return out;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, id } = await params;
  const stop = getStop(id);
  if (!stop) return {};
  if (!LOCALES.includes(locale as Locale)) return {};
  const typed = locale as Locale;

  const name = tServer(typed, `${stop.i18nKey}.name`);
  const tagline = tServer(typed, `${stop.i18nKey}.tagline`);
  const body = tServer(typed, `${stop.i18nKey}.body`);
  const description =
    tagline.length + body.length < 158
      ? `${tagline} ${body}`.trim()
      : tagline;

  return buildPageMetadata({
    locale: typed,
    path: `stop/${stop.id}`,
    title: `${name} — ${tServer(typed, `categories.${stop.category}`)}`,
    description,
    imageAlt: tServer(typed, stop.image.altKey),
  });
}

export default async function StopPage({ params }: PageProps) {
  const { locale, id } = await params;
  if (!LOCALES.includes(locale as Locale)) notFound();
  const typed = locale as Locale;

  const stop = getStop(id);
  if (!stop) notFound();

  const { prev, next } = getNeighbors(stop.id);
  const related = getRelatedStops(stop, 3);

  const name = tServer(typed, `${stop.i18nKey}.name`);
  const tagline = tServer(typed, `${stop.i18nKey}.tagline`);
  const body = tServer(typed, `${stop.i18nKey}.body`);
  const altText = tServer(typed, stop.image.altKey);
  const facts = ["fact1", "fact2", "fact3", "fact4"].map((k) =>
    tServer(typed, `${stop.i18nKey}.facts.${k}`)
  );

  return (
    <>
      <JsonLd
        data={[
          stopJsonLd(stop, typed, {
            name,
            description: tagline,
            body,
            altText,
            facts,
          }),
          breadcrumbJsonLd(typed, [
            { name: tServer(typed, "common.title"), path: "" },
            { name, path: `stop/${stop.id}` },
          ]),
        ]}
      />
      <StopDetail stop={stop} prev={prev} next={next} related={related} />
      <SiteFooter />
    </>
  );
}
