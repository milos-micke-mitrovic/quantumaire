"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";

interface NavItem {
  href: string;
  label: string;
  external?: boolean;
}

export function NavMenu() {
  const { t, locale } = useI18n();
  const pathname = usePathname() ?? "";
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (!wrapperRef.current?.contains(e.target as Node)) close();
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
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
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t("common.more")}
        className={clsx(
          "inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium uppercase tracking-[0.18em] transition-colors",
          open
            ? "bg-white/[0.08] text-cosmos-star"
            : "text-cosmos-star/70 hover:bg-white/[0.06] hover:text-cosmos-star"
        )}
      >
        <span className="hidden sm:inline">{t("common.more")}</span>
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
          className="h-3.5 w-3.5"
        >
          <circle cx="5" cy="12" r="1.6" />
          <circle cx="12" cy="12" r="1.6" />
          <circle cx="19" cy="12" r="1.6" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.14, ease: "easeOut" }}
            className="absolute right-0 top-[calc(100%+8px)] z-50 w-[200px] overflow-hidden rounded-2xl border border-white/10 bg-cosmos-deep/95 p-1.5 shadow-glow backdrop-blur-md"
          >
            {items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  role="menuitem"
                  onClick={close}
                  className={clsx(
                    "flex items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-white/[0.08] text-cosmos-star"
                      : "text-cosmos-star/80 hover:bg-white/[0.05] hover:text-cosmos-star"
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
                    className="h-3.5 w-3.5 opacity-50"
                  >
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
