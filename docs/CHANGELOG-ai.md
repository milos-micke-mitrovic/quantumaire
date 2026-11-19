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

## 2026-11-19 — audit Phase 2 (facts)
- All 27 items from `docs/audit/facts.md`, EN + SR: parsec definition, Andromeda/Homo, moon counts (Saturn 293, Jupiter 115, Aug 2026), Uranus −224 °C, Venera 13, DNA vs red blood cells, galaxy merger odds, category-intro magnitudes, Mercury midnight, twin paradox, neutron-star sugar cube, UY Scuti, Voyager (no hard-coded age; LECP off), Saturn rings 273k/282k, supernova rate, Hawking lifetime, Bell/local, Jupiter golf-ball scale, Halley 11 km mean.
- Data: dark_energy → PROBABLE_THEORY; time-averaged distances (Venus 170, Mars 255 million km; new Mercury "closest planet on average" fact); TON 618 / Phoenix-A use comoving distance (fact explains light-travel vs now).

## 2026-11-19 — audit Phase 3 (Serbian) + Phase 4 part 1
- Serbian: all of `docs/audit/serbian.md` applied (313 keys): compare ratio strings („nego“ + nominative), meaning errors (proton „bilionitog“, light-time hints, parsec glossary, tardigrade certainty…), „…“ quotes, vi in prose, „meseci“, decimals, terminology table (džin/superdžin, Proksima Kentaura, Kajper, Ort, Rakova maglina, Sunčeve mase, gravitaciono sočivo…).
- Static rendering: `[locale]/layout.tsx` is now the root layout (`<html lang>` at build time), `app/global-not-found.tsx`, no `headers()`; all topic/guide/category/tag/tool pages are SSG and OpenNext serves them from the static-assets incremental cache.
- Client payload: layout ships a base dictionary (UI + names/taglines + glossary terms); stop/guide/glossary/about pages add their own text via `<I18nExtend>`. HTML −40–60 % (e.g. /en/tools/scale 241→94 KB). Test `tests/clientDictionary.test.ts` guards missing keys.
- `geminiPrompt` → `content/image-prompts.json` (archive), `sources` → `content/sources.json` (server-only `lib/sources.ts`).
- Footer is a server component with links to every category, guide, tool, glossary and about; dropped the llms.txt link.

## 2026-11-19 — audit Phase 4 part 2 (titles & descriptions)
- `fitDescription` (lib/seo.ts): descriptions built from whole sentences ≤160; `buildPageMetadata` applies it everywhere. No self-comparison tail on earth/human.
- Search-intent titles: `topics.*.seoTitle` (13 guides), `stops.*.seoTitle` (14 ideas: "What Is Gravity? …"), about/between/compare titles, long tag titles trimmed; titles ≥ 47 chars drop the brand suffix.
- Hand-written `metaDescription` for ideas, tags and 5 guides (EN+SR); tests guard seoTitle length.
- Check script: crawl all sitemap URLs on `next start` → 0 title/description issues (was 91).

## 2026-11-19 — audit Phase 4 part 3 (FAQ + hygiene)
- FAQ (visible + JSON-LD): "How far is X from Earth?" (with light-time), "How hot is X?", "How big is X compared to Earth?"; idea topics lead with their search question ("What Is Dark Energy?"). Ratios near 1 keep two decimals.
- Content date from git (`CONTENT_MODIFIED` via next.config) → JSON-LD dateModified + sitemap `<lastmod>`; sitemap x-default; robots `/api/` in the bot group; `/favicon.ico` (scripts/build-icons.mts); llms.txt says "topic".

## 2026-11-19 — audit Phase 4 part 4 (compare pairs)
- 20 static pair pages `/[locale]/compare/<a>-vs-<b>` (`lib/comparePairs.ts`): server H1 + size/distance/temperature sentences, FAQ + breadcrumb JSON-LD, links to both topics, the interactive tool preset below (changes hand off to `/compare?…`). "Popular comparisons" links on `/compare` and every pair page; pairs in the sitemap (216 URLs, crawl: 0 issues).

## 2026-11-19 — audit Phase 4 part 5 (OG cards)
- `lib/ogCard.tsx` shared card; `opengraph-image.tsx` for every guide, category, tag, plus topics index, glossary, about and both tools (EN+SR). Pages point og:image at their own card (`ogImageUrl`), guide Article JSON-LD has `image`. Note: Next 16 calls `generateImageMetadata` once with empty params during build — fall back to id "default".

## 2026-11-19 — audit Phase 5 (accessibility)
- `lib/useDialog.ts`: focus into panel, Tab trap (ignores tabIndex −1), page inert, focus returns to opener — Search, MobileNav, Shortcuts, Lightbox; `role="dialog"` moved from backdrop to panel. Verified with real keyboard in Chrome.
- Search input is a combobox (aria-controls/activedescendant, label); result links tabIndex −1; category button removed from inside links. StopCard bookmark is a sibling of the link; visited marker has sr-only text.
- NavMenu/NavGroups: no `role="menu"`; MobileNav groups labelled; ScaleExplorer: no aria-activedescendant on roving listbox, `useId` dot ids, horizontal orientation; StopCombobox closes on blur, "no results" is a disabled option.
- Contrast: `/35–/45` text → `/55`, aurora links → plasma; outline-based focus ring for links/buttons/inputs/options; glossary filter and pickers show focus.
- Touch targets ≥ 40 px (search trigger, burger/close, dialog close, explorer arrows, drawer pills), 36 px bookmark/switch pills; Tooltip closes on Escape; skip target focusable; `lang` on language buttons.

## 2026-11-19 — audit Phase 6 part 1 (UX & code health)
- About: scale section rewritten for today's tools (log scale, three views, light-time, everyday analogies, unit switches).
- Guides index: "start here" guides first, topic counts instead of the repeated eyebrow, plainer intro; cards no longer JS-hidden.
- Guide pages auto-link topic names (first mention, inflection-aware, `lib/topicLinks.ts` + tests); sections and all page headers (topics, guides, glossary, category, compare, about, progress) render visible without JS (`animate-rise`).
- Between tool defaults to Human → Earth; StopCombobox reserves room for the detail so long names truncate; "cosmos" tag removed.
- Code health: `lib/distance.ts` (StopDistanceCard deleted), `lib/text.ts normalize`, `SIZED_STOPS`, client dictionary falls back to English like tServer.

## 2026-11-19 — categories merged
- Human Mind + Ancient History (one topic each) → **Humankind** / „Čovečanstvo“ (`HUMANKIND`, `/category/humankind`); `/category/human-mind` and `/category/ancient-history` 308 there (next.config.ts). Test: every category has ≥ 2 topics.

## 2026-11-19 — header fix (owner report)
- Header controls were uneven (40/30/46 px after the touch-target change) and the stop-page section bar, stuck at a hard-coded `top-[57px]`, slid under the taller header and clipped the active pill. Now every header control is `h-10`, the header height is one CSS variable `--header-h` (globals.css) used by the header, the section bar and section scroll-margins.

## Next / ideas
- Audit plan: phases 1–5 done; Phase 6 left: 8 new topics, guide hero image + key-numbers table, dedupe toggle UIs. Daily GSC indexing (queue starts with compare pairs).

## 2026-11-19 — audit Phase 6 part 2 (new topics)
- M87* (`m87_black_hole`, COSMOS, FACT, black-hole tag): EHT image (CC BY 4.0), 6.5 billion Suns, 38 billion km horizon, 55 million ly; EN+SR, sources (Wikipedia/ESO/NASA).
- Gaia BH1 (`gaia_bh1`, COSMOS, FACT, black-hole): closest known black hole, 9.6 M☉, 1,560 ly, 57 km horizon; NOIRLab artist's impression (CC BY 4.0); BH2/BH3 in the fun fact.
- Neutrino (`neutrino`, MICRO_WORLD idea, FACT, particle): ghost particle, KATRIN mass limit, SN 1987A, IceCube/KM3NeT; IceCube Lab photo (CC BY 4.0); new glossary term `neutrino_oscillation`.
- Mariana Trench (`mariana_trench`, EARTH, FACT, new `ocean` tag): 10,935 m Challenger Deep, size compared to Everest, ~2 °C; 1960 Trieste photo (US Navy, PD); new glossary term `subduction`.
- ISS (`iss`, COSMOS, FACT, spacecraft): 109 m, 450 t, 400 km, 92-min orbit; NASA photo (PD); new glossary `free_fall`; spacecraft-speed table row links to it. Spacecraft now has 2 topics → new `/tag/spacecraft` page (texts EN+SR); particle collection text mentions the neutrino. Fixes: distance FAQ said light from <1 light-second objects "set out long ago" (new `sizeFaq.a6near`); test that every tag page has its texts (it showed raw keys).
- James Webb Space Telescope (`james_webb`, COSMOS, FACT, spacecraft): 6.5 m mirror, 21 m sunshield, L2 at 1.5 million km, −233 °C; NASA/Chris Gunn mirror photo (PD); new glossary `lagrange_point`; spacecraft collection texts now name Webb.
