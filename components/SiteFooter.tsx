import Link from "next/link";
import { CATEGORIES, categorySlug } from "@/lib/content";
import { tServer } from "@/lib/i18n-server";
import { TOPICS } from "@/lib/topics";
import type { Locale } from "@/lib/types";

/**
 * Server-rendered footer: plain links to every hub (categories, guides,
 * tools, glossary, about) so crawlers can reach them from any page without
 * running the JS menus.
 */
export function SiteFooter({ locale }: { locale: Locale }) {
  const t = (key: string) => tServer(locale, key);
  const p = (path: string) => `/${locale}${path ? `/${path}` : ""}`;

  const columns: { title: string; links: { href: string; label: string }[] }[] = [
    {
      title: t("common.nav.categories"),
      links: CATEGORIES.map((c) => ({
        href: p(`category/${categorySlug(c)}`),
        label: t(`categories.${c}`),
      })),
    },
    {
      title: t("topicsIndex.title"),
      links: [
        ...TOPICS.map((topic) => ({
          href: p(`topics/${topic.slug}`),
          label: t(`${topic.i18nKey}.title`),
        })),
      ],
    },
    {
      title: t("common.nav.tools"),
      links: [
        { href: p("compare"), label: t("common.compare") },
        { href: p("tools/scale"), label: t("common.scaleTool.title") },
        { href: p("tools/between"), label: t("common.betweenTool.title") },
      ],
    },
    {
      title: t("common.title"),
      links: [
        { href: p("topics"), label: t("topicsIndex.title") },
        { href: p("glossary"), label: t("common.glossary") },
        { href: p("about"), label: t("common.about") },
      ],
    },
  ];

  return (
    <footer className="mx-auto w-full max-w-6xl px-5 pb-10 pt-2 text-xs text-cosmos-star/60 sm:px-8 print:hidden">
      <div className="mx-auto mb-8 h-px max-w-3xl bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <nav
        aria-label={t("common.nav.explore")}
        className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4"
      >
        {columns.map((col) => (
          <div key={col.title}>
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-cosmos-star/55">
              {col.title}
            </p>
            <ul className="mt-3 space-y-1">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="inline-block py-1 leading-snug transition-colors hover:text-cosmos-star"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      <div className="mt-8 flex flex-col items-center gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-between">
        <p className="max-w-md text-center sm:text-left">{t("common.footer")}</p>
        <p className="font-mono uppercase tracking-[0.22em] text-cosmos-star/55">
          © {new Date().getFullYear()} · {t("common.title")}
        </p>
      </div>
    </footer>
  );
}
