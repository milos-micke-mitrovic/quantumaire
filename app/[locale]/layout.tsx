import { notFound } from "next/navigation";
import { I18nProvider } from "@/lib/i18n";
import { JsonLd } from "@/components/JsonLd";
import { BackToTop } from "@/components/BackToTop";
import { ReadingProgress } from "@/components/ReadingProgress";
import { ShortcutsOverlay } from "@/components/ShortcutsOverlay";
import { SiteHeader } from "@/components/SiteHeader";
import { SkipToContent } from "@/components/SkipToContent";
import { Starfield } from "@/components/Starfield";
import type { Locale } from "@/lib/types";
import { LOCALES, websiteJsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

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
    <I18nProvider locale={typed}>
      <JsonLd data={websiteJsonLd(typed)} />
      <SkipToContent />
      <Starfield />
      <ReadingProgress />
      <SiteHeader />
      <div id="main-content">{children}</div>
      <BackToTop />
      <ShortcutsOverlay />
    </I18nProvider>
  );
}
