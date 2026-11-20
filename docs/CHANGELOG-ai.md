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
