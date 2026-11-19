# Technical SEO audit — https://quantumaire.space (live, 2026-11-19)

Method: fetched `/sitemap.xml` (176 URLs = 88 EN + 88 SR) and every URL in it through
Cloudflare (`--resolve quantumaire.space:443:104.21.50.132`), parsed each page with a stdlib
HTML parser, then checked every internal link target once (incl. JSON-LD URLs), all
og:images, redirects, 404s and headers. Scripts and raw data are in this directory:
`crawl.py` (fetch + extract → `pages.json`), `analyse.py` (checks → `findings.json`),
`probe.py` (spot-check any URL), `raw/` (HTML of every page, md5(url).html).

**What is already solid** (no action needed): all 176 sitemap URLs return 200; no
redirecting/404 URLs in the sitemap; exactly one `<h1>` on every page; canonical is
self-referencing, absolute, https, no trailing slash on all 176; hreflang `en` /
`sr-Latn-RS` / `x-default` present and reciprocal on every page; `<html lang>` correct
(`en` / `sr-Latn-RS`); og:title/description/image + `twitter:card=summary_large_image`
on every page; all 72 distinct og:image URLs return 200 `image/png`; no duplicate titles
or descriptions; all JSON-LD blocks parse; no FAQ with empty answers; breadcrumbs
use correct same-locale absolute URLs; no unintended noindex (`/progress`,
`/favorites` are noindex,nofollow on purpose; 404s are noindex); http:// and www.
308 to `https://quantumaire.space` preserving path; unknown URLs return a real 404;
retired `/tag/star` etc. 308 to guides and nothing links to them; no `<img>` without
`alt` (472 `alt=""` are decorative logos/thumbnails — fine); Brotli on HTML/JS/CSS;
TTFB ≈ 0.18 s.

---

## Executive summary — top 10 issues by impact

| # | Issue | Impact | Where to fix |
|---|---|---|---|
| 1 | **Hashed static assets are not cached**: `/_next/static/*` (JS, CSS, woff2), `/images/*`, icons all send `cache-control: public, max-age=0, must-revalidate` — every repeat view revalidates every asset. | Core Web Vitals (LCP/repeat-visit speed), CF egress | add `public/_headers` (Workers static assets honour it) |
| 2 | **Every HTML page is rendered per request with `private, no-cache, no-store`** because the root layout calls `headers()` (for `x-pathname` → `<html lang>`). This opts the whole site out of SSG/ISR, edge caching and bfcache, although all routes have `generateStaticParams`. | TTFB, crawl efficiency, Worker CPU | `app/layout.tsx:81` (move `lang` into `app/[locale]/layout.tsx`) |
| 3 | **Key hubs are not crawlable**: the header menu (`NavMenu` → `NavGroups`) renders its links only when opened (`{open && …}`), so `/compare` and `/tools/between` have **0** plain inbound `<a>` links on the whole site (orphans), `/topics` index is linked from only 26/176 pages, guides from 3–24 pages, `category/human-mind` and `category/ancient-history` from 2. | Discovery + PageRank flow to guides/tools | `components/NavMenu.tsx:62`, `components/SiteFooter.tsx` |
| 4 | **Compare pages can't rank**: 104 internal links point to `/compare?a=X&b=earth`, each a distinct page (title "Jupiter vs Earth · Compare two objects") but canonicalised to `/compare`. The bare `/en/compare` is titled "**Quark vs Earth** · Compare two objects". "X vs Y size" / "how big is X compared to Earth" intent is untargeted. | Missed long-tail traffic | `app/[locale]/compare/page.tsx`; new static pair route |
| 5 | **73 meta descriptions are clipped mid-sentence with "…"** (all guides, most stop pages). The generic tail "See how it compares to a human, Earth and the…" eats the last 50 chars and is cut off; on `/stop/earth` it says "compares to … Earth" (self-comparison), on `/stop/human` "compares to a human". | CTR | `app/[locale]/stop/[id]/page.tsx:66-75`, `sizeFaq.metaTail` in `locales/*.json`, `clipDescription` in `lib/seo.ts`; topic page `app/[locale]/topics/[slug]/page.tsx:46` |
| 6 | **Guide pages have weak titles and no own OG image**: "Stars · Quantumaire" (19 chars), "Time · Quantumaire" … 9 of 13 guides per locale are 18–27 chars; 35 pages per locale (all guides, categories, tags, tools, about, glossary) share the generic home OG image; guide `Article` JSON-LD has no `image`. | CTR, social, Article rich results | `title` keys of guides in `locales/*.json` (add `seoTitle` like tags have), `buildPageMetadata` calls without `image` |
| 7 | **`dateModified` is always "today"** on all 130 Article/LearningResource blocks (`SITE_MODIFIED = new Date()` evaluated at runtime), and the sitemap has **no `<lastmod>`** at all. Fake freshness is ignored or distrusted by Google; real freshness signal is missing. | Freshness signal, trust | `lib/seo.ts:25`, `app/sitemap.ts` |
| 8 | **14 "idea" topics per locale have generic titles/no intent**: "Gravity — Forces & Spacetime · Quantumaire", "Dark Matter — Cosmos · …", "Voyager 1 — Cosmos · …". Their FAQPage has a single, self-referential Q ("How certain is what we know about Gravity?"). Also overlap/cannibalisation: `/stop/big_bang` vs `/topics/big-bang`, `/stop/observable_universe` vs `/topics/how-big-is-the-universe`, `/stop/light_year` vs `/topics/distances`. | Rankings for "what is X" queries | `app/[locale]/stop/[id]/page.tsx:77-83` (else branch), `lib/seo.ts` FAQ builder |
| 9 | **Distance / temperature data exists but no question targets it**: 22 topics have `distanceFromEarthMeters`, 16 have `temperatureKelvin`, yet FAQs/H2s only ask size questions. "How far is the Moon from Earth", "How far away is Voyager 1", "How hot is the Sun", "How big is Jupiter compared to Earth" are not targeted. | High-volume long-tail | FAQ builder (`buildSizeFaq`), `sizeFaq.*` keys |
| 10 | **No HSTS** header on any response. | Security/minor SEO hygiene | Cloudflare dashboard → SSL/TLS → Edge Certificates → HSTS, or `headers()` in `next.config.ts` |

Next tier: thin tag/category pages (27 pages < 250 words), awkward Serbian FAQ phrasing,
over-length titles (25) and descriptions (18), `llms.txt` still says "stop", 404 page body
is empty without JS, `/favicon.ico` 404, `Tools` breadcrumb points at a leaf, robots.txt
AI/bot group drops the `/api/` disallow.

---

## 1. Crawl status, redirects, 404s

| URL | Result | OK? |
|---|---|---|
| all 176 sitemap URLs | 200 | yes |
| `http://quantumaire.space/en/stop/jupiter` | 308 → `https://quantumaire.space/en/stop/jupiter` | yes |
| `https://www.quantumaire.space/en/stop/jupiter` | 308 → apex | yes |
| `http://www.quantumaire.space/en/about` | 308 → `https://quantumaire.space/en/about` (1 hop) | yes |
| `http://quantumaire.space/` | 308 → `https://quantumaire.space/` → 307 `/en` (2 hops) | acceptable |
| `https://quantumaire.space/` | 307 → `/en` (Accept-Language/cookie) | acceptable; x-default = `/en` |
| `/en/` , `/en/stop/jupiter/` | 308 → no slash | yes |
| `/stop/jupiter` | 307 → `/en/stop/jupiter` | yes |
| `/en/stop/nonexistent`, `/en/foo-bar`, `/sr/topics/nope`, `/en/tag/nope`, `/en/category/nope`, `/nonexistent.txt` | 404 (noindex) | yes |
| `/EN/stop/jupiter`, `/de/stop/jupiter` | 307 → `/en/EN/stop/jupiter` → 404 | minor: extra hop; could 404 directly or lowercase-redirect |
| `/en/tools`, `/en/category`, `/en/tag`, `/en/stop` | 404 | see breadcrumb note §7 |
| `/favicon.ico` | **404** (HTML) | minor — add `app/favicon.ico` or a redirect to `/icon.svg`; some crawlers/clients still request it |
| `/en/random` | 307 → random topic | fine (not linked as content) |
| `/api/indexnow` | 405 | fine |

**404 page**: correct status + `noindex`, but the SSR `<body>` is empty
(`<div hidden><!--$--><!--/$--></div>`) — the content arrives only through the RSC payload,
and `<title>` is the generic home title. No ranking impact; for UX/no-JS give
`app/[locale]/not-found.tsx` server-rendered content and a "Page not found" title.

## 2. Titles (target 30–60, unique)

No duplicates. 49 outside 30–60:

**Too short (guides, about, tools)** — fix with keyword-rich titles (add a `seoTitle` key
to each guide in `locales/en.json`/`sr.json`, like the tag pages already have):

| URL | Current | Suggested |
|---|---|---|
| /en/topics/stars | Stars · Quantumaire (19) | Stars Explained: How Big, Hot and Far Are They? |
| /en/topics/planets | Planets · Quantumaire | The Planets: Sizes, Distances and Facts Compared |
| /en/topics/black-holes | Black holes · Quantumaire | Black Holes: How Big Can They Get? (Sizes Compared) |
| /en/topics/nebulae | Nebulae · Quantumaire | What Is a Nebula? Star Nurseries and Remnants Explained |
| /en/topics/moons | Moons · Quantumaire | Moons of the Solar System: Sizes and Facts |
| /en/topics/big-bang | The Big Bang · Quantumaire | The Big Bang Explained: What Happened 13.8 Billion Years Ago |
| /en/topics/supernova | Supernovae · Quantumaire | What Is a Supernova? How Massive Stars Die |
| /en/topics/time | Time · Quantumaire | Is Time Relative? Time Dilation Explained Simply |
| /en/topics/distances | Distances · Quantumaire | Space Distances Explained: Light-Years, AU and Parsecs |
| /en/about | About Quantumaire (17) | About Quantumaire — How We Measure the Universe |
| /sr/topics/* (same 9) | "Zvezde · Quantumaire" … | e.g. "Zvezde: koliko su velike, vrele i daleke?" |
| /sr/about | O Quantumaire-u (15) | |
| /sr/tools/between | Šta je između? · Quantumaire (28) | (EN "What's in between? · Quantumaire" is 32 chars but has no keyword either: "What's Between Two Sizes? Scale Finder") |

**Too long (> 60)** — trim; Google cuts at ~580 px:
`/en/tag/spacetime` (82), `/en/tag/animal` (72), `/en/tag/unit` (70), `/en/tag/phenomenon` (69),
`/en/tag/particle` (66), `/en/tag/gas-giant` (64), `/en/tag/hypothetical` (64),
`/en/category/forces-and-spacetime` (61); SR: `/sr/tag/spacetime` (77), `/sr/tag/phenomenon` (75),
`/sr/tag/animal` (69), `/sr/tools/scale` (68), `/sr/tag/particle` (63), `/sr/category/life-and-earth` (62),
`/sr/tag/biology` (61), `/sr/tag/hypothetical` (61).
Stop pages at 61–62 chars purely because of the " · Quantumaire" suffix:
`/en/stop/{mount_everest,halley,neutron_star,supermassive_black_hole,milky_way}`,
`/sr/stop/{planck_length,mpd,pyramid,halley,proxima_centauri,light_year,observable_universe}` —
other long ones already drop the suffix; apply the same rule at ≥ 60 (title template
logic in `buildPageMetadata`, `lib/seo.ts`).

**Title vs intent on stop pages**: sized topics use "How Big Is X? Size & Scale Compared"
(good). Ideas use "`{name} — {category}`" (weak, see §11). `/en/compare` = "Quark vs Earth ·
Compare two objects" — the default pair leaks into the canonical page's title; use
"Size Comparison Tool: Compare Any Two Things in the Universe".

## 3. Meta descriptions (target 70–160, unique)

No duplicates, none missing. 18 too long (Google truncates):
`/en/about` & `/sr/about` (300 — the whole intro paragraph), `/en/compare` (162),
`/en/topics` (162), `/sr/topics` (177), `/sr/glossary` (162), `/sr/tools/scale` (166),
`/en/tag/{biology 182, phenomenon 203, gas-giant 174, spacetime 189, particle 171, animal 163, matter 179}`,
`/sr/tag/{biology 173, phenomenon 181, spacetime 185, matter 190}`.
→ tag `description` keys in `locales/*.json` (tags block near `seoTitle`), about page
metadata (`app/[locale]/about/page.tsx`) — use a dedicated ≤155-char summary.

**73 descriptions end in a mid-sentence "…"** (generated by `clipDescription(…,160)`):
all 13 guides × 2 locales (tagline + intro clipped), and EN stops
`string_theory, quark, higgs_boson, antimatter, quantum_entanglement, dna, tardigrade, blue_whale, mpd, mount_everest, gravity, time_dilation, moon, pluto, jupiter, proxima_centauri, supermassive_black_hole, gravitational_waves, ton_618, phoenix_a, wormhole, voyager1, milky_way, andromeda, galaxy_cluster, laniakea_supercluster, dark_matter, dark_energy, big_bang, observable_universe, multiverse`
(+ SR equivalents). Example `/en/stop/jupiter`:
"…heavier than all the others combined. See how it compares to a human, Earth and the…".
Fix (`app/[locale]/stop/[id]/page.tsx:66-75`): drop `sizeFaq.metaTail` when it would not
fit whole, and clip on sentence boundary rather than adding "…"; for guides use a short
dedicated `metaDescription` key instead of `tagline + intro`.
**Logic bug**: `/en/stop/earth` → "See how it compares to a human, Earth and the universe."
and `/sr/stop/earth` "Uporedite sa čovekom, Zemljom i svemirom." (Earth compared with Earth);
`/stop/human` likewise compares to a human. Exclude self from the tail.

## 4. H1

Exactly one H1 on all 176 pages. Content notes:
- Home H1 "From the smallest spark to the edge of everything." contains no query term; the
  title carries "Scale of the Universe". Consider "The Scale of the Universe — from the
  smallest spark to the edge of everything".
- Stop H1 is just the name ("Jupiter") while title asks "How Big Is Jupiter?". Fine, but a
  visible subtitle/H2 "How big is Jupiter?" near the top would match the query (the FAQ H3
  is far down).
- `/en/topics` H1 "Guides", `/en/glossary` H1 "Glossary", `/en/compare` H1 "Compare two
  objects" — generic; add keywords ("Space & physics glossary", "Size comparison: compare
  any two things in the universe").

## 5. Canonical / hreflang / lang

All correct on the 176 sitemap pages (self canonical; `en`, `sr-Latn-RS`, `x-default`→EN,
reciprocal; html lang matches; og:locale `en_US`/`sr_RS`).
- **Sitemap hreflang lacks `x-default`** (pages have it). Harmless, but add it in
  `alternates()` in `app/sitemap.ts` for consistency.
- `/compare?a=…&b=…` canonical → `/compare` (deliberate) — see §11 for the opportunity cost.
- The language switcher is not an `<a href>` (0 cross-locale anchors found): SR pages are
  discovered only via hreflang/sitemap. Rendering the switcher as a real link
  (`components/LanguageSwitcher.tsx`) gives crawlers a direct path.

## 6. Open Graph / Twitter

- All present; all og:images 200 `image/png`.
- **Generic OG image on 35 pages per locale** (`/en/opengraph-image/en`): home, about,
  glossary, tools/scale, tools/between, topics index, all 13 guides, all 6 categories, all 10
  tags (+ SR). Guides/tags/categories should get their own (e.g. reuse the hero image of the
  guide's first topic, or an `opengraph-image.tsx` under `topics/[slug]`, `tag/[tag]`,
  `category/[slug]`).
- `og:type` is `website` everywhere; use `article` for guides and topic pages.
- OG images are served with `max-age=0, must-revalidate` (Satori re-render on every
  social fetch) — cache them (`s-maxage=86400` or longer; content is static per deploy).

## 7. Structured data (JSON-LD)

Types found: EducationalOrganization 176, WebSite 176, BreadcrumbList 174, FAQPage 120,
LearningResource 104, CollectionPage 32, Article 26, SoftwareApplication 6, ItemList 4,
AboutPage 2, DefinedTermSet 2. All parse; no empty FAQ answers; no template leaks.

Issues:
1. **`dateModified` = request date** on all 104 LearningResource + 26 Article blocks
   (`2026-11-19` today, `datePublished 2025-09-01`). Source `lib/seo.ts:25`
   `SITE_MODIFIED = new Date()…` — evaluated at runtime on the Worker. Use a build-time
   constant (inject at build via env, e.g. `process.env.BUILD_DATE` set in `deploy-cf.sh`)
   or, better, per-topic git last-modified.
2. **Article (guides) has no `image`** — required-ish for Article rich results. Add the guide's
   hero image / OG image.
3. **Idea topics' FAQPage has a single, self-referential question** ("How certain is what we
   know about Gravity?") — `/stop/{gravity,dark_matter,dark_energy,voyager1,higgs_boson,
   antimatter,quantum_entanglement,time_dilation,gravitational_waves,wormhole,big_bang,
   multiverse,string_theory,mpd}` × 2. Add "What is X?" (from tagline/body) and topic-specific Qs.
4. **Tools breadcrumb**: `/tools/scale` breadcrumb "Tools" → `https://quantumaire.space/en/tools/scale`
   (same URL as the leaf); `/en/tools` is a 404. Drop the middle item or create a `/tools`
   hub page (`app/[locale]/tools/scale/page.tsx:74`, same in `tools/between`).
5. **Stop breadcrumb** is Home → Topic; adding the category (Home → Cosmos → Jupiter) builds
   a better hierarchy and links categories (which have weak internal links).
6. `EducationalOrganization.url` = `https://quantumaire.space` (307 → `/en`) and
   `sameAs: []`. Use `https://quantumaire.space/en` (or keep root) and either fill `sameAs`
   with real profiles or remove the empty array.
7. `WebSite.potentialAction` SearchAction: Google retired the sitelinks search box (2024) —
   harmless, no action needed.
8. Serbian FAQ questions are template-awkward: "Jupiter — kolika je veličina?",
   "Kad bi Zemlja bila zrno peska, kolika bi bila veličina — Jupiter?",
   "Koliko je sigurno ono što znamo o temi: Jupiter?". Serbian users search
   "Koliki je Jupiter?", "Koliko je veliki Jupiter u odnosu na Zemlju?". Add per-topic SR
   subject forms (like `sizeFaq.subjects` for EN) so questions read naturally.

## 8. Images

No `<img>` without `alt`. 472 `alt=""` are the header logo (176) and small decorative
thumbnails in related cards next to visible names — acceptable. Main topic images have
descriptive alt. `srcset` maps 1200w–3840w all to the original `/images/x.webp` — harmless.
Opportunity: an **image sitemap** (`images` field in `app/sitemap.ts`) for the 52 licensed
topic images (Google Images traffic for "size of X compared" is real).

## 9. Internal links

- **Broken internal links: none.** Only non-200 target: `https://quantumaire.space` (JSON-LD
  Organization url, 307 → `/en`, on all 176 pages) — see §7.6.
- **Orphans (no plain `<a href>` inbound anywhere)**: `/en/compare`, `/sr/compare`,
  `/en/tools/between`, `/sr/tools/between`. (`/compare?a=X&b=earth` links exist on stop
  pages but point to canonicalised variants.)
- **Weakly linked** (inbound pages): guides 3–24 (`/topics/nebulae` 3, `/topics/supernova` 3,
  `/topics/big-bang` 4, `/topics/planets` 4, `/topics/time` 4, `/topics/moons` 5);
  `/topics` index 26 of 176 pages; `/category/human-mind` and `/category/ancient-history` 2;
  `/stop/mpd`, `/stop/multiverse` 5.
- **Root cause**: `components/NavMenu.tsx:62` renders `NavGroups` only `{open && …}`; the
  SSR site-wide links are just `/`, `/about`, `/glossary`, `/tools/scale`, `/llms.txt`,
  `/sitemap.xml` (footer). Fix: render `NavGroups` (Guides index + every guide, Compare,
  Between, Converter, all categories) as a plain link list in `components/SiteFooter.tsx`
  (server component), or keep the menu in the DOM and toggle with CSS.
- Footer links to raw `/llms.txt` and `/sitemap.xml` — harmless but they consume link
  equity on every page; consider dropping from the visible footer.
- Missing linking patterns: stop pages → their category (only via breadcrumb text?), stop
  pages → `/compare` with a *meaningful* pair (neighbour, not always Earth), guides →
  each other ("related guides"), categories ↔ guides, glossary terms → guides.

## 10. Thin / low-value pages (< 250 visible words, excl. nav-heavy chrome)

| URL (EN; SR equivalents same) | words | items |
|---|---|---|
| /en/tag/matter | 131 | 2 |
| /en/tag/galaxy | 139 | 2 |
| /en/tag/unit | 143 | 2 |
| /en/tag/hypothetical | 149 | 3 |
| /en/tag/particle | 149 | 3 |
| /en/tag/animal | 154 | 2 |
| /en/tag/spacetime | 189 | |
| /en/tag/phenomenon | 195 | |
| /en/tag/gas-giant | 206 | 4 |
| /en/tag/biology | 237 | |
| /en/category/ancient-history | 137 | 1 (pyramid) |
| /en/category/human-mind | 153 | 1 (mpd) |
| /en/compare | 234 | tool |
| /sr/category/life-and-earth | 235 | |

Fix options: raise the tag threshold in `lib/tags.ts` from ≥2 to ≥4 topics (and 308 the
dropped ones to a guide/category, like the existing tag→guide redirects in
`next.config.ts`), or enrich each tag page with an intro + a comparison table (size ratio
between members, "X is N× bigger than Y" — content the site can generate). The two
single-topic categories (Human Mind: `mpd`; Ancient History: `pyramid`) are very thin
hubs; consider merging into "Life & Earth"/"People & places" until they have ≥4 topics.

## 11. Sitemap

- 176 URLs, all 200, all self-canonical, EN+SR symmetric. Covers home, about, glossary,
  tools/scale, tools/between, compare, topics index, 13 guides, 6 categories, 10 tags, 52
  topics per locale. **No indexable page missing** (crawl found no 200 page-like internal
  URL outside the sitemap except the canonicalised `/compare?a=…` variants and noindex
  `/progress`, `/favorites`).
- **No `<lastmod>`** on any URL. Google uses lastmod when it's consistently accurate; add a
  real per-URL date (content/locale file git mtime at build, not `new Date()`).
- `changefreq`/`priority` are ignored by Google — harmless.
- Add `x-default` to sitemap alternates; consider an image sitemap (§8).

## 12. robots.txt / llms.txt

- robots.txt: `Allow: /`, `Disallow: /api/`, sitemap declared. Note the second group
  (GPTBot … Bingbot, DuckDuckBot, YandexBot) only says `Allow: /` — a crawler obeys only its
  most specific group, so **Bingbot/Yandex/etc. are no longer told `Disallow: /api/`**. Add
  `disallow: ["/api/"]` to that group in `app/robots.ts`. `Host:` is a Yandex-only directive
  (harmless). robots.txt is served `max-age=0` — fine.
- llms.txt (26 KB) + llms-full.txt (145 KB) OK, but still uses internal naming that CLAUDE.md
  forbids in UI: "list every **stop** between two sizes", "Compare two **stops**",
  section header "### **Stops** (en)" → `app/llms.txt/route.ts` (and llms-full).

## 13. Response headers

| Resource | cache-control | encoding | Verdict |
|---|---|---|---|
| HTML (`/en`, `/en/stop/jupiter`) | `private, no-cache, no-store, max-age=0, must-revalidate` | br | **not cacheable anywhere**; dynamic render per request |
| `/_next/static/chunks/*.js`, `*.css` | `public, max-age=0, must-revalidate` (cf HIT, ETag) | br | **should be `public, max-age=31536000, immutable`** |
| `/_next/static/media/*.woff2` | `public, max-age=0, must-revalidate` | — | **should be immutable 1 y** |
| `/images/w384/jupiter.webp` etc. | `public, max-age=0, must-revalidate` | — | should be long (e.g. `max-age=2592000, stale-while-revalidate`); not hashed, so 30 d rather than immutable unless filenames get hashes |
| `/icon.svg`, `/apple-icon.png`, `/manifest.webmanifest` | `max-age=0` | br | 1 d+ fine |
| OG images | `public, max-age=0, must-revalidate` | — | cache ≥ 1 d |
| `/sitemap.xml`, `/robots.txt` | `max-age=0` | br | OK |
| `/llms.txt` | `max-age=3600, s-maxage=86400` | | OK |
| any response | **no `strict-transport-security`** | | add HSTS |

Fixes:
1. Create `public/_headers` (Cloudflare Workers static assets support it with OpenNext):
   ```
   /_next/static/*
     Cache-Control: public, max-age=31536000, immutable
   /images/*
     Cache-Control: public, max-age=2592000, stale-while-revalidate=86400
   ```
2. HSTS: enable in Cloudflare dashboard (Edge Certificates → HSTS, max-age 1 y,
   includeSubDomains), or add `Strict-Transport-Security` via `headers()` in `next.config.ts`.
3. HTML no-store: `app/layout.tsx:81` reads `headers()` to set `<html lang>`, which makes
   every route dynamic. Put `<html lang={locale}>` in `app/[locale]/layout.tsx` (root layout
   can be minimal / or use the `[locale]` layout as root) so the pages are prerendered
   (they already have `generateStaticParams` + `dynamicParams=false`) and can be
   edge-cached by OpenNext's incremental cache.
4. HTML weight: a stop page is 331 KB uncompressed, 76 `<script>` tags / 53 RSC push
   chunks. Worth checking what is serialized into the RSC payload (e.g. full stops/locale
   JSON passed to client components like Search/StopCombobox) — a perf item, not an
   indexing blocker.

---

## 14. Content & search-intent opportunities

The site has the data; titles/FAQs target only "how big is X".

1. **"How big is X compared to Earth"** — very common phrasing ("how big is jupiter
   compared to earth", "how big is the sun compared to earth"). The FAQ asks "compared to
   a human". Add a "compared to Earth" Q (and "how many Earths fit in X" — volume ratio is
   trivial to compute) for planets/stars/moons. Keep the human Q for small things.
2. **"How far is X (from Earth)"** — 22 topics have `distanceFromEarthMeters` (sun, moon,
   all planets, pluto, halley, proxima_centauri, uy_scuti, andromeda, voyager1, milky way
   centre, galaxy_cluster, laniakea, ton_618, phoenix_a, observable_universe, solar_system).
   Add FAQ "How far away is the Moon?" with km + light-time + grain-of-sand scale; for
   **Voyager 1** the title itself should be "How Far Away Is Voyager 1 Right Now?" (its main
   search intent) instead of "Voyager 1 — Cosmos".
3. **"How hot is X"** — 16 topics have `temperatureKelvin` (sun, planets, neutron star,
   uy_scuti, everest…). Add "How hot is the surface of Venus?" style Q.
4. **"X vs Y" pair pages** — make a curated set of static, indexable comparison URLs, e.g.
   `/en/compare/jupiter-vs-earth`, `sun-vs-earth`, `moon-vs-earth`, `uy-scuti-vs-sun`,
   `milky-way-vs-andromeda`, `ton-618-vs-sagittarius-a`, `pluto-vs-moon`, `mars-vs-earth`,
   `neutron-star-vs-earth` … with their own title ("Jupiter vs Earth: Size Comparison"),
   H1, a computed ratio paragraph, FAQ, and self-canonical; include in sitemap. Keep the
   free-form `?a=&b=` tool canonicalised to `/compare`. Link to the relevant pair from each
   topic (nearest neighbour + Earth).
5. **"What is X" for ideas** — retitle the 14 idea topics: "What Is Dark Matter? Evidence
   and What We Know", "What Is Gravity? The Weakest Force Explained", "Is Time Dilation
   Real? …", "Do Wormholes Exist? …", "What Is String Theory? …", "Is There a Multiverse?
   …", and add 3–4 real FAQ Qs each (the badge Q can stay as the last one).
6. **Cannibalisation**: `/stop/big_bang` vs `/topics/big-bang`; `/stop/observable_universe`
   vs `/topics/how-big-is-the-universe`; `/stop/light_year` vs `/topics/distances`;
   `/stop/supermassive_black_hole` vs `/topics/black-holes`. Give each pair distinct intent
   (topic page = "How big is the observable universe? 93 billion ly" / guide = broader
   "Is the universe infinite?") and cross-link with intent-specific anchors.
7. **Superlative queries**: "biggest star" (UY Scuti), "biggest black hole" (TON 618 /
   Phoenix-A), "smallest planet" (Mercury), "biggest planet" (Jupiter), "largest animal
   ever" (blue whale) — the guides `largest-/smallest-things-in-the-universe` should have
   H2s phrased as these queries with jump links to topic pages.
8. **Unit-conversion intents for the converter** (`/tools/scale`): "how many km in a
   light-year", "AU to km", "light-years to parsecs" — already in its FAQ; add H2s and
   pre-filled, linkable states.
9. **Serbian intents**: titles use "X: veličina i razmere u poređenju"; Serbian queries are
   "Koliki je Jupiter", "Koliko je daleko Mesec", "Koliko je veliko Sunce u odnosu na Zemlju".
   Consider "Koliki je Jupiter? Veličina u poređenju sa Zemljom".
10. **Internal-linking patterns to add**: site-wide SSR footer with all guides + tools +
    categories (fixes orphans); "Related guides" on guides; category breadcrumb on topics;
    glossary term pages linking back to the guides that use them (already "Used in");
    "Next bigger / next smaller" links already exist — keep.

---

## Files in this directory

- `crawl.py` — `python3 -I crawl.py <dir>` fetches `urls.txt` → `pages.json`, `raw/*.html`
- `analyse.py` — `python3 -I analyse.py <dir>` → `findings.json` (all checks, link checks, OG image checks)
- `probe.py` — `python3 -I probe.py <dir> URL…` quick metadata dump
- `sitemap.xml`, `urls.txt`, `llms.txt`, `j.html` (Jupiter page sample)
