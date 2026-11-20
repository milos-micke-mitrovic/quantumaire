# Next plan (round 4, written 2026-11-20)

Round 3 (review of the newest topics, 9 scale-gap topics, 9 compare pairs) is
done — see "Done: round 3" below. Still blocked: daily GSC indexing (quota
seems to be a rolling ~24 h window), the 404 SSR body (Next upgrade) and the
Search Console CTR pass (needs data). Work top to bottom, tick boxes, commit +
deploy each block, test desktop + mobile (`pnpm check:mobile`), dump and read
every generated sentence for new topics, log in `docs/CHANGELOG-ai.md`.

## 1. Remaining gaps on the size scale (things people actually picture)

Biggest jumps a layperson notices: honeybee 13 mm → human 1.7 m (2 orders),
Orion Nebula 24 ly → LMC 32,000 ly (3), Andromeda → galaxy cluster (2),
Laniakea → observable universe (2). (Planck → quark and proton → atom are
empty in nature too; leave them.)

- [x] Life & Earth: house cat (or dog) — the pet-sized step between bee and human
- [x] Cosmos: a globular cluster (Omega Centauri, ~150 ly), the Local Group
      (~10 million ly), a cosmic "great wall" (Hercules–Corona Borealis or
      Sloan Great Wall) — only if sources agree on a size a layperson can use
- [x] Wire into guides/collections/familiar lists; dump FAQ, analogies,
      neighbours, real-scale cards in both locales and read them
      2026-11-20: house cat, Omega Centauri, Local Group, Sloan Great Wall.

## 2. Humankind is the thinnest category (8 topics)

- [x] Saturn V rocket (110.6 m), Large Hadron Collider (27 km ring — links
      the Higgs topic), Stonehenge (or another well-known ancient site) —
      pick measures that make honest comparisons (height / ring length / width)
- [x] Compare pairs that people search and read well (e.g. saturn-v-vs-
      statue-of-liberty?), dumped and read

## 3. A guide people search for: animals by size

- [x] `/topics/animals-by-size`: tardigrade → ant → honeybee → cat → human →
      giraffe → African elephant → blue whale (+ General Sherman as the
      biggest living thing); key numbers, cross-links, both locales
      2026-11-20: covers tag `animal` (/tag/animal 308s to it); hero blue whale.

## 4. Physics ideas (7 topics, all abstract)

- [x] Absolute zero (ties into the temperature scale), the uncertainty
      principle — idea topics (sizeMeters null), sourced, both locales

## 5. Image alt texts (found 2026-11-20)

The blue whale's alt described "a diver beside it" — the photo is an aerial
shot with no diver. Older topics' alts were written for earlier images.

- [x] Look at every `public/images/*.webp` next to its EN alt text (and SR);
      fix any that describe a different picture.
      2026-11-20: 98 checked, 31 rewritten (EN+SR) — leftovers from the AI-image era.

## 6. Search Console data (blocked until enough pages are indexed)

- [ ] Pages with impressions but low CTR → rewrite titles/descriptions.

---

# Done: round 3

## 1. Review today's 17 topics + 2 guides (quality before quantity)

They skipped the facts/Serbian audits the older topics went through.

- [x] Facts: every number in name/body/facts/funFact/keyNumbers vs sources.json
      (EN), mark/fix anything unsourced or out of date.
- [x] Serbian: grammar, terminology table from docs/audit/serbian.md, „…“
      quotes, decimal comma, vi-forms, count phrases.
- [x] Desktop + mobile walkthrough of a few new pages (topic, guide, tag,
      compare pair, home shelves) in both locales; fix layout issues.

## 2. Fill the empty stretches of the size scale

Sorted by size, the biggest gaps a layperson would notice are 0.5 mm → 1.7 m
(tardigrade → human: nothing insect- or pet-sized), 57 km → 2,400 km (Gaia BH1
→ Pluto) and 3 ly → 100,000 ly (Oort cloud → Milky Way). The Nebulae guide has
no nebula topic and the Moons guide has only the Moon.

- [x] Life & Earth: ant, honeybee (familiar small-animal sizes)
- [x] Cosmos, mid-size: Ceres, Olympus Mons (vs Everest), Titan, Europa
- [x] Cosmos, large: Orion Nebula, Crab Nebula, Large Magellanic Cloud
- [x] Wire them into guides (nebulae, moons, planets, supernova, smallest/
      largest), collections, familiar/round lists; dump and read the new FAQ
      answers, analogies, real-scale cards.

## 3. More compare pairs (people search "X vs Y")

- [x] Add pairs for topics added since the last batch where the comparison is
      a real search and reads well (e.g. sirius-vs-sun, great-red-spot-vs-earth,
      titanic-vs-blue-whale?, olympus-mons-vs-mount-everest, titan-vs-moon,
      ceres-vs-moon, …); dump every pair page in both locales and read it.
      2026-11-19: 9 added (35 total); blue-whale-vs-african-elephant dropped —
      whale length vs elephant shoulder height reads as "7.8× bigger", misleading.

## 4. Search Console data — moved to round 4, block 5.

---

# Done: round 2

## 1. Generated-text audit (owner keeps finding these — do this first)

Owner reports on 2026-11-19 were all about auto-generated text that is
numerically right but reads badly: circles for a football pitch, "Pluto ≈ the
Eiffel Tower", "2 °C" without saying where. Sweep every generated sentence
across ALL topics in BOTH locales, dumping them to a file (like the analogy
dump: a temporary vitest that writes to the scratchpad) and reading them:

- [x] Size FAQ (`lib/sizeFaq.ts`): all answers, incl. "one step down/up"
      (neighbours like Halley's Comet 1.01× bigger than the trench are
      technically right but pointless — consider skipping near-equal or
      unrelated neighbours), grain-of-sand answer for tiny things
      ("429 nm" — is that useful?), ratios "10¹⁶ times bigger".
- [x] Serbian FAQ grammar ("kolika bi bila veličina — Marijanski rov?",
      "6.400 puta manji nego Marijanski rov" — gender/case agreement).
- [x] Compare pair pages (`app/[locale]/compare/[pair]/page.tsx`), SR too.
- [x] Distance compare ("2.7× closer than Proxima Centauri"), light-time.
- [x] Prev/next, "On the scales", search snippets, OG cards, share text.
- [x] Analogy distance rows (FAMILIAR_DISTANCES) — same "is it familiar?" test.
- [x] Real-scale card: decide whether neutron star / Gaia BH1 (round) vs
      Everest should be circles-vs-bar or skip.

## 2. New topics (use the `add-topic` skill; Humankind and Life & Earth are thin)

- [x] Life & Earth: African elephant, giraffe, Sahara, Amazon River, Grand Canyon
- [x] Humankind: Titanic, Colosseum, Great Wall (length — check the "X times
      Earth" FAQ doesn't mislead; maybe skip the Earth comparison for lengths)
- [x] Cosmos: Great Red Spot, Sirius, Kuiper Belt, asteroid belt (Kuiper Belt skipped: its ~100 AU span equals the Solar System topic's size)
- [x] Micro-world: water molecule, pollen grain
- [x] Add each to `FAMILIAR_STOP_IDS` (lib/analogies.ts) only if laypeople know
      its size; round ones to `ROUND_STOP_IDS`/tags (lib/references.ts); add
      `temperatureNote` when a temperature is set (test enforces it).

## 3. Guides

- [x] Link new topics from existing guides (Betelgeuse → stars, Oort cloud /
      comets → solar system / largest things, landmarks → largest things).
- [x] New guide candidates: "Tallest buildings and structures", "The human body
      by size" (cell, red blood cell, bacterium, virus, DNA, human).

## 4. Performance

- [x] Lighthouse (mobile) on home, a topic page, a guide; fix LCP/CLS/JS weight.
      2026-11-19: home 59 → 81 (LCP 8.8 → 4.6 s), topic 79, guides 75–79; a11y 100,
      best practices 100, SEO 100 on all. Real-network LCP image is done by ~1.2 s.
- [x] Remaining simulated LCP (~4.5–5 s) is fonts + JS under 4× CPU: 4 preloaded
      woff2 (173 KiB, latin + latin-ext of Inter and Space Grotesk) and ~425 KiB JS
      (biggest chunk ~71 KiB, ~1 s scripting). Ideas: drop latin-ext preload where
      possible, lighter framer-motion use above the fold, check what the home
      shelves/explorer pull into the first chunk.
      2026-11-19: font preloads 4 → 2 (173 → 70 KiB), search dialog lazy, guide
      body server-rendered. Home 79–81 → 82–83, Jupiter 83–85, guides 75–82 → 82–85
      (TBT ~225 → 40–80 ms). What's left is react-dom + Next runtime (~120 KiB gz)
      and simulated slow 4G; not worth chasing further for now.

## 5. Search Console data — moved to round 3, block 4.
