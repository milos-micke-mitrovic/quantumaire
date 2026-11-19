# Quantumaire — code audit (performance, accessibility, code health)

Audit date 2026-11-19, against live https://quantumaire.space (via `--resolve …:104.21.50.132`) and repo HEAD `2ae6c6a`. Read-only; nothing in the repo was changed.
Live captures: `/private/tmp/claude-501/-Users-milosmitrovic-Projects-my-quantumaire/495a8e4e-0c89-4933-b77a-b1d5999716fa/scratchpad/audit/live/`

## TL;DR — top 10 by impact × effort

| # | Impact | Effort | Finding |
|---|---|---|---|
| 1 | High | Low | Hashed `/_next/static/*` and `/images/*` are served with `cache-control: public, max-age=0, must-revalidate`, so the browser revalidates every chunk and image on every visit. Add `public/_headers`. |
| 2 | High | Medium | **No page is prerendered.** `headers()` in `app/layout.tsx:81` makes every route dynamic. HTML is `private, no-store` and every page view runs SSR on the Worker. |
| 3 | High | Medium | **The whole EN/SR dictionary (~184 KB raw, ~64 KB gz) is inlined in the RSC payload of every HTML page** (`app/[locale]/layout.tsx:41`). That is about 85% of the `/tools/scale` HTML (74 KB br). |
| 4 | High | Low | The LCP elements start hidden. The SSR output has `style="opacity:0"` on the stop-page `<header>` (with the hero image and H1 inside), the home hero copy and all 52 home cards. They only appear after hydration plus a framer animation. The home hero image is `loading="lazy"`. Stop hero `priority` produces neither `fetchpriority` nor a preload. |
| 5 | Med-High | Low | Wrong `sizes` and missing small variants: phones fetch 1376 px originals (up to 365 KB) for about 300 px cards. Thumbnails of 32–112 px fetch the 384 px variant. Opening the compare combobox loads about 50 × w384 images (~600 KB). |
| 6 | Med | Low | `content/stops.json` is shipped to every page, including `geminiPrompt` (11.6 KB) and `sources` (11.3 KB). These are server-only or stop-page-only fields. |
| 7 | Med | Low | framer-motion ignores `prefers-reduced-motion` (no `MotionConfig reducedMotion="user"`). The Starfield canvas animates forever regardless. |
| 8 | Med | Med | Dialogs (Search, MobileNav, ShortcutsOverlay, Lightbox) have no focus trap and do not return focus on close. Search uses a broken listbox pattern (no combobox wiring, button nested in a link). |
| 9 | Med | Low | 40+ low-contrast small texts: `/45` ≈ 4.0:1, `/40` ≈ 3.4:1, `/35` ≈ 2.9:1, `/30` ≈ 2.4:1, all at 9–11 px. |
| 10 | Med | Low | Bug: on stop pages, ←/→ on a focused scale dot (JourneyMinimap → ScaleExplorer) also navigates to the previous/next topic. `KeyboardNav` ignores `defaultPrevented`. |

---

## 1. JS / HTML payload (live, Brotli on the wire)

### Per-page totals

| Page | HTML raw | HTML br | JS chunks | JS br (all) | JS br (modern, excl. nomodule polyfills) |
|---|---|---|---|---|---|
| /en | 554 KB | 91.1 KB | 16 | 269.6 KB | **228.7 KB** |
| /en/stop/atom | 320 KB | 83.7 KB | 17 | 276.9 KB | **236.1 KB** |
| /en/compare | 238 KB | 74.4 KB | 17 | 272.5 KB | **231.7 KB** |
| /en/tools/scale | 239 KB | 73.6 KB | 17 | 270.2 KB | **229.3 KB** |

CSS: one file, 44 KB raw / 9.4 KB br, shared by all pages. Four font preloads (Inter and Space Grotesk, each in latin and latin-ext).

### Chunks (br bytes) and what's in them
| Chunk | br | Pages | Contents |
|---|---|---|---|
| `0-fkxn_d~2htr.js` | 70.6 KB | all | react-dom |
| `03~yq9q893hmn.js` | 40.7 KB | all (`noModule`) | core-js polyfills. Modern browsers skip it. |
| `07cp~6qowqpn..js` | 39.3 KB | all | Next app-router runtime (flight client, prefetch) |
| `14xma7kcype6i.js` | 26.4 KB | all | Layout client tree: SiteHeader, Search, MobileNav, NavMenu, ShortcutsOverlay, Starfield, BackToTop, ReadingProgress, plus part of framer-motion |
| `07y.rnnu3nzza.js` | 15.9 KB | all | framer-motion core (MotionValue, `reducedMotion`, layout) |
| `10ncx8p1uu20r.js` | 13.1 KB | all | Next runtime |
| `15u2ca73n44~i.js` | 11.1 KB (48 KB raw) | **all** | **`content/stops.json` (all 52 stops incl. `geminiPrompt`, `sources`, credits)**, plus TOPICS/TAGS |
| `0mu1~m2exk2ir.js` | 9.5 KB | all | `lib/scale.ts`, COMPARISON, units |
| `01sv6dq8.c0co.js`, `04t8~-69scip3.js` | ~9 KB each | all | Next/React runtime |
| `0t5wg6agq3g~g.js` | 9.0 KB | all | Bookmarks, references, ScaleExplorer helpers |
| `0jr.aas48f~dt.js` | 6.4 KB | home | JourneyHero, Journey, CategoryShelves, StopCard |
| `16jivng79vmss.js` + `07_i-35irfnsi.js` | 13.6 KB | stop | StopDetail & co., Lightbox, JourneyMinimap/ScaleExplorer |
| `0nmp-79ui64h9.js` + `0sds_jnyk0s2u.js` | 9.3 KB | compare | ComparePage, StopCombobox, ScaleVisual |
| `17jr7zi3ff2-6.js` + `0sds…` | 6.8 KB | tools/scale | ScaleCalculator, StopCombobox |

**Is the locale dictionary shipped?** It is not in the JS chunks (`lib/glossary.ts` imports `en.json` but only server code uses it). It is shipped in a worse place, though: `I18nProvider` receives `getDictionary(locale)` as a prop (`app/[locale]/layout.tsx:41`, `lib/i18n-server.ts:85`). The whole dictionary is therefore serialized into `self.__next_f.push(...)` in the HTML of every page. All 52 `funFact`s appear even on `/en/tools/scale`. Measured cost: ~194 KB raw / ~64 KB gzip per first page load. That is most of every HTML document, and it cannot be cached separately from the page.
Weight of the `stops.*` keys alone: body 22.9 KB, facts 17.9 KB, funFact 11.5 KB, narrative 9.2 KB, ifDistance 3.7 KB, massNarrative 3.5 KB. `topics` is 48 KB and `glossary` 15 KB.

**Is stops.json shipped?** Yes, all of it, on every page (chunk `15u2ca…`), because the header `Search` and many client components import `STOPS`. On stop pages the `Stop` objects passed as props to the client `StopDetail` also repeat `geminiPrompt` 5 times in the RSC payload (stop, prev/next, related).

### Fixes (in order)
1. **Cache headers** (`public/_headers`, which Workers static assets honour; OpenNext copies `public/` to `.open-next/assets`):
   ```
   /_next/static/*
     Cache-Control: public, max-age=31536000, immutable
   /images/*
     Cache-Control: public, max-age=604800, stale-while-revalidate=86400
   /logo.svg
     Cache-Control: public, max-age=604800
   ```
   Keep `/sw.js` at `max-age=0`. Verify with `curl -sI` after deploy. Today even a cf-cache HIT goes out as `max-age=0, must-revalidate` (checked on chunks, `/images/w828/atom.webp` and `/images/hero-deep-field.webp`).
2. **Make pages static.** Remove `headers()` from `app/layout.tsx:81`. Make `app/[locale]/layout.tsx` the root layout that renders `<html lang={HREFLANG_MAP[locale]}>`: the standard i18n multi-root-layout pattern. `generateStaticParams` and `dynamicParams=false` are already in place. Root `app/page.tsx` and `app/not-found.tsx` then need their own minimal `<html>`, or can be handled by middleware. `HtmlLangSync` becomes unnecessary. In OpenNext, set `incrementalCache: staticAssetsIncrementalCache` (the site is SSG-only) or R2. Today `.next/prerender-manifest.json` lists only 9 non-page routes, and the 104+ topic pages render per request (TTFB ~165–190 ms measured, `no-store`).
   Caveat: `/compare` uses `useSearchParams` inside `<Suspense fallback={null}>` (`app/[locale]/compare/page.tsx`). Once static, the server HTML would be empty. Give it a real fallback (render with `DEFAULTS.size`) or keep that route dynamic.
3. **Stop shipping the full dictionary.** Options, cheapest first:
   - a) Build a client subset in the layout: `common`, `categories`, `badges`, `tags`, `tagPages.*.short/title`, `topics.*.title/tagline`, `stops.*.name/tagline`, `referenceLabels`, `comparison`, `analogy`, `spacecraft`. Exclude `stops.*.body/narrative/funFact/facts/massNarrative/ifDistance`, `topics.*` bodies, `glossary` definitions, `about`, `sizeFaq`, `seo`, `faq`. Pass the page-specific remainder from each page's server component (`<I18nProvider extra={...}>`, or plain props). Expected saving: roughly 120–150 KB raw / 40–50 KB gz per HTML.
   - b) Long term: render text-only parts as server components with `tServer` (see §2), so they never need client `t()`.
   - Note: the Search haystack uses `facts.fact1..4` (`components/Search.tsx:75`). Drop it, or build the search index server-side into a static JSON fetched on first open.
4. **Client-safe stops projection.** Add `lib/stops-client.ts`, generated at build time or with a mapped `STOPS_LITE`, containing only `id, i18nKey, sizeMeters, distanceFromEarthMeters, temperatureKelvin, category, accent, accentGlow, image{src,aspect,altKey}, tags, distanceNameKey, order`. Import it from all `"use client"` files. Keep `geminiPrompt`, `credit`, `sources` and `glossary[]` server-only, passed as props where needed. Saves ~23 KB raw of the 48 KB chunk on every page and removes AI-prompt text from the public bundle.
5. **Lazy-load rarely used UI** with `next/dynamic(() => import(...), { ssr: false })` and load on first open:
   - `SearchDialog` (`components/Search.tsx:54-398`): keep the trigger button and shortcut listener in the header and load the dialog plus the STOPS/TOPICS/TAG_PAGES index on open, or on `pointerenter`/`focus` of the trigger.
   - `ShortcutsOverlay` (`app/[locale]/layout.tsx:51`): only a small `?` key listener is needed up front.
   - `MobileNav` drawer body, the Lightbox modal part of `LightboxImage`, and `JourneyMinimap` on stop pages (below the fold, pulls in the whole ScaleExplorer).
6. **Use less framer-motion.** All 64 client components share `LazyMotion domAnimation`, about 25–30 KB br. Most uses are one-shot fade/slide-ins: `JourneyHero`, `StopDetail` header/story, `StopCard` `whileInView`, `TopicView`, `TopicsIndex`, `AboutContent`, `CategoryView`, `ShareBar`, `BackToTop`, and the dialog fades. Replace them with a CSS `@keyframes fade-up` utility, plus `animation-timeline: view()` or a single IntersectionObserver for in-view cards. `ReadingProgress` can be `animation-timeline: scroll()` with a JS fallback. Keep framer only where it earns its weight (AnimatePresence exits, `ScaleVisual`), or drop it entirely. This also fixes the opacity-0 LCP problem in §3.
7. Fonts: four woff2 preloads on EN pages. Consider `preload: false` for the latin-ext subsets on EN; they are needed only for SR (č ć š ž đ).

## 2. Rendering

### `"use client"` that could be server components
Every component in `components/` except `EverydayScale`, `FaqSection`, `JsonLd`, `SpacecraftSpeeds` and `StopSizeFaq` is a client component, mostly only to call `useI18n().t`.
These have **no** hooks or handlers and could become server components (with `tServer(locale, …)` or a `t` prop): `Badge`, `GlossaryTerm` (server wrapper with a client `Tooltip` child), `LinkedBody`, `QuickFacts`, `Sources`, `SiteFooter`, `SiteHeader` (shell only; Search/NavMenu/switchers stay client islands), `SkipToContent`, `StopGuides`, `StopHighlights`, `StopTags`, `TagView`.
These use motion only and become server components once fades are in CSS: `JourneyHero`, `CategoryView`, `AboutContent`, `TopicView`, `TopicsIndex`, `StopDetail` (keep `KeyboardNav`, `useMarkVisited`, `BookmarkButton`, `ShareBar`, `LightboxImage`, and the NavCard section-hash click as small client islands).
Payoff: smaller hydration cost on stop pages and no need to ship body text in the dictionary.

### Heavy or repeated work in render (all small, since N = 52, but easy to fix)
- `components/InteractiveScale.tsx:39` builds `TICKS.map(...)` each render, so a new `ticks` array invalidates `visibleTicks` in `ScaleExplorer.tsx:95` on every arrow key. Memoise on `[t, units]`. The same applies to `DistanceScale.tsx:45-54` (`ticks` literal).
- `ScaleExplorer.tsx:79-86`: `axis` memo depends on `items`, which is fine because the wrappers memoise. `formatValue` arrow props are recreated each render (cheap).
- `ComparePage.tsx:57` `StopPicker` rebuilds `options` (formatting ~50 values) every render. Wrap it in `useMemo([stops, t, units, tempUnit])`.
- `ScaleCalculator.tsx:66,111` `sizedStops()` filters and sorts STOPS on each memo run. Hoist to a module constant. The same goes for `BetweenFinder.tsx:23`, `ComparePage.tsx:32 eligibleStops` (make it a `Record<Mode, Stop[]>` constant), and `CategoryShelves.tsx:44-64`, which calls `getStopsByCategory` three times per category.
- `lib/references.ts:104` sorts `REFERENCES` on every call. Precompute once.
- `lib/visited.ts:51`: each of the 52 home `StopCard`s calls `useVisited()` and JSON-parses the same snapshot. Cache the parsed Set at module level keyed by snapshot string, or read visited once in `CategoryShelves` and pass a boolean down.
- `StopDetail.tsx:129-135` splits the body to compute reading time in render. Precompute server-side and pass it as a prop.
- `EverydayScale` and `buildAnalogies` already run server-side. Once pages are SSG (fix 2) they run at build time.

### Hydration-mismatch risks
- `lib/visited.ts:34-36` `getSnapshot` reads `localStorage` **without try/catch**, unlike `readSet`. In Safari with storage blocked, or a sandboxed iframe, it throws and crashes every `StopCard`/`NavGroups` render. Wrap it in try/catch. `lib/bookmarks.ts:35` has the same issue.
- `SiteFooter.tsx:55` `new Date().getFullYear()` in a client component. Harmless except at New Year; once SSG it freezes at build time. Make it a server component (it already is in effect) or pass the year as a prop.
- `toLocaleString(locale)` in `lib/scale.ts` and `ScaleCalculator.tsx:55,63` renders on the Worker (ICU) and in the browser. `sr-Latn-RS` grouping and decimal output can differ between engines (e.g. NBSP vs `.`), which gives text mismatches on SR pages. Prefer a fixed `Intl.NumberFormat` with explicit options, or verify SR pages in the console for hydration warnings.
- `useUnits`/`useTempUnit`/`useVisited` use `useSyncExternalStore` with server snapshots, which is correct. Units flip after hydration (expected).
- `Starfield` `Math.random` is inside an effect, which is fine. `ShareBar` uses `useSyncExternalStore` correctly.

## 3. Images

- **Home LCP:** `components/JourneyHero.tsx:15-22` hero `<Image fill sizes="100vw">` has no `priority`/`preload`, so it is rendered `loading="lazy"` (confirmed in live HTML). On top of that, the eyebrow, sub-tagline and CTA are SSR'd `opacity:0`. Fix: `preload` (Next 16) or `loading="eager" fetchPriority="high"`. It is only 7–69 KB, so this is cheap.
- **Stop LCP:** `components/StopDetail.tsx:112-120` wraps the hero image and H1 in `motion.header initial={{opacity:0,y:16}}`. Live HTML: `<header … style="opacity:0;transform:translateY(16px)">`. LCP cannot happen until JS (~236 KB br) has downloaded and hydrated, plus 500 ms. Remove the initial-hidden state from above-the-fold content, or use a CSS animation that starts from a visible state. `LightboxImage priority` (`StopDetail.tsx:179`) emits only the default eager load: no `fetchpriority="high"` and no `<link rel=preload as=image>` in the live HTML. Use `preload`/`fetchPriority="high"`.
- **Home cards are invisible without JS:** 55 `opacity:0` elements on `/en` (all `StopCard` `whileInView`). That is bad for no-JS crawlers' rendering snapshots and for slow devices.
- **`sizes` correctness:**
  - `StopCard.tsx:50` `"(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"`. In home shelves the card is `w-[78%] max-w-[300px]` / `sm:w-[300px]` (`CategoryShelves.tsx:~189`) minus `p-5`, so the image is about 260 px. A 390 px 3× phone picks ≥1170w, which is the **original** (1376 px, up to 365 KB: `human.webp`, `big-bang.webp` 340 KB, `light-year.webp` 319 KB, `gravitational-waves.webp` 316 KB, `milky-way.webp` 282 KB, `andromeda.webp` 272 KB, `observable-universe.webp` 253 KB). Make `sizes` a prop: shelves `"(min-width: 640px) 260px, 70vw"`; grids `"(min-width:1024px) 300px, (min-width:640px) 45vw, calc(100vw - 4.5rem)"`.
  - `ImagePlaceholder.tsx:37` default `"(min-width: 1024px) 50vw, 100vw"` (stop hero). The column is at most about 440 px (`max-w-5xl`, 2-col, padding), so a 1440 px 2× desktop picks the original. Use `"(min-width: 1024px) 440px, calc(100vw - 5.5rem)"`.
- **Missing small variants:** `lib/imageLoader.ts:9` `IMAGE_WIDTHS = [384, 640, 828, 1080]`. Every thumbnail request at 32/48/64/96/128/256 resolves to w384 (see the srcset in live HTML): `StopCombobox` options at 32 px (`StopCombobox.tsx:116,199`), `NavCard` 64 px (`StopDetail.tsx:336`), `ScaleExplorer` preview 112 px (`ScaleExplorer.tsx:190`). Opening the Compare/Converter combobox renders about 50 options and loads about 50 × w384 (≈12 KB each, ≈600 KB). Add a `w128` (and maybe `w256`) variant in `scripts/resize-images.mjs` and `IMAGE_WIDTHS`, and set `images.imageSizes: [32, 64, 128, 256]` and `deviceSizes: [384, 640, 828, 1080, 1376]` in `next.config.ts` so the srcset stops advertising 1920/2048/3840 that map to the same original. Also lazy-render option images (`loading="lazy"` is the default, but the list is a scroll container, so many load anyway).
- **Originals over 250 KB:** 6 of 53 are listed above. They are served whenever the requested width is above 1080, which is common given the `sizes` above. Re-encode the originals at q≈72 like the variants, or add a 1376 variant at q72 and stop serving the raw originals. `w1080/human.webp` is still 235 KB, so lower the quality for photographic noise.
- **Width/height / CLS:** all content images use `fill` inside `aspect-*` boxes and the logo has 28×28, so no CLS issue was found. The blur placeholder is a 1-px SVG data URL that Next expands into an ~1 KB inline `background-image` style per image (104 copies on `/en`, ~100 KB raw HTML). Since it is a flat colour, drop `placeholder="blur"` and use `bg-cosmos-night/40` on the wrapper, which is already there (`ImagePlaceholder.tsx:47,60-61`).
- `ImagePlaceholder.tsx:47` applies `backdrop-blur-sm` on every card image wrapper (52 on home). Backdrop filters are expensive while scrolling and invisible behind an opaque image. Remove it.

## 4. Accessibility

### Landmarks, headings, lang
- Home: `SiteFooter` is rendered **inside `<main>`** (`app/[locale]/page.tsx:52-58`), so it loses its contentinfo role. Move it outside `<main>`, as stop and tool pages do.
- Skip link target `#main-content` is a `<div>` (`app/[locale]/layout.tsx:49`) without `tabIndex={-1}`. Point it at `<main id="main" tabIndex={-1}>` instead.
- Heading order: home is `h1 → h2 (journey) → h3 shelf → h3 card ×52`. Card titles sit at the same level as their shelf, so make card titles `h4` in shelves, or use a `headingLevel` prop. The stop page order is fine. `ScaleExplorer.tsx:209` uses `h3` regardless of context.
- `<html lang>` is correct server-side (`en` / `sr-Latn-RS` from middleware) as long as `headers()` stays. After fix 2, set it in the `[locale]` root layout. Add `lang="sr-Latn"`/`lang="en"` on the EN/SR language-switcher buttons (`LanguageSwitcher.tsx`, `MobileNav.tsx:167-181`).

### Dialogs (keyboard traps / focus)
| Dialog | Initial focus | Trap | Return focus | Background inert | Notes |
|---|---|---|---|---|---|
| Search (`Search.tsx:211-221`) | input after a 30 ms timeout | ✗ | ✗ | ✗ | `role=dialog` sits on the backdrop, not the panel |
| MobileNav (`MobileNav.tsx:77-95`) | ✗ (stays on burger, behind the overlay) | ✗ | ✗ | ✗ | |
| ShortcutsOverlay (`ShortcutsOverlay.tsx:46-56`) | ✗ | ✗ | ✗ | ✗ | `?` toggles; no body scroll lock |
| Lightbox (`LightboxImage.tsx:~85`) | ? | ✗ | ✗ | ✗ | trigger label hard-codes English " — zoom" (`:48`) |
| NavMenu popover (`NavMenu.tsx:64`) | ✗ | n/a | ✗ | n/a | `role="menu"` + `menuitem` without arrow-key handling or roving focus |

Fix: write one small `useDialog(ref, open, onClose)` hook that saves `document.activeElement`, focuses the first focusable (or the panel), loops Tab/Shift+Tab, sets `inert` on `#main-content` and the header while open, and restores focus on close. Alternatively, switch to native `<dialog>` with `showModal()`, which gives trap, inert and Esc for free and works with the BodyPortal requirement. Put `role="dialog" aria-modal aria-labelledby` on the panel, not the click-catching backdrop. For NavMenu, drop `role="menu"`/`menuitem` (`NavGroups.tsx:103,130,163`) and use a disclosure (`aria-expanded` + plain links).

### ARIA patterns
- **Search** (`Search.tsx:244-377`):
  - The input has no accessible name (placeholder only) and no `role="combobox"`, `aria-expanded`, `aria-controls` or `aria-activedescendant`. Arrow keys move a visual highlight that screen readers never hear about. Give options `id`s and wire them like `StopCombobox`.
  - `role="option"` `<li>`s contain a `<Link>` that contains a `<button>` (`:353-366`). That is interactive content nested in interactive content (invalid HTML, and an option must not contain focusable children). Move the category button out of the link (a sibling inside the row) or drop it.
  - The group headings `<li role="presentation">` inside the listbox should be `role="group" aria-labelledby` wrappers.
- **StopCombobox** (`StopCombobox.tsx`): mostly correct.
  - `aria-selected` reflects the committed value (`:185`), while `aria-activedescendant` points at the highlighted row. That is acceptable, but add a visible plus programmatic active state, or set `aria-selected` on the active option per APG.
  - The "no results" `<li>` (`:175`) inside `role=listbox` has no role. Render it outside the listbox or as `role="option" aria-disabled`.
  - **Bug:** Tabbing out leaves the list open, because there is no `onBlur` and only `mousedown`-outside closes it. Close on blur when `relatedTarget` is outside `wrapRef`.
  - Opening on focus (`:130`) pops the list for keyboard users who are just tabbing through. Consider opening on typing, ArrowDown or click only.
- **ScaleExplorer** (`ScaleExplorer.tsx:276-284, 343-358`):
  - Two patterns are mixed. The container `role="listbox"` has `aria-activedescendant` but is not focusable (focus sits on the `<button role="option">` via roving tabindex), so `aria-activedescendant` is ignored. Remove it.
  - The ids `scale-dot-${stop.id}` are global. They collide if two explorers mount, and `DistanceScale` + `InteractiveScale` share stop ids such as `earth`. Prefix them with `useId()`.
  - A `<button role="option">` is OK. Make sure the listbox has `aria-orientation="horizontal"`.
- `StopCard.tsx:52-56`: `aria-label` on a role-less `<span>` (visited marker) is ignored by AT. Use `<span className="sr-only">` text. `BookmarkButton` (a `<button>`) is nested inside the card `<Link>` (`StopCard.tsx:40-69`), which is invalid nesting. Clicking or tabbing to it is ambiguous, and screen readers announce the link name "Open — Atom" for everything. Restructure: make the link a stretched overlay (`after:absolute after:inset-0`) and put the button as a sibling with `relative z-10`.
- `Tooltip.tsx`: no Escape to dismiss hover/focus tooltips (WCAG 1.4.13). Add a keydown Escape handler while open.
- `MobileNav.tsx:129,163` and `Journey.tsx:42`: `role="group"` without a label in the two drawer groups. Add `aria-labelledby` pointing at the visible `<p>`.

### Focus visibility
- `app/globals.css:54-58` gives a global ring for `a, button, [role=button]`, but it also forces `border-radius: 9999px` on focused elements without a rounded class. Use `outline: 2px solid …; outline-offset: 2px` instead of box-shadow plus radius, so it follows the element's shape and shows in forced-colors mode.
- `GlossaryView.tsx:113`: `focus:outline-none` on the search input, and the wrapper has no `focus-within:` style, so **focus is invisible**. Add `focus-within:border-cosmos-aurora/60` on the wrapper. `Search.tsx:252` is the same, but the dialog context makes it less critical.
- Inputs and selects are not covered by the global rule. `ScaleCalculator.tsx:155` and `StopCombobox` use a border-colour change only (aurora/60 on white/10), which is subtle. Add a ring.

### Colour contrast (`#e0f2fe` at alpha over the backgrounds; WCAG AA needs 4.5:1 for these 9–11 px texts)
| Class | on void #03030a | on deep #0a0a1f | on night #10103a | Uses |
|---|---|---|---|---|
| `/30` | 2.33 | 2.43 | 2.46 | 1 (decorative `·`, OK) |
| `/35` | 2.81 | 2.88 | 2.91 | 3: `SiteFooter.tsx:54` ©, `JourneyHero.tsx:81` credit (over the photo), `ScaleExplorer.tsx:317` gap labels |
| `/40` | 3.37 | 3.45 | 3.41 | 11: e.g. `ScaleExplorer.tsx:244,297`, `StopDetail.tsx:239`, `CategoryShelves.tsx:101`, placeholders |
| `/45` | 4.02 | 4.04 | 4.03 | 22: e.g. `Search.tsx:285,318,381`, `NavGroups.tsx:93,121`, `StopCard.tsx:78,89,99`, `LightboxImage.tsx:77,127`, `EverydayScale.tsx:120,129` |
| `/50` | 4.73 | 4.77 | 4.68 | passes (just barely) |
| `/55` | 5.57 | 5.59 | 5.40 | passes |

Also `text-cosmos-aurora` (#7c5cff) on deep is **4.49:1** (fails at 11 px, e.g. the "Open" link `ScaleExplorer.tsx:228`). Use `cosmos-plasma` (7.4:1).
Fix: set a floor of `/55` for any informative text. A global replace of `/45`→`/55` and `/40`→`/55` keeps the hierarchy through size and tracking. Keep `/30–/40` only for `aria-hidden` decoration.

### Reduced motion
- `MotionProvider.tsx` sets no `reducedMotion`. Wrap it in `<MotionConfig reducedMotion="user">`. The CSS rule at `globals.css:61-69` doesn't touch framer's JS-driven transforms, the `ReadingProgress` spring or `ScaleExplorer` `scrollTo({behavior:"smooth"})`.
- `Starfield.tsx` animates continuously (drift and twinkle) with no `matchMedia('(prefers-reduced-motion: reduce)')` check. Draw one static frame and skip RAF when reduced. Also: `resize` regenerates all stars on every mobile URL-bar show/hide (stars jump). Debounce it and keep stars when only the height changes slightly.
- `BackToTop.tsx:34` `scrollTo({behavior:"smooth"})` and `ScaleExplorer.tsx:126` ignore reduced motion. Pick `"auto"` when reduced.

### Touch targets (< 40 px; WCAG 2.5.8 minimum is 24 px, 44 px recommended)
- Search trigger: `px-3 py-1.5` + 14 px icon ≈ **28 px** tall (`Search.tsx:431`), and it is the only search entry point on mobile.
- Burger 36 px (`MobileNav.tsx:59`), drawer close **32 px** (`:104`), dialog close buttons ≈ **24 px** (`Search.tsx:258` `p-1`, `ShortcutsOverlay.tsx:78` `p-1.5`).
- `BookmarkButton` sm **32 px** (`BookmarkButton.tsx:41`) on every card.
- ScaleExplorer prev/next **32 px** (`ScaleExplorer.tsx:253,265`). Dots are a 10 px circle plus `p-1.5` ≈ **22 px**, with lanes 15 px apart.
- Unit/Language/Temp switch pills `px-3 py-1` ≈ 24 px (`UnitSwitcher.tsx:33`, `LanguageSwitcher.tsx:27`, `TempUnitSwitcher.tsx:36`). Tag chips `py-0.5` at 10 px ≈ 18 px (`StopTags.tsx:38`). ShareBar/Compare pills ≈ 28 px.
- Fix: a `min-h-10 min-w-10` (40 px) utility on icon buttons, or invisible hit-area expansion (`relative after:absolute after:-inset-2`) where the visual size must stay small.

## 5. Code health

- **Bug, keyboard:** `KeyboardNav.tsx:19-31` does not check `e.defaultPrevented`, open dialogs, or `[role=listbox]`/scroll containers. On stop pages, ←/→ on a focused ScaleExplorer dot (JourneyMinimap) moves the dot **and** navigates to the previous/next topic. The same happens while the Lightbox or ShortcutsOverlay is open. Add `if (e.defaultPrevented) return;`, skip when `document.querySelector('[aria-modal="true"]')`, and skip when the target is inside `[role=listbox],[role=slider]`.
- **Bug, global shortcuts:** `Search.tsx:405-423` and `ShortcutsOverlay.tsx:27-41` check only tagName for typing contexts, so `contentEditable` is not covered (minor). `/` opens Search while the Lightbox or MobileNav is open, stacking dialogs.
- **Bug, storage:** `lib/visited.ts:34` and `lib/bookmarks.ts:35`: `getSnapshot` reads `localStorage` without try/catch (see §2).
- **Service worker** (`public/sw.js`):
  - `RUNTIME_CACHE` is unbounded and `VERSION` is not bumped per deploy, so every visited HTML page and every hashed chunk from every past deploy accumulates forever.
  - Non-OK responses are cached (`:61`, `:105`: no `fresh.ok` check), so a 404 or 5xx can be served offline later.
  - Image SWR (`:90-99`) refetches every image on every view for returning visitors, doubling image traffic. With fix 1 (long max-age), make images cache-first.
  - Fix: add `ok` checks and trim the runtime cache to N entries. Drop `/_next/static` from the SW, because the HTTP cache with `immutable` is enough, or purge old chunks on activate.
- **Dead code:** the `StopDistanceCard` component (`components/StopDistanceCard.tsx:82-187`) is unused. Only `computeDistance` and `DISTANCE_REFERENCE_TO_STOP_ID` are imported, by `StopValuesCard.tsx:7-10`. Move those two into `lib/distance.ts` and delete the component (~105 lines and its i18n keys `common.distanceCompare.*`, if unused elsewhere). `FilterableStopGrid` **is used** (`CategoryView.tsx:63`), so keep it.
- **Unused exports:** `lib/spacecraft.ts LIGHT_YEAR_KM` (export never imported). Internal-only items that are needlessly exported: `lib/seo.ts` `defaultOgImage`, `localePath`, `fitsWithBrand`, `SITE_PUBLISHED`, `TWITTER_HANDLE`; `lib/analogies.ts` `FAMILIAR_SIZES`, `FAMILIAR_DISTANCES`, `DISTANCE_REFS`. Low priority. `ts-prune`/`knip` would keep this in check.
- **Duplicated logic:**
  - `walkPath`/`resolveKey`/`interpolate` are copy-pasted between `lib/i18n.tsx:28-67` and `lib/i18n-server.ts:12-50`. Move them to `lib/i18n-core.ts`. Note the behavioural drift: the server falls back to EN for missing SR keys, but the client does not and shows the raw key. Share one implementation with the fallback.
  - `normalize()` appears in both `Search.tsx:23` and `StopCombobox.tsx:16`.
  - The Unit/Language toggle UI is duplicated in `MobileNav.tsx:129-183` versus `UnitSwitcher`/`LanguageSwitcher`. `LOCALE_LABELS` is duplicated too.
  - Sized-stops filter+sort appears in `ScaleCalculator`, `BetweenFinder`, `InteractiveScale` and `lib/content.ts NAV_ORDER`. Export `SIZED_STOPS` once from `lib/content.ts`.
- **Inconsistencies:**
  - `CATEGORY_DOT` lives in `ScaleExplorer.tsx` but is imported by `CategoryShelves`. Move it to `lib/content.ts` or a `lib/categoryStyle.ts`.
  - Body scroll-lock is implemented three times with `document.body.style.overflow` (Search, MobileNav, Lightbox). When two are open, closing one unlocks the page. Use a ref-counted helper.
  - Next 16 `priority` is deprecated in favour of `preload` (`ImagePlaceholder.tsx:57`, `LightboxImage`).
  - `ScaleExplorer` key is `it.stop.id + i` (`:345`). It is stable, but an id alone suffices once ids are unique.

## Suggested order of work
1. `public/_headers` cache rules (15 min, big repeat-visit win).
2. Remove the `opacity:0` initial states above the fold; add `preload`/`fetchPriority` on the home hero and stop hero (30 min, LCP).
3. `MotionConfig reducedMotion="user"` + reduced-motion Starfield; fix KeyboardNav `defaultPrevented`; storage try/catch (30 min).
4. `sizes` fixes + `w128` thumbnail variant + trimmed `deviceSizes`/`imageSizes` (1 h).
5. Contrast floor `/55`, touch-target sizes, footer out of `<main>`, glossary focus ring (1 h).
6. Client stops projection without `geminiPrompt`/`sources`; dynamic-import SearchDialog/ShortcutsOverlay/Lightbox modal/JourneyMinimap (2 h).
7. Dialog focus management hook; Search combobox semantics; card link/button un-nesting (2–3 h).
8. Static rendering (multi-root `[locale]` layout, OpenNext static incremental cache) + dictionary subsetting + server-component conversion of text-only components (half a day to a day; the biggest structural win).
