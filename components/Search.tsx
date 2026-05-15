"use client";

import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { STOPS, categorySlug } from "@/lib/content";
import type { Stop } from "@/lib/types";
import { formatMeters } from "@/lib/scale";

function normalize(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
}

interface IndexedStop {
  stop: Stop;
  haystack: string;
  name: string;
  tagline: string;
  category: string;
}

function scoreStop(item: IndexedStop, q: string): number {
  if (!q) return 0;
  const n = normalize(item.name);
  if (n === q) return 100;
  if (n.startsWith(q)) return 80;
  if (n.includes(q)) return 60;
  if (item.haystack.includes(q)) return 30;
  return 0;
}

function SearchDialog({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const { t, locale } = useI18n();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const indexed = useMemo<IndexedStop[]>(() => {
    return STOPS.map((stop) => {
      const name = t(`${stop.i18nKey}.name`);
      const tagline = t(`${stop.i18nKey}.tagline`);
      const category = t(`categories.${stop.category}`);
      const facts = ["fact1", "fact2", "fact3", "fact4"]
        .map((k) => t(`${stop.i18nKey}.facts.${k}`))
        .join(" ");
      const haystack = normalize(
        `${name} ${tagline} ${category} ${stop.id} ${facts}`
      );
      return { stop, name, tagline, category, haystack };
    });
  }, [t]);

  const results = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return indexed;
    return indexed
      .map((item) => ({ item, score: scoreStop(item, q) }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((r) => r.item);
  }, [indexed, query]);

  useEffect(() => {
    const id = window.setTimeout(() => inputRef.current?.focus(), 30);
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(id);
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const onKeyDownInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(results.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      const target = results[activeIndex];
      if (target) {
        e.preventDefault();
        router.push(`/${locale}/stop/${target.stop.id}`);
        onClose();
      }
    }
  };

  const onQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setActiveIndex(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-50 flex items-start justify-center bg-cosmos-void/85 backdrop-blur-md px-4 pt-[12vh] sm:pt-[16vh]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={t("common.search")}
    >
      <motion.div
        initial={{ opacity: 0, y: -8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.98 }}
        transition={{ duration: 0.16, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl overflow-hidden rounded-3xl border border-white/10 bg-cosmos-deep/90 shadow-glow-lg"
      >
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3 sm:px-5">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 text-cosmos-star/55"
            aria-hidden
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={onQueryChange}
            onKeyDown={onKeyDownInput}
            placeholder={t("common.searchHint")}
            className="flex-1 bg-transparent text-sm text-cosmos-star placeholder:text-cosmos-star/40 focus:outline-none sm:text-[15px]"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label={t("common.searchClose")}
            className="rounded-full p-1 text-cosmos-star/55 transition-colors hover:bg-white/[0.06] hover:text-cosmos-star"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              aria-hidden
            >
              <path d="M6 6l12 12M6 18L18 6" />
            </svg>
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {results.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-cosmos-star/55">
              {t("common.searchEmpty")}
            </p>
          ) : (
            <ul role="listbox" aria-label={t("common.search")}>
              {results.map((item, i) => {
                const isActive = i === activeIndex;
                return (
                  <li key={item.stop.id} role="option" aria-selected={isActive}>
                    <Link
                      href={`/${locale}/stop/${item.stop.id}`}
                      onMouseEnter={() => setActiveIndex(i)}
                      onClick={onClose}
                      className={clsx(
                        "flex items-center gap-4 rounded-2xl px-4 py-3 transition-colors",
                        isActive
                          ? "bg-white/[0.08]"
                          : "hover:bg-white/[0.04]"
                      )}
                    >
                      <span className="flex-1 min-w-0">
                        <span className="block truncate text-sm font-medium text-cosmos-star sm:text-[15px]">
                          {item.name}
                        </span>
                        <span className="mt-0.5 block truncate text-xs text-cosmos-star/65">
                          {item.tagline}
                        </span>
                      </span>
                      <span className="flex shrink-0 flex-col items-end gap-1 text-[10px] uppercase tracking-[0.18em] text-cosmos-star/55">
                        <Link
                          href={`/${locale}/category/${categorySlug(item.stop.category)}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onClose();
                          }}
                          className="rounded-full px-2 py-0.5 hover:bg-white/[0.06]"
                        >
                          {item.category}
                        </Link>
                        <span className="font-mono">
                          {item.stop.sizeMeters !== null
                            ? formatMeters(item.stop.sizeMeters, t)
                            : t("common.abstract")}
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-white/10 px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-cosmos-star/45 sm:px-5">
          <span className="flex items-center gap-2">
            <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-cosmos-star/65">↵</kbd>
            open
          </span>
          <span className="flex items-center gap-2">
            <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-cosmos-star/65">↑↓</kbd>
            navigate
          </span>
          <span className="flex items-center gap-2">
            <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-cosmos-star/65">esc</kbd>
            close
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Search() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  // Global shortcut: Cmd/Ctrl+K opens search; `/` opens when not in a field.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
        return;
      }
      const tag = (e.target as HTMLElement | null)?.tagName;
      const inField =
        tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
      if (!inField && e.key === "/") {
        e.preventDefault();
        setOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t("common.searchOpen")}
        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-cosmos-star/70 transition-colors hover:bg-white/[0.08] hover:text-cosmos-star"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-3.5 w-3.5"
          aria-hidden
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
        <span className="hidden sm:inline">{t("common.search")}</span>
        <kbd className="hidden rounded bg-white/10 px-1.5 py-0.5 text-[9px] tracking-wider text-cosmos-star/70 sm:inline">
          ⌘K
        </kbd>
      </button>

      <AnimatePresence>
        {open && <SearchDialog onClose={close} />}
      </AnimatePresence>
    </>
  );
}
