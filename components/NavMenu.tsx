"use client";

import clsx from "clsx";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, m as motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { NavGroups } from "./NavGroups";

export function NavMenu() {
  const { t } = useI18n();
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
            className="absolute right-0 top-[calc(100%+8px)] z-50 w-[min(92vw,640px)] overflow-hidden rounded-2xl border border-white/10 bg-cosmos-deep p-1.5 shadow-glow backdrop-blur-md"
          >
            <NavGroups variant="menu" onNavigate={close} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
