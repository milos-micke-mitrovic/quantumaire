"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface KeyboardNavProps {
  prevHref?: string;
  nextHref?: string;
}

/**
 * Arrow-key navigation between stop pages. Ignores key events when the user
 * is typing in an input or when a modifier key is pressed.
 */
export function KeyboardNav({ prevHref, nextHref }: KeyboardNavProps) {
  const router = useRouter();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.defaultPrevented) return;
      if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (target?.isContentEditable) return;
      // Widgets with their own arrow-key handling (scale dots, pickers).
      if (target?.closest?.('[role="listbox"],[role="slider"],[role="tablist"],[role="radiogroup"]'))
        return;
      // An open dialog (search, lightbox, shortcuts, mobile menu) owns the keys.
      if (document.querySelector('[aria-modal="true"]')) return;

      if (e.key === "ArrowLeft" && prevHref) {
        e.preventDefault();
        router.push(prevHref);
      } else if (e.key === "ArrowRight" && nextHref) {
        e.preventDefault();
        router.push(nextHref);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router, prevHref, nextHref]);

  return null;
}
