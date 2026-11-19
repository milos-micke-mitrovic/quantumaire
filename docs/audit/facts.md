# Quantumaire EN fact audit (2026-11-19)

Scope: `locales/en.json` → stops.* (all 52), topics.*, home.faq.*, tagPages.*, categories.*, common.converter.faq; also `spacecraft.*` and `glossary.oort_cloud` for cross-page consistency. `content/stops.json`: numeric fields, badges, and all 112 non-Britannica source URLs (every one returned HTTP 200 with `curl -L`; none broken).

Voyager 1 check: NASA/JPL and EarthSky give the one-light-day crossing as **18 Nov 2026, 10:16 UTC** (https://earthsky.org/space/voyager-1-1-light-day-from-earth-november-17-18-2026/). So `voyager1.facts.fact3`, `voyager1.body` and `topics.distances.section1Body` are correct as of today. I also modelled Earth's orbital swing (about ±0.8 AU along Voyager's line of sight). The distance keeps increasing through 2027 and does not drop back under one light-day, so "every signal now takes a full day" holds. "49 years" is correct until 5 Sep 2027 (see the low-severity entry).

---

### common.converter.faq[2].a  (severity: high)
- Current: "It is the distance at which a star would appear to shift by one arcsecond as Earth moves half-way around its orbit"
- Problem: Off by a factor of two. A parsec is the distance at which **1 AU** (the radius of Earth's orbit) spans one arcsecond, i.e. a parallax of 1″. Between opposite sides of the orbit (2 AU baseline, half a year apart) the star shifts by 2″ in total. https://en.wikipedia.org/wiki/Parsec
- Fix (EN): "A parsec is about 3.26 light-years (3.086 × 10¹³ km). It is the distance at which the radius of Earth's orbit — one astronomical unit — would span exactly one arcsecond, so a star there wobbles one arcsecond either side of its average position over a year. That parallax shift is how astronomers first measured the distances to nearby stars."
- Also update: sr.json `common.converter.faq[2].a`. SR: "Parsek iznosi oko 3,26 svetlosnih godina (3,086 × 10¹³ km). To je udaljenost sa koje bi poluprečnik Zemljine orbite — jedna astronomska jedinica — zauzimao tačno jednu lučnu sekundu, pa se zvezda na toj udaljenosti tokom godine pomera po jednu lučnu sekundu na svaku stranu od svog prosečnog položaja. Tim pomakom paralakse astronomi su prvi put izmerili udaljenosti do bliskih zvezda."

### stops.andromeda.narrative  (severity: high)
- Current: "You're seeing it as it was before the first members of our genus, Homo, appeared."
- Problem: The light left about 2.5 million years ago. The earliest accepted Homo fossil (LD 350-1, Ethiopia) is about 2.8 million years old, so Homo already existed when the light set out. The site itself uses 2.8 Myr in `proxima_centauri.ifDistance` ("sixteen times longer than the human genus": 45/16 ≈ 2.8). https://en.wikipedia.org/wiki/LD_350-1
- Fix (EN): "Andromeda already covers about six full moons in our night sky — yet its light has travelled 2.5 million years to reach us. It set out when our genus, Homo, was still in its infancy in Africa."
- Also update: `topics.distances.section3Body`. Change "its light set out before the first members of our genus, Homo, appeared" to "its light set out when our genus, Homo, was still in its infancy". sr.json `stops.andromeda.narrative`: replace "Vidite je onakvu kakva je bila pre nego što su se pojavili prvi pripadnici našeg roda, Homo." with "Svetlost je krenula kada je naš rod, Homo, bio tek u povoju u Africi." sr.json `topics.distances.section3Body`: replace "njena svetlost je krenula pre nego što su se pojavili prvi pripadnici našeg roda, Homo" with "njena svetlost je krenula kada je naš rod, Homo, bio tek u povoju".

### stops.saturn.facts.fact4  (severity: high — stale, appears in 4 keys)
- Current: "285 known moons (as of March 2026) — more than any other planet."
- Problem: Out of date. NASA now lists 293 confirmed Saturn moons "as of August 2026" (https://science.nasa.gov/saturn/moons/) and 115 IAU-recognised Jupiter moons (https://science.nasa.gov/jupiter/jupiter-moons/, page updated 17 Nov 2026).
- Fix (EN): "293 known moons (as of August 2026) — more than any other planet."
- Also update:
  - `stops.saturn.body`: "Saturn has 285 known moons" → "Saturn has 293 known moons".
  - `stops.jupiter.facts.fact4`: "More than 100 known moons (101 as of March 2026)" → "More than 100 known moons (115 as of August 2026)".
  - `topics.moons.section3Body`: "Jupiter has 101 known moons and Saturn 285 (as of March 2026)" → "Jupiter has 115 known moons and Saturn 293 (as of August 2026)".
  - SR, same keys: "285 poznatih meseca (od marta 2026)" → "293 poznata meseca (od avgusta 2026)"; "Saturn ima 285 poznatih meseca" → "Saturn ima 293 poznata meseca"; "(101 od marta 2026)" → "(115 od avgusta 2026)"; "Jupiter ima 101 poznat mesec, a Saturn 285 (od marta 2026)" → "Jupiter ima 115 poznatih meseca, a Saturn 293 (od avgusta 2026)".
  - `stops.solar_system.body`/`fact2` ("more than 400 moons") is still true (now about 455).
  - Consider dropping the exact numbers and writing "nearly 300" / "more than 110", since these counts change several times a year.

### stops.uranus.facts.fact3  (severity: medium)
- Current: "Cloud-top temperature around -197 °C — coldest planetary atmosphere despite not being farthest."
- Problem: This contradicts `stops.neptune.facts.fact4` ("Cloud-top temperature around -201 °C"). By the site's own figures Neptune's cloud tops are colder. Uranus's "coldest atmosphere" record refers to its tropopause minimum of about 49 K (−224 °C), not its cloud tops. https://science.nasa.gov/uranus/facts/
- Fix (EN): "Its upper atmosphere dips to about −224 °C (49 K) — the coldest of any planet, colder even than more-distant Neptune."
- Also update: sr.json `stops.uranus.facts.fact3`: "Gornja atmosfera spušta se do oko −224 °C (49 K) — najhladnija od svih planeta, hladnija čak i od udaljenijeg Neptuna." The `temperatureKelvin` of 76 can stay (it is the 1-bar value).

### stops.venus.body  (severity: medium)
- Current: "No spacecraft has lasted more than two hours on its surface."
- Problem: Venera 13 (1982) transmitted from the surface for 127 minutes, which is just over two hours. https://en.wikipedia.org/wiki/Venera_13
- Fix (EN): "No spacecraft has lasted much more than two hours on its surface — the record, Venera 13, managed 127 minutes."
- Also update: sr.json `stops.venus.body`: "Nijedna letelica nije izdržala duže od dva sata na njenoj površini." → "Nijedna letelica nije izdržala mnogo duže od dva sata na njenoj površini — rekorder, Venera 13, trajala je 127 minuta."

### stops.dna.body  (severity: medium)
- Current: "Nearly every cell carries the same complete copy … all written into roughly two metres of DNA coiled inside that one cell."
- Problem: About 84% of the body's roughly 30 trillion cells are red blood cells, and they have no nucleus or DNA (Sender, Fuchs & Milo 2016, https://doi.org/10.1371/journal.pbio.1002533). The `dna.massNarrative` also multiplies by "thirty trillion cells". Its "less than half a kilo" conclusion still holds, but the premise is wrong.
- Fix (EN): "Almost every cell that has a nucleus carries the same complete copy — your eye colour, your height, the chance you'll inherit your father's allergies, all written into roughly two metres of DNA coiled inside each one."
- Also update:
  - `stops.dna.facts.fact5`: "coiled into nearly every cell in your body" → "coiled into almost every cell with a nucleus".
  - `stops.dna.massNarrative`: optionally "All the DNA in your body together weighs well under half a kilo".
  - SR: needs equivalent change in `stops.dna.body` ("Gotovo svaka ćelija" → "Gotovo svaka ćelija sa jedrom"), `stops.dna.facts.fact5` ("u skoro svaku ćeliju vašeg tela" → "u skoro svaku ćeliju sa jedrom"), and `stops.dna.massNarrative`.

### stops.dark_energy (badge in content/stops.json)  (severity: medium)
- Current: badge "SPECULATIVE"
- Problem: The accelerating expansion is well established. It was found independently by two teams, won the 2011 Nobel Prize, and is confirmed by the CMB and baryon acoustic oscillations (BAO), giving ~68% of the energy budget in ΛCDM. The site itself says so in `topics.bigBang.section3Body` ("The acceleration is **established theory**"). Dark matter, which has a comparable status, is PROBABLE_THEORY. Only its *nature* is unknown. Rating it SPECULATIVE, alongside wormholes and the multiverse, understates it and is inconsistent with the rest of the site. https://www.nobelprize.org/prizes/physics/2011/summary/
- Fix (EN): set badge to "PROBABLE_THEORY" (keep the text, which already stresses that we don't know what it is).
- Also update: nothing in SR text; check whether any tag page or category copy lists dark energy among "speculative" items.

### tagPages.galaxy.intro  (severity: medium)
- Current: "two spirals of hundreds of billions of stars, on course to merge in a few billion years."
- Problem: This contradicts `stops.andromeda.body`/`facts.fact4`, which say a 2025 Hubble + Gaia study (Sawala et al., Nature Astronomy) puts the merger odds within 10 billion years at only about 50%. https://www.nature.com/articles/s41550-025-02563-1
- Fix (EN): "two spirals of hundreds of billions of stars, closing in on each other — though whether they merge within the next 10 billion years is now roughly a coin toss."
- Also update: sr.json `tagPages.galaxy.intro`: "…dve spirale sa stotinama milijardi zvezda koje se približavaju jedna drugoj — mada je spajanje u narednih 10 milijardi godina sada otprilike pitanje bacanja novčića."

### categories.MICRO_WORLD.intro  (severity: medium)
- Current: "Each step down this ladder is roughly a thousand times smaller than the last"
- Problem: Using the site's own `sizeMeters`, the steps are bacterium→virus ×20, virus→DNA ×50, DNA→atom ×20, atom→proton ×100,000, proton→quark ×1,000. Only one step is roughly a thousandfold.
- Fix (EN): "Each step down this ladder is anywhere from ten to a hundred thousand times smaller than the last"
- Also update: SR: needs equivalent change in sr.json `categories.MICRO_WORLD.intro`.

### categories.EARTH.intro  (severity: medium)
- Current: "Life on Earth spans more than seven orders of magnitude — from a tardigrade you'd need a microscope to see, through a human being, to a blue whale"
- Problem: From a tardigrade (0.5 mm) to a blue whale (25–30 m) is under 5 orders of magnitude. `tagPages.biology.intro` (DNA to whale) correctly says "more than ten". Also, a 0.5 mm tardigrade is just about visible to the naked eye.
- Fix (EN): "Animal life alone spans nearly five orders of magnitude — from a tardigrade barely visible to the naked eye, through a human being, to a blue whale"
- Also update: SR: needs equivalent change in sr.json `categories.EARTH.intro`.

### stops.venus / stops.mercury distanceFromEarthMeters (content/stops.json)  (severity: medium)
- Current: venus 120000000000; mercury 155000000000; mars 225000000000
- Problem: These values mix different definitions. Mercury's is the time-averaged Earth distance (1.04 AU). Venus's 120 million km (0.80 AU) matches no standard definition; its time-averaged distance is about 1.14 AU, or 170 million km. As a result, the "Distance from Earth" scale and the compare page show Venus closer than Mercury on average, which is the reverse of the well-known result that Mercury is, on average, the closest planet to Earth (and to every planet). Physics Today 2019: https://pubs.aip.org/physicstoday/online/30225
- Fix (EN): venus `distanceFromEarthMeters`: 170000000000. Optionally Mars → 255000000000 (time-averaged, 1.7 AU); if you do, change `stops.mars.facts.fact2` to "Average distance from Earth ~255 million km — closest pass ~54 million km."
- Also update: sr.json `stops.mars.facts.fact2` only if Mars changes. Optionally add a Mercury fact: "On average, Mercury is the closest planet to Earth — and to every other planet."

### stops.mercury.narrative  (severity: low)
- Current: "Wait for nightfall — 88 Earth days later — and the same ground sinks below -170 °C"
- Problem: Mercury's solar day is 176 Earth days, so sunset comes 44 days after noon. 88 days after noon is local midnight.
- Fix (EN): "Wait until local midnight — 88 Earth days later — and the same ground sinks below -170 °C"
- Also update: sr.json `stops.mercury.narrative`: "Sačekajte noć — 88 zemaljskih dana kasnije —" → "Sačekajte lokalnu ponoć — 88 zemaljskih dana kasnije —".

### topics.time.section3Body  (severity: low)
- Current: "This isn't a paradox; the asymmetry comes from acceleration, which only the travelling twin experiences."
- Problem: Physicists would object here. Acceleration is not the cause: the effect is the same however brief the turnaround, and it also appears in acceleration-free three-clock versions. The asymmetry is that the travelling twin's worldline changes inertial frame, and the bent path through spacetime has less proper time. https://en.wikipedia.org/wiki/Twin_paradox
- Fix (EN): "This isn't a paradox: the two twins are not symmetric, because only the traveller switches from an outbound to an inbound frame of reference. Their paths through spacetime differ, and the bent path accumulates less time."
- Also update: SR: needs equivalent change in sr.json `topics.time.section3Body`.

### stops.neutron_star.massNarrative  (severity: low)
- Current: "A single sugar cube of neutron-star matter would outweigh every human on Earth combined."
- Problem: Average density (1.4 M☉ in a 12 km radius) is about 4 × 10¹⁷ kg/m³, so 1 cm³ weighs about 4 × 10¹¹ kg. Humanity (8.2 billion × ~50 kg average including children) is also about 4 × 10¹¹ kg. The two are comparable, so "outweigh" is not supported except in the core. `stops.atom.funFact` ("entire human race would fit inside a sugar cube") has the same issue: it is about 2 cubes at nuclear density.
- Fix (EN): "A single sugar cube of neutron-star matter would weigh about as much as every human on Earth combined."
- Also update: `stops.atom.funFact` → "…and the entire human race would fit into a couple of sugar cubes." SR: needs equivalent change in sr.json `stops.neutron_star.massNarrative` and `stops.atom.funFact`.

### stops.neutron_star.facts.fact4  (severity: low)
- Current: "Forms when a 10 to 25 solar-mass star collapses in a supernova."
- Problem: Inconsistent with `topics.stars.section4Body`, `topics.blackHoles.section2Body` and `topics.supernova.section2Body`, which all say 8–25. The usual lower limit is about 8 M☉.
- Fix (EN): "Forms when a star of roughly 8 to 25 solar masses collapses in a supernova."
- Also update: sr.json `stops.neutron_star.facts.fact4`: change "10" to "8" (SR: needs equivalent change).

### stops.uy_scuti.narrative  (severity: low)
- Current: "under ten million years from birth to supernova. Our Sun, ten times less massive, …"
- Problem: `uy_scuti.massNarrative` gives today's mass as 7–10 M☉ (matching Wikipedia). A 7–10 M☉ star lives about 20–40 Myr, and with that mass the Sun is "7–10 times" lighter, not "ten times". The short lifetime only works for its larger *birth* mass (~20–25 M☉, since shed). https://en.wikipedia.org/wiki/UY_Scuti
- Fix (EN): "Stars like UY Scuti live only a moment by cosmic standards — born perhaps twenty times heavier than the Sun, they burn out in around ten million years. Our Sun is already 4.6 billion years old and only about halfway done."
- Also update: SR: needs equivalent change in sr.json `stops.uy_scuti.narrative`.

### topics.largestThingsInTheUniverse.section1Body  (severity: low)
- Current: "and even UY Scuti would reach past Mars into the asteroid belt."
- Problem: A radius of 909 R☉ is 4.23 AU. That is beyond the whole main belt (2.2–3.3 AU) and about 80% of the way to Jupiter, so "into the asteroid belt" understates it.
- Fix (EN): "and even UY Scuti would reach past Mars and the asteroid belt, most of the way to Jupiter."
- Also update: SR: needs equivalent change in the same key.

### topics.smallestThingsInTheUniverse.section2Body  (severity: low)
- Current: "so somewhere between half a million and a million atoms side by side would span the thickness of a human hair."
- Problem: Using the page's own numbers (70 µm hair, 0.1–0.5 nm atoms), the answer is 140,000 to 700,000.
- Fix (EN): "so somewhere between about 150,000 and 700,000 atoms side by side would span the thickness of a human hair."
- Also update: SR: needs equivalent change in the same key.

### stops.solar_system.funFact  (severity: low)
- Current: "the Oort Cloud … may extend halfway to the nearest star."
- Problem: The site's own outer edge (fact4, glossary, `distanceFromEarthMeters` 1.5e16 m) is 100,000 AU ≈ 1.6 ly. Proxima is 4.24 ly away, so that is about 37%, not half.
- Fix (EN): "…a roughly spherical shell of icy bodies that may extend more than a third of the way to the nearest star."
- Also update: SR: needs equivalent change in sr.json `stops.solar_system.funFact`.

### stops.voyager1.body  (severity: low)
- Current: "Forty-nine years later it's still operating … sending back a faint trickle of data on the particles and magnetic fields around it."
- Problem: (1) NASA switched off Voyager 1's last particle instrument (LECP) on 17 April 2026. Only the plasma-wave subsystem and the magnetometer remain on. https://www.jpl.nasa.gov/news/nasa-shuts-off-instrument-on-voyager-1-to-keep-spacecraft-operating/ (2) "Forty-nine years" becomes wrong on 5 Sep 2027.
- Fix (EN): "Nearly half a century later it's still operating — now in interstellar space, more than 173 astronomical units from Earth, sending back a faint trickle of data on the plasma waves and magnetic fields around it, from the last two of its instruments still switched on."
- Also update: the hard-coded ages drift. `stops.voyager1.facts.fact1` ("over 49 years ago" → "Launched 5 September 1977."), `stops.solar_system.body` ("has been travelling for 49 years" → "has been travelling since 1977"), and `stops.solar_system.facts.fact3` ("has been travelling for 49 years and is about 26 billion km out" → "launched in 1977, is now about 26 billion km out — one light-day"). `spacecraft.craft.voyager1.status` is fine. SR: needs equivalent change in the same four keys ("četrdeset devet"/"49 godina" → "od 1977.").

### stops.halley sizeMeters vs text  (severity: low)
- Current: sizeMeters 11000; body "about 15 km long"; fact1 "roughly 15 × 8 km"
- Problem: Size comparisons and analogies use 11 km (the mean diameter) while the text says 15 km. Both are right, but the page shows two different sizes with no explanation.
- Fix (EN): fact1 → "Nucleus is roughly 15 × 8 × 8 km — about 11 km in mean diameter, irregular and peanut-shaped."
- Also update: SR: needs equivalent change in sr.json `stops.halley.facts.fact1`.

### topics.planetSizesCompared.section4Body vs stops.saturn  (severity: low)
- Current: "Saturn's main rings stretch about 270,000 km from edge to edge" vs `stops.saturn.funFact`/`facts.fact3` "Rings span ~282,000 km"
- Problem: The same quantity is given two ways. 273,000 km is the main rings (A-ring edge) and 282,000 km reaches the F ring.
- Fix (EN): saturn.funFact/fact3 → "Its main rings span about 273,000 km (282,000 km counting the narrow F ring)". Alternatively, change the guide to "about 280,000 km including the F ring".
- Also update: SR: needs equivalent change in the matching sr.json keys.

### topics.supernova.intro  (severity: low)
- Current: "in our own Milky Way one occurs only every century or so."
- Problem: Estimates are about 1.6–2 core-collapse plus Ia supernovae per century (e.g. Rozwadowska et al. 2021: 1.63 ± 0.46 per century). We just haven't seen one since 1604 because of dust.
- Fix (EN): "in our own Milky Way one goes off only about twice a century — and dust has hidden every one since 1604."
- Also update: SR: needs equivalent change.

### topics.blackHoles.section5Body  (severity: low)
- Current: "(around 10⁶⁷ years for a stellar-mass black hole …)"
- Problem: About 2 × 10⁶⁷ yr is the figure for **one** solar mass. Lifetime scales as M³, so a real stellar-mass black hole (≥ 3–5 M☉) takes about 10⁶⁹ years or more. Also, today any stellar black hole absorbs more CMB than it radiates.
- Fix (EN): "(at least 10⁶⁷ years even for a black hole of just one solar mass, far longer for heavier ones)"
- Also update: SR: needs equivalent change.

### topics.stars.section5Body  (severity: low)
- Current: "The smallest known stars are barely larger than Jupiter."
- Problem: The smallest hydrogen-burning stars, such as EBLM J0555-57Ab (~0.08 R☉) and 2MASS J0523−1403, are about Jupiter's size or slightly smaller (0.8–0.9 R_J).
- Fix (EN): "The smallest known stars are about the size of Jupiter — some slightly smaller."
- Also update: SR: needs equivalent change.

### stops.quantum_entanglement.body  (severity: low)
- Current: "experiments since the 1970s — culminating in loophole-free tests in 2015 — say no such hidden instructions exist."
- Problem: Bell tests rule out *local* hidden variables only. Nonlocal hidden-variable theories (e.g. Bohmian mechanics) are untouched, and physicists will notice the missing word.
- Fix (EN): "…say no such hidden instructions can exist as long as nothing travels between the particles faster than light."
- Also update: SR: needs equivalent change.

### stops.jupiter.ifDistance  (severity: low)
- Current: "Put the Sun — a golf ball at this scale — … Earth would circle 5 metres away while Jupiter sat near the far end, 26 metres out."
- Problem: With a 4.27 cm golf-ball Sun, Earth is at 4.6 m and Jupiter at 23.9 m.
- Fix (EN): "…and Earth would circle about 4.6 metres away while Jupiter sat near the far end, about 24 metres out."
- Also update: SR: needs equivalent change.

### TON 618 / Phoenix-A distanceFromEarthMeters vs observable_universe  (severity: low)
- Current: ton_618 1.02e26 (10.8 Gly light-travel), phoenix_a 5.54e25 (5.86 Gly light-travel), observable_universe 4.4e26 (46.5 Gly comoving)
- Problem: The "Distance from Earth" scale mixes light-travel distance for quasars with comoving distance for the horizon. TON 618's comoving distance is about 18 Gly (z = 2.22).
- Fix (EN): either use comoving distances (TON 618 ≈ 1.72e26 m; Phoenix ≈ 6.9e25 m, z = 0.597) or label the scale as mixing the two. Note that the text in `ton_618.facts.fact3` already says "light-travel distance".
- Also update: none in SR if you only change the numbers.

---

## Checked and correct (some borderline)
- Voyager 1: crossed one light-day on 18 Nov 2026 (NASA/EarthSky, 10:16 UTC) and does not dip back below it; 173 AU, 25.9e12 m, 17 km/s, 17,600 yr/ly, the 105 m pitch analogy (0.61 m / 163 km), and 720 kg are all fine.
- Artemis II: 406,771 km on 6 Apr 2026 beat Apollo 13's 400,171 km (1970); "56 years" is correct.
- Scale-model arithmetic all checks out: Earth = 0.5 mm grain; Sun 5.4–5.5 cm at 5.9 m; Moon 1.5 cm; Milky Way 39 million km; observable universe 3.6 ly; Proxima 1,575 km; every planet entry in planetSizesCompared.section3.
- Event-horizon sizes check out: Sgr A* (24 million km, 17 Suns), TON 618 (1,580 AU, 2.5 km marble analogy), Phoenix-A (25 billion → 1.5e14 m, 108,000 Suns).
- These also check out: planet diameters, volume ratios, "seven planets fit between Earth and Moon" (380,010 km), Planck-length numbers (140 m pyramid analogy, 10²⁰, 10¹⁵ × LHC), Higgs ≈ Cs atom, antimatter 1.8e14 J ≈ 2.9 Hiroshimas, GPS +38 µs, ISS 0.005 s, parsec/AU/ly conversions, and Proxima 1.30 pc.
- UY Scuti 909 R☉, 5,900 ly, 70 light-minutes and a 740-day period are correct. It is now usually called a red supergiant, "sometimes" a hypergiant, so the "hypergiant" label in body, tagPages.star and image alt is borderline.
- Borderline: "hundreds of billions … perhaps 2 trillion galaxies" (observable_universe, stars.section5, howBig, largest.section6). The 2016 Conselice figure stands, but the 2021 New Horizons background-light result suggests it is high, so prefer "hundreds of billions, possibly up to 2 trillion".
- Borderline: human tagline/body "halfway … on a logarithmic scale". Human is 35 of 62 decades up; the true midpoint is about 0.1 mm (a tardigrade). The text is honest about this.
- Borderline: "every atom in your body heavier than helium was forged inside an ancient star … recycled supernova" (supernova.section4) and human.funFact. Some lithium is primordial or from cosmic-ray spallation, and much carbon and nitrogen comes from AGB stars rather than supernovae.
- Borderline: big_bang fact2 "CMB discovered in 1965" vs funFact "found … in 1964". Detected in 1964, published in 1965; consistent enough.
- Borderline: time_dilation body, "hundreds of nanoseconds" for Hafele–Keating. The eastward result was 59 ns and westward 273 ns.
- Borderline: time_dilation narrative "a few centimetres". JILA measured it across about 1 mm in 2022.
- Borderline: uranus fact4 "13 rings — discovered only in 1977". Nine were found in 1977 and the rest in 1986 and 2003–05.
- Borderline: proton fact4 "Rutherford 1917". The experiments ran 1917–19 and were published in 1919.
- Borderline: andromeda `sizeMeters` 2e21 m ≈ 211,000 ly. Wikipedia gives ~152,000 ly (D25); 220,000 ly is the generous halo-inclusive figure.
- Borderline: moons.section1 "almost certainly when a Mars-sized body collided". The giant-impact idea is the leading model, but the impactor's size is debated.
- Borderline: string_theory fact3 "the only physicist ever to receive [the Fields Medal]". This is the standard claim and is defensible.
- Borderline: DID badge ESTABLISHED_THEORY. The diagnosis is in DSM-5-TR, but the trauma vs sociocognitive debate continues; the text hedges appropriately.
- All 112 non-Britannica source URLs return 200.
