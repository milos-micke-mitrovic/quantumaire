"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n";

interface ShareBarProps {
  title: string;
  /** Optional override; defaults to window.location.href at click time. */
  url?: string;
}

const NO_SUBSCRIBE = () => () => {};

export function ShareBar({ title, url }: ShareBarProps) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  // SSR-safe check for the Web Share API — returns false on the server, the
  // real value on the client. No effect, no flash.
  const canNativeShare = useSyncExternalStore(
    NO_SUBSCRIBE,
    () =>
      typeof navigator !== "undefined" && typeof navigator.share === "function",
    () => false
  );

  // Current page URL — empty on the server, real value after hydration.
  // useSyncExternalStore is React's purpose-built primitive for this; using
  // window.location during render directly causes a hydration mismatch.
  const currentUrl = useSyncExternalStore(
    NO_SUBSCRIBE,
    () => (typeof window !== "undefined" ? window.location.href : ""),
    () => ""
  );

  const getUrl = useCallback(() => {
    if (url) return url;
    return currentUrl;
  }, [url, currentUrl]);

  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(getUrl());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked — leave silent */
    }
  }, [getUrl]);

  const onNativeShare = useCallback(async () => {
    try {
      await navigator.share({ title, url: getUrl() });
    } catch {
      /* user cancelled — silent */
    }
  }, [title, getUrl]);

  return (
    <div className="inline-flex items-center gap-2">
      {canNativeShare && (
        <button
          type="button"
          onClick={onNativeShare}
          aria-label={t("common.share")}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-cosmos-star/75 transition-colors hover:bg-white/[0.08] hover:text-cosmos-star"
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
            <path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7" />
            <path d="M16 6l-4-4-4 4" />
            <path d="M12 2v14" />
          </svg>
          {t("common.share")}
        </button>
      )}
      <button
        type="button"
        onClick={onCopy}
        aria-label={t("common.shareCopy")}
        className="relative inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-cosmos-star/75 transition-colors hover:bg-white/[0.08] hover:text-cosmos-star"
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
          <rect x="9" y="9" width="13" height="13" rx="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
        <AnimatePresence mode="wait" initial={false}>
          {copied ? (
            <motion.span
              key="done"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="text-cosmos-nova"
            >
              {t("common.shareCopied")}
            </motion.span>
          ) : (
            <motion.span
              key="copy"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
            >
              {t("common.shareCopy")}
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
}
