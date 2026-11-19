"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";

const subscribe = () => () => {};

/**
 * Render children directly under <body>. Overlays mounted inside the
 * sticky header would otherwise be trapped by its `backdrop-filter`, which
 * turns `position: fixed` into "fixed to the header" — so a full-screen
 * backdrop only covered the header strip.
 */
export function BodyPortal({ children }: { children: ReactNode }) {
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
  return mounted ? createPortal(children, document.body) : null;
}
