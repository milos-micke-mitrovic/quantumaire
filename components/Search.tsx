"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { BodyPortal } from "./BodyPortal";

/*
 * The dialog (search index over every topic, guide and collection) is only
 * needed once someone opens search, so it loads as its own chunk. Hovering
 * or focusing the button starts the download early.
 */
const loadDialog = () => import("./SearchDialog").then((m) => m.SearchDialog);
const SearchDialog = dynamic(loadDialog, { ssr: false });

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
        onPointerEnter={() => void loadDialog()}
        onFocus={() => void loadDialog()}
        aria-label={t("common.searchOpen")}
        className="inline-flex h-10 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 text-xs font-medium uppercase tracking-[0.18em] text-cosmos-star/70 transition-colors hover:bg-white/[0.08] hover:text-cosmos-star"
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

      <BodyPortal>
        <AnimatePresence>
          {open && <SearchDialog onClose={close} />}
        </AnimatePresence>
      </BodyPortal>
    </>
  );
}
