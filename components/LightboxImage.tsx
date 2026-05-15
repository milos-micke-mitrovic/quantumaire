"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import type { ImagePlaceholder as ImagePlaceholderType } from "@/lib/types";
import { ImagePlaceholder } from "./ImagePlaceholder";

interface LightboxImageProps {
  image: ImagePlaceholderType;
  priority?: boolean;
  className?: string;
}

/**
 * Renders an ImagePlaceholder as a clickable trigger that opens a
 * full-viewport lightbox of the same image. Esc / backdrop click closes.
 */
export function LightboxImage({
  image,
  priority,
  className,
}: LightboxImageProps) {
  const { t } = useI18n();
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

  const alt = t(image.altKey);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`${alt} — zoom`}
        className="group relative block w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-cosmos-aurora/60 rounded-2xl"
      >
        <ImagePlaceholder
          image={image}
          priority={priority}
          className={className}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-cosmos-deep/65 text-cosmos-star/85 opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M15 3h6v6" />
            <path d="M9 21H3v-6" />
            <path d="M21 3l-7 7" />
            <path d="M3 21l7-7" />
          </svg>
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={alt}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            onClick={close}
            className="fixed inset-0 z-50 flex items-center justify-center bg-cosmos-void/95 px-4 py-12 backdrop-blur-md sm:py-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl"
            >
              <ImagePlaceholder image={image} priority />
              <button
                type="button"
                onClick={close}
                aria-label={t("common.searchClose")}
                className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-cosmos-deep/85 text-cosmos-star/85 backdrop-blur-md transition-colors hover:bg-cosmos-deep hover:text-cosmos-star"
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
              <p className="mt-3 text-center text-[11px] uppercase tracking-[0.22em] text-cosmos-star/55">
                {alt}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
