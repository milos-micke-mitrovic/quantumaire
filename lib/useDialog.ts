"use client";

import { useEffect, type RefObject } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function focusables(root: HTMLElement): HTMLElement[] {
  return [...root.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
    (el) =>
      el.tabIndex >= 0 &&
      (el.offsetParent !== null || el === document.activeElement)
  );
}

/**
 * Modal dialog behaviour for the hand-rolled overlays (search, mobile menu,
 * shortcuts, lightbox): moves focus into the panel, keeps Tab inside it,
 * makes the rest of the page inert, and returns focus to whatever opened
 * it when it closes.
 */
export function useDialog(
  panelRef: RefObject<HTMLElement | null>,
  open: boolean,
  initialFocusRef?: RefObject<HTMLElement | null>
) {
  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    if (!panel) return;

    const raf = requestAnimationFrame(() => {
      const target =
        initialFocusRef?.current ?? focusables(panel)[0] ?? panel;
      target.focus({ preventScroll: true });
    });

    // Everything outside the dialog becomes inert (not focusable or
    // clickable, hidden from screen readers) until it closes.
    const inerted = [...document.body.children].filter(
      (el): el is HTMLElement =>
        el instanceof HTMLElement && !el.contains(panel) && !el.inert
    );
    inerted.forEach((el) => (el.inert = true));

    function onKey(e: KeyboardEvent) {
      if (e.key !== "Tab" || !panel) return;
      const items = focusables(panel);
      if (items.length === 0) {
        e.preventDefault();
        panel.focus();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !panel.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !panel.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKey);
      inerted.forEach((el) => (el.inert = false));
      if (opener && document.contains(opener)) {
        opener.focus({ preventScroll: true });
      }
    };
  }, [open, panelRef, initialFocusRef]);
}
