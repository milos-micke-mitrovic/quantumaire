# Audit plan (2026-11-19)

Source reports (read the relevant one before each phase — they have exact
key paths, file:line references and ready-made replacement texts):

- `docs/audit/facts.md` — 27 English fact issues (3 high, 7 medium, 17 low)
- `docs/audit/serbian.md` — ~175 Serbian language issues + terminology table
- `docs/audit/seo.md` — technical SEO of the live site (176 URLs crawled)
- `docs/audit/code.md` — performance, accessibility, bugs, code health
- `docs/audit/ux-notes.md` — page-by-page UX walkthrough notes

Work top to bottom. Tick boxes as you go, commit after each phase, deploy
with the `deploy` skill, and append to `docs/CHANGELOG-ai.md`. Keep
`pnpm typecheck && pnpm lint && pnpm test` green. Check visually in the
browser (desktop + 390 px) after UI changes.

## Phase 1 — Quick, high-impact (performance & correctness)

- [x] `public/_headers`: `/_next/static/*` → `public, max-age=31536000, immutable`;
      `/images/*`, icons, `/logo.svg` → long max-age (e.g. 30 days + stale-while-revalidate);
      add HSTS (`Strict-Transport-Security: max-age=31536000; includeSubDomains`).
      Verify with curl -I through `--resolve` after deploy. (seo #1, #10; code #1)
- [x] Bugs (code.md §8): KeyboardNav must ignore events already handled
      (`e.defaultPrevented`), focus inside inputs/listboxes, and open dialogs;
      wrap localStorage reads in `lib/visited.ts` + `lib/bookmarks.ts`
      `getSnapshot` in try/catch; footer outside `<main>` on home;
      single shared body-scroll-lock (ref-counted).
- [x] Reduced motion: `MotionConfig reducedMotion="user"` in MotionProvider;
      Starfield static (single frame) when `prefers-reduced-motion`.
- [x] Content hidden until JS: remove `initial={{opacity:0}}` from above-the-fold
      elements (stop header, home hero text) or use CSS animations; home hero
      image must not be lazy (eager + fetchPriority high); stop hero image
      `priority` should emit a preload (check LightboxImage/ImagePlaceholder).
- [x] Images: add a `w128` variant (scripts/resize-images.mjs + lib/imageLoader.ts
      IMAGE_WIDTHS + tests) and fix `sizes` on StopCard (cards are ~260–360 px),
      thumbnails (32–112 px) in ScaleExplorer, StopCombobox, NavCard.
- [x] Service worker: cap image cache size, don't cache non-OK responses,
      don't re-fetch images on every view (only when stale); bump VERSION.

## Phase 2 — Facts (docs/audit/facts.md)

- [x] All 3 high + 7 medium items, EN and SR together (SR text is given for
      most; write the rest carefully). Includes: parsec definition, Andromeda
      vs Homo (2.8 Myr), moon counts (Saturn 293, Jupiter 115), Uranus coldest
      −224 °C, Venera 13 127 min, DNA/red blood cells, dark_energy badge →
      PROBABLE_THEORY (content/stops.json, edit as text), galaxy merge odds,
      category-intro orders of magnitude, Venus vs Mercury average distance.
- [x] The 17 low items.

## Phase 3 — Serbian (docs/audit/serbian.md)

- [x] Compare-page ratio strings (grammar with nominative names) — highest impact.
- [x] Meaning errors (proton "bilionitog", parsec glossary term, light-time
      hints, tardigrade certainty, etc.).
- [x] Global fixes: quotes „…“, "meseci", "merljiv", vi/ti consistency (pick
      "ti" for UI and prose, or "vi" — be consistent), gender-neutral reader
      phrasing, decimals + "svetlosne godine", "na oko N".
- [x] Apply the terminology table site-wide.

## Phase 4 — SEO structure (docs/audit/seo.md)

- [x] Static rendering: remove `headers()` from `app/layout.tsx:81`; set
      `<html lang>` per locale (root layout under `[locale]`, or a static
      approach) so pages prerender; make sure `/compare` has a Suspense
      fallback with real content. Verify OpenNext serves cached HTML.
- [x] Ship less to the client: pass a per-page / trimmed dictionary instead of
      the full ~194 KB one; strip `geminiPrompt` and `sources` from the client
      copy of stops.json (server-only data module).
- [x] Crawlable hub links: server-rendered footer nav (guides, categories,
      tools incl. /compare and /tools/between, glossary, about).
- [x] Meta descriptions cut mid-sentence (73): rebuild stop descriptions so
      they end on a full sentence ≤160 chars; drop the self-comparison tail on
      earth/human.
- [ ] ~~Guide titles too short → descriptive `seo` titles per guide~~ (done: `topics.*.seoTitle`); per-guide
      OG image (generated like stop OG) + `image` in Article JSON-LD;
      category/tag/tool pages get their own OG images.
- [ ] `dateModified`: use a real content date (e.g. git commit date at build
      or a constant bumped on content changes), add `<lastmod>` to sitemap.
- [ ] ~~Idea-topic titles → search-intent titles~~ (done: `stops.*.seoTitle`); FAQ for ideas; resolve stop vs guide
      cannibalisation (big_bang ↔ topics/big-bang, observable_universe ↔
      how-big-is-the-universe): differentiate titles/intent, cross-link.
- [ ] FAQ for distance/temperature: "How far is X from Earth?", "How hot is X?",
      "X compared to Earth" (lib/sizeFaq.ts).
- [ ] Indexable compare pairs: `/compare/[a]-vs-[b]` for ~20 curated pairs
      (jupiter-vs-earth, sun-vs-earth, moon-vs-earth, uy-scuti-vs-sun,
      milky-way-vs-andromeda, …) with real titles; keep the interactive page.
- [ ] Smaller: ~~titles >60 / descriptions >160~~ (done — local crawl of all 176 sitemap URLs: 0 issues; `metaDescription` keys + `fitDescription`); robots.txt keep `Disallow: /api/`
      in bot groups; "Tools" breadcrumb + `/tools` hub page (or point to
      converter); `/favicon.ico`; 404 page SSR body (note: Next 16 renders every 404 — even a trivial not-found — through the `__next_error__` shell; status is 404 and the body appears after JS; revisit on a Next upgrade); sitemap x-default;
      llms.txt still says "stop"; thin pages (merge single-topic categories
      HUMAN_MIND + ANCIENT_HISTORY into a "Curiosities" category? or noindex).

## Phase 5 — Accessibility (docs/audit/code.md §6, §7, §9)

- [ ] Focus trap + return focus: Search, MobileNav, ShortcutsOverlay, Lightbox.
- [ ] Search input as proper combobox with accessible name; no `<button>`
      inside the result link; StopCard bookmark not nested in the link.
- [ ] NavMenu: drop `role="menu"` (use plain nav list) or add arrow keys.
- [ ] ScaleExplorer: one keyboard model (roving tabindex), unique ids per
      instance (useId); StopCombobox closes on blur/Tab.
- [ ] Contrast: raise small text to ≥ text-cosmos-star/55; aurora link colour
      on dark → plasma; glossary filter visible focus ring.
- [ ] Touch targets ≥ 40 px on mobile (search trigger, close buttons,
      bookmark, toggles; scale dots get bigger hit areas).

## Phase 6 — UX & content (docs/audit/ux-notes.md + ideas)

- [ ] About page: rewrite the grain-of-sand section to describe today's tools
      (log-scale explorer, light-time, everyday analogies, unit switches).
- [ ] Guides index: drop repeated "GUIDES" eyebrow; feature search-intent guides
      first; clearer intro.
- [ ] Guide pages: auto-link topic names in guide text to /stop/ pages; hero
      image per guide; key-numbers mini table.
- [ ] StopCombobox closed state: long name + detail overlap; Between tool default
      range (e.g. human → earth).
- [ ] Remove "cosmos" tag from stops (duplicates category chip).
- [ ] Footer: drop visible llms.txt link.
- [ ] Code health: delete dead StopDistanceCard component (move
      computeDistance + mapping to lib/), unused `LIGHT_YEAR_KM`, dedupe
      `normalize()`, sized-stop sorting, toggle UIs; client i18n EN fallback.
- [ ] New topic candidates: M87*, Gaia BH1, neutrino, Mariana Trench, ISS,
      James Webb, Fermi paradox, speed of light (use the `add-topic` skill).
- [ ] Daily: `gsc-indexing` skill (queue in docs/indexing-log.md).
