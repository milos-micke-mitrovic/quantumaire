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
      if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

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
