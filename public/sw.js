/* Quantumaire service worker. Hand-rolled — keep this file small and obvious. */

const VERSION = "quantumaire-v1";
const SHELL_CACHE = `${VERSION}-shell`;
const RUNTIME_CACHE = `${VERSION}-runtime`;
const IMG_CACHE = `${VERSION}-img`;

// Pre-cached "shell" URLs. The locale roots fall back to the offline shell
// when the network is unavailable.
const SHELL_URLS = ["/en", "/sr", "/manifest.webmanifest"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(SHELL_CACHE);
      await Promise.allSettled(SHELL_URLS.map((u) => cache.add(u)));
      self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => !k.startsWith(VERSION))
          .map((k) => caches.delete(k)),
      );
      await self.clients.claim();
    })(),
  );
});

function isAssetRequest(url) {
  return (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/_next/image") ||
    /\.(?:png|jpe?g|webp|avif|gif|svg|ico|woff2?)$/i.test(url.pathname)
  );
}

function isHtmlRequest(req) {
  if (req.method !== "GET") return false;
  const accept = req.headers.get("accept") || "";
  return req.mode === "navigate" || accept.includes("text/html");
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // HTML pages: network-first, fall back to cache, then to /en shell.
  if (isHtmlRequest(req)) {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(req);
          const cache = await caches.open(RUNTIME_CACHE);
          cache.put(req, fresh.clone());
          return fresh;
        } catch {
          const cached = await caches.match(req);
          if (cached) return cached;
          const fallback = await caches.match("/en");
          if (fallback) return fallback;
          return new Response("Offline", {
            status: 503,
            statusText: "Offline",
            headers: { "Content-Type": "text/plain" },
          });
        }
      })(),
    );
    return;
  }

  // Static assets: cache-first, refill on miss.
  if (isAssetRequest(url)) {
    event.respondWith(
      (async () => {
        const isImg = /\.(?:png|jpe?g|webp|avif|gif|svg)$/i.test(url.pathname);
        const cacheName = isImg ? IMG_CACHE : RUNTIME_CACHE;
        const cached = await caches.match(req);
        if (cached) return cached;
        try {
          const fresh = await fetch(req);
          const cache = await caches.open(cacheName);
          cache.put(req, fresh.clone());
          return fresh;
        } catch {
          return cached || Response.error();
        }
      })(),
    );
  }
});
