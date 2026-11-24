# Next plan (round 10, written 2026-11-24)

**Direction:** same as rounds 8–9 (cosmos + micro/quantum + ancient sky
stories; no new animals/modern structures; no quiz/game features). Owner
approved all four blocks on 2026-11-24 and chose to keep the Serbian name
„Io“ (not „Ija“). Same rules: top to bottom, tick boxes, commit + deploy per
block, mobile check, dump and read generated sentences, log in
`docs/CHANGELOG-ai.md`.

## 1. Interstellar visitors + Planet Nine (COSMOS)

- [x] 'Oumuamua (2017), 2I/Borisov (2019), 3I/ATLAS (2025) — sizes only
      where sources agree (ranges otherwise); alien-probe claims labelled
      honestly. Planet Nine (idea, SPECULATIVE): the clustering evidence and
      the counter-arguments. Wire into guides (comets / solar system).
      2026-11-24: oumuamua 400 m (NASA/ESO estimate; plain "size" — as a
      length it became the Titanic's neighbour), borisov 700 m nucleus
      (Hubble 0.4–1 km), atlas_3i 2.6 km nucleus (Hubble 2026),
      planet_nine idea, SPECULATIVE (tag hypothetical only). New tag page
      /tag/interstellar (the three visitors). Planets guide §1 + related.
      Client dictionary budget 60,000 → 64,000 (~200 chars per topic).

## 2. Quantum ideas people search (MICRO_WORLD / PHYSICS)

- [x] Muon (cosmic-ray muons reaching the ground = time dilation; g-2 link
      to standard_model), superconductivity (zero resistance, Meissner
      effect, MRI magnets; room-temperature claims like LK-99 labelled),
      quantum computing (qubits; what works today vs hype). Add to the
      quantum-physics guide.
      2026-11-24: muon (MICRO_WORLD idea), superconductivity and
      quantum_computing (PHYSICS ideas, tag phenomenon), all FACT; in the
      quantum-physics guide (§3, §4). Fixed: bold mentions in EN guides
      never auto-linked (Title Case names) — bold runs now match without
      case; optional `stops.<id>.linkName` alias (General Sherman).

## 3. More ancient sky stories (HUMANKIND, tag `ancient`)

- [x] Teotihuacan's Pyramid of the Sun (size; the alignment claims as
      claims), Dendera zodiac (the sky map on a temple ceiling; the
      "ancient electricity" myth), Maya Dresden Codex (Venus table, eclipse
      table). Add to the ancient-astronomy guide.
      2026-11-24: pyramid_of_the_sun 65 m height (exact tie with Angkor Wat
      — never named as neighbours), dendera_zodiac 2.55 m slab (Louvre),
      dresden_codex 3.56 m unfolded ("Unfolded length" label). Guide §4/§5.
      Size FAQ: at human scale two plain "sizes" no longer beat a nearer
      familiar thing (JWST → giraffe, not the Dendera slab).

## 4. Review round 10 topics

- [x] Facts vs sources (agents), Serbian review, desktop + mobile pass.
      2026-11-24: 3 agent reviews, ~50 fixes; 5 glossary terms of block 3
      had been dropped by the merge script (draft format) — added, plus a
      test that every topic's glossary keys exist. Mobile checked per block.

## 5. Pairs, speed, Search Console

- [ ] Pairs that read well (dump EN+SR, read).
- [ ] Lighthouse spot check (round 9 skipped it: `npx -y lighthouse` was
      blocked by the session permission classifier — ask the owner to allow
      it, or use an installed copy).
- [ ] Indexing: finish the EN queue, then start /sr/ pages of the most
      important topics.
- [ ] Re-check speed_of_light CTR (~2026-12-07); rewrite titles of any
      other page that gets impressions without clicks.

## 6. Carried over (blocked)

- [ ] 404 body server-rendered (Next 16.4.6 is still the latest on
      2026-11-24: still the `__next_error__` shell).

---

# Done: round 9 (written 2026-11-23; time-gated items carried to round 10)

**Direction:** same as round 8 (cosmos + micro/quantum + ancient sky
stories; no new animals/modern structures; no quiz/game features — owner
2026-11-23). Owner approved the round minus the quiz. Same rules: top to
bottom, tick boxes, commit + deploy per block, mobile check, dump and read
generated sentences, log in `docs/CHANGELOG-ai.md`.

## 1. Moons (COSMOS; the Moons guide has only Moon, Titan, Europa)

- [x] Ganymede (largest moon, wider than Mercury; subsurface ocean), Io
      (most volcanic body known; tidal heating), Enceladus (geysers, ocean
      under the ice, Cassini). Add to the moons guide; pairs only if they
      read well (ganymede-vs-mercury?).
      2026-11-23: ganymede 5,265 km (Wikipedia's newer radius; NASA 5,268),
      io 3,643 km, enceladus 504 km; moons guide related/key numbers + an
      Io/Enceladus sentence. Sahara → LENGTH_STOP_IDS (its 4,800 km is an
      east–west span; Io's step up read "the Sahara"). SR "Enceladus" →
      „Enkelad“ site-wide.

## 2. Particles (MICRO_WORLD / PHYSICS)

- [x] Photon (idea or size? decide — no size; link visible_light,
      wave_particle_duality), neutron (~1.7e-15 m like the proton; free
      neutron ~15 min half-life; ties to neutron_star), Standard Model
      (idea: 17 particles, what it leaves out — gravity, dark matter).
      Add to quantum-physics / smallest-things guides.
      2026-11-23: photon (idea, FACT), neutron 1.7e-15 (ties with the
      proton, now also 1.7e-15 — was a round 1e-15 that contradicted its
      own 0.84 fm radius and the nucleus page), standard_model (idea,
      PHYSICS, ESTABLISHED_THEORY). Guides: quantum-physics (+all three),
      smallest-things (+neutron). No pairs (neutron–proton is a tie).

## 3. Ancient sky sites (HUMANKIND, tag `ancient`)

- [x] Göbekli Tepe (~9600 BC; "star map"/comet claims labelled
      speculative), Nazca Lines (geoglyphs; the astronomical-calendar theory
      tested and mostly rejected — say so), Angkor Wat (equinox sunrise
      over the central tower). Add to the ancient-astronomy guide.
      2026-11-24: gobekli_tepe 20 m (Enclosure D inside; mound 300 m ties
      Chankillo, pillars 5.5 m tie the giraffe), nazca_lines 47 m (the
      spider — value label "Spider length" via SIZE_LABEL_OVERRIDES, FAQ
      subject "the Nazca spider"), angkor_wat 65 m central tower height.
      Guide §5 now "Equinox suns, desert lines — and what is myth".
      Taglines of the four newest ancient sites shortened (SR client
      dictionary hit its 60,000-char budget).

## 4. Review round 9 topics

- [x] Facts vs sources (agents), Serbian review, desktop + mobile pass.
      2026-11-24: 3 agent reviews, 45 fixes (see changelog); mobile OK on
      all 9 topics + moons/quantum/ancient guides (dev). Desktop not
      re-screenshotted (no new components).

## 5. Pairs, speed, Search Console

- [x] Pairs that read well (dump EN+SR, read); Lighthouse spot check.
      2026-11-24: ganymede-vs-mercury, ganymede-vs-moon, pyramid-vs-angkor-wat
      (54). Dropped io-vs-moon (1.05×), enceladus-vs-moon (not searched),
      stonehenge-vs-gobekli-tepe (searched for age, not size). Lighthouse
      not run this time: `npx -y lighthouse` was blocked by the session's
      permission classifier — rerun when allowed.
- [ ] Indexing queue: add the round 9 pages, then start the /sr/ pages of
      the most important topics after the EN backlog thins.
      2026-11-24: all 9 round-9 topics + 3 new pairs are in the queue.
- [ ] Re-check speed_of_light CTR (~2026-12-07); rewrite titles of any
      other page that gets impressions without clicks.

## 6. Carried over (blocked)

- [ ] 404 body server-rendered (Next 16.4.6: still the `__next_error__` shell).

---

# Done: round 8 (written 2026-11-22)

**Direction (owner, 2026-11-21):** cosmos + micro/quantum world + ancient
stories that meet the sky; animals/modern structures stay as yardsticks, no
new ones. Round 8 strengthens the thinnest part: the quantum/micro side
(Cosmos 57 topics, Micro-World 16, Forces & Spacetime 12). Owner approved
the whole round on 2026-11-22 ("ok do all"). Same rules as before: top to
bottom, tick boxes, commit + deploy per block, mobile check, dump and read
generated sentences, log in `docs/CHANGELOG-ai.md`.

## 1. Quantum ideas (PHYSICS, ideas — sizeMeters null)

- [x] Quantum superposition & Schrödinger's cat (what it is, what the cat
      was meant to show, largest objects put in superposition), quantum
      tunnelling (fusion in the Sun, alpha decay, scanning tunnelling
      microscope, flash memory), Pauli exclusion principle (why atoms have
      shells, why matter is solid, white dwarfs/neutron stars). Honest
      badges; interpretations labelled as such. Link from the
      quantum-physics guide.
      2026-11-22: quantum_superposition (FACT), quantum_tunnelling (FACT,
      2025 Nobel), pauli_exclusion_principle (ESTABLISHED_THEORY, like the
      uncertainty principle); all in the quantum-physics guide.

## 2. Micro-world reference sizes (MICRO_WORLD)

- [x] Atomic nucleus (~1e-14 m — the atom is mostly empty), wavelength of
      visible light (~500 nm — why microscopes can't see viruses),
      mitochondrion (~1 µm — once a free-living bacterium). Fit into the
      smallest-things / human-body guides where they belong.
      2026-11-22: atomic_nucleus 1.4e-14 (gold-197), visible_light 5.5e-7
      (555 nm eye peak), mitochondrion 2e-6 (length; ties with bacterium —
      size FAQ now never names an exact tie).

## 3. Ancient sites that meet the sky (HUMANKIND, tag `ancient`)

- [x] Chankillo (Peru, 13 towers marking the Sun's yearly path), Goseck
      circle (Germany, ~75 m, solstice gates), Abu Simbel (Ramesses II's
      temple, sunlight days). Legends labelled as legends; add to the
      ancient-astronomy guide.
      2026-11-22: chankillo 300 m (line of towers; plain "size" so the Titanic
      keeps the Eiffel Tower as neighbour), goseck_circle 75 m, abu_simbel
      33 m facade height (HEIGHT_STOP_IDS). All three in the guide (§1, §2).

## 4. Review round 8 topics

- [x] Facts vs sources (agents), Serbian review, desktop + mobile pass.
      2026-11-22: 23 fact fixes, ~40 Serbian fixes; mobile OK.

## 5. Compare pairs + speed

- [x] Pairs that read well for a layperson (dump EN+SR, read); Lighthouse
      spot check.
      2026-11-22: goseck-circle-vs-stonehenge, pyramid-vs-abu-simbel (51).
      Dropped atom-vs-atomic-nucleus (generic 0.1 nm atom gives 7,100×,
      the nucleus page says 20,000–60,000×), visible-light-vs-virus,
      abu-simbel-vs-el-castillo (1.1×).

## 6. Carried over (blocked)

- [ ] 404 body server-rendered (Next 16.4.6: still the `__next_error__` shell).
- [ ] Search Console: pages with impressions but low CTR → rewrite titles.
      2026-11-23: first data (28 days: 26 impressions, 0 clicks). Only
      /en/stop/speed_of_light has volume: 13 impressions at position 4.8 for
      "speed of light", 0 clicks — Google's answer box already shows the
      number, and our title/description repeated it. Rewrote both to lead
      with the why/how/history. Re-check its CTR around 2026-12-07.

---

# Done: round 7 (written 2026-11-21)

**Direction (owner, 2026-11-21):** the site is about the cosmos and the
micro/quantum world, plus stories from ancient history (the owner likes the
pyramids). Animals and modern structures already on the site stay as size
yardsticks, but don't add more of them — "fill a gap on the size scale" is not
a reason to add a topic. Humankind grows only through ancient stories,
ideally where they meet the sky (Antikythera mechanism, Nebra sky disc, …).

Round 6 (quantum guide, ribosome, zoom, CLS fixes) is done — see "Done:
round 6" below. Same rules: work top to bottom, tick boxes, commit + deploy
each block, desktop + mobile check (`pnpm check:mobile`), dump and read every
generated sentence for new topics, log in `docs/CHANGELOG-ai.md`. Daily: GSC
indexing batch (`gsc-indexing`).

## 1. Ancient stories that meet the sky (Humankind: only 3 ancient topics)

- [x] Nebra sky disc (~32 cm, oldest known depiction of the sky), Antikythera
      mechanism (~34 cm, the ancient Greek "computer"), Newgrange (~85 m
      mound, winter-solstice light box), El Castillo at Chichén Itzá (~30 m,
      equinox serpent). Only claims sources support; label legends as legends.
      2026-11-21: all four (31 cm, 33 cm case, 85 m, 30 m height).
- [x] Shared tag (`ancient_astronomy` or reuse `ancient`) and wiring into the
      existing pyramid / Stonehenge pages.
      2026-11-21: reuse `ancient`; the guide links them all (StopGuides).

## 2. A guide: ancient astronomy

- [x] `/topics/ancient-astronomy`: what old cultures actually measured
      (pyramid cardinal alignment, Stonehenge solstice axis, Sirius and the
      Egyptian calendar, Halley in old records, the Moon and eclipses) vs
      popular myths (Orion correlation etc.). Both locales, sources.
      2026-11-21: 5 sections, no tag (/tag/ancient also has Colosseum etc.).

## 3. Cosmos: things people look up that the site lacks

- [x] Candidates: Saturn's rings, the Kuiper Belt, an exoplanet system
      (TRAPPIST-1), the cosmic microwave background (idea), Pillars of
      Creation. Pick only those with clear sourced sizes and that read well
      next to existing neighbours.
      2026-11-22: all five. Solar System size redefined as Neptune's orbit
      (9e12 m; was an unexplained 100 AU = the Kuiper Belt's edge).

## 4. Review round 7 topics (quality before quantity)

- [x] Facts vs sources, Serbian terminology/style, desktop + mobile pass.
      2026-11-22: 3 agent reviews; 17 fact fixes, ~30 Serbian fixes; mobile
      OK on all 20 pages.

## 5. Compare pairs + speed

- [x] Pairs that are real searches (stonehenge-vs-newgrange? kuiper-belt-vs-
      asteroid-belt?); dump EN+SR and read. Lighthouse spot check.
      2026-11-22: 8 dumped, 6 kept (49 pairs). Lighthouse: see changelog.

## 6. Carried over (blocked)

- [ ] 404 body server-rendered (Next 16.4.6: still the `__next_error__` shell).
- [ ] Search Console: pages with impressions but low CTR → rewrite titles.

---

# Done: round 6 (written 2026-11-21)

**Direction (owner, 2026-11-21):** the site is about the cosmos and the
micro/quantum world, plus stories from ancient history (the owner likes the
pyramids). Animals and modern structures already on the site stay as size
yardsticks, but don't add more of them — "fill a gap on the size scale" is not
a reason to add a topic. Humankind grows only through ancient stories,
ideally where they meet the sky (Antikythera mechanism, Nebra sky disc, …).

Round 5 (review, Next 16.4.6, last scale gaps, physics/micro ideas, compare
pairs) is done — see "Done: round 5" below. Same rules: work top to bottom,
tick boxes, commit + deploy each block, desktop + mobile check
(`pnpm check:mobile`), dump and read every generated sentence for new topics,
log in `docs/CHANGELOG-ai.md`. Daily: GSC indexing batch (`gsc-indexing`).

## 1. Review round 5's 7 topics (quality before quantity)

Tarantula Nebula, Small Magellanic Cloud, house mouse, electron,
wave–particle duality, E = mc², entropy — drafted by agents, not yet
fact/Serbian-audited.

- [x] Facts: every number vs sources.json; fix or source anything unsupported.
- [x] Serbian: terminology table (docs/audit/serbian.md), „…“, decimal comma,
      genitive after decimals, vi-forms, count phrases.
- [x] Desktop + mobile pass on these pages in both locales.
      2026-11-21: see CHANGELOG-ai.md.

## 2. A guide for the physics ideas (PHYSICS now has 12 topics)

- [x] `/topics/quantum-physics` (or similar searched title): electron,
      wave–particle duality, uncertainty principle, entanglement, Planck
      length, quark, Higgs, antimatter — what is known vs open, key numbers,
      both locales. Check which tag it should cover (and its 308).
      2026-11-21: no tag — /tag/particle stays (a sizes collection).

## 3. Remaining gaps a layperson notices

Size scale: DNA 2 nm → virus 100 nm (1.7 orders) is the last empty stretch in
nature that has a familiar object. Humankind is the thinnest category (11).

- [x] Micro-world: ribosome (~20–30 nm) — only if sources agree on a size.
      2026-11-21: 25 nm (Nobel 2009 material; bacterial 20, human 25–30 nm).
- [x] ~~Humankind: Golden Gate Bridge, Panama Canal~~ — drafted, then dropped
      by the new direction (no more modern structures).
- [x] Dump FAQ, analogies, neighbours, real-scale cards in both locales and read.
- [x] Home: shelves now Cosmos → Micro-World → Forces & Spacetime →
      Humankind → Life & Earth; Life & Earth opens with the planet, animals last.

## 4. Speed re-check (~20 topics since the last Lighthouse run)

- [x] Lighthouse mobile on home, a topic, a guide, a compare pair; client
      dictionary + first-load JS budgets; fix regressions.
      2026-11-21: no speed regressions; two layout shifts fixed (CLS → 0).

## 5. Compare pairs for round 6 topics

- [x] Only real searches that read well; dump EN+SR and read before keeping.
      2026-11-21: virus-vs-ribosome (43 pairs). Round 6's other new page is a
      guide, which needs no pair.

## 6. Carried over (blocked)

- [ ] 404 body server-rendered (Next 16.4.6: still the `__next_error__` shell).
- [ ] Search Console: pages with impressions but low CTR → rewrite titles.

---

# Done: round 5 (written 2026-11-20)

Round 4 (scale gaps, Humankind topics, animals guide, physics ideas, alt
texts) is done — see "Done: round 4" below. Same rules: work top to bottom,
tick boxes, commit + deploy each block, desktop + mobile check
(`pnpm check:mobile`), dump and read every generated sentence for new topics,
log in `docs/CHANGELOG-ai.md`.

## 1. Review round 4's 9 topics + animals guide (quality before quantity)

House cat, Omega Centauri, Local Group, Sloan Great Wall, Saturn V, LHC,
Stonehenge, absolute zero, uncertainty principle, `/topics/animals-by-size`,
plus today's water/gold additions — drafted by agents, never fact/Serbian-audited.

- [x] Facts: every number vs sources.json; fix or source anything unsupported.
- [x] Serbian: terminology table (docs/audit/serbian.md), „…“, decimal comma,
      genitive after decimals, vi-forms, count phrases.
- [x] Desktop + mobile pass on these pages in both locales.
      2026-11-20: see CHANGELOG-ai.md.

## 2. Next upgrade 16.2.6 → 16.4.x (unblocks the 404 SSR item)

- [x] Upgrade next (+ eslint-config-next), run checks, OpenNext build, smoke
      test locally (`pnpm preview` / wrangler dev): topic, guide, pair, 404,
      redirects, middleware locale redirect, OG images, sitemap.
- [ ] Re-test: does a 404 now render its body server-side? If yes, tick the
      AUDIT-PLAN Phase 4 item; if not, note the version and leave it.
      2026-11-20: 16.4.6 still serves the `__next_error__` shell (status 404,
      body only after JS). Left open.

## 3. Last big gaps on the size scale

Sorted by size: Omega Centauri 150 ly → LMC 32,000 ly (2.3 orders, the biggest
empty stretch), honeybee 13 mm → house cat 46 cm (1.5), Andromeda → Local
Group (1.7), Sloan Great Wall → observable universe (1.8).

- [x] Cosmos: Tarantula Nebula (~600–1,000 ly — check sources agree) and/or
      the Small Magellanic Cloud (~19,000 ly); pair with LMC.
- [x] Life & Earth: house mouse (~8 cm) or bee hummingbird (~5 cm) — whichever
      has a good free photo and a size people quote.
- [x] Wire into guides/collections/familiar lists; dump FAQ, analogies,
      neighbours, real-scale cards in both locales and read them.
      2026-11-20: Tarantula Nebula, Small Magellanic Cloud, house mouse;
      pair large-magellanic-cloud-vs-small-magellanic-cloud.

## 4. Physics + micro-world ideas (PHYSICS has 9 topics, MICRO_WORLD 14)

- [x] Electron (idea or ~point-like — decide honestly), photon / light as
      particle-and-wave, entropy & the arrow of time, E = mc² — sourced,
      both locales, glossary links; only ones that add something the
      existing topics (speed of light, antimatter, Higgs) don't already say.
      2026-11-21: electron (idea, FACT), wave–particle duality, E = mc²
      (`mass_energy_equivalence`), entropy — all FACT, open parts labelled.

## 5. Compare pairs for the newest topics

- [x] Candidates that are real searches and read well (stonehenge-vs-
      colosseum?, saturn-v-vs-burj? tarantula/smc-vs-lmc after block 3);
      dump EN+SR and read before keeping.
      2026-11-21: +4 (42 total): tarantula-nebula-vs-orion-nebula,
      titanic-vs-blue-whale (new "longer" wording for two lengths),
      african-elephant-vs-human, burj-khalifa-vs-saturn-v. Dropped after
      reading: titanic-vs-eiffel-tower (length vs height), colosseum-vs-
      stonehenge and omega-centauri-vs-orion (not searched, unrelated),
      tarantula-vs-lmc (nebula inside the galaxy, same distance), LHC-vs-
      Great Wall, SMC-vs-Milky Way (LMC pairs cover it).

## 6. Search Console data (blocked until enough pages are indexed)

- [ ] Pages with impressions but low CTR → rewrite titles/descriptions.

---

# Done: round 4 (written 2026-11-20)

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
