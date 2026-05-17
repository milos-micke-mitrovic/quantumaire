import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FavoritesView } from "@/components/FavoritesView";
import { JsonLd } from "@/components/JsonLd";
import { SiteFooter } from "@/components/SiteFooter";
import { tServer } from "@/lib/i18n-server";
import {
  breadcrumbJsonLd,
  buildPageMetadata,
  LOCALES,
} from "@/lib/seo";
import type { Locale } from "@/lib/types";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!LOCALES.includes(locale as Locale)) return {};
  const typed = locale as Locale;
  return buildPageMetadata({
    locale: typed,
    path: "favorites",
    title: tServer(typed, "common.bookmarksTitle"),
    description: tServer(typed, "common.bookmarksTagline"),
    index: false,
  });
}

export default async function FavoritesPage({ params }: PageProps) {
  const { locale } = await params;
  if (!LOCALES.includes(locale as Locale)) notFound();
  const typed = locale as Locale;

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd(typed, [
            { name: tServer(typed, "common.title"), path: "" },
            { name: tServer(typed, "common.bookmarksTitle"), path: "favorites" },
          ]),
        ]}
      />
      <FavoritesView />
      <SiteFooter />
    </>
  );
}
