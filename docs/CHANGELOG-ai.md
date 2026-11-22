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
- Fermi paradox (`fermi_paradox`, COSMOS idea, SPECULATIVE — the question is real, the answers aren't; new `alien-life` tag): Great Filter, Drake equation, Wow! signal, "hot tub" search estimate; ALMA under the Milky Way (ESO/P. Horálek, CC BY 4.0, cropped from a panorama); new glossary `drake_equation`.
- Speed of light (`speed_of_light`, PHYSICS idea, FACT, spacetime): exact by definition since 1983, relativity, Rømer/Io, slowed light, Cherenkov; ESO laser towards the galactic centre (CC BY 4.0, square crop); spacetime collection intro mentions the speed limit. Audit-plan "new topics" box ticked.
- Titles: a hand-written `seoTitle` now overrides the generic "How Big Is X?" title for sized topics too (`stopTitle()` in lib/sizeFaq.ts) — ISS/Webb auto titles were 64–65 chars; test: every topic title ≤ 60 in both locales.
- Next (AUDIT-PLAN Phase 6): guide pages — hero image per guide + key-numbers mini table; code health — shared toggle UI (km/mi, °C/°F/K, EN/SR); daily GSC queue (starts with fermi_paradox). Phase 4 404-SSR item waits for a Next upgrade.

## 2026-11-19 — audit Phase 6 part 3 (guide hero + key numbers)
- Every guide has a hero image borrowed from a topic (`Topic.heroStopId`, licensed + credited; square/portrait images shown whole over a blurred copy instead of cropped) and a "Key numbers" table (`Topic.keyNumbers`): rows read from topic data (size / distance / temperature, link to the topic, follow km/mi and °C/°F/K) or hand-written `keyNumber{n}Label/Value` texts for ages, rates and thresholds (nebulae, Big Bang, supernova, time; EN+SR, numbers match the guide text). `components/GuideHero.tsx`, `GuideKeyNumbers.tsx`; test `tests/guides.test.ts`.
- Fix: guide text showed raw `**bold**` / `*italic*` markers (15 strings per locale). `lib/inlineMarkdown.ts` parses them (lone `*` in names like M87* left alone) before topic-name linking; markers stripped from the guide meta description and Article JSON-LD. Tests `tests/inlineMarkdown.test.ts`.

## 2026-11-19 — audit Phase 6 part 4 (shared toggle UI)
- `components/ToggleGroup.tsx`: one pill segmented control (`aria-pressed`, `md` 40 px / `sm` 36 px, `fullWidth`, `caps` scrollable uppercase). UnitSwitcher / TempUnitSwitcher / LanguageSwitcher are thin wrappers over it; the mobile drawer reuses them (`fullWidth`) instead of its own copies; Compare mode and the home + topic-page scale-view toggles (Journey, JourneyMinimap) use it too — also lifts those from ~30 px to 36 px touch targets. Header temperature switch hidden below `lg` via a wrapper div.
- Next: Phase 6 code-health and guide boxes done; remaining unticked: daily GSC indexing (queue starts with fermi_paradox), Phase 4 404-SSR (waits for a Next upgrade).

## 2026-11-19 — new topics: landmarks + largest tree
- Eiffel Tower (`eiffel_tower`, HUMANKIND, FACT, 330 m; Benh Lieu Song photo, PD, square on a blurred copy), Burj Khalifa (`burj_khalifa`, HUMANKIND, FACT, 828 m; Laika ac, CC BY-SA 2.0, cropped), General Sherman tree (`general_sherman`, EARTH, FACT, 83.8 m, biology tag; Jim Bahn, CC BY 2.0, square on blur). EN+SR text, seoTitle + metaDescription, sources, glossary `wrought_iron`, `thermal_expansion`, `vanity_height`, `serotiny`.
- New `landmark` tag → `/tag/landmark` (Great Pyramid, Eiffel, Burj); Humankind + Life & Earth category texts and biology collection intro mention the new topics. Compare pairs: burj-khalifa-vs-eiffel-tower, eiffel-tower-vs-pyramid, general-sherman-vs-blue-whale (23 pairs).
- Wording fixes, site-wide: size-FAQ neighbours and compare-pair sentences use the article-bearing subject ("One step down is the Great Pyramid", was "is The Great Pyramid"; "bigger than a blue whale", was "than Blue Whale"); pair titles keep bare names. Everyday-scale analogies never pair the Eiffel Tower/Burj Khalifa with themselves (`SAME_AS_STOP`, test). Tag-page breadcrumb shows the collection name ("Landmarks") instead of the chip label.
- Next: daily GSC indexing (queue starts with fermi_paradox; new URLs appended). Content ideas: Betelgeuse, Oort cloud, Great Red Spot, red blood cell, Statue of Liberty.

## 2026-11-19 — real-scale card: bars for non-round things (owner report)
- The "drawn to true scale" card drew every pair as nested circles ("General Sherman Tree — Football pitch" as two balls). Now circles only when both objects are round (`isRoundStop` / `isRoundReference` in lib/references.ts: planets, stars, moons, black holes, atoms, cells, Earth, Sun, coin, sand); everything else is two true-scale length bars from a common start line. Checked all 25 cards: 16 bars (bacterium/cell/tardigrade vs hair width; Webb/whale/Sherman/ISS/pyramid/Eiffel vs pitch; Burj/Everest vs Eiffel; trench/Halley/neutron star/Gaia BH1 vs Everest), 9 circles (planets/stars vs Earth/Sun). Hair reference relabelled "Width of a human hair"; Eiffel/Everest references link to their topics.

## 2026-11-19 — everyday-scale analogies: only well-known topics (owner report)
- "ISS = a marble → Pluto ≈ the Eiffel Tower" was useless: nobody pictures Pluto. The second row of a size analogy now only uses `FAMILIAR_STOP_IDS` (lib/analogies.ts: atom, DNA, virus, bacterium, cell, red blood cell, human, blue whale, pyramid, Statue of Liberty, Eiffel, Burj, Everest, Moon, Earth, Jupiter, Sun, Solar System, Milky Way, observable universe). Dumped all analogies before/after: Pluto, Halley, Webb, Mercury, UY Scuti, M87*, neutron star, Phoenix A, light-year, tardigrade no longer appear as the "picture this" object; every sized topic except the Planck length still gets ≥1 analogy. Test guards the whitelist.

## 2026-11-19 — temperatures say where (owner report)
- "Mariana Trench: 2 °C" didn't say where. New `stops.<id>.temperatureNote` (EN+SR) for all 18 topics with a temperature — "water at the bottom (Challenger Deep)", "summit, January average", "cloud tops", "visible surface (photosphere)", "cold, shaded side of the sunshield"… — shown under the value in the Numbers card and in the "How hot is X?" FAQ (`sizeFaq.a7where`). Notes carry no numbers so they work with °C/°F/K. Test: every topic with a temperature has a note in both locales.

## 2026-11-19 — new topics: Betelgeuse, Oort cloud, red blood cell, Statue of Liberty
- Betelgeuse (`betelgeuse`, COSMOS, FACT, star tag): 640–764 R☉ (1.06×10¹² m), 548 ly, 3,600 K, Great Dimming, Siwarha, coming supernova; ALMA image (CC BY 4.0). Glossary `red_supergiant`.
- Oort cloud (`oort_cloud`, COSMOS, PROBABLE_THEORY — never observed; 3×10¹⁶ m ≈ 3 ly across): Öpik/Oort, long-period comets, Voyager 300/30,000 years; photo of Comet McNaught over Paranal (S. Deiries/ESO, CC BY 4.0) instead of a labelled diagram. Tag `comet` → new `/tag/comet` collection (Halley + Oort; EN+SR texts).
- Red blood cell (`red_blood_cell`, MICRO_WORLD, FACT, biology): 7.5 µm, 270 M haemoglobin, 20–30 trillion, 100–120 days; NCI SEM (PD). Glossary `hemoglobin`.
- Statue of Liberty (`statue_of_liberty`, HUMANKIND, FACT, landmark): 93 m ground-to-torch, 46 m statue, 2.4 mm copper, Eiffel's framework (NPS statistics); PD photo on blur. Glossary `patina`. Landmarks collection intro now lists four.
- Compare pairs: betelgeuse-vs-sun, statue-of-liberty-vs-eiffel-tower (25). Betelgeuse has a temperature note ("surface").

## 2026-11-19 — generated-text audit (NEXT-PLAN block 1)
Dumped every generated sentence (size FAQ ×2 locales, 25 compare pairs, distance analogies, real-scale cards, distance context) to the scratchpad and read them.
- Size FAQ: "one step up/down" skips near-equal (<1.15×) neighbours of an unrelated kind (`areRelated` in lib/references.ts: shared tag or both heights/depths) — no more "Halley's Comet 1.01× bigger than the Mariana Trench"; trench → Everest / neutron star. `sizeMeasure()` (height/depth/size): "190 times taller than a human", "deeper than a human is tall", "wider than Mount Everest is tall", neighbours between two heights say taller/shorter. Grain-of-sand answer only when the result is ≥ 10 µm (planets up; was "Everest → 347 nm"); Earth comparison only for things ≥ 1 km (was "Earth is 610,000× wider than Webb"). No "(≈ 8.4 × 10¹ m)" for 1 cm–100 km sizes.
- Serbian: `sizeFaq.subjects` in sr.json (lower-case common nouns: "veći nego atom", "Korak niže: proton"; full map for every sized topic, test); questions rephrased to avoid case/gender ("Kolike je veličine Marijanski rov?", "… u razmeri u kojoj je Zemlja zrno peska?", "Dubina: … puta veća nego visina čoveka"). Number words agree (`scaled()` in lib/scale.ts + `numberMillionOne`/`numberBillionOne/Few`/`numberTrillionOne`): "93 milijarde sg", "21 milijarda".
- Compare pair pages: sentences moved to `lib/comparePairText.ts`; two heights → "taller" (`pairSizeTall`, `pairFaqQTall`, `pairDescriptionTall`); temperatures say where (cloud tops, photosphere…); no "From Earth … the Solar System about 1.59 ly" (edge-of distances skipped); description no longer promises distances/temperatures that aren't there; Serbian titles "Plavi kit i čovek". Light-years 1,000–1M rounded to 4 significant figures ("26,000 ly", was 26,002).
- Compare tool: always phrased from the bigger/farther/hotter side with natural subjects ("A blue whale is 15× bigger than a human", "Proxima Centauri is 268,316× farther…"); temperature ratio says "measured in kelvin, from absolute zero"; `closer/smaller/colder` keys removed. Compare OG card: "11×" / "3.5×" via the shared formatFactor, never "1 / 3.55" or "11.0×".
- Numbers card distance context: always "N× farther than" the farthest clearly-nearer reference (Betelgeuse 129× farther than Proxima Centauri; Venus 442× farther than the Moon); ISS/Moon get no line (was "961× closer than the Moon", "1.14× farther than the Sun").
- Everyday-scale distance rows: "the Earth–Moon distance" dropped as a target (Neptune row read "Earth → Moon = Earth–Moon distance"); rows to "edge of" places say so ("Earth → edge of the Solar System").
- Real-scale card: new `manhattan` reference (21.6 km); neutron star → "Manhattan, end to end" (city-sized, ×1.1), Everest pinned to the Eiffel Tower; Gaia BH1 vs Manhattan. Round-vs-bar stays bars.
- Tests: `tests/generatedText.test.ts`.
- Next: NEXT-PLAN block 2 (new topics).

## 2026-11-19 — new topics: Life & Earth (NEXT-PLAN block 2, part 1)
- African elephant (`african_elephant`, 3.2 m bull shoulder height; Charles J. Sharp, CC BY-SA 4.0), giraffe (`giraffe`, 5.5 m; Jorge Láscar, CC BY 2.0), Sahara (`sahara`, 4,800 km east–west, 40 °C "typical summer afternoon"; Thomas Fuhrmann, CC BY-SA 4.0), Amazon River (`amazon_river`, 6,400 km; ESA Sentinel image of the mouth, CC BY-SA 3.0 IGO, square), Grand Canyon (`grand_canyon`, 1,857 m deepest; Tuxyso, CC BY-SA 3.0). EN+SR text, seoTitle + metaDescription, 6 facts each, sources (Wikipedia, NPS statistics, NASA CALIPSO dust, Giraffe Conservation Foundation). Glossary: infrasound, ossicone, erg, tidal_bore, erosion.
- New `landscape` tag → `/tag/landscape` (Grand Canyon, Everest, trench, Sahara, Amazon); animal collection and Life & Earth category texts mention the new topics. Compare pair giraffe-vs-human (26).
- Generated text: `sizeMeasure` gains `length` (Amazon: "3.8 million times longer than a human is tall", "Earth … wider than the Amazon River is long"); elephant/giraffe are heights, Grand Canyon a depth. First FAQ answer is measure-aware: "The Eiffel Tower stands about 330 m tall", "The Mariana Trench is about 11 km deep", SR "Žirafa: visina je oko 5,5 m". Elephant + giraffe join `FAMILIAR_STOP_IDS`. Dumped all new FAQ answers, analogies and real-scale cards and read them.

## 2026-11-19 — new topics: Humankind (NEXT-PLAN block 2, part 2)
- Titanic (`titanic`, 269 m long; 1912 Southampton photo, PD; tag `ship`, glossary `watertight_compartment`), Colosseum (`colosseum`, 189 m long ellipse; Nicholas Hartmann, CC BY-SA 4.0; glossary `hypogeum`), Great Wall of China (`great_wall`, 21,196 km all branches, Ming wall 8,850 km in the text; Velatrix, CC0; glossary `rammed_earth`). All three are `length` measures; Titanic/Colosseum real-scale card vs a football pitch.
- Great Wall vs Earth: new `sizeFaq.a8longer` — "roughly 1.7 times longer than Earth is wide (12,742 km across)", never "wider than Earth". The text says it is many walls, not one line, and is not visible from orbit.
- Colosseum + Great Wall + Great Pyramid → new `/tag/ancient` collection ("Ancient wonders"); the height-only Landmarks collection keeps its four towers. Humankind category texts updated.

## 2026-11-19 — new topics: Cosmos (NEXT-PLAN block 2, part 3)
- Great Red Spot (`great_red_spot`, 16,350 km wide per Juno 2017, shrinking from ~40,000 km; Juno close-up, PD; tag `storm`, glossary `anticyclone`), Sirius (`sirius`, Sirius A 2.38 million km, 8.6 ly, 9,940 K "surface of Sirius A"; NASA/ESA/G. Bacon artist's impression, PD; glossary `white_dwarf`), asteroid belt (`asteroid_belt`, ~960 million km across the outer edge, 2.2–3.2 AU; Dawn image of Vesta, PD, square; tag `asteroid`, glossary `dwarf_planet`).
- Kuiper Belt skipped: 30–50 AU gives ~100 AU across, the same 1.5×10¹³ m as the Solar System topic — two identical dots and a confusing comparison.
- Distance FAQ: stars and galaxies up to 10 million ly now say "its light takes about 8.6 years to reach us" (was "set out long ago" for Sirius/Proxima); topics measured to an edge say "The edge of the Solar System is about 1.59 ly from Earth" (was "its light set out long ago" for the Solar System).

## 2026-11-19 — new topics: Micro-world (NEXT-PLAN block 2 done)
- Water molecule (`water_molecule`, 0.28 nm, tag `matter` → matter collection retitled "Matter, antimatter and molecules"; water-drop photo by Davide Restivo, CC BY-SA 2.0; glossary `hydrogen_bond`), pollen grain (`pollen_grain`, typical 25 µm, real-scale card vs a hair; Dartmouth SEM, PD; glossary `sporopollenin`).
- Familiar list: elephant + giraffe added; Sahara/Amazon/Grand Canyon/Titanic etc. not (people know the name, not the size). No new round topics (Sirius is round via the `star` tag); `temperatureNote` set for Sahara and Sirius.
- Next: NEXT-PLAN block 3 (guides).

## 2026-11-19 — guides (NEXT-PLAN block 3)
- New topics linked from guides: Stars (+Sirius, Betelgeuse), Planets (+Great Red Spot, asteroid belt; text now mentions the Asteroid Belt), Planet sizes (+Great Red Spot), Distances (+Sirius), Smallest things (+water molecule, red blood cell, pollen grain; text mentions pollen and the water molecule), Largest things (+Betelgeuse).
- New guide `/topics/tallest-buildings-and-structures` (hero Burj Khalifa): how the record climbed (Great Pyramid → Lincoln Cathedral → Eiffel → Chrysler → Empire State → Taipei 101 → Burj), CTBUH height rules and vanity height, wind/lift limits and Jeddah Tower, nature's tallest (giraffe, Hyperion, General Sherman, Everest, Mauna Kea). Key numbers incl. a hand-written Lincoln Cathedral row. Not tied to the `landmark` tag, so /tag/landmark stays.
- New guide `/topics/human-body-by-size` (hero red blood cell): 1.7 m human, 30 trillion cells (84% red blood cells, Sender et al. 2016), DNA 2 nm wide / 2 m long, 38 trillion bacteria, viruses. Key numbers mix topic data and hand-written counts.
- Size labels follow the measure: "Height" (Eiffel, Everest, giraffe), "Depth" (trench, Grand Canyon), "Length" (Amazon, Titanic, Great Wall) in the Numbers card and guide key numbers (`sizeLabelKey`).
- Client bundle: collection intros/meta (`tagPages`) no longer ship on every page — base keeps `tagPages.*.short/title`, the tag page adds its intro via `I18nExtend` (base dictionary was over the 60 KB budget test after 17 new topics).
- Next: NEXT-PLAN block 4 (Lighthouse/performance).

## 2026-11-19 — performance + accessibility (NEXT-PLAN block 4)
- Lighthouse mobile before: home 59 (LCP 8.8 s, TBT 330 ms), topic ~78, guide 81. The home LCP is the decorative Webb hero; ~31 shelf images (800 KiB) and gtag (180 KiB) competed with it on simulated slow 4G.
- `ImagePlaceholder defer` (IntersectionObserver, 300 px margin; hydration-safe) — home shelf cards load their images only near the viewport, also when a shelf is scrolled sideways; initial home load now requests 1 card-free image instead of ~31. GA scripts `lazyOnload`.
- Accessibility: home FAQ no longer nests `<dt>/<dd>` in `<details>` (invalid `<dl>`), tag chips use `text-cosmos-plasma` (contrast), StopCard links lose the "Open — X" aria-label that mismatched their visible text.
- After: home 81 (LCP 4.6 s, TBT 90 ms), Jupiter 79, guides 75–79 (TBT ~250 ms; one 1.6 s TBT reading was noise), accessibility/best practices/SEO 100 everywhere. Follow-up (fonts + JS weight) added to NEXT-PLAN.
- Block 5 (Search Console CTR) waits for indexing data.

## 2026-11-19 — fonts + JS weight (NEXT-PLAN block 4 follow-up)
- Fonts: `subsets` in next/font only picks the *preloaded* files (every subset stays in the CSS via unicode-range), so both fonts now preload only `latin`; Serbian č/ć/š/ž/đ load latin-ext on demand (checked in the browser). The 404 layout had its own `latin-ext` font call, and Turbopack then preloaded latin-ext everywhere; both layouts now import one definition from `lib/fonts.ts`. 4 preloads / 173 KiB → 2 / 70 KiB.
- Search: the dialog (index over every topic, guide and collection) moved to `components/SearchDialog.tsx` and loads via `next/dynamic` on first open; hovering or focusing the button prefetches it. Checked: opens via click and ⌘K, "giraf" finds the giraffe.
- Guides: `TopicView` is now a server component (it only used `t()`), so the guide text doesn't hydrate; the page sends the client only the hand-written key-number strings instead of the whole guide namespace. GuideHero's blurred backdrop (the LCP element on square-image guides) was `loading="lazy"`; now eager (same URL as the preloaded image, no extra bytes).
- Lighthouse mobile (live, 2 runs each): home 79–81 → 82–83 (LCP ~4.6 s), Jupiter 79 → 83–85, guides 75–82 → 82–85 with TBT ~225 → 40–80 ms; CLS 0. Remaining cost is react-dom + Next runtime under simulated 4G.
- The only open plan item is block 5 (Search Console CTR), which needs indexing data first.

## 2026-11-19 — review of the 20 newest topics + 2 guides (round 3, block 1)
- New plan written to `docs/NEXT-PLAN.md` (round 3: review → fill scale gaps → compare pairs → GSC CTR).
- Facts (checked against Wikipedia/NASA/NPS/CTBUH): Oort-cloud comets arrive ~a million years after a nudge (was "centuries"); red blood cells >80% of body cells (was 70%, guide said 84%); "nucleus of every cell that has one"; tallest-structures guide: iron/steel took the record from ~170 m (Washington Monument), not 139, and says Taipei 101 etc. were building records while guyed radio masts (Warsaw 646 m) were taller; Burj spire 244 m everywhere; Sahara "almost as big as" (not as wide as — it is wider) the US; Great Wall "practically invisible from orbit, not at all from the Moon"; Betelgeuse 15–20 M☉ in both places, surface "into or beyond" the asteroid belt; Great Red Spot turns every 4–6 days; giraffe stacked-people line; pollen 3–4 grains per hair; Sherman 7.7 m at chest height / ~11 m at the base; Amazon basin 8 countries + French Guiana; 1.7 m "a little above" the world average.
- Serbian: decimal agreement site-wide („8,6 svetlosne godine“, „5,5 metra“, 15 places), gender/case fixes (Vesta „sivi asteroid“, „najpoznatiji su Pluton i Cerera“, „užad postaje“, „odrasle osobe“), meaning fixes (Sirius „1,7 puta širi“, „temperatura površine“, „nevidljivi pratilac“), Sautempton, „niskim brundanjem“, „Visina iz sujete“, ~30 style edits.
- Mobile/desktop walkthrough (52 pages at 390 px: no horizontal overflow). Fixes: the compare tool drew a giraffe and a human as nested circles — now true-scale bars unless both are round (same rule as the real-scale card), with Height/Length/Depth labels; topic cards and the real-scale card label sizes by measure ("Depth 1.9 km" for the Grand Canyon, "Length" for the Titanic and a football pitch, `referenceLabelKey`); image credits on Serbian pages say „javno vlasništvo“ / „(isečeno)“ (`localizeCredit`).

## 2026-11-19 — 9 topics fill the empty stretches of the scale (round 3, block 2)
- Ant (`ant`, 5 mm worker; Carlos Delgado, CC BY-SA 3.0) and honey bee (`honeybee`, 13 mm; John Severns, PD) — nothing sat between the 0.5 mm tardigrade and the human. New `insect` tag → `/tag/insect`; glossary pheromone, eusociality, waggle_dance. Both are "length" measures and join FAMILIAR_STOP_IDS.
- Ceres (939 km, Dawn, PD; tags dwarf-planet + asteroid → new `/tag/dwarf-planet`, `/tag/asteroid`), Olympus Mons (22 km height, Viking, PD; tag mountain → `/tag/mountain` with Everest; real-scale card vs Everest), Titan (5,150 km, Cassini, PD), Europa (3,122 km, Galileo, PD); glossary cryovolcano, shield_volcano, tidal_heating.
- Orion Nebula (24 ly, ~1,300 ly away — the 389 pc radio-parallax distance, not the old 1,344), Crab Nebula (11 ly, SN 1054), Large Magellanic Cloud (32,000 ly, 160,000 ly away; Bardon/ESO CC BY 4.0, cropped); new `nebula` tag and glossary nebula, satellite_galaxy. Topics drafted by three research agents (sources fetched, licences from Commons extmetadata), then read and edited.
- Guides: nebulae guide now `tag: "nebula"` with the Orion Nebula as hero and its size/distance + Crab size in key numbers; moons guide `tag: "satellite"` (+Titan, Europa key numbers); supernova (+Crab, LMC, Betelgeuse), planets (+Mars, Olympus Mons, Ceres), planet sizes (+Ceres), distances (+LMC). `/tag/nebula` and `/tag/satellite` 308 to their guides.
- Generated text (dumped and read for all new topics + diff over every sized topic):
  - Everyday-scale analogies must rescale by ≥ 10× (`MIN_SCALE_LOG`): "everything enlarged 3× — the Statue of Liberty ≈ the Eiffel Tower" no longer appears on the ant page (now "ant = Eiffel Tower → Great Pyramid ≈ Earth"); 14 topics got better pairs (human = marble → Everest ≈ a football pitch).
  - "One step up/down" names neighbours of the same kind of measure (diameter / height-depth / length) or with a shared tag: Titan and Mercury → Mars (was the Amazon River), Great Red Spot → Neptune (was the Great Wall), Olympus Mons → Mariana Trench (was Halley's Comet and Gaia BH1); below 1 km anything can stand side by side, so Webb ↔ giraffe and Titanic ↔ Eiffel stay. No more false "largest on the scale" when a line is skipped.
  - "A 1.7 m human is roughly 340 times taller than an ant is long" (`a2smallerLong`).
  - Crab Nebula is not tagged stellar-remnant (would have drawn it as a circle and made a 2-topic page).

## 2026-11-19 — compare pairs (round 3, block 3)
- 9 new pair pages (35 total): mariana-trench-vs-mount-everest, olympus-mons-vs-mount-everest, uy-scuti-vs-betelgeuse, sirius-vs-sun, titan-vs-moon, moon-vs-europa, pluto-vs-ceres, great-red-spot-vs-earth, milky-way-vs-large-magellanic-cloud. Dumped all sentences EN+SR and read them; blue whale vs African elephant dropped (whale length vs shoulder height → "7.8× bigger" misleads).
- A depth against a height reads "The Mariana Trench is about 1.2 times deeper than Mount Everest is tall: the Mariana Trench goes down 11 km, Mount Everest rises 8.8 km" (`pairSizeDeepTall` + description/FAQ variants; SR „Dubina — …; visina — …“). The interactive tool's ratio line follows: "1.24× deeper than Mount Everest is tall", "2.49× taller" for two heights (`timesAsTall`, `timesDeeperThanTall`).
- LMC size stored as exactly 32,000 ly (was shown as 32,130 next to text saying ~32,000); Orion/Crab/LMC distances rounded to the text's 1,300 / 6,500 / 160,000 ly.
- Remaining plan item: Search Console CTR (blocked on indexing data).

## 2026-11-20 — round 4 plan + block 1 (scale gaps)
- GSC: only /en/stop/fermi_paradox went through before "Quota Exceeded" — the quota looks like a rolling ~24 h window, so yesterday's late batch counted. Queue resumes with james_webb.
- New plan (round 4) in `docs/NEXT-PLAN.md`: scale gaps → Humankind topics → animals-by-size guide → physics ideas → GSC CTR.
- Four topics drafted by research agents (sources fetched, Commons licences from extmetadata), then read and edited: house cat (`house_cat`, 46 cm head-and-body, a `length`; Von.grzanka CC BY-SA 3.0; glossary tapetum_lucidum), Omega Centauri (`omega_centauri`, ~150 ly — the commonly quoted bright-part diameter, NASA's 450 ly in the facts; 17,000 ly; ESO CC BY 4.0; new tag `star-cluster`, glossary globular_cluster + intermediate_mass_black_hole), Local Group (`local_group`, 10 million ly, insideNote instead of a distance; Budassi map CC BY 4.0), Sloan Great Wall (`sloan_great_wall`, 1.37 billion ly long, 1 billion ly away, not gravitationally bound; 2dF map by Willem Schaap CC BY-SA 3.0; glossary cosmic_web).
- New collections: `/tag/galaxy-cluster` (tag renamed "Galaxy groups and clusters": Local Group + Virgo) and `/tag/supercluster` (Laniakea + Sloan Great Wall). Animals collection intro mentions the cat. Guides: black holes (+Omega Centauri), distances (+Omega Centauri, Local Group), how big is the universe and largest things (+Local Group, Sloan Great Wall).
- Generated text (full before/after dump of every topic):
  - 10 cm – 1 m now reads in centimetres ("46 cm", Sagittarius A* as a grain-of-sand model "94.2 cm"), not "460 mm".
  - Light-year scale words are chosen after rounding: "1 billion ly", not "1,000 million ly".
  - Serbian decimals take the genitive singular: „1,06 milijarde km“, „6,1 milijarde puta“ (was „milijardi“ in ~20 FAQ answers: planet distances, Betelgeuse, UY Scuti, ratios).
  - "One step up/down" no longer skips past closer topics to a same-kind one more than 10⁶× away (the Great Wall of China named the Sloan Great Wall, 10¹⁸×); the directly adjacent topic is still always named (Planck length → quark).

## 2026-11-20 — animals-by-size guide (round 4, block 3)
- `/topics/animals-by-size` (hero blue whale): tardigrade → ant → honey bee → house cat → human → elephant → giraffe → blue whale, + General Sherman as the biggest living thing. Sections explain why insects stay small (tracheae; Meganeuropsis ~70 cm wingspan in high-oxygen times, hedged as debated), the square–cube law (Galileo 1638), sauropods (Argentinosaurus 30–35 m, 65–80 t, "estimates vary"), why the largest animal lives in water. Key numbers: 8 topic sizes + heaviest animal + largest dinosaurs.
- The guide covers tag `animal`, so `/tag/animal` 308s to it (next.config.ts) and animal tag chips link there.
- Tardigrade and blue whale are now `length` measures: "A 1.7 m human is roughly 3,400 times taller than a tardigrade is long", key numbers say "Length"; the whale's size neighbour is now the giraffe (shared tag), the ISS's the Webb telescope.

## 2026-11-20 — Humankind topics, physics ideas (round 4, blocks 2 + 4)
- Saturn V (`saturn_v`, 111 m height; Apollo 11 launch, NASA PD; glossary rocket_stage, thrust), Large Hadron Collider (`large_hadron_collider`, 26.7 km ring as a `length`, 1.9 K magnets as its temperature; Maximilien Brice/CERN CC BY-SA 3.0; glossary particle_accelerator; shut down since July 2026 for HL-LHC, ~mid-2030), Stonehenge (`stonehenge`, 30 m sarsen circle; garethwiscombe CC BY 2.0; glossary sarsen, trilithon; Altar Stone: 2024 Scotland study + Nov 2026 JGS "exact provenance unknown", DOI checked).
- Absolute zero (`absolute_zero`, idea, FACT; NIST/JILA 1995 BEC graph PD; no temperatureKelvin — a log scale can't show 0 K; lab record "about 10 pK" on Tiangong, Science 5 Nov 2026, verified via Science News; glossary third_law, bose_einstein_condensate) and the uncertainty principle (`uncertainty_principle`, idea, ESTABLISHED_THEORY; 1927 Solvay photo PD; "clumsy measurement" myth addressed; football/electron numbers recomputed from ħ; glossary wave_function, zero_point_energy).
- Collections: spacecraft tag → "Spacecraft and rockets" (+Saturn V), Ancient wonders intro leads with Stonehenge. Pairs: saturn-v-vs-statue-of-liberty, local-group-vs-milky-way (37 total).
- Temperatures below 10 K show one decimal, halves away from zero: "1.9 K (−271.3 °C)" (was "2 K (−271 °C)").
- Size neighbours: a near-equal neighbour (<1.15×) needs the same kind of measure, not just a shared tag — Saturn V no longer says the ISS is "1.02 times smaller" (rocket height vs station width); it steps to the Statue of Liberty.
- Client dictionary was over the 60 KB budget: topic-image alt texts left the base dictionary. Card images are now decorative (`alt=""` — the card's name is right below), topic/guide/pair pages add their images' alts via I18nExtend, and the interactive compare falls back to the topic name.
- Blue whale alt fixed (described a diver that isn't in the photo); full alt-text audit added to the plan (block 5).

## 2026-11-20 — image alt-text audit (round 4, block 5)
- All 98 topic images compared with their alt text (agent read every image; spot-checked). 31 alts still described the old AI pictures replaced in 27bc49b ("real public-domain images"): e.g. human (now the Vitruvian Man), time dilation (a GPS satellite), Jupiter ("four Galilean moons" not in the photo), dark matter (Bullet Cluster), big bang (Planck CMB map), Voyager 1 (no Earth in frame). Rewritten in EN and SR; six of them are guide heroes too.
- Next: only GSC CTR (blocked on indexing data) remains in the round-4 plan.

## 2026-11-20 — origin of water and gold; indexing
- Owner request: where water and gold come from. water_molecule body + fact7/fact8 (H from Big Bang, O from stars, up to half of Earth's water older than the Sun; asteroid delivery = leading idea, still debated), neutron_star fact5 (merger gold, GW170817), earth fact5 (mined gold arrived on meteorites; original sank to the core). EN + SR, sources added.
- GSC: 11 URLs requested; resume with /en/compare/milky-way-vs-andromeda.
- Next: owner will ask "propose the next plan" → round 5.

## 2026-11-20 — round 5 plan; review of round 4 (block 1); Next 16.4.6 (block 2)
- New plan (round 5) in `docs/NEXT-PLAN.md`: review → Next upgrade → last scale gaps (Tarantula/SMC, mouse/hummingbird) → physics/micro ideas → compare pairs → GSC CTR.
- Facts (agent-checked against Wikipedia/CERN/NASA/papers): −273.15 °C is exact because Celsius is defined as kelvin − 273.15 (the 2019 SI change redefined the kelvin, not the offset); the animals guide no longer calls General Sherman "the biggest living thing" (biggest single tree; Pando / honey fungus bigger), blue whale "typically 25 m, up to 30 m", "heaviest animal known … (weighed record)", Meganeuropsis ~290 Myr; LHC off since end of June 2026, 13.6 TeV "during Run 3 (2022–2026)"; Saturn V thrust 34–35 MN (7.5–7.9 Mlbf) — the two units disagreed; Sloan Great Wall unsourced "1.5 billion comoving" dropped; Tiangong record is an effective temperature; neutron-star gold mentions magnetar flares.
- Serbian: genitive after decimals (43,5 tone, džul-sekunde, 3,7 mačke), ordinal years with a period („1973.;“, „2025. godine,“), MSS/MSS-a, „struktura“ not „obrazac“ for cosmic structures, „podrhtavanje nulte tačke“ consistently, strings „titraju“ (not „trepere“), Gaia uninflected, ~20 style fixes (Stonehenge, Omega Centauri, uncertainty principle, animals guide, glossary thrust / BEC).
- Temperatures use a real minus sign everywhere ("−271.3 °C"; `toLocaleString` gave a hyphen).
- Mobile check of 14 new pages (live): no overflow.
- Next 16.2.6 → 16.4.6 (+ eslint-config-next): checks, OpenNext build and a local Worker smoke test (pages, 308s, sitemap, OG, 404 status) all fine; the 404 body is still not server-rendered.

## 2026-11-20 — last scale gaps (round 5, block 3)
- Three topics drafted by research agents (sources fetched, Commons licences from extmetadata), then read and edited: Tarantula Nebula (`tarantula_nebula`, "nearly 1,000 ly" as ESA/Hubble and ESO say, 650–1,860 ly range explained; 160,000 ly like the LMC; R136a1 "about 200 to 300 Suns"; shadows-at-Orion-distance claim from NOAO 2011; Webb NIRCam PD), Small Magellanic Cloud (`small_magellanic_cloud`, 18,900 ly, 200,000 ly; Leavitt's period–luminosity rule; 2024 "two structures" / 2025 "torn apart" hedged; P. Horálek/NOIRLab CC BY 4.0), house mouse (`house_mouse`, 8 cm head-and-body as a `length`, like the cat; 6 mm gap, 85% protein-coding identity; Dion Art CC BY-SA 4.0; glossary `commensal`; "most used mammal in research" softened to "a mainstay" — unsourced).
- The scale now steps Omega Centauri 150 → Tarantula 1,000 → SMC 18,900 → LMC 32,000 ly and honey bee 13 mm → mouse 8 cm → cat 46 cm.
- Wired: nebulae guide (text + key number), distances and supernova guides, animals guide (text + key number), galaxies collection intro, FAMILIAR_STOP_IDS + LENGTH_STOP_IDS (mouse). Pair large-magellanic-cloud-vs-small-magellanic-cloud (38 pairs). New URLs appended to the GSC queue.
- Generated text: 5–10 cm now reads in centimetres ("8 cm", was "80 mm"); pair descriptions only promise what the page shows — "sizes and distances" / "sizes and temperatures" (sun/planet pairs without a distance line used to promise distances).

## 2026-11-21 — physics + micro-world ideas (round 5, block 4)
- Four idea topics drafted by research agents (sources fetched, Commons licences from extmetadata), then read, cross-checked for overlap and edited:
  - Electron (`electron`, MICRO_WORLD): no measured size, only the LEP upper bound of 2.8 × 10⁻¹⁹ m; the 2.8 fm "classical electron radius" is explained as not a size; JILA 2023 roundness; g/2 to 0.13 ppt; electron microscopes. Image: Thomson's 1897 tube (Science Museum, CC BY-SA 2.0).
  - Wave–particle duality (`wave_particle_duality`): Young, the photoelectric effect (Einstein's Nobel), de Broglie, Davisson–Germer, Tonomura's 1989 single-electron build-up (the image), molecules of 2,000 atoms (2019) and 7,000-atom sodium clusters (Nature 2026). Myths addressed: no flipping between wave and ball, no conscious observer.
  - E = mc² (`mass_energy_equivalence`): 1 kg ≈ 21.5 Mt TNT, Hiroshima ≈ 0.7 g, the Sun loses 4.26 Mt/s (0.03% over 4.6 Gyr), a boiled cup of tea is ~0.9 ng heavier, the 2005 NIST/MIT test to 4 × 10⁻⁷. Image: the actual paragraph of the 1905 paper (L/V², PD).
  - Entropy (`entropy`): S = k log W, the second law as statistics (1 in 2¹⁰⁰), "disorder" as shorthand, Earth sending ~20 infrared photons per sunlight photon, Landauer, the arrow of time; the past hypothesis and heat death are marked open. Image: Boltzmann's grave (CC BY-SA 4.0).
- Glossary: new `spin`, `photon`, `rest_energy`, `second_law`, `microstate`; the `electron` definition rewritten (no size, carries current).
- Guides: smallest things (+electron), time (+entropy, speed of light); the time guide now says entropy "never decreases" instead of "(disorder) always increases".
- Fixed a live bug: since the Next 16 upgrade every topic's OG image showed the Planck length card, and the Serbian home OG image was in English. `params` is a Promise in metadata image routes; the topic and home routes read it synchronously.


## 2026-11-21 — compare pairs for the newest topics (round 5, block 5)
- 17 candidate pairs dumped in EN + SR and read; 4 kept (42 pairs): tarantula-nebula-vs-orion-nebula, titanic-vs-blue-whale, african-elephant-vs-human, burj-khalifa-vs-saturn-v. Dropped: Titanic vs Eiffel Tower (ship length vs tower height), Colosseum vs Stonehenge, Omega Centauri vs Orion, Tarantula vs LMC (part of it, same distance), LHC vs Great Wall, SMC vs Milky Way.
- Two lengths now compare as "longer": "The Titanic is about 11 times longer than a blue whale: the Titanic is 269 m long, a blue whale 25 m" (SR „duže … Dužina —“), FAQ "How much longer …?". No existing pair was affected.
- Mobile check of the 4 pages: no overflow. URLs appended to the GSC queue.
- Round 5 left: 404 SSR body (Next), Search Console CTR (needs data).

## 2026-11-21 — indexing; round 6 plan
- GSC: 11 URLs requested (milky-way-vs-andromeda pair + 10 physics/cosmos topics); quota hit on multiverse — resume there.
- New plan (round 6) in `docs/NEXT-PLAN.md`: review round 5's topics → quantum-physics guide → ribosome + Humankind structures → Lighthouse re-check → pairs; 404 SSR + GSC CTR carried over.

## 2026-11-21 — review of round 5's topics (round 6, block 1)
- Facts (agent-checked against sources; arithmetic recomputed — all sums were right): Tarantula "60 full Moons" was a width, not an area (now "about 30° across — as wide as 60 full Moons side by side"); R136 is 1–2 Myr old (was 2–3); R136a1 "about 200 Suns (earlier estimates over 300)"; SN 1987A "was seen exploding"; Magellan's voyage "made the Clouds widely known in Europe" (SMC + LMC; Europeans had reports earlier); Leavitt's rule needed calibrating; electron limit 3 × 10⁻¹⁹ m in the narrative (matched the LEP fact), HfF⁺ molecular ions, "ordinary light microscope"; spin is zero for some particles (Higgs); Young split a beam (the two-slit form is later); E = mc²: "a body's mass is a measure of the energy it contains"; Planck introduced k (he didn't name it after Boltzmann); Sun "over 20 times hotter"; heat-death sentence fixed; time guide: entropy is "a measure of" the number of arrangements, second law "in practice". Sources: APOD 30°, ESA heic1605.
- Serbian: genitive singular after decimals site-wide (46 × „X,Y milijarde“, e.g. „13,8 milijarde godina“), „u minutu“, dative „odgovara energiji od“, „0,6 milijarditog dela“, reflexive „svog većeg suseda“, „magnetni moment“, „sopstveni moment impulsa“, years in parentheses without a period, ~40 style fixes across the 7 topics and glossary (commensal, spin, rest energy, second law).
- Mobile check of 8 pages (live, both locales): no overflow.

## 2026-11-21 — quantum-physics guide (round 6, block 2)
- `/topics/quantum-physics` ("Quantum Physics for Beginners: What Is Known and What Isn't"), EN + SR, 5 sections: energy in lumps (Planck 1900, h exact since 2019, photons, atomic energy levels), every particle is a wave (de Broglie, two slits, uncertainty), entanglement (Bell, loophole-free 2015, no messages, 2022 Nobel, Micius 1,203 km), the Standard Model's 17 kinds of particle (proton not elementary, antimatter, no measured size), known vs open (12-digit tests and everyday tech; interpretations, matter–antimatter, neutrino masses, gravity at the Planck length). Numbers reuse the topic pages' sourced values. Hero: Tonomura's build-up image. Key numbers: h, 17 kinds, Planck length, quark, proton, atom.
- No tag: `/tag/particle` stays a sizes collection with its own searches.
- Bug fix: guide auto-links allowed up to 3 extra letters after a name (for Serbian cases), so English "Anton" linked to the ant topic. English now takes only plural -s/-es; every other existing guide link unchanged (diffed all 17 guides).

## 2026-11-21 — zoom on the size scale (owner request)
- The home size scale (82 dots) was crowded between 10 m and 10 million km. Rather than dropping topics (the scale is also how you step through them), it gets −/+ zoom: 1×, 2.5×, 6× track width in the existing horizontal scroller, which keeps the selected dot centred; dot rows and tick thinning scale with the zoom, and zoomed-in tracks show a tick every power of ten. Only on scales with ≥ 30 dots (not the distance/temperature views with few dots).

## 2026-11-21 — direction reset; ribosome (round 6, block 3)
- Owner noticed the site drifting towards animals and modern structures. Agreed direction: cosmos + micro/quantum world + ancient-history stories; existing animals/structures stay as yardsticks, no new ones. Written at the top of NEXT-PLAN.md.
- Golden Gate Bridge and Panama Canal were fully drafted by agents and then dropped (drafts only in the session scratchpad, not committed).
- Home shelves reordered: Cosmos, Micro-World, Forces & Spacetime, Humankind, Life & Earth (was Micro, Life & Earth, Physics, Cosmos, Humankind); the Life & Earth row opens with Everest/Mariana Trench/Grand Canyon…, animals at the end.
- Ribosome (`ribosome`, 25 nm, MICRO_WORLD, FACT): fills DNA 2 nm → virus 100 nm. Bacterial ~20 nm, human 25–30 nm, 25 nm per the Nobel 2009 material; ~20 aa/s in E. coli, ~6 in mouse cells; 3–10 million per HeLa cell, 72,000 per fast E. coli; the RNA does the chemistry (ribozyme); Palade 1955, Nobel 2009; antibiotics. Image: E. coli 70S QuteMol render, Dcrjsr CC BY 3.0 (resized, not cropped). Glossary: ribozyme, amino_acid. In the smallest-things and human-body guides.

## 2026-11-21 — speed re-check (round 6, block 4)
- Lighthouse mobile (live, 2 runs each), all a11y/best-practices/SEO 100: home 84–85 (LCP 4.0–4.4 s, TBT 40–90 ms), quantum-physics guide 82–85, Jupiter 81–82 → 83 after the fix, milky-way-vs-andromeda 78 → 87. No speed regression since 2026-11-19.
- CLS found with a throttled Playwright layout-shift recorder (Lighthouse names only the moved container):
  - Topic pages 0.075: ShareBar added a "Share" button after hydration on browsers with the Web Share API (every phone), wrapping the button row and pushing the image down. Now one button: "Copy link" in the HTML, "Share" on such browsers (narrower, never wraps).
  - Pair pages 0.135: the compare tool used useSearchParams, so the static HTML held only the Suspense fallback (the header) and the tool appeared after JS, pushing "Popular comparisons" off-screen. Pair pages now use `ComparePairTool` (no search params; the pair is fixed by the path) and server-render the whole tool; `/compare` keeps `ComparePage` with ?a=&b=. Swap/mode still hand off to /compare (checked).
  - After: CLS 0–0.001 on both.
- Budgets: base client dictionary 52.2 KB (en) / 52.3 KB (sr) of 60 KB; scripts ~260 KiB own + gtag 179 KiB (lazyOnload).

## 2026-11-21 — pair for round 6 (block 5)
- virus-vs-ribosome (43 pairs): "A virus is about 4 times bigger than a ribosome: a virus measures 100 nm, a ribosome 25 nm." (SR read too). Round 6 is done except the carried-over blocked items (404 SSR body, GSC CTR).

## 2026-11-21 — round 7 blocks 1–2: ancient sky stories + guide
- Round 7 plan written (direction: cosmos, micro/quantum, ancient stories that meet the sky).
- New HUMANKIND topics (FACT, tag `ancient`), drafted by agents, facts/Serbian reviewed:
  - Nebra Sky Disc (`nebra_sky_disc`, 31 cm; sources 30–32 cm). Softened "the museum calls it the oldest…" (unsourced) to "widely regarded". Image CC0 (Shonagon). Note: in 2023 the Saxony-Anhalt heritage office sent Commons a DMCA claim over disc photos; Wikimedia DE counter-noticed (EU DSM Art. 14); file still CC0 on Commons.
  - Antikythera Mechanism (`antikythera_mechanism`, 33 cm estimated case length → LENGTH_STOP_IDS). Fragment A 18 cm, 82 fragments, 30 gears; planetary gearing marked as reconstruction. Image CC BY 4.0 (Logg Tandy, resized only).
  - Newgrange (`newgrange`, 85 m mound). Fun fact replaced (unsourced axial-tilt claim) with Ray 1989 Nature (beam aligned with first sunrise rays when built). Image CC BY-SA 4.0 (cropped).
  - El Castillo at Chichén Itzá (`el_castillo`, 30 m height → HEIGHT_STOP_IDS). 365 steps and equinox serpent worded as "usually counted" / intention debated. Image CC BY-SA 4.0 (cropped).
  - New glossary: equinox, saros, metonic_cycle, solstice, lunisolar_calendar, passage_tomb, roof_box.
- Guide `/topics/ancient-astronomy` (5 sections: solstice monuments, pyramid north alignment + Orion-correlation myth, Sirius & the 365-day Egyptian calendar, Nebra/Babylonian saros/Halley 240 BC/Eratosthenes/Antikythera, El Castillo + "no aliens"). Names written to match auto-links in both locales (checked).
- Fix: ScaleExplorer hydration mismatch (dev console error on every topic page): long float `left: %` values and numeric `top` differed from the browser-normalised server HTML; positions now 6 significant digits, `top` in px.

## 2026-11-22 — round 7 block 3: cosmos topics
- New COSMOS topics (agent drafts, reviewed): Saturn's Rings (`saturn_rings`, 273,550 km main rings, ~10 m thick, age debate both sides; no tag), Kuiper Belt (`kuiper_belt`, 100 AU ≈ 1.5e13 m), TRAPPIST-1 (`trappist_1`, 166,000 km, 40.7 ly, 2,566 K; JWST atmosphere results worded as unsettled), Pillars of Creation (`pillars_of_creation`, 4 ly tall → HEIGHT_STOP_IDS, 6,500 ly; supernova story as unconfirmed), Cosmic Microwave Background (`cosmic_microwave_background`, idea, 2.7255 K, ESTABLISHED_THEORY like big_bang).
- Solar System `sizeMeters` 1.5e13 → 9e12 (Neptune's orbit, 60 AU): the old value was never explained and equalled the Kuiper Belt; body now says so and mentions the belt.
- New tag pages: star-system (Solar System + TRAPPIST-1), red-dwarf (Proxima + TRAPPIST-1). New glossary: orbit (was referenced by 8 planet pages but missing), roche_limit, orbital_resonance, transit, scattered_disc, contact_binary, photoevaporation, black_body, recombination.
- Size FAQ: new `a8taller` ("X is N times taller than Earth is wide") — the Pillars said "wider". Saturn texts 273,000 → 273,500 km to match the rings page.
- Guides: stars +TRAPPIST-1, planets +rings/Kuiper Belt, nebulae +Pillars, big-bang +CMB.

## 2026-11-22 — review of round 7 topics + pairs (round 7, blocks 4–5)
- Facts (agents checked against sources, arithmetic recomputed): CMB dipole is ±0.1% vs average (ahead vs behind is 0.25%); "cold spot … no agreed explanation"; TRAPPIST-1 planets 0.76–1.13 Earth widths (h = 0.755), JWST: no Earth-like atmosphere on b/c/d, e inconclusive (2025); Saturn B ring 5–10 m thick, 2.5 km structures "thought to be raised by unseen moonlets"; Albion 110–170 km, *discovered* 30 Aug 1992; Kuiper's 38–50 AU from 1950–51; Pillars supernova story uses the 2007 study's 7,000 ly; NASA 2015 "pillars about 5 ly tall"; Newgrange "half a hectare (about 5,000 m²)" (4,500 m² contradicted 85 m) and "600–700 years before"; Antikythera planetary gearing "almost nothing survives (Fragment D gear debated)"; El Castillo "built over an older pyramid, found inside it"; guide: Metonic (not lunar) calendar, Sothic 1,460 y vs Sirius / ~1,500 vs seasons, light zigzag along the north stair's balustrade.
- Serbian: ~30 fixes (Uneskov/Uneskovoj site-wide, „sakupljači sunđera“, „zupčani prenosi za planete“, „čini“ after devet, „milijarde“ after decimals, „za oko petinu šira“, „dodeljuju žrebom“, „gravitacioni uticaj na planete“, …). The guide keeps **Antikiterski mehanizam** capitalised because the auto-link is case-sensitive.
- Mobile check of all 9 topics + guide in both locales (live): no overflow.
- Lighthouse mobile (live): trappist_1 91, pyramid-vs-el-castillo 88; a11y/BP/SEO 100, CLS 0.
- Pairs (49): kuiper-belt-vs-asteroid-belt, pyramid-vs-el-castillo, trappist-1-vs-jupiter, sun-vs-trappist-1, pillars-of-creation-vs-solar-system, saturn-rings-vs-earth. Dropped: Newgrange vs Stonehenge (mound vs circle diameter; people search it for age), Saturn's rings vs Saturn (part of it).

## 2026-11-22 — round 8 plan; blocks 1–2: quantum ideas + micro sizes
- Round 8 (owner: "ok do all"): strengthen the quantum/micro side (Cosmos 57 topics vs Micro-World 16, Forces & Spacetime 12), plus 3 ancient sky sites.
- New PHYSICS ideas (agent drafts, 5 sources each): Quantum Superposition (Schrödinger's cat as a 1935 criticism, Einstein's gunpowder keg, decoherence; interpretations as interpretations), Quantum Tunnelling (Gamow/Gurney–Condon 1928, Sun's core protons tunnel, STM, flash memory, 2025 Nobel to Clarke/Devoret/Martinis), Pauli Exclusion Principle (1925, shells 2/8/18/32, Dyson–Lenard 1967 stability of matter, degeneracy pressure, ESTABLISHED_THEORY). New glossary: decoherence, alpha_decay, josephson_junction, fermion.
- New MICRO_WORLD sizes: Atomic nucleus (1.4e-14 m = gold-197; atom 20,000–60,000× wider), Visible light (wavelength 5.5e-7 m, 555 nm eye peak; Abbe limit ~200 nm, 2014 Nobel nanoscopy, 1/λ⁴ blue sky), Mitochondrion (2e-6 m length; endosymbiosis, 16,569 bp mtDNA). New glossary: wavelength, diffraction_limit, endosymbiosis, atp.
- Guides: quantum-physics +superposition/tunnelling/Pauli/visible light; smallest-things +nucleus/light/mitochondrion; human-body +mitochondrion.
- Size FAQ: exact same-size neighbours (ratio < 1.01) are never named — mitochondrion vs bacterium read "about 1 times smaller". Atom's step down is now the nucleus (test updated). Mitochondrion SEO titles shortened (60-char test).
- Dev check: 12 pages 200, mobile no overflow.
