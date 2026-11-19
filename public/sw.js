/* Quantumaire service worker. Hand-rolled — keep this file small and obvious. */

const VERSION = "quantumaire-v3";
const SHELL_CACHE = `${VERSION}-shell`;
const RUNTIME_CACHE = `${VERSION}-runtime`;
const IMG_CACHE = `${VERSION}-img`;

// Caches are trimmed (oldest first) so they can't grow forever.
const LIMITS = { [RUNTIME_CACHE]: 120, [IMG_CACHE]: 150 };
// Cached images older than this are refreshed in the background.
const IMG_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

async function putTrimmed(cacheName, req, res) {
  if (!res || !res.ok || res.type === "opaque") return;
  const cache = await caches.open(cacheName);
  await cache.put(req, res);
  const limit = LIMITS[cacheName];
  if (!limit) return;
  const keys = await cache.keys();
  for (let i = 0; i < keys.length - limit; i++) await cache.delete(keys[i]);
}

function isStale(res) {
  const date = Date.parse(res.headers.get("date") || "");
  return !date || Date.now() - date > IMG_MAX_AGE_MS;
}

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
          event.waitUntil(putTrimmed(RUNTIME_CACHE, req, fresh.clone()));
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
        // Images keep their file name when replaced, so refresh them in the
        // background once they are a week old; hashed /_next/static files
        // never change and stay cache-first.
        if (cached && isImg && isStale(cached)) {
          event.waitUntil(
            fetch(req)
              .then((fresh) => putTrimmed(cacheName, req, fresh))
              .catch(() => {}),
          );
          return cached;
        }
        if (cached) return cached;
        try {
          const fresh = await fetch(req);
          event.waitUntil(putTrimmed(cacheName, req, fresh.clone()));
          return fresh;
        } catch {
          return cached || Response.error();
        }
      })(),
    );
  }
});
