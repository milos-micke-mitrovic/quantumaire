"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, m as motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { TempUnitSwitcher } from "./TempUnitSwitcher";
import { UnitSwitcher } from "./UnitSwitcher";
import { NavGroups } from "./NavGroups";
import { BodyPortal } from "./BodyPortal";
import { lockBodyScroll } from "@/lib/scrollLock";
import { useDialog } from "@/lib/useDialog";

/**
 * Mobile-only header replacement for NavMenu + UnitSwitcher + LanguageSwitcher.
 * Collapses every secondary control into a single burger that opens a
 * right-side slide-in drawer. Search stays outside (icon-only).
 *
 * Visible only at < sm breakpoint via the wrapping `<div className="sm:hidden">`
 * in SiteHeader. Above sm, the inline desktop controls render instead.
 */
export function MobileNav() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const panelRef = useRef<HTMLDivElement>(null);
  useDialog(panelRef, open);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    const unlock = lockBodyScroll();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      unlock();
    };
  }, [open, close]);


  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={t("common.menuOpen")}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-cosmos-star/80 transition-colors hover:bg-white/[0.08] hover:text-cosmos-star"
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

      <BodyPortal>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.14 }}
            onClick={close}
            className="fixed inset-0 z-50 bg-cosmos-void/90 backdrop-blur-md"
          >
            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label={t("common.menuLabel")}
              tabIndex={-1}
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
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-cosmos-star/70 transition-colors hover:bg-white/[0.08] hover:text-cosmos-star"
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
                <NavGroups variant="drawer" onNavigate={close} />
              </nav>

              <div className="border-t border-white/10 p-4 space-y-4">
                {[
                  { label: t("common.units"), control: <UnitSwitcher fullWidth /> },
                  { label: t("common.temperatureUnit"), control: <TempUnitSwitcher fullWidth /> },
                  { label: t("common.language"), control: <LanguageSwitcher fullWidth /> },
                ].map(({ label, control }) => (
                  <div key={label}>
                    <p
                      aria-hidden
                      className="mb-2 text-[10px] font-medium uppercase tracking-[0.22em] text-cosmos-star/55"
                    >
                      {label}
                    </p>
                    {control}
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </BodyPortal>
    </>
  );
}
