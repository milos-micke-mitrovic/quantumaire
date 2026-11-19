# Quantumaire — project guide

Bilingual (EN + Serbian Latin, ekavian) science site: everything from the
Planck length to the observable universe, compared by size, each topic
labelled with an honesty badge (FACT / ESTABLISHED_THEORY / PROBABLE_THEORY /
SPECULATIVE). Live at https://quantumaire.space. The owner gives broad
autonomy: improve UI/UX/content/SEO/speed proactively, deploy yourself.

## Stack & commands

- Next.js 16 App Router, React 19, Tailwind 3, framer-motion (LazyMotion +
  `m as motion`, strict), vitest, pnpm. Dev server: `pnpm dev` (port 5739).
- Checks: `pnpm typecheck && pnpm lint && pnpm test` (all must be clean).
- Deploy: `./deploy-cf.sh` (= `pnpm deploy:cf`) — runs checks, image
  variants, OpenNext build, wrangler deploy to the Cloudflare Worker
  `quantumaire`, purges the zone cache, pings IndexNow. `SKIP_CHECKS=1` for
  tiny follow-ups. Always commit + push to `main` before/with a deploy.
- Verify live through Cloudflare even if local DNS is stale:
  `curl --resolve quantumaire.space:443:104.21.50.132 https://quantumaire.space/…`
  (in zsh pass `--resolve` via an array, not a string variable).

## Content model

- `content/stops.json` — every topic ("stop" is the internal/code name;
  never show "stop" or "journey" in UI text). Fields: id, i18nKey,
  sizeMeters (null for ideas), order, badge, category, accent, accentGlow,
  image {src, aspect, altKey, geminiPrompt, credit}, glossary[], sources[],
  tags[], optional distanceFromEarthMeters, temperatureKelvin,
  distanceNameKey, insideNoteKey, preferredReferenceId.
  Edit as text — re-dumping with Python changes number formatting.
- `locales/en.json`, `locales/sr.json` — all UI + content text. Python
  `json.dumps(d, indent=2, ensure_ascii=False) + "\n"` round-trips them
  byte-for-byte; keep EN and SR keys in sync. Serbian count phrases use
  count-neutral forms ("Tema: {count}").
- Per-topic text keys: name, tagline, body, narrative, funFact, image.alt,
  facts.fact1..fact8, optional massNarrative, ifDistance, distanceName,
  insideNote. English size-FAQ phrases live in `sizeFaq.subjects`.
- Categories (`lib/content.ts`): MICRO_WORLD, EARTH ("Life & Earth"),
  HUMAN_MIND, ANCIENT_HISTORY, PHYSICS ("Forces & Spacetime"), COSMOS.
- Tags → `/tag/[tag]` collection pages (`lib/tags.ts`) for tags with ≥2
  topics, except tags a guide covers (`Topic.tag` in `lib/topics.ts`) —
  those link to the guide and `/tag/x` 308-redirects (next.config.ts).
- Guides = `lib/topics.ts` (`/topics/[slug]`, UI name "Guides").
- Prev/next order = `NAV_ORDER` (sized topics by size, then ideas by
  category), not the `order` field.

## Adding a topic

Use the `add-topic` skill (`.claude/skills/add-topic/SKILL.md`).

## Images

- Stop images: `public/images/<id-with-hyphens>.webp` (1376×768 wide or
  1024×1024 square). Only PD / CC0 / CC BY / CC BY-SA, licence read from
  Wikimedia extmetadata; CC credits end with "(cropped)" when modified.
- Workers have no image optimizer: `lib/imageLoader.ts` maps to
  pre-generated `public/images/w{384,640,828,1080}/` variants made by
  `node scripts/resize-images.mjs` (deploy runs it; commit the variants).
- Logo/icons are generated from `lib/logo.ts`:
  `node --experimental-strip-types scripts/build-icons.mts`.
- Hero background: `public/images/hero-deep-field.webp` (Webb, PD).

## Gotchas learned the hard way

- `middleware.ts` (edge) does www/http → https://quantumaire.space and the
  locale redirect; Next 16 `proxy.ts` is Node-only and OpenNext can't run
  it. Its matcher must exclude real files (incl. `.webmanifest`).
- Do NOT add `loading.tsx` under `[locale]`: streaming makes `notFound()`
  return 200 (soft 404). Dynamic routes use `dynamicParams = false`.
- Overlays inside the sticky header (backdrop-filter) must render through
  `components/BodyPortal.tsx`, or `position: fixed` gets trapped.
- The service worker (`public/sw.js`, bump VERSION when changing it) only
  registers in production; in dev it unregisters itself. If localhost
  shows stale CSS/JS, unregister it in the browser.
- Kill stray dev servers (`pkill -f "next dev"`) — several on one port
  served stale code once.
- Satori (OG images) lacks superscript glyphs — use `ogSafe()`.
- framer-motion `whileInView` on cards uses `amount: 0` (horizontal shelves
  otherwise leave partly visible cards invisible).

## Key components

ScaleExplorer (log-scale track; wrappers InteractiveScale/DistanceScale/
TemperatureScale), CategoryShelves (home rows), StopDetail (+ StopSectionNav,
StopHighlights, StopValuesCard, StopGuides, EverydayScale via
`lib/analogies.ts`), Search (topics + categories/collections/guides/tools),
StopCombobox (searchable picker), ScaleCalculator (= distance converter at
`/tools/scale`), NavGroups (shared desktop/mobile menu).

## SEO state

Sitemap + hreflang, FAQ/ItemList/Breadcrumb JSON-LD, OG images per page,
IndexNow on deploy. Google Search Console: manual "Request indexing" ~10
URLs/day via the Chrome extension — see the `gsc-indexing` skill and the
log in `docs/indexing-log.md`.

## Current work

A full audit (2026-11-19) produced `docs/AUDIT-PLAN.md` — a phased
checklist backed by the reports in `docs/audit/`. Continue from the first
unticked box.

## Work log

See `docs/CHANGELOG-ai.md` for what was done per session and what is next.
