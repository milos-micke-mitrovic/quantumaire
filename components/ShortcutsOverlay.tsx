"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";

interface Shortcut {
  keys: string[];
  labelKey: string;
}

const SHORTCUTS: Shortcut[] = [
  { keys: ["⌘", "K"], labelKey: "common.shortcuts.searchOpen" },
  { keys: ["/"], labelKey: "common.shortcuts.searchOpen" },
  { keys: ["↑", "↓"], labelKey: "common.shortcuts.searchNav" },
  { keys: ["↵"], labelKey: "common.shortcuts.searchSelect" },
  { keys: ["←", "→"], labelKey: "common.shortcuts.stopNav" },
  { keys: ["?"], labelKey: "common.shortcuts.showHelp" },
  { keys: ["Esc"], labelKey: "common.shortcuts.closeOverlay" },
];

export function ShortcutsOverlay() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement | null)?.tagName;
      const inField =
        tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
      if (!inField && (e.key === "?" || (e.shiftKey && e.key === "/"))) {
        e.preventDefault();
        setOpen((o) => !o);
        return;
      }
      if (open && e.key === "Escape") close();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={t("common.shortcuts.title")}
          className="fixed inset-0 z-50 flex items-center justify-center bg-cosmos-void/85 backdrop-blur-md px-4"
        >
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-cosmos-deep/95 shadow-glow-lg"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-cosmos-star/55">
                  {t("common.shortcuts.tagline")}
                </p>
                <h2 className="mt-1 font-display text-lg font-semibold text-cosmos-star">
                  {t("common.shortcuts.title")}
                </h2>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label={t("common.searchClose")}
                className="rounded-full p-1.5 text-cosmos-star/55 transition-colors hover:bg-white/[0.06] hover:text-cosmos-star"
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
            <ul className="p-3">
              {SHORTCUTS.map((s, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between gap-4 rounded-xl px-3 py-2 text-sm"
                >
                  <span className="text-cosmos-star/80">{t(s.labelKey)}</span>
                  <span className="flex items-center gap-1">
                    {s.keys.map((k) => (
                      <kbd
                        key={k}
                        className="min-w-[2em] rounded bg-white/10 px-1.5 py-0.5 text-center font-mono text-[11px] text-cosmos-star/85"
                      >
                        {k}
                      </kbd>
                    ))}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
