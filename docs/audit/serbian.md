# Quantumaire — Serbian (sr.json) language audit

Read-only review of all 1,477 flattened string keys in `locales/sr.json` against `locales/en.json` (same key paths). Excerpts use „…“ for the relevant fragment; "…" inside an excerpt means text omitted.

Severity tags: **[E]** error (grammar, wrong fact or meaning, wrong term), **[C]** consistency (the same thing written two ways across the site), **[S]** style or calque (the current text is clearly unnatural).

---

## 0. Structural checks

### Missing / extra keys
- **Missing in sr (38):** all of `sizeFaq.subjects.*` (quark, proton, atom, dna, virus, bacterium, cell, human, pyramid, halley, mercury, venus, earth, mars, moon, pluto, jupiter, saturn, uranus, neptune, sun, proxima_centauri, uy_scuti, neutron_star, supermassive_black_hole, ton_618, phoenix_a, solar_system, light_year, milky_way, andromeda, galaxy_cluster, laniakea_supercluster, observable_universe, planck_length, tardigrade, blue_whale, mount_everest).
  → **This is intentional.** `lib/sizeFaq.ts → subjectName()` uses the subject map only for `en` ("tServer falls back to English, so only English may use the subject map"). No action needed. Adding sr subjects would actually break things, because sr would then receive English article phrases.
- **Extra in sr:** none.

### Placeholders
- Every `{…}` placeholder is preserved, with one apparent exception: `sizeFaq.q1`, `q2`, `a2smaller`, `q3`, `q4`, `a4`, `q5`, `a5` and `title` use `{Name}` where EN uses `{name}`. **This is intentional and safe.** `buildSizeFaq()` passes both `name` and `Name` to every key, and for sr they are the same nominative topic name. No action needed.

### Script / dialect
- No Cyrillic characters found.
- No ijekavian forms found. All forms are ekavian.

### Runtime case problem (code + copy)
- `common.comparePage.timesAsBig / timesSmaller / timesAsFar / timesCloser / timesHotter / timesColder` receive `{a}`/`{b}` = **nominative stop names** (`ComparePage.tsx` passes `aName`/`bName`). After „od“ this renders ungrammatical Serbian, e.g. „Sunce je 109× veće od Zemlja“. The adjective also always agrees as neuter („Zemlja je … veće“). See the fixes under common.* below. The pattern to use is „nego“ + nominative, which `common.distanceCompare.*` already uses correctly.

---

## 1. Global issues (apply across many keys)

1. **[C] Typographic quotes.** Serbian should use „…“ (U+201E … U+201C) everywhere.
   - ASCII `"…"` (15 keys): stops.quark.funFact, stops.atom.facts.fact4, stops.virus.facts.fact4, stops.cell.body, stops.laniakea_supercluster.funFact, stops.uranus.body, topics.stars.section1Body, topics.stars.section3Body, topics.planets.section1Body, topics.planets.section2Body, topics.planets.section4Body, topics.blackHoles.section4Body, topics.bigBang.section4Body, topics.supernova.section4Body, topics.distances.section4Body.
   - Single `'…'` used as quotation marks (11 keys): categories.MICRO_WORLD.intro, stops.dna.funFact, stops.dna.facts.fact4, stops.mpd.funFact, stops.dark_energy.funFact, stops.ton_618.facts.fact4, stops.quantum_entanglement.body, stops.quantum_entanglement.funFact, stops.tardigrade.body, topics.planets.section3Body, glossary.brown_dwarf.definition.
   - Wrong closing mark `„…”` (U+201D instead of U+201C) (17 keys): stops.gravitational_waves.body, stops.wormhole.body, stops.wormhole.funFact, stops.wormhole.facts.fact2, stops.wormhole.facts.fact3, stops.big_bang.narrative, stops.big_bang.funFact, stops.multiverse.body, stops.multiverse.facts.fact1, stops.multiverse.facts.fact3, stops.string_theory.facts.fact2, topics.howBigIsTheUniverse.section5Body, topics.smallestThingsInTheUniverse.section2Body, …section4Body, …section5Body, topics.largestThingsInTheUniverse.intro, glossary.supersymmetry.definition.
   - Correct already: home.faq.a7, sizeFaq.a5.
   - This can be fixed mechanically: `"X"` / `'X'` / `„X”` → `„X“`, but not inside `common.converter.faq`, whose `'q'`/`'a'` are Python-repr keys, not prose.
2. **[C] Ti/vi (informal/formal "you") is mixed.** Prose mostly uses vi (formal: stops.*, about.*, notFound, progress, error). UI taglines and some content use ti (informal): common.footer („da uvek znaš“), bookmarksTagline/Empty, nav.favoritesDesc/progressDesc, scaleTool.tagline/yourValue, comparison.subtitle, comparison.ifDistance, analogy.intro, tagPages.planet/biology/black-hole intros, stops.mars.narrative, stops.pluto.ifDistance, stops.venus.facts.fact3, stops.saturn.narrative. Recommendation: keep short ti-imperatives on buttons (Istraži, Otvori, Uporedi), and use **vi** in every sentence of prose. Strings that switch between ti and vi inside one sentence are listed individually below.
3. **[C] Masculine-only forms** („si sačuvao“, „si video“) exclude half the readers. Rephrase impersonally or use vi plural (see common.*).
4. **[C] Decimals with "svetlosna godina".** The site uses „4,24 svetlosne godine“ (genitive singular after a decimal, which is correct). These keys use the plural instead and should match: common.converter.units.pc.hint („3,26 svetlosnih godina“), common.converter.faq (Parsek … „3,26 svetlosnih godina“), glossary.parsec.definition, stops.voyager1.funFact („1,6 svetlosnih godina“), topics.howBigIsTheUniverse.section4Body („3,6 svetlosnih godina“). Same rule for km: stops.phoenix_a.narrative „1,6 kilometara“ → „1,6 kilometra“, matching ton_618 „2,5 kilometra“.
5. **[E] Genitive plural of „mesec“ (moon).** After numbers of 5 or more, and after „stotine“ or „više od N“, the form is **meseci**, not „meseca“: stops.solar_system.body („više od 400 meseca“), stops.solar_system.facts.fact2, stops.jupiter.body („više od 100 poznatih meseca“), stops.jupiter.facts.fact4, stops.saturn.body („285 poznatih meseca“), stops.saturn.facts.fact4, topics.moons.intro („stotine potvrđenih meseca“), topics.planetSizesCompared.section2Body („49 Meseca“ → „49 Meseci“).
6. **[E] Typo „mereljiv“ → „merljiv“:** categories.HUMAN_MIND.intro („mereljivi objekti“), comparison.abstract („mereljivu veličinu“), topics.time.intro („mereljivi“).
7. **[E] „X oko N“ is ambiguous after „kruži“.** „kruži oko 5,2 AJ od Sunca“ reads as "orbits around 5.2 AU". Use „kruži na oko …“ / „na udaljenosti od oko …“: common.converter.faq (Jupiter), stops.jupiter.ifDistance („Jupiter kruži oko 5,2 puta dalje“), stops.solar_system.facts.fact1 („Pluton kruži oko 5,9 milijardi km“).
8. **[C] Personal names: transcribe (Pravopis) or not, but pick one.** Most of the site transcribes (Majkl Tarner, Rajnhard Gencel, Piter Higs, Edvard Viten, Karl Sejgan). These are left in English spelling: Ernest Rutherford (stops.proton.facts.fact4, smallest…section5Body → Ernest Raderford), Robert Hooke (stops.cell.facts.fact4 → Robert Huk), Gell-Mann i Zweig (stops.quark.facts.fact4 → Gel-Man i Cvajg), William Herschel (stops.uranus.ifDistance, fact5 → Vilijam Heršel), Stephen Hawking / „Hawking-ovo“ (topics.blackHoles.section5Heading/Body → Stiven Hoking, „Hokingovo zračenje“), Edwin Hubble (topics.bigBang.section1Body → Edvin Habl), Tycho Brahe (topics.supernova.section3Body → Tiho Brahe), Gerd Binnig / Heinrich Rohrer (→ Gerd Binig, Hajnrih Rorer), Brent Tully (→ Brent Tali). Also „Hubble slika“ (topics.nebulae.section2Body) → „Hablov snimak“. Everett has two different forms: „Hju Everet“ (multiverse.facts.fact2) vs „Hjua Everta“ (glossary.many_worlds.definition). The genitive must be „Evereta“.
9. **[S] Comma before „ali“** is missing in: stops.mars.facts.fact4 („95% CO₂ ali manje“), stops.saturn.facts.fact3 („~282.000 km ali su“), topics.planets.section3Body („deuterijum ali ne i“).
10. **[S] English noun-adjunct order with names:** „Virgo jato“, „Phoenix jato“, „Koma jato“, „Laniakea superjato“, „Apolo astronauti“, „Voyager sondi“, „Orion korelacija“, „Gaia udaljenosti“. Natural Serbian puts the head noun first („jato Virgo“, „superjato Laniakea“, „astronauti misija Apolo“, „sonde Voyager“, „Orionova korelacija“). This is low priority for the topic names (it may be an intentional branding choice), but the cases in running text should be fixed (listed below).

---

## 2. common.*

- `common.moreSoon` — Current: „Još za istražiti“ → Proposed: „Istražite još“ — [S] „za + infinitive“ is a calque.
- `common.distanceLegend` — Current: „…od Zemlje naviše…“ → Proposed: „…od Zemlje ka sve udaljenijim objektima…“ (or „…od Zemlje nadalje…“) — [E] „naviše“ means "upward". EN says "outward".
- `common.footer` — Current: „…da uvek znaš koliko je nauka sigurna.“ → Proposed: „…da uvek znate koliko je nauka sigurna.“ — [C] ti/vi.
- `common.openExternal` — Current: „Otvori u novom tabu“ → Proposed: „Otvori u novoj kartici“ — [S] Anglicism. „kartica“ is the standard UI term.
- `common.glossaryPage.intro` — Current: „Svaka stručna reč … živi ovde … ovo je strana za sletanje. … radije biste pročitali tri kraće nego prelistali jednu dugu.“ → Proposed: „Svaka stručna reč koju koristimo na sajtu nalazi se ovde, poređana po abecedi i dostupna za pretragu. … ako ste naišli na nešto nepoznato, ovde ste na pravom mestu. Definicije su namerno kratke; radije bismo da pročitate tri kratke nego da preletite jednu dugu.“ — [E] Meaning reversed: EN "we'd rather you read", SR says "you'd rather read". „strana za sletanje“ and „živi ovde“ are calques.
- `common.scaleTool.intro` — Current: „…smanji Zemlju … pa sve ostalo smanji … koju ukucate … vam govori…“ → Proposed: „…smanjite Zemlju … pa sve ostalo smanjite istim faktorom…“ — [C] Switches from ti to vi inside one paragraph.
- `common.scaleTool.yourValue` — Current: „Tvoja vrednost“ → Proposed: „Vaša vrednost“ (or simply „Uneta vrednost“) — [C] ti/vi.
- `common.bookmarksTagline` — Current: „Teme koje si sačuvao za kasnije.“ → Proposed: „Teme koje ste sačuvali za kasnije.“ — [C] Masculine-only and ti.
- `common.bookmarksEmpty` — Current: „Još nisi sačuvao nijednu temu. Otvori neku i dodirni srce…“ → Proposed: „Još niste sačuvali nijednu temu. Otvorite neku i dodirnite srce da je dodate ovde.“ — [C] Same.
- `common.nav.favoritesDesc` — Current: „Teme koje si sačuvao srcem“ → Proposed: „Teme označene srcem“ — [C]/[S] Masculine-only, and „sačuvati srcem“ is odd.
- `common.nav.progressDesc` — Current: „Koliki deo sajta si video“ → Proposed: „Koliki deo sajta ste pregledali“ — [C] Masculine-only.
- `common.progress.intro` — Current: „…šta vam je još pred sobom … krenete iznova sa čistim brojem.“ → Proposed: „…šta vas još čeka … i (ako poželite) krenete ispočetka.“ — [E] „vam je … pred sobom“ is ungrammatical (it would need „pred vama“). „sa čistim brojem“ is a calque of "clean slate".
- `common.progress.remaining` — Current: „Preostalo za posetiti“ → Proposed: „Još neposećeno“ (or „Preostale teme“) — [S] „za + infinitive“ calque.
- `common.progress.openRandom` — Current: „Otvori slučajnu neposećenu temu“ → Proposed: „Otvori nasumičnu neposećenu temu“ — [C] The rest of the site says „nasumična tema“ (common.random, shortcuts.randomStop, nav.randomDesc).
- `common.visited.confirmReset` — Current: „Zaboraviti koje teme ste posetili? Ovo utiče samo na ovaj uređaj.“ → Proposed: „Obrisati podatke o posećenim temama? Ovo važi samo za ovaj uređaj.“ — [S] An infinitive question is unnatural in a confirm dialog.
- `common.shortcuts.closeOverlay` — Current: „Zatvori prekrivač“ → Proposed: „Zatvori otvoreni prozor“ (or „Zatvori panel“) — [E] „prekrivač“ means a bedspread or blanket.
- `common.comparePage.tagline` — Current: „Izaberi bilo koje dve i vidi…“ → Proposed: „Izaberi bilo koja dva objekta i vidi odnos između njih.“ — [E] Gender: it refers to „objekta“, so the numeral must be „dva“, not „dve“.
- `common.comparePage.intro` — Current: „…uključujući brojeve koji razliku čine stvarnom … Deljenjem URL-a bilo kog para, ista poređenja vidi i sagovornik.“ → Proposed: „…uključujući brojeve zbog kojih razlika postaje opipljiva … Kada podelite URL bilo kog para, druga osoba vidi isti prikaz.“ — [E] „sagovornik“ means a conversation partner. The sentence is also built as a calque.
- `common.comparePage.timesAsBig` — Current: „{b} je {factor}× veće od {a}“ → Proposed: „{b}: {factor}× veće nego {a}“ — [E] `{a}` is a nominative name, so „od {a}“ is ungrammatical, and „je … veće“ is neuter regardless of the subject's gender. „nego“ + nominative works. The colon removes the gender clash.
- `common.comparePage.timesSmaller` — Current: „{b} je {factor}× manje od {a}“ → Proposed: „{b}: {factor}× manje nego {a}“ — [E] Same.
- `common.comparePage.timesAsFar` — Current: „{b} je {factor}× dalje od Zemlje od {a}“ → Proposed: „{b} je {factor}× dalje od Zemlje nego {a}“ — [E] Case error and a double „od“. „dalje“ is an adverb, so there is no gender issue.
- `common.comparePage.timesCloser` — Current: „{b} je {factor}× bliže Zemlji od {a}“ → Proposed: „{b} je {factor}× bliže Zemlji nego {a}“ — [E] Same.
- `common.comparePage.timesHotter` — Current: „{b} je {factor}× toplije od {a}“ → Proposed: „{b}: {factor}× toplije nego {a}“ — [E] Case and gender.
- `common.comparePage.timesColder` — Current: „{b} je {factor}× hladnije od {a}“ → Proposed: „{b}: {factor}× hladnije nego {a}“ — [E] Case and gender.
- `common.lightTime.hint` — Current: „Koliko je svetlosti potrebno da pređe ovu udaljenost“ → Proposed: „Koliko je vremena potrebno svetlosti da pređe ovu udaljenost“ — [E] As written it means "how much light is needed".
- `common.lightTime.sizeHint` — Current: „Koliko je svetlosti potrebno da ga pređe“ → Proposed: „Koliko je vremena potrebno svetlosti da ga pređe“ — [E] Same.
- `common.converter.tagline` — Current: „…i vidi koliko svetlosti treba da je pređe…“ → Proposed: „…i vidi koliko je vremena potrebno svetlosti da je pređe…“ — [E] Same ambiguity.
- `common.converter.amount` — Current: „Iznos“ → Proposed: „Vrednost“ — [S] „Iznos“ reads as an amount of money.
- `common.converter.faqHeading` — Current: „Jedinice svemirskih udaljenosti, objašnjene“ → Proposed: „Jedinice svemirskih udaljenosti — objašnjenje“ — [S] Calque of the English trailing participle.
- `common.converter.faq` (q1 answer) — Current: „Jupiter, na primer, kruži oko 5,2 AJ od Sunca“ → Proposed: „Jupiter, na primer, kruži na oko 5,2 AJ od Sunca“ — [E] Ambiguous „oko“ (see Global 7).
- `common.converter.faq` (q3 answer) — Current: „Parsek iznosi oko 3,26 svetlosnih godina“ → Proposed: „…oko 3,26 svetlosne godine“ — [C] Decimal agreement (Global 4).
- `common.converter.units.pc.hint` — Current: „≈ 3,26 svetlosnih godina“ → Proposed: „≈ 3,26 svetlosne godine“ — [C] Same.
- `common.unitImperial` — Current: „Imperijalne (mi)“ → Proposed: „Anglosaksonske (mi)“ — [S] „anglosaksonske jedinice“ is the established Serbian term.
- `common.comboSearch` — Current: „Kucaj za pretragu…“ → Proposed: „Počnite da kucate…“ (or „Pretraži…“) — [S] Calque of "Type to search".

## 3. home.*

- `home.faq.a1` — Current: „Najmanje što smo izmerili — kvarkovi i elektroni — ponašaju se kao tačke“ → Proposed: „Najmanje čestice koje smo izmerili — kvarkovi i elektroni — ponašaju se kao tačke“ — [E] Number agreement: the singular „Najmanje“ takes a plural verb.
- `home.faq.a3` — Current: „sa masama od po desetina milijardi solarnih masa“ → Proposed: „svaka s masom od nekoliko desetina milijardi Sunčevih masa“ — [E] „od po desetina“ is ungrammatical. Terminology: Sunčeva masa (see table).
- `home.faq.a5` — Current: „Mapiramo je kroz gravitaciono sočivovanje“ → Proposed: „Mapiramo je pomoću gravitacionog sočiva“ — [C] „sočivovanje“ is not an established term (see table).

## 4. badges.*

- `badges.ESTABLISHED_THEORY.tooltip` — Current: „Dobro proverena teorija koja se uklapa u dokaze.“ → Proposed: „Dobro proverena teorija koja je u skladu sa dokazima.“ — [S] Calque of "fits the evidence".

## 5. categories.*

- `categories.COSMOS.description` — Current: „neutronski gusti leševi“ → Proposed: „zvezdani leševi gušći od atomskog jezgra“ (or „neutronske zvezde i drugi zvezdani leševi“) — [S] Unnatural compound.
- `categories.HUMAN_MIND.description` — Current: „Dokumentovane neobičnosti kako jedan mozak…“ → Proposed: „Dokumentovane neobičnosti o tome kako jedan mozak…“ — [E] „o tome“ is missing.
- `categories.ANCIENT_HISTORY.description` — Current: „…čija gradnja se i dalje opire…“ → Proposed: „…čija se gradnja i dalje opire…“ — [E] Clitic placement.
- `categories.MICRO_WORLD.intro` — Current: „'male stvari razlikuju za poneki deo'“ → Proposed: „„male stvari se razlikuju tek malo““ — [C] Quotes; the paraphrase is also stiff.
- `categories.HUMAN_MIND.intro` — Current: „mereljivi objekti“ → Proposed: „merljivi objekti“ — [E] Typo.
- `categories.ANCIENT_HISTORY.intro` — Current: „čija inženjerija i dalje poziva…“ → Proposed: „čije graditeljsko umeće i dalje traži pažljivo objašnjenje…“ — [E] „inženjerija“ is non-standard (stops.pyramid.body uses „inženjerstvo“).
- `categories.EARTH.intro` — Current: „od tardigrada za koga vam treba mikroskop … stvari koje već osećate“ → Proposed: „od tardigrada koji se vidi tek pod mikroskopom … stvari za koje već imate osećaj“ — [S] The second phrase drifts in meaning: EN "have a feel for" ≠ "feel".
- `categories.PHYSICS.intro` — Current: „prostor-vreme može da talasa“ → Proposed: „prostor-vreme može da se talasa“ — [E] The verb is reflexive.

## 6. comparison.* / references.*

- `comparison.abstract` — Current: „nema mereljivu veličinu“ → Proposed: „nema merljivu veličinu“ — [E] Typo.
- `comparison.ifDistance` — Current: „Ako uskladiš razmeru udaljenosti“ → Proposed: „Ako se i udaljenost smanji u istoj razmeri“ — [E] „uskladiti“ means "to harmonise". The meaning is lost. Also ti.
- `comparison.subtitle` — Current: „a ispod ih pregledaj po kategorijama“ → Proposed: „a ispod ih pregledajte po kategorijama“ — [C] ti/vi.

## 7. stops.<id>.*

### quark
- `stops.quark.funFact` — Current: „Kvarkovi dolaze u šest aroma — gornji, donji, šarmantni, čudni, vrh, dno — i tri "boje"…“ → Proposed: „Postoji šest ukusa kvarkova — gornji, donji, šarmantni, čudni, top i bottom — i tri „boje“…“ — [E] „vrh, dno“ mixes literal nouns with adjectives, and fact1 already uses „top kvark“. „dolaze u“ is a calque. „ukus“ is the usual Serbian textbook term. Quotes.
- `stops.quark.facts.fact4` — Current: „Gell-Mann i Zweig“ → Proposed: „Gel-Man i Cvajg“ — [C] Transcription (Global 8).
- `stops.quark.image.alt` — Current: „suspendovan unutar gluonskog polja“ → Proposed: „koji lebdi u gluonskom polju“ — [S] Calque.

### proton
- `stops.proton.facts.fact3` — Current: „manje od trilionitog dela milimetra“ → Proposed: „manje od bilionitog dela milimetra“ — [E] **Factual error.** EN short-scale "trillionth" = 10⁻¹², which in Serbian long scale is „bilioniti“. „trilioniti“ = 10⁻¹⁸. (0.84 fm = 0.84 × 10⁻¹² mm.)
- `stops.proton.facts.fact4` — Current: „Ernest Rutherford“ → Proposed: „Ernest Raderford“ — [C] Transcription.

### atom
- `stops.atom.facts.fact4` — Current: „"nedeljiv"“ → Proposed: „„nedeljiv““ — [C] Quotes.

### dna
- `stops.dna.tagline` — Current: „…i gotovo sve ostalo živo.“ → Proposed: „…i gotovo sva druga živa bića.“ — [S] Unnatural.
- `stops.dna.funFact`, `stops.dna.facts.fact4` — 'razlike među ljudima', 'Mitohondrijalna Eva' → „…“ — [C] Quotes.
- `stops.dna.facts.fact6` — Current: „Fotografija X-zraka … (Photo 51)“ → Proposed: „Rendgenski snimak … (Fotografija 51)“ — [C] The site elsewhere says „rendgenski“ (neutron_star.funFact).

### mpd
- `stops.mpd.funFact` — 'Alteri' → „Alteri“ — [C] Quotes.

### pyramid
- `stops.pyramid.body` — Current: „je zvanično datovana na oko 2560. p.n.e.“ → Proposed: „se prema uvreženom datovanju smešta oko 2560. p.n.e.“ — [E] Meaning drift: EN "mainstream-dated" ≠ „zvanično“ (officially).

### neutron_star
- `stops.neutron_star.body` — Current: „Kada se masivna zvezda urušava“ → Proposed: „Kada se masivna zvezda uruši“ — [S] Aspect: a single completed event.
- `stops.neutron_star.funFact` — Current: „…više od 100 puta toplije od površine Sunca.“ → Proposed: „…više od 100 puta višu nego na površini Sunca.“ (it refers to „temperaturu“) — [E] Agreement and logic: a temperature is „viša“, not „toplije“.

### sun
- `stops.sun.massNarrative` — Current: „…zajedno su prah u poređenju.“ → Proposed: „…zajedno su prašina u poređenju s njim.“ — [S] Dangling „u poređenju“.
- `stops.sun.image.alt` — Current: „Sunce u ultraljubičastom“ → Proposed: „Sunce u ultraljubičastoj svetlosti“ — [S] Truncated calque.
- `stops.sun.facts.fact4` — Current: „Zvezda je glavnog niza već oko 4,6 milijardi godina.“ → Proposed: „Već oko 4,6 milijardi godina je zvezda glavnog niza.“ — [S] Word order.

### uy_scuti
- `stops.uy_scuti.body` — Current: „UY Scuti je crveni hipergigant … njegove konvektivne ćelije … Spoljni slojevi su mu…“ → Proposed: keep the masculine only inside the first clause, then switch to feminine: „…Njeni spoljni slojevi ređi su od…“ — [C] Gender switches. The tagline, massNarrative, funFact and facts treat UY Scuti as feminine (zvezda).
- `stops.uy_scuti.facts.fact1` — Current: „na osnovu Gaia udaljenosti“ → Proposed: „na osnovu udaljenosti izmerene satelitom Gaia“ — [S] Noun-adjunct calque.

### milky_way
- `stops.milky_way.tagline` — Current: „Spirala sa prečkom od stotina milijardi zvezda“ → Proposed: „Spiralna galaksija s prečkom i stotinama milijardi zvezda — uključujući našu.“ — [E] Ambiguous: it reads as "a bar made of hundreds of billions of stars".
- `stops.milky_way.body` — Current: „Mlečni put je spiralna galaksija … Naše Sunce je jedna od stotina milijardi zvezda u njoj, jaše tihim krakom zvanim Orion.“ → Proposed: „Mlečni put je spiralna galaksija s prečkom … Naše Sunce je jedna od stotina milijardi zvezda u njoj i nalazi se u mirnom kraku Orion.“ — [E] Drops "barred" (meaning drift). The clause after the comma is ungrammatical (no relative or conjunction), and „jaše“ is a calque of "riding".
- `stops.milky_way.funFact` — Current: „običnom svetlošću“ → Proposed: „u vidljivoj svetlosti“ — [S] EN says "visible light", a fixed term.

### dark_matter
- `stops.dark_matter.body`, `stops.dark_matter.facts.fact3` — Current: „gravitaciono sočivovanje“ / „sočivovanja“ → Proposed: „pomoću gravitacionog sočiva“ / „efekta gravitacionog sočiva“ — [C] Terminology.

### dark_energy
- `stops.dark_energy.tagline` — Current: „Šta god to bilo što razvlači svemir — sve brže i brže.“ → Proposed: „Nešto — ne znamo šta — razvlači svemir sve brže i brže.“ — [S] Ungrammatical fragment.
- `stops.dark_energy.funFact` — Current: „Termin 'tamna energija' … taj rezervni naziv“ → Proposed: „Termin „tamna energija“ … taj privremeni naziv“ — [S]/[C] „rezervni“ means "spare". Quotes.
- `stops.dark_energy.facts.fact2` — Current: „preko merenja supernova i kosmičkog širenja“ → Proposed: „merenjem kosmičkog širenja pomoću supernova“ — [E] Meaning drift: the supernovae were the tool for measuring the expansion. SR makes them two separate things.
- `stops.dark_energy.facts.fact4` — Current: „Pokreće ubrzavajuće širenje svemira.“ → Proposed: „Pokreće ubrzano širenje svemira.“ — [S] „ubrzavajuće“ is a calque. Same in `image.alt` („ubrzavajućom silom“ → „silom koja ih sve brže razdvaja“).

### observable_universe
- `stops.observable_universe.body` — Current: „Vidljivi svemir je sve dovoljno blizu da je svetlost…“ → Proposed: „Vidljivi svemir je sve što je dovoljno blizu da je svetlost…“ — [E] „što je“ is missing.
- `stops.observable_universe.facts.fact4` — Current: „Sam prostor može — i zaista to čini — širiti se brže od svetlosti.“ → Proposed: „Sam prostor može da se širi — i zaista se širi — brže od svetlosti.“ — [S] Infinitive construction.

### virus
- `stops.virus.image.alt` — Current: „Ikosaedarska kapsula virusa“ → Proposed: „Ikosaedarski kapsid virusa“ — [E] The term is „kapsid“; „kapsula“ is a different structure. See also glossary.capsid.
- `stops.virus.facts.fact4` — Current: „Prvi put identifikovan kao "filtrirajući agens" od strane Ivanovskog 1892. godine.“ → Proposed: „Ivanovski ga je 1892. prvi opisao kao „agens koji prolazi kroz filter“.“ — [E] "filterable" ≠ „filtrirajući“ (filtering). „od strane“ is a passive calque. Quotes.

### supermassive_black_hole
- `stops.supermassive_black_hole.body` — Current: „…Gaia BH1, mnogo je manja zvezdane mase i udaljena…“ → Proposed: „…Gaia BH1, mnogo je manja — zvezdane mase — i udaljena je svega 1.560 svetlosnih godina.“ — [E] Garbled: it reads as "smaller than the stellar mass". The same garble is in topics.blackHoles.section3Body.
- `stops.supermassive_black_hole.facts.fact4` — Current: „ne može pobeći iznutra horizonta događaja“ → Proposed: „ne može pobeći iz unutrašnjosti horizonta događaja“ — [E] „iznutra“ is an adverb and cannot govern a genitive.

### bacterium
- `stops.bacterium.body` — Current: „Bakterije su radne ćelije planete.“ → Proposed: „Bakterije su neumorni radnici planete.“ — [S] "workhorse" was translated too literally.
- `stops.bacterium.narrative` — Current: „dok ne sedi u vašoj ruci kao kliker“ → Proposed: „dok vam ne stane na dlan kao kliker“ — [S] Calque.
- `stops.bacterium.funFact` — Current: „čine svega nekoliko stotina grama“ → Proposed: „čine svega dvestotinak grama“ — [E] Meaning drift: EN "a couple of hundred" ≈ 200 g; „nekoliko stotina“ = several hundred.

### cell
- `stops.cell.body` — Current: „membranom okružen "džak" molekula“ → Proposed: „membranom obavijena vreća molekula“ — [C] EN has no quotes here. If quotes are kept, use „…“.

### galaxy_cluster
- `stops.galaxy_cluster.image.alt` — Current: „oko sjajne centralne džinovske eliptične.“ → Proposed: „oko sjajne centralne džinovske eliptične galaksije.“ — [E] The noun is missing.
- `stops.galaxy_cluster.funFact` — Current: „sva su povučena ka nevidljivoj koncentraciji mase“ → Proposed: „sva privlači nevidljiva koncentracija mase“ — [S] EN describes an ongoing process ("are being pulled"). SR's past participle describes a finished state.

### andromeda
- `stops.andromeda.ifDistance` — Current: „najbrže čime nešto što smo napravili napušta Sunčev sistem“ → Proposed: „najvećom brzinom kojom neki naš objekat napušta Sunčev sistem“ — [E] Garbled syntax.
- `stops.andromeda.funFact` — Current: „ali ovde naša gravitaciona veza sa Andromedom je jača“ → Proposed: „ali ovde je jača naša gravitaciona veza sa Andromedom“ — [S] Word order.

### human
- `stops.human.facts.fact3` — Current: „više nego broj zvezda u svemiru“ → Proposed: „više nego što ima zvezda u svemiru“ — [S] Unnatural.

### light_year
- `stops.light_year.body` — Current: „Na oko 300.000 km u sekundi … Proxima Centauri … brzinom Voyager sondi“ → Proposed: „Brzinom od oko 300.000 km/s … Proksima Kentaura … brzinom sondi Voyager“ — [C] The name differs from the site's „Proksima Kentaur/Kentaura“, and the word order is a calque.
- `stops.light_year.facts.fact3` — Current: „Proxima Centauri“ → Proposed: „Proksima Kentaura“ (see table) — [C].

### ton_618
- `stops.ton_618.funFact` — Current: „hiperluminantan kvazar — njegov akrecioni disk sija sa svetlošću 140 biliona Sunaca“ → Proposed: „izuzetno sjajan (hiperluminozni) kvazar — njegov akrecioni disk sija sjajem 140 biliona Sunaca“ — [S] „sija sa svetlošću“ is a calque.
- `stops.ton_618.facts.fact4` — 'zvezda' → „zvezda“ — [C] Quotes.

### phoenix_a
- `stops.phoenix_a.narrative` — Current: „oko 1,6 kilometara“ → Proposed: „oko 1,6 kilometra“ — [C] Decimal agreement.
- `stops.phoenix_a.facts.fact3`, `stops.phoenix_a.image.alt` — Current: „međugalaktičkih oblaka gasa“ / „međugalaktičkim gasom“ → Proposed: „gasa unutar jata“ — [E] Meaning drift: intracluster gas lies inside the cluster. „Međugalaktički“ (intergalactic) is a different, broader term.

### voyager1
- `stops.voyager1.facts.fact3` — Current: „Radio signali putuju oko 24 sata u jednom pravcu — jedan svetlosni dan od Zemlje dostigao je 18. novembra 2026.“ → Proposed: „Radio-signali putuju oko 24 sata u jednom pravcu — udaljenost od jednog svetlosnog dana sonda je dostigla 18. novembra 2026.“ — [E] Subject clash: as written, the signals "reached" the distance.
- `stops.voyager1.funFact` — Current: „na 1,6 svetlosnih godina“ → Proposed: „na 1,6 svetlosne godine“ — [C] Decimal agreement.

### laniakea_supercluster
- `stops.laniakea_supercluster.body` — Current: „Prostire se oko 500 miliona svetlosnih godina“ → Proposed: „Prostire se na oko 500 miliona svetlosnih godina“ — [S] „na“ is missing (the other strings use „prostire se na“).
- `stops.laniakea_supercluster.funFact` — "Laniakea", "nemerljivo nebo" → „…“ — [C] Quotes.

### solar_system
- `stops.solar_system.body` / `facts.fact2` — „više od 400 meseca“ → „više od 400 meseci“ — [E] (Global 5). „Oortov oblak“ → „Ortov oblak“ — [C].
- `stops.solar_system.funFact` — Current: „iza Kojperovog pojasa nalazi se Oortov oblak … tek za desetine hiljada“ → Proposed: „iza Kajperovog pojasa nalazi se Ortov oblak … tek za desetine hiljada godina“ — [C] Kajper is used in 4 other keys and the glossary term. „godina“ is missing.
- `stops.solar_system.facts.fact1` — „Pluton kruži oko 5,9 milijardi km“ → „Pluton kruži na oko 5,9 milijardi km“ — [E] (Global 7).
- `stops.solar_system.facts.fact4` — „Oortov“ → „Ortov“ — [C].

### moon
- `stops.moon.ifDistance`, `stops.moon.funFact` — Current: „Apolo astronauti“ → Proposed: „astronauti misija Apolo“ — [S] Noun-adjunct calque.
- `stops.moon.body` / `facts.fact3` — Current: „Plimski je vezan“ / „Plimski zaključan“ → Proposed: „Plimski je zaključan“ / „Plimski zaključan“ — [C] One term (see table).

### jupiter
- `stops.jupiter.body` — Current: „gasoviti gigant … Velikom crvenom mrljom … više od 100 poznatih meseca“ → Proposed: „gasoviti džin … Velikom crvenom pegom … više od 100 poznatih meseci“ — [C]/[E] topics.planetSizesCompared.section4Body says „Velika crvena pega“ (the standard term). Also the genitive plural (Global 5).
- `stops.jupiter.image.alt` — „Velikom crvenom mrljom“ → „Velikom crvenom pegom“ — [C].
- `stops.jupiter.ifDistance` — Current: „Jupiter kruži oko 5,2 puta dalje od Sunca nego Zemlja.“ → Proposed: „Jupiter je od Sunca oko 5,2 puta dalji nego Zemlja.“ — [E] Ambiguous „kruži oko“.
- `stops.jupiter.facts.fact4` — „Više od 100 poznatih meseca“ → „meseci“ — [E].

### proxima_centauri
- `stops.proxima_centauri.name` and all mentions — „Proksima Kentaur“ vs „Proksime Kentaura“ (narrative, ifDistance) vs „Proxima Centauri“ (light_year, topics) → standardise on **„Proksima Kentaura“** (cf. „Alfa Kentaura“) — [C] Three different spellings are in use (see table).
- `stops.proxima_centauri.body` — Current: „Bar dve planete potvrđeno kruže oko nje“ → Proposed: „Potvrđeno je da oko nje kruže bar dve planete“ — [S] Unnatural adverb placement.
- `stops.proxima_centauri.massNarrative` — Current: „dugo nakon što su sve zvezde slične Suncu izgorele“ → Proposed: „dugo pošto sve zvezde slične Suncu budu izgorele“ — [E] Tense: the event is in the future.
- `stops.proxima_centauri.facts.fact4` / body — „habitabilnoj zoni“ vs topics.planets „nastanjivoj zoni“ — [C] Pick one (see table).

### mars
- `stops.mars.narrative` — Current: „Stojiš na Marsu vedrog dana — … kada je ugledaš, vidiš…“ → Proposed: „Kada biste stajali na Marsu vedrog dana, nebo bi bilo bledoružičasto, zalazak sunca plav… Zemlja bi, kada je ugledate, izgledala kao sjajna plava zvezda.“ — [C]/[S] It is the only stop narrative in the indicative ti form.
- `stops.mars.ifDistance` — Current: „Radio-signal“ (here) vs „radio signal“ (elsewhere) → Proposed: „radio-signal“ everywhere — [C] Pravopis prefers the hyphen.
- `stops.mars.facts.fact4` — Current: „Atmosfera je 95% CO₂ ali manje od 1% Zemljinog pritiska vazduha.“ → Proposed: „Atmosferu čini 95% CO₂, ali je njen pritisak manji od 1% Zemljinog.“ — [E] The subject does not match the comparison, and the comma is missing.
- `stops.mars.facts.fact5` — Current: „Dom Olimpa (…) i Valles Marineris-a (…) — oba rekorderi“ → Proposed: „Na njemu su Olimp (22 km visine) i Valles Marineris (4.000 km dužine) — oba su rekorderi Sunčevog sistema.“ — [S] Calque „Dom …“, „Marineris-a“ should not be hyphenated, and the verb is missing.

### pluto
- `stops.pluto.tagline` — „Kojperovom pojasu“ → „Kajperovom pojasu“ — [C].
- `stops.pluto.body` — Current: „slične objekte tamo napolju“ → Proposed: „slične objekte u tom delu Sunčevog sistema“ — [S] Calque of "out there".
- `stops.pluto.ifDistance` — Current: „Stoj na njegovoj površini u podne i Sunce izgleda … da pri njoj čitaš … možeš pokriti glavom čiode pruženom u ruci.“ → Proposed: „Kada biste u podne stajali na njegovoj površini, Sunce bi izgledalo kao naročito sjajna zvezda — dovoljno sjajna da se pri njoj čita, ali toliko mala da je možete zakloniti glavom čiode u ispruženoj ruci.“ — [C]/[E] ti form. „glavom čiode pruženom u ruci“ makes the pinhead the thing that is "stretched out".
- `stops.pluto.funFact` — Current: „plimno su zaključani jedan ka drugom“ → Proposed: „međusobno su plimski zaključani“ — [C]/[S].
- `stops.pluto.facts.fact3` — Current: „dovoljno hladno da azot smrzne“ → Proposed: „dovoljno hladno da se azot zamrzne“ — [S].

### halley
- `stops.halley.image.alt` — Current: „mlazovima gasa koji erumpiraju ka Suncu“ → Proposed: „mlazovima gasa koji izbijaju ka Suncu“ — [E] „erumpirati“ is not a Serbian word.

### mercury
- `stops.mercury.tagline` — Current: „Najunutrašnja planeta — svet ekstrema sa kraterima poput Mesečevih.“ → Proposed: „Planeta najbliža Suncu — svet krajnosti punih kratera.“ — [E] „Najunutrašnja“ is not a valid superlative form. The text also drifts in meaning: it adds the Moon and drops "impossible".
- `stops.mercury.body` — Current: „Ali dani se njišu između ekstrema…“ → Proposed: „Ali temperature se kreću između krajnosti…“ — [S] Calque of "swing".
- `stops.mercury.narrative` — Current: „Sunce izgleda do tri puta šire nego sa Zemlje, peče stene…“ → Proposed: „…Sunce izgleda i do tri puta veće nego sa Zemlje i peče stene…“ — [S] The conjunction is missing.
- `stops.mercury.funFact` — Current: „zbog svog odbeglog efekta staklene bašte“ → Proposed: „zbog nekontrolisanog efekta staklene bašte“ — [C] „odbegli“ is a calque of "runaway" (see table).

### venus
- `stops.venus.body` — Current: „96% ugljen-dioksid … odbegli efekat staklene bašte“ → Proposed: „96% ugljen-dioksida … nekontrolisani efekat staklene bašte“ — [E] Case. [C] Terminology.
- `stops.venus.image.alt` — Current: „krem-i-žute trake oblaka“ → Proposed: „krem i žućkaste trake oblaka“ — [S] The hyphenated English compound was copied as-is.
- `stops.venus.facts.fact3` — Current: „kao da si 900 m pod vodom“ → Proposed: „kao na dubini od 900 m pod vodom“ — [C] ti form.
- `stops.venus.facts.fact5` — Current: „udžbenički odbegli staklenički efekat“ → Proposed: „udžbenički primer nekontrolisanog efekta staklene bašte“ — [C] Two different terms on the same page.

### saturn
- `stops.saturn.body` — „285 poznatih meseca“ → „meseci“ — [E].
- `stops.saturn.narrative` — Current: „Baci Saturn … ste vi gušći od njega“ → Proposed: „Bacite Saturn u dovoljno veliku kadu i plutao bi. … toliko naduven da ste vi, kubni centimetar po kubni centimetar, gušći od njega.“ — [C] Switches from ti to vi inside one string.
- `stops.saturn.funFact` — Current: „besmisleno tanki, često samo 10 metara od gore do dole“ → Proposed: „neverovatno tanki — često debeli samo 10 metara“ — [S] Calques.
- `stops.saturn.facts.fact3` — „~282.000 km ali su“ → „~282.000 km, ali su“ — [S] Comma.
- `stops.saturn.facts.fact4` — „285 poznatih meseca“ → „meseci“ — [E].

### uranus
- `stops.uranus.body` — "ledovi" → „ledovi“ — [C] Quotes.
- `stops.uranus.funFact` — Current: „ugao se zaglavio za milijarde godina“ → Proposed: „a nagib je takav ostao milijardama godina“ — [S] Calque.
- `stops.uranus.ifDistance` / `facts.fact5` — „William Herschel“ → „Vilijam Heršel“ — [C] Transcription. fact5: „1781 — prva planeta“ → „1781. — prva planeta“ — [E] The ordinal dot is missing.

### neptune
- `stops.neptune.tagline` — Current: „Plavo-olujni ledeni gigant“ → Proposed: „Olujni plavi ledeni džin“ — [S] Unnatural compound.
- `stops.neptune.funFact` — Current: „ima najjače vreme u sistemu“ → Proposed: „ima najburnije vremenske prilike u Sunčevom sistemu“ — [S] Calque of "strongest weather".

### higgs_boson
- `stops.higgs_boson.massNarrative` — Current: „u sebi nema nikakve delove“ → Proposed: „u sebi nema nikakvih delova“ — [E] Genitive of negation.

### antimatter
- `stops.antimatter.narrative` — Current: „Ovde je važna razmera jedan odnos: … preživela je jedna čestica materije viška.“ → Proposed: „Ovde je bitna razmera zapravo odnos: … preživela je po jedna čestica materije više.“ — [E] Garbled syntax.

### quantum_entanglement
- `stops.quantum_entanglement.body` — Current: „'sablasnim delovanjem na daljinu' … sve do testova bez rupa u logici iz 2015.“ → Proposed: „„sablasnim delovanjem na daljinu“ … sve do testova bez eksperimentalnih propusta (loophole-free) iz 2015.“ — [E] "Loopholes" are experimental gaps, not gaps in logic. Quotes.
- `stops.quantum_entanglement.funFact` — 'kosmičkom Belovom testu' → „…“ — [C] Quotes.

### tardigrade
- `stops.tardigrade.body` — 'tun' → „tun“ — [C] Quotes.
- `stops.tardigrade.funFact` — Current: „pa istraživači smatraju da gotovo sigurno nisu preživeli“ → Proposed: „pa istraživači smatraju da vrlo verovatno nisu preživeli“ — [E] Meaning drift: EN "very likely" is weaker than „gotovo sigurno“ (almost certainly). This matters on a site with honesty labels.

### blue_whale
- `stops.blue_whale.tagline` — Current: „…— izgrađena na ishrani od krila.“ → Proposed: „…— a hrani se sićušnim račićima, krilom.“ — [S]/[E] Calque. „krila“ (genitive of kril) reads as "wings".

### mount_everest
- `stops.mount_everest.body` — Current: „…gužvajući koru u Himalaje — i još uvek raste…“ → Proposed: „…gužvajući koru u Himalaje — a Everest i dalje raste…“ — [E] Ambiguous subject: as written, India is the thing that "keeps rising".
- `stops.mount_everest.facts.fact3` — Current: „samo oko trećine onog na nivou mora“ → Proposed: „samo oko trećina onog na nivou mora“ — [E] Case: the predicate takes the nominative.

### gravity
- `stops.gravity.body` — Current: „pretvorila ju je u zakrivljenost“ → Proposed: „opisala ju je kao zakrivljenost“ — [S] EN "recast" means "reformulated", not "turned into".

### gravitational_waves
- `stops.gravitational_waves.body` — Current: „mreže za merenje pulsara … „brujanju”“ → Proposed: „mreže za precizno merenje vremena pulsara … „brujanju““ — [E] "pulsar timing arrays" time the pulsars' signals; they do not "measure pulsars". Closing quote.

### big_bang / multiverse / wormhole / string_theory
- Closing quotes only (Global 1).
- `stops.multiverse.facts.fact3` — Current: „u CMB-u“ → Proposed: „u kosmičkom mikrotalasnom pozadinskom zračenju“ — [S] Undefined English abbreviation.

## 8. about.*

- `about.badgeEstablishedBody` — Current: „…koji se uklapa u dokaze … Otvorena za poboljšanje, ali podržana…“ → Proposed: „…koji je u skladu sa dokazima … Otvoren za poboljšanja, ali podržan…“ — [E] Gender: the subject „okvir“ is masculine.
- `about.badgeProbableBody` — „gravitaciono sočivovanje“ → „gravitaciono sočivo“ — [C].
- `about.editorialBody` — Current: „ustanovljene udžbenike“ → Proposed: „priznate udžbenike“ — [S] Wrong collocation.
- `about.languagesBody` — Current: „…kako bi mogle biti otkrivene, citirane i prevedene nezavisno — i od strane ljudi i od strane AI pretraživača.“ → Proposed: „…kako bi ih i ljudi i AI pretraživači mogli nezavisno da pronađu, citiraju i prevedu.“ — [S] Passive with „od strane“ is a calque.

## 9. topics.*

### stars
- `topics.stars.intro` — Current: „Zvezde dolaze u ogromnom rasponu boja…“ → Proposed: „Zvezde se veoma razlikuju po boji, veličini i temperaturi…“ — [S] Calque of "come in".
- `topics.stars.section1Body` — Current: „Za konverziju u Celzijuse“ → Proposed: „Za pretvaranje u stepene Celzijusa“ — [E] Wrong noun form. Also quotes around the mnemonic.
- `topics.stars.section2Body` — Current: „Crveni džinovi i supergiganti…“ → Proposed: „Crveni džinovi i superdžinovi…“ — [C] džin and gigant are mixed in one sentence (see table).
- `topics.stars.section3Body` — "glavnom nizu" → „glavnom nizu“; „gde provede“ → „u kojoj provede“ — [C]/[S].

### planets
- `topics.planets.intro` — Current: „Treća klauzula … je ono što je rekategorizovalo Pluton.“ → Proposed: „Upravo zbog trećeg uslova … Pluton je prekvalifikovan.“ — [S] Calque. „klauzula“ is legal jargon.
- `topics.planets.section2Body` — Current: „"odbegle planete"“ → Proposed: „„lutajuće planete““ — [S] Standard term. Quotes.
- `topics.planets.section3Body` — Current: „'promašena zvezda'“ → Proposed: „„neuspela zvezda““ — [C] The same paragraph says „neuspele zvezde“, and glossary.brown_dwarf says „Neuspela zvezda“.
- `topics.planets.section4Body` — Current: „Planeta … treba stabilnu orbitu u "nastanjivoj zoni" … demonstrabilno“ → Proposed: „Planeti … potrebna je stabilna orbita u „nastanjivoj zoni“ … dokazano“ — [S] „treba“ + accusative is colloquial. „demonstrabilno“ is a calque. Term consistency (see table).

### blackHoles
- `topics.blackHoles.intro` — Current: „oblast u kojoj se materija kolapsirala“ → Proposed: „oblast u kojoj je materija kolapsirala“ — [E] „kolapsirati“ is not reflexive.
- `topics.blackHoles.section1Body` — Current: „Crne rupe dolaze u tri grube klase … sede u centrima“ → Proposed: „Crne rupe se grubo dele u tri klase … nalaze se u centrima“ — [S] Calques.
- `topics.blackHoles.section3Body` — Current: „sedi u centru … mnogo manja zvezdane mase“ → Proposed: „nalazi se u centru … mnogo manja, zvezdane mase“ — [S]/[E] Same garble as smbh.body.
- `topics.blackHoles.section5Heading` — Current: „Hawking-ovo zračenje i sporo isparavanje“ → Proposed: „Hokingovo zračenje i sporo isparavanje“ — [E] The hyphenated possessive is wrong in Serbian.
- `topics.blackHoles.section5Body` — Current: „Stephen Hawking … trebale bi polako da ispare“ → Proposed: „Stiven Hoking … trebalo bi polako da ispare“ — [E] „trebati“ in this sense is impersonal.

### nebulae
- `topics.nebulae.intro` — Current: „najglasniji, najlepši objekti“ → Proposed: „najupadljiviji, najlepši objekti“ — [S] EN "loudest" is figurative.
- `topics.nebulae.section1Body` — Current: „planetama-sličnog izgleda … Rakovicu (Crab)“ → Proposed: „izgleda nalik planetama … Rakovu maglinu“ — [E] Hyphenated calque. The standard Serbian name is „Rakova maglina“. Rakovica is a Belgrade municipality.
- `topics.nebulae.section2Body` — Current: „Hubble slika koju ste videli“ → Proposed: „Hablov snimak koji ste sigurno videli“ — [C].
- `topics.nebulae.section3Heading` — Current: „Smrti veličine Sunca ostavljaju planetarne magline“ → Proposed: „Zvezde poput Sunca za sobom ostavljaju planetarne magline“ — [S] Unnatural.
- `topics.nebulae.section4Heading` — Current: „Masivne smrti ostavljaju ostatke supernova“ → Proposed: „Masivne zvezde za sobom ostavljaju ostatke supernove“ — [S].
- `topics.nebulae.section4Body` — Current: „Rakovica … pulsar u Rakovici“ → Proposed: „Rakova maglina … pulsar u Rakovoj maglini“ — [E] Term.

### bigBang
- `topics.bigBang.intro` — Current: „…bilo sabijeno u stanje toliko vrelo … da se … ponašaju … prostor se širi, hladi i proizvodi materiju…“ → Proposed: „…da su se … ponašali … prostor se širio, hladio i stvorio materiju…“ — [E] Tense mismatch inside a past-tense narrative.
- `topics.bigBang.section1Body` — Current: „Edwin Hubble … svaka galaksija vidi isti odlazni tok od svake druge“ → Proposed: „Edvin Habl … iz svake galaksije izgleda isto: sve ostale se udaljavaju od nje“ — [S]/[C].
- `topics.bigBang.section2Body` — Current: „pomerena u mikrotalase 13,8 milijardi godina širenja … ovog Kosmičkog … to je jedna od najbolje testiranih predviđanja“ → Proposed: „pomerena ka mikrotalasnom delu spektra tokom 13,8 milijardi godina širenja … ovog kosmičkog … to je jedno od najbolje proverenih predviđanja“ — [E] Missing preposition, a stray capital, and gender agreement (predviđanje is neuter).
- `topics.bigBang.section3Heading` — „Ubrzavajuće širenje i tamna energija“ → „Ubrzano širenje i tamna energija“ — [S].
- `topics.bigBang.section4Body` — "…" → „…“ — [C] Quotes.

### supernova
- `topics.supernova.intro` — Current: „materije u vašem telu težeg od helijuma“ → Proposed: „materije u vašem telu koja je teža od helijuma“ — [E] Agreement: materija is feminine.
- `topics.supernova.section1Body` — Current: „(Tipovi II, Ib, Ic) … potom odbija … lančanu fuziju ugljenika“ → Proposed: „(tipovi II, Ib, Ic) … potom se odbije … nekontrolisanu fuziju ugljenika“ — [E] The verb must be reflexive. "runaway" ≠ "chain reaction" (meaning drift). Lowercase „tipovi“.
- `topics.supernova.section2Body` / `section3Body` — „Rakovica“ → „Rakova maglina“. In section3: „Tycho Brahe“ → „Tiho Brahe“ — [E]/[C].
- `topics.supernova.section4Body` — quotes — [C].

### time
- `topics.time.intro` — Current: „mereljivi i ugrađeni u satelite GPS čipa u vašem telefonu“ → Proposed: „merljivi i uračunati u rad GPS satelita na koje se oslanja vaš telefon“ — [E] Typo, and the phrase as written is nonsense ("satellites of the GPS chip").

### distances
- `topics.distances.intro` — Current: „rastojanje Zemlja-Sunce“ → Proposed: „rastojanje Zemlja–Sunce“ — [C] Use an en dash, as elsewhere.
- `topics.distances.section1Body` — Current: „dostigao je jedan svetlosni dan od Zemlje … Oortov oblak“ → Proposed: „dostigao je udaljenost od jednog svetlosnog dana … Ortov oblak“ — [S]/[C].
- `topics.distances.section2Body` — Current: „Proxima Centauri … Alfa Centauri A i B … najsvetlija zvezda … Proximu biste dostigli“ → Proposed: „Proksima Kentaura … Alfa Kentaura A i B … najsjajnija zvezda … do Proksime biste stigli“ — [C] Names. „sjaj“ is the astronomical term.
- `topics.distances.section3Heading` — „Galaktičko i van-galaktičko“ → „Galaktičko i vangalaktičko“ — [E] The word is written closed (no hyphen).
- `topics.distances.section3Body` — Current: „Druga strana Mlečnog puta nalazi se oko 80.000 svetlosnih godina.“ → Proposed: „…nalazi se na oko 80.000 svetlosnih godina od nas.“ — [E] Preposition missing. „Virgo jato“ → „jato Virgo“ — [S].
- `topics.distances.section4Body` — Current: „ograničenje je na ono što možemo znati“ → Proposed: „ograničenje se odnosi na ono što možemo znati“ — [S] Calque.

### moons
- `topics.moons.intro` — Current: „Mesec — takođe zvani prirodni satelit … stotine potvrđenih meseca“ → Proposed: „Mesec (prirodni satelit) — u opštem smislu „mesec“, malim slovom … stotine potvrđenih meseci“ — [E] The generic "moon" takes a lowercase initial. Genitive plural.
- `topics.moons.section4Body` — Current: „oko gasnog džina Kepler-1625b“ → Proposed: „oko gasovitog džina Kepler-1625b“ — [C] Third variant of "gas giant".

### howBigIsTheUniverse
- `topics.howBigIsTheUniverse.section3Body` — Current: „ravan sa tačnošću boljom od jednog procenta“ → Proposed: „ravan sa tačnošću od delića procenta“ — [E] Meaning drift: EN "to within a fraction of a percent".
- `topics.howBigIsTheUniverse.section4Body` — Current: „Proxima Centauri … sa svojih 93 milijarde … 3,6 svetlosnih godina … do Proxime Centauri“ → Proposed: „Proksima Kentaura … sa svoje 93 milijarde … 3,6 svetlosne godine … do Proksime Kentaura“ — [E]/[C] milijarda is feminine, decimal agreement, and the name.

### planetSizesCompared
- `topics.planetSizesCompared.tagline` — Current: „model u razmeri koji možete da prošetate“ → Proposed: „model u razmeri kroz koji možete da prošetate“ — [E] „prošetati“ needs „kroz“.
- `topics.planetSizesCompared.section2Body` — „49 Meseca“ → „49 Meseci“ — [E].
- `topics.planetSizesCompared.section3Body` — Current: „Referentna razmera Quantumairea … Proxima Centauri“ → Proposed: „Referentna razmera Quantumaire-a … Proksima Kentaura“ — [C] All other strings write Quantumaire-u / Quantumaire-ova.
- `topics.planetSizesCompared.section5Body` — Current: „…Erida, gotovo je jednako široka i masivnija je od njega.“ → Proposed: „…Erida, gotovo je jednako široka i nešto je masivnija od njega.“ — [S] EN "slightly more massive".

### smallest / largest
- `topics.smallestThingsInTheUniverse.section5Body` — Current: „Gerd Binnig i Heinrich Rohrer … Rutherford“ → Proposed: „Gerd Binig i Hajnrih Rorer … Raderford“ — [C] Transcription. Closing quotes.
- `topics.largestThingsInTheUniverse.section1Body` — Current: „crveni supergiganti … ovi naduveni džinovi“ → Proposed: unify per the table („superdžinovi“, „hiperdžinovi“) — [C].
- `topics.largestThingsInTheUniverse.section4Body` — „Brent Tully“ → „Brent Tali“ — [C].

## 10. glossary.*

- `glossary.orion_correlation.term` — „Orion korelacija“ → „Orionova korelacija“ — [S] Noun-adjunct calque.
- `glossary.reference_scale.definition` — Current: „…da bi se ogromno različite veličine postale intuitivne.“ → Proposed: „…kako bi i krajnje različite veličine postale intuitivne.“ — [E] The verb is wrongly reflexive.
- `glossary.degenerate_matter.definition` — Current: „…kvantni pritisak, a ne toplota, drži uspravnom protiv gravitacije.“ → Proposed: „…kvantni pritisak, a ne toplota, štiti od urušavanja pod sopstvenom gravitacijom.“ — [S] Calque of "holds up".
- `glossary.tidal_lock.definition` — Current: „…period rotacije Meseca ili planete…“ → Proposed: „…period rotacije meseca ili planete…“ — [E] The generic moon takes a lowercase initial.
- `glossary.habitable_zone.term` — „Habitabilna zona“ — [C] Pick one term with topics.planets (see table).
- `glossary.spiral_arm.definition` — Current: „Sjajan trak zvezda…“ → Proposed: „Sjajna traka zvezda…“ — [E] „trak“ is not a standard form.
- `glossary.gravitational_lensing.term` — „Gravitaciono sočivovanje“ → „Gravitaciono sočivo (efekat gravitacionog sočiva)“ — [C].
- `glossary.wimp.definition` — Current: „Slabo Interagujuća Masivna Čestica“ → Proposed: „Slabo interagujuća masivna čestica (WIMP)“ — [E] English title case.
- `glossary.expansion.definition` — Current: „Rastezanje samog prostora koji nosi udaljene galaksije…“ → Proposed: „Rastezanje samog prostora, koje udaljene galaksije odvlači sve dalje jedne od drugih.“ — [E] The relative clause attaches to the wrong noun (prostor instead of rastezanje).
- `glossary.big_bang.definition` — Current: „Vrelo, gusto, šireće stanje“ → Proposed: „Vrelo, gusto stanje koje se širilo“ — [S] „šireće“ is a non-standard participle.
- `glossary.capsid.term` — „Kapsida“ → „Kapsid“ — [E]/[C] The standard term is masculine. Align stops.virus.image.alt with it.
- `glossary.ecliptic.definition` — Current: „Grubo ravna ravan u kojoj planete obilaze Sunce.“ → Proposed: „Ravan u kojoj, približno, sve planete obilaze Sunce.“ — [S] „grubo ravna ravan“ is a tautology and a calque of "roughly flat".
- `glossary.oort_cloud.term` — „Oortov oblak“ → „Ortov oblak“ — [C].
- `glossary.parsec.definition` — Current: „Astronomska jedinica rastojanja — oko 3,26 svetlosnih godina…“ → Proposed: „Jedinica rastojanja u astronomiji — oko 3,26 svetlosne godine…“ — [E] „Astronomska jedinica“ is the name of a different unit (AU). This is misleading in a glossary. Decimal agreement.
- `glossary.heliosphere.definition` — Current: „solarni vetar“ → Proposed: „Sunčev vetar“ — [C] Standard term.
- `glossary.brown_dwarf.definition` — 'Neuspela zvezda' → „Neuspela zvezda“ — [C] Quotes.
- `glossary.inflation.definition` — Current: „Hipotetisani … Objašnjava krupnozrnu glatkoću i ravnoću svemira, ali se osnovni mehanizam i dalje raspravlja.“ → Proposed: „Pretpostavljeni … Objašnjava zašto je svemir na velikim razmerama gladak i ravan, ali se o samom mehanizmu i dalje raspravlja.“ — [E] „krupnozrna“ means coarse-grained, the opposite of "large-scale". The construction „se … raspravlja“ is ungrammatical.
- `glossary.multiverse.definition` — Current: „Spekulativna kolekcija mnogih svemira“ → Proposed: „Pretpostavljeni skup mnogih svemira“ — [S] „kolekcija“ is a calque.
- `glossary.plate_tectonics.definition` — Current: „sporo grebanje“ → Proposed: „sporo trenje i pomeranje“ — [S] Calque of "grinding".
- `glossary.quasar.definition` — Current: „Izuzetno svetlo jezgro … brzo akrecuje materiju … posmatranog svemira“ → Proposed: „Izuzetno sjajno jezgro … brzo guta (akretira) materiju … vidljivog svemira“ — [E] „akrecuje“ is not a word. „posmatrani“ conflicts with the site term „vidljivi svemir“.
- `glossary.standard_candle.definition` — Current: „unutrašnja sjajnost … Supernove Tipa Ia su radni primer.“ → Proposed: „stvarni (apsolutni) sjaj … Supernove tipa Ia su najvažniji primer.“ — [E] "intrinsic" is not „unutrašnja“. "workhorse" was translated literally. Lowercase „tipa“.
- `glossary.type_ia.term` / `definition` — Current: „Supernova Tipa Ia … lančanu fuziju ugljenika … vršna sjajnost“ → Proposed: „Supernova tipa Ia … nekontrolisanu fuziju ugljenika … maksimalni sjaj“ — [E] Meaning drift ("runaway"). Capitalisation.
- `glossary.standard_model.definition` — Current: „…tri od četiri sile — svemu osim gravitacije.“ → Proposed: „…tri od četiri osnovne sile — svim osim gravitacije.“ — [E] Agreement with „sile“.
- `glossary.many_worlds.definition` — „Hjua Everta“ → „Hjua Evereta“ — [E] Genitive of Everet.
- `glossary.spacetime.definition` — Current: „četvorodimenzionalna tkanina“ → Proposed: „četvorodimenzionalna celina“ (or „struktura“) — [S] Calque of "fabric" (tagPages.spacetime uses „tkivo“).

## 11. sizeFaq.*, seo.*, spacecraft.*, analogy.*, tagPages.*

- `sizeFaq.q4` — Current: „Kad bi Zemlja bila zrno peska, kolika bi bila veličina — {Name}?“ → Proposed: „Kad bi Zemlja bila zrno peska, koliko bi bilo veliko: {Name}?“ (or keep, as an acceptable dodge of case) — [S] Awkward but grammatical. Low priority.
- `seo.topicsTitle` — Current: „Vodiči kroz svemir: veličine, razmere i svemir objašnjeni“ → Proposed: „Vodiči kroz svemir: veličine i razmere, jasno objašnjene“ — [S] „svemir“ appears twice.
- `spacecraft.footnote` — Current: „MSS: orbitalna brzina … Vremena pretpostavljaju stalnu brzinu.“ → Proposed: keep „MSS“ but also use it in stops.time_dilation.facts.fact3 (which says „ISS-u“). „Proračun pretpostavlja stalnu brzinu.“ — [C]/[S].
- `analogy.items.eiffel` — „Ajfelova kula“ vs references/referenceLabels „Ajfelov toranj“ — [C] Pick one. „Ajfelova kula“ is more common.
- `analogy.items.pitch` — „fudbalski teren“ vs referenceLabels „Fudbalsko igralište“ — [C] Pick one („fudbalski teren“).
- `tagPages.phenomenon.intro` — Current: „…svaki označen koliko je nauka zaista sigurna.“ → Proposed: „…svaki s oznakom koliko je nauka u njega zaista sigurna.“ — [E] A preposition is missing.
- `tagPages.star.intro` — Current: „UY Scuti, hiperdžina koji bi…“ → Proposed: per the table („hiperdžin“ everywhere, or „hipergigant“ everywhere) — [C] The site uses „hipergigant“ in 6 other places.
- `tagPages.animal.seoTitle` — Current: „Tardigrad i plavi kit: najizdržljivija mala i najveća životinja ikada“ → Proposed: „Tardigrad i plavi kit: najizdržljiviji mališan i najveća životinja ikada“ — [S] „najizdržljivija mala“ is awkward.
- `tagPages.planet.intro`, `tagPages.biology.intro`, `tagPages.black-hole.intro`, `analogy.intro` — ti forms („Otvori“, „do tebe“, „poznaješ“, „možeš“) → vi — [C] (Global 2).

---

## 12. Recommended terminology (standardise on these)

| EN term | Recommended SR | Notes / current variants found |
|---|---|---|
| light-year (ly) | svetlosna godina (abbr. **sg**) | Consistent already. Decimals take the genitive singular („4,24 svetlosne godine“, „3,26 svetlosne godine“). |
| light-second / -minute / -day | svetlosna sekunda / svetlosni minut / svetlosni dan | OK |
| astronomical unit (AU) | astronomska jedinica (**AJ**) | Do not use „astronomska jedinica“ generically (glossary.parsec). |
| parsec / megaparsec | parsek / megaparsek (instr. pl. parsecima) | OK |
| solar mass (M☉) | **Sunčeva masa** (gen. pl. „Sunčevih masa“) | Currently „solarnih masa“ ×20 keys. The site already says „Sunčevih poluprečnika“, so align with that. |
| solar wind | Sunčev vetar | glossary.heliosphere has „solarni vetar“. |
| giant / supergiant / hypergiant (stars) | **džin / superdžin / hiperdžin** | Currently gigant ×16 and džin ×17, mixed even within single sentences (topics.stars.section2Body). If the team prefers „gigant“, use it everywhere instead. Just don't mix. |
| gas giant / ice giant | gasoviti džin / ledeni džin | Variants: „gasoviti gigant“ (jupiter, saturn), „gasni džin“ (moons.section4), „ledeni gigant“ (uranus, neptune) |
| red dwarf / white dwarf / brown dwarf | crveni patuljak / beli patuljak / smeđi patuljak | „crvena patuljasta zvezda“ is acceptable in running text. |
| failed star | neuspela zvezda | „promašena zvezda“ in planets.section3Body |
| Proxima Centauri / Alpha Centauri | **Proksima Kentaura / Alfa Kentaura** (indeclinable „Kentaura“) | Currently: Proksima Kentaur (name, 10 keys), Proksime Kentaura (2), Proxima Centauri / Proxime Centauri / Alfa Centauri (5) |
| Kuiper Belt | Kajperov pojas | „Kojperov“ in solar_system.funFact, pluto.tagline |
| Oort Cloud | Ortov oblak | currently „Oortov“ ×5 |
| Crab Nebula / Crab Pulsar | Rakova maglina / Rakov pulsar | currently „Rakovica“ ×4 |
| Great Red Spot | Velika crvena pega | „Velika crvena mrlja“ in jupiter.body, image.alt |
| habitable zone | nastanjiva zona (term „habitabilna zona“ in parentheses once, if wanted) | habitabilna ×2 + glossary term vs nastanjiva ×1 |
| tidally locked / tidal locking | plimski zaključan / plimsko zaključavanje | „plimski vezan“ (moon.body), „plimno zaključani“ (pluto.funFact) |
| runaway greenhouse effect | nekontrolisani efekat staklene bašte | „odbegli efekat staklene bašte“, „odbegli staklenički efekat“ |
| runaway (carbon) fusion | nekontrolisana fuzija | „lančana fuzija“ is a meaning drift |
| gravitational lensing | gravitaciono sočivo / efekat gravitacionog sočiva | „gravitaciono sočivovanje“ ×5 |
| accelerating expansion | ubrzano širenje | „ubrzavajuće širenje“ ×3 |
| observable universe | vidljivi svemir | „posmatrani svemir“ in glossary.quasar |
| capsid | kapsid (m.) | „kapsula“ (virus alt), „kapsida“ (glossary) |
| quark flavours | ukusi kvarkova: gornji, donji, šarmantni, čudni, top, bottom | „arome … vrh, dno“ |
| rogue planet | lutajuća planeta | „odbegla planeta“ |
| pulsar timing array | mreža za merenje vremena pulsara | „mreža za merenje pulsara“ |
| intracluster gas | gas unutar jata | „međugalaktički gas“ |
| X-ray | rendgenski (zraci, snimak) | „X-zraci“ in dna.facts.fact6 |
| ISS | MSS (Međunarodna svemirska stanica) | „ISS-u“ in time_dilation.facts.fact3 |
| radio signal | radio-signal | mixed hyphenation |
| Eiffel Tower | Ajfelova kula | „Ajfelov toranj“ in references / referenceLabels |
| football pitch | fudbalski teren | „fudbalsko igralište“ in referenceLabels |
| random topic | nasumična tema | „slučajna“ in progress.openRandom |
| tab (browser) | kartica | „tab“ |
| imperial units | anglosaksonske jedinice | „imperijalne“ |
| Quantumaire (inflected) | Quantumaire-a, Quantumaire-u, Quantumaire-ov | „Quantumairea“ in planetSizesCompared.section3Body |
| Hawking radiation | Hokingovo zračenje | „Hawking-ovo“ |
| Hubble (telescope / person) | Habl, Hablov | „Hubble slika“, „Edwin Hubble“ |
| Virgo / Coma / Phoenix Cluster | jato Virgo / jato Koma / jato Feniks (or keep Latin names but put „jato“ first) | „Virgo jato“, „Koma jato“, „Phoenix jato“ (low priority, possibly intentional) |
| Laniakea Supercluster | superjato Laniakea | „Laniakea superjato“ (low priority) |
| Big Crunch | Veliko sažimanje | „Veliki krahovi“ is acceptable. Pick one if the term is reused. |
| addressing the reader | **vi** in all prose; short ti-imperatives allowed on buttons | currently mixed (Global 2) |
| quotation marks | „…“ | 43 keys use "…", '…' or „…” |

---

## Counts

- Keys reviewed: 1,477 sr / 1,515 en. Missing in sr: 38 (all `sizeFaq.subjects.*`, intentional). Extra in sr: 0.
- Placeholder mismatches: 9 keys use `{Name}` where EN uses `{name}`. Intentional and safe.
- Cyrillic: 0. Ijekavian forms: 0. Thousands and decimal number formatting: correct throughout (dot for thousands, decimal comma).
- Itemised findings: about **175 entries** across ~165 keys: about **95 [E]** grammar, meaning or terminology errors, about **45 [C]** consistency issues, and about **35 [S]** calques or unnatural phrasing. Plus the global issues: quotes in 43 keys, „meseca“ → „meseci“ in 8 keys, „solarnih masa“ in 20 keys, mixed ti/vi in about 25 keys.
- Highest-impact fixes:
  1. The comparePage ratio strings, which render ungrammatically at runtime.
  2. Factual or meaning errors: proton.fact3 („trilionitog“ is 10⁶× off), glossaryPage.intro (meaning reversed), lightTime.hint and sizeHint plus converter.tagline („how much light“), glossary.parsec („Astronomska jedinica“), glossary.inflation („krupnozrnu“), dark_energy.fact2, tardigrade.funFact (certainty overstated), bacterium.funFact, phoenix_a intracluster gas, gravitational_waves PTA, and pyramid „zvanično“.
  3. Unifying the terminology in the table above.
