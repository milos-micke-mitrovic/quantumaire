"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SUPPORTED_LOCALES, useI18n } from "@/lib/i18n";
import { useUnits, type UnitSystem } from "@/lib/units";
import type { Locale } from "@/lib/types";

interface NavItem {
  href: string;
  label: string;
}

const LOCALE_LABELS: Record<Locale, string> = {
  en: "EN",
  sr: "SR",
};

const UNIT_OPTIONS: Array<{ value: UnitSystem; labelKey: string }> = [
  { value: "metric", labelKey: "common.unitMetricShort" },
  { value: "imperial", labelKey: "common.unitImperialShort" },
];

/**
 * Mobile-only header replacement for NavMenu + UnitSwitcher + LanguageSwitcher.
 * Collapses every secondary control into a single burger that opens a
 * right-side slide-in drawer. Search stays outside (icon-only).
 *
 * Visible only at < sm breakpoint via the wrapping `<div className="sm:hidden">`
 * in SiteHeader. Above sm, the inline desktop controls render instead.
 */
export function MobileNav() {
  const { t, locale, setLocale } = useI18n();
  const { units, setUnits } = useUnits();
  const pathname = usePathname() ?? "";
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close]);

  const items: NavItem[] = [
    { href: `/${locale}/about`, label: t("common.about") },
    { href: `/${locale}/topics`, label: t("topicsIndex.title") },
    { href: `/${locale}/glossary`, label: t("common.glossary") },
    { href: `/${locale}/tools/scale`, label: t("common.scaleTool.title") },
    { href: `/${locale}/tools/between`, label: t("common.betweenTool.title") },
    { href: `/${locale}/compare`, label: t("common.compare") },
    { href: `/${locale}/favorites`, label: t("common.bookmarksTitle") },
    { href: `/${locale}/progress`, label: t("common.progress.title") },
    { href: `/${locale}/random`, label: t("common.random") },
  ];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={t("common.menuOpen")}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-cosmos-star/80 transition-colors hover:bg-white/[0.08] hover:text-cosmos-star"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden
          className="h-4 w-4"
        >
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={t("common.menuLabel")}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.14 }}
            onClick={close}
            className="fixed inset-0 z-50 bg-cosmos-void/90 backdrop-blur-md"
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.22, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-0 flex h-full w-[min(86vw,340px)] flex-col border-l border-white/10 bg-cosmos-void shadow-glow"
            >
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <span className="font-display text-sm font-semibold uppercase tracking-[0.22em] text-cosmos-star/70">
                  {t("common.menuLabel")}
                </span>
                <button
                  type="button"
                  onClick={close}
                  aria-label={t("common.menuClose")}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-cosmos-star/70 transition-colors hover:bg-white/[0.08] hover:text-cosmos-star"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    aria-hidden
                    className="h-3.5 w-3.5"
                  >
                    <path d="M6 6l12 12M6 18L18 6" />
                  </svg>
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto p-2">
                {items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={close}
                      className={clsx(
                        "flex items-center justify-between rounded-xl px-3 py-3 text-sm transition-colors",
                        isActive
                          ? "bg-white/[0.08] text-cosmos-star"
                          : "text-cosmos-star/85 hover:bg-white/[0.05] hover:text-cosmos-star"
                      )}
                    >
                      {item.label}
                      <svg
                        aria-hidden
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-3.5 w-3.5 opacity-40"
                      >
                        <path d="M9 6l6 6-6 6" />
                      </svg>
                    </Link>
                  );
                })}
              </nav>

              <div className="border-t border-white/10 p-4 space-y-4">
                <div>
                  <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.22em] text-cosmos-star/50">
                    {t("common.units")}
                  </p>
                  <div
                    role="group"
                    className="inline-flex w-full items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1"
                  >
                    {UNIT_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        aria-pressed={opt.value === units}
                        onClick={() => setUnits(opt.value)}
                        className={clsx(
                          "flex-1 rounded-full px-3 py-1.5 text-xs font-medium tracking-wider transition-colors",
                          opt.value === units
                            ? "bg-aurora-gradient text-cosmos-void shadow-glow"
                            : "text-cosmos-star/70 hover:text-cosmos-star"
                        )}
                      >
                        {t(opt.labelKey)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.22em] text-cosmos-star/50">
                    {t("common.language")}
                  </p>
                  <div
                    role="group"
                    className="inline-flex w-full items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1"
                  >
                    {SUPPORTED_LOCALES.map((l) => (
                      <button
                        key={l}
                        type="button"
                        aria-pressed={l === locale}
                        onClick={() => setLocale(l)}
                        className={clsx(
                          "flex-1 rounded-full px-3 py-1.5 text-xs font-medium tracking-wider transition-colors",
                          l === locale
                            ? "bg-aurora-gradient text-cosmos-void shadow-glow"
                            : "text-cosmos-star/70 hover:text-cosmos-star"
                        )}
                      >
                        {LOCALE_LABELS[l]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
