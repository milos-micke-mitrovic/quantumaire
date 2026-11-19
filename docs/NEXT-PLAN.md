# Next plan (after the 2026-11-19 audit)

The audit plan (`docs/AUDIT-PLAN.md`) is done except two blocked items: daily
GSC indexing (`gsc-indexing` skill, ~10 URLs/day) and the 404 SSR body (waits
for a Next upgrade). This is the follow-up list. Work top to bottom, tick boxes,
commit + deploy each block, test desktop + mobile, log in `docs/CHANGELOG-ai.md`.

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

- [ ] Life & Earth: African elephant, giraffe, Sahara, Amazon River, Grand Canyon
- [ ] Humankind: Titanic, Colosseum, Great Wall (length — check the "X times
      Earth" FAQ doesn't mislead; maybe skip the Earth comparison for lengths)
- [ ] Cosmos: Great Red Spot, Sirius, Kuiper Belt, asteroid belt
- [ ] Micro-world: water molecule, pollen grain
- [ ] Add each to `FAMILIAR_STOP_IDS` (lib/analogies.ts) only if laypeople know
      its size; round ones to `ROUND_STOP_IDS`/tags (lib/references.ts); add
      `temperatureNote` when a temperature is set (test enforces it).

## 3. Guides

- [ ] Link new topics from existing guides (Betelgeuse → stars, Oort cloud /
      comets → solar system / largest things, landmarks → largest things).
- [ ] New guide candidates: "Tallest buildings and structures", "The human body
      by size" (cell, red blood cell, bacterium, virus, DNA, human).

## 4. Performance

- [ ] Lighthouse (mobile) on home, a topic page, a guide; fix LCP/CLS/JS weight.

## 5. Search Console data (once enough pages are indexed)

- [ ] Pages with impressions but low CTR → rewrite titles/descriptions.
