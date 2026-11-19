"use client";

import { useEffect } from "react";

/**
 * Registers `/sw.js` once on mount in production builds. Dev mode and
 * unsupported browsers are no-ops.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      // A production preview on localhost may have left a worker behind;
      // in dev it would serve stale (unhashed) chunks, so remove it.
      navigator.serviceWorker
        ?.getRegistrations()
        .then((regs) => regs.forEach((r) => r.unregister()))
        .catch(() => {});
      return;
    }
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    const onLoad = () => {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .catch(() => {
          /* registration failed — fall back to no SW, no crash */
        });
    };

    if (document.readyState === "complete") {
      onLoad();
    } else {
      window.addEventListener("load", onLoad, { once: true });
      return () => window.removeEventListener("load", onLoad);
    }
  }, []);

  return null;
}
