# AI work log

## 2026-11-18 — 19
- Moved hosting Vercel → Cloudflare Workers (OpenNext); www/http redirects; image variants pipeline.
- SEO: search-intent titles, size FAQ + JSON-LD, 4 guides, sitemap fixes, real 404s, IndexNow.
- Content: 14 new topics (Forces & Spacetime, Life & Earth, Planck length, Higgs, antimatter, Big Bang, multiverse, string theory…), fact audit.
- UX: log-scale explorer, category shelves, section nav on topic pages, everyday-scale analogies, light-time hints, °C/°F/K switch, searchable pickers, grouped menu, new logo/icons/OG, deep-field hero, dropped "journey/stop" wording, guides merged with overlapping tag collections, glossary deep links + "used in".
- Tools: /tools/scale is now a space distance converter.

## 2026-11-19 — audit Phase 1 (performance & correctness)
- `public/_headers`: immutable `/_next/static`, 30-day images/icons, HSTS + nosniff.
- Bugs: KeyboardNav ignores handled keys, widgets and open dialogs; storage `getSnapshot` try/catch; home footer outside `<main>`; ref-counted `lib/scrollLock.ts` for all overlays.
- Reduced motion: `MotionConfig reducedMotion="user"`, static Starfield (and no star jump on URL-bar resize), instant scrolls.
- LCP: stop header/story and home hero no longer start at opacity 0 (CSS `animate-rise`/`animate-fade-up`); cards static; hero images `preload` + `fetchPriority=high`; dropped blur placeholder and backdrop blur on image wrappers.
- Images: new `w128` variant, `imageSizes`/`deviceSizes` match variants, correct `sizes` on cards/shelves/stop hero/lightbox.
- Service worker v3: only OK responses cached, caches trimmed, images refreshed only after 7 days.

## Next / ideas
- Full audit done 2026-11-19 → `docs/AUDIT-PLAN.md` (phases 1–6, nothing ticked yet).
