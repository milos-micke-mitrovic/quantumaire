"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useBookmarks } from "@/lib/bookmarks";
import { useI18n } from "@/lib/i18n";
import { CATEGORIES, STOPS, categorySlug } from "@/lib/content";
import { CATEGORY_DOT } from "./ScaleExplorer";
import { useVisited } from "@/lib/visited";

interface NavLink {
  href: string;
  label: string;
  desc: string;
  badge?: string;
}

interface NavGroup {
  key: string;
  title: string;
  links: NavLink[];
}

function useNavGroups(): { groups: NavGroup[]; about: NavLink } {
  const { t, locale } = useI18n();
  const { bookmarks } = useBookmarks();
  const { visited } = useVisited();
  const p = (path: string) => `/${locale}/${path}`;
  const groups: NavGroup[] = [
    {
      key: "explore",
      title: t("common.nav.explore"),
      links: [
        { href: p("topics"), label: t("topicsIndex.title"), desc: t("common.nav.topicsDesc") },
        { href: p("glossary"), label: t("common.glossary"), desc: t("common.nav.glossaryDesc") },
        { href: p("random"), label: t("common.random"), desc: t("common.nav.randomDesc") },
      ],
    },
    {
      key: "tools",
      title: t("common.nav.tools"),
      links: [
        { href: p("compare"), label: t("common.compare"), desc: t("common.nav.compareDesc") },
        { href: p("tools/scale"), label: t("common.scaleTool.title"), desc: t("common.nav.scaleDesc") },
        { href: p("tools/between"), label: t("common.betweenTool.title"), desc: t("common.nav.betweenDesc") },
      ],
    },
    {
      key: "yours",
      title: t("common.nav.yours"),
      links: [
        {
          href: p("favorites"),
          label: t("common.bookmarksTitle"),
          desc: t("common.nav.favoritesDesc"),
          badge: bookmarks.size > 0 ? String(bookmarks.size) : undefined,
        },
        {
          href: p("progress"),
          label: t("common.progress.title"),
          desc: t("common.nav.progressDesc"),
          badge: visited.size > 0 ? `${visited.size}/${STOPS.length}` : undefined,
        },
      ],
    },
  ];
  return {
    groups,
    about: { href: p("about"), label: t("common.about"), desc: "" },
  };
}

/**
 * Grouped site navigation (Explore / Tools / Yours + About), shared by the
 * desktop "More" dropdown and the mobile drawer so both stay in sync.
 */
export function NavGroups({
  onNavigate,
  variant,
}: {
  onNavigate: () => void;
  variant: "menu" | "drawer";
}) {
  const pathname = usePathname() ?? "";
  const { t, locale } = useI18n();
  const { groups, about } = useNavGroups();
  const isMenu = variant === "menu";

  return (
    <div className={isMenu ? "grid gap-1 sm:grid-cols-3" : "space-y-4"}>
      <div className={clsx("min-w-0", isMenu && "sm:col-span-3")}>
        <p className="px-3 pb-1.5 pt-2 text-[10px] font-medium uppercase tracking-[0.22em] text-cosmos-star/45">
          {t("common.nav.categories")}
        </p>
        <div className="flex flex-wrap gap-1.5 px-2 pb-1">
          {CATEGORIES.map((c) => {
            const href = `/${locale}/category/${categorySlug(c)}`;
            return (
              <Link
                key={c}
                href={href}
                role={isMenu ? "menuitem" : undefined}
                onClick={onNavigate}
                className={clsx(
                  "inline-flex items-center gap-1.5 rounded-full border border-white/10 px-2.5 py-1 text-xs transition-colors",
                  pathname === href
                    ? "bg-white/[0.08] text-cosmos-star"
                    : "text-cosmos-star/75 hover:bg-white/[0.06] hover:text-cosmos-star"
                )}
              >
                <span aria-hidden className={clsx("h-2 w-2 rounded-full", CATEGORY_DOT[c])} />
                {t(`categories.${c}`)}
              </Link>
            );
          })}
        </div>
      </div>
      {groups.map((g) => (
        <div key={g.key} className="min-w-0">
          <p className="px-3 pb-1 pt-2 text-[10px] font-medium uppercase tracking-[0.22em] text-cosmos-star/45">
            {g.title}
          </p>
          {g.links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                role={isMenu ? "menuitem" : undefined}
                onClick={onNavigate}
                className={clsx(
                  "block rounded-xl px-3 py-2 transition-colors",
                  active
                    ? "bg-white/[0.08]"
                    : "hover:bg-white/[0.05]"
                )}
              >
                <span className="flex items-center justify-between gap-2 text-sm text-cosmos-star">
                  {l.label}
                  {l.badge && (
                    <span className="rounded-full bg-cosmos-aurora/20 px-1.5 py-px font-mono text-[10px] text-cosmos-plasma">
                      {l.badge}
                    </span>
                  )}
                </span>
                <span className="mt-0.5 block text-xs leading-snug text-cosmos-star/50">
                  {l.desc}
                </span>
              </Link>
            );
          })}
        </div>
      ))}
      <div
        className={clsx(
          "border-t border-white/10 pt-1.5",
          isMenu && "sm:col-span-3"
        )}
      >
        <Link
          href={about.href}
          role={isMenu ? "menuitem" : undefined}
          onClick={onNavigate}
          className="block rounded-xl px-3 py-2 text-xs uppercase tracking-[0.18em] text-cosmos-star/60 transition-colors hover:bg-white/[0.05] hover:text-cosmos-star"
        >
          {about.label}
        </Link>
      </div>
    </div>
  );
}
