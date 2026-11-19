---
name: add-topic
description: Add a new topic ("stop") to Quantumaire — content entry, EN+SR text, licensed image, variants, tests, deploy. Use when the user asks to add an item/object/concept to the site.
---

# Add a topic to Quantumaire

1. **Decide the data**: id (snake_case), sizeMeters (null for ideas), badge
   (FACT / ESTABLISHED_THEORY / PROBABLE_THEORY / SPECULATIVE — be honest),
   category (MICRO_WORLD, EARTH, HUMAN_MIND, ANCIENT_HISTORY, PHYSICS,
   COSMOS), tags (reuse existing `tags.*` ids where possible), glossary keys
   (reuse existing `glossary.*`), 2–3 verified sources (curl each URL),
   optional distanceFromEarthMeters / temperatureKelvin.
2. **Order**: pick an `order` value that slots it near similar topics
   (prev/next navigation uses size order anyway — see `NAV_ORDER`).
3. **Text** (EN + SR, same keys): name, tagline, body (3–5 sentences),
   narrative, funFact, image.alt, facts.fact1..fact4 (concrete numbers),
   optional massNarrative / ifDistance. Match tone of existing entries.
   Serbian: Latin, ekavian, decimal comma, dot thousands. Sized topics also
   need an English phrase in `sizeFaq.subjects` ("a blue whale").
   New tags need `tags.<id>` in both locales; new glossary terms need
   `glossary.<key>.{term,definition}` in both.
4. **Image**: Wikimedia Commons API (`prop=imageinfo&iiprop=url|extmetadata`)
   — only PD/CC0/CC BY/CC BY-SA; download to the scratchpad, convert with
   sharp to webp q80 cover 1376×768 or 1024×1024 into
   `public/images/<id-with-hyphens>.webp`; credit "Author — Licence"
   (+ " (cropped)" for CC when modified). Then
   `node scripts/resize-images.mjs`.
5. **Insert** the stop object into `content/stops.json` as text (do not
   re-dump the whole file with Python — number formatting changes).
6. **Check**: `pnpm typecheck && pnpm lint && pnpm test`, open
   `/en/stop/<id>` and `/sr/stop/<id>` in the dev server.
7. **Deploy** with the `deploy` skill, then add the URL to the GSC
   indexing queue in `docs/indexing-log.md`.
