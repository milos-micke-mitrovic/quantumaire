# UX walkthrough notes
- about.scaleBody: claims every length is rescaled to grain of sand — outdated; rewrite to describe log scale, light-time, everyday analogies, unit switches.
- /topics (Guides index): every card repeats eyebrow "GUIDES" (noise) → remove or show something useful (reading time / item count). Search-intent guides (how-big-is-the-universe, planet-sizes-compared, smallest/largest) are last → feature them first ("Start here"). topicsIndex.intro wording "object page"/"concept page" is clunky.
- Guide pages (/topics/*): text-only sections; auto-link topic names mentioned in guide text (Sagittarius A*, TON 618, Phoenix-A, Jupiter…) to /stop/ pages (reuse LinkedBody-like matcher on stop names); consider an image per guide (hero) and a "Key numbers" mini table. Black-holes guide mentions M87* and Gaia BH1 — candidates for new topics.
- /tools/between: StopCombobox closed state — long name + detail overlap ("Observable Universe" vs "billion ly") → truncate name / hide detail when narrow (StopCombobox: give name flex-1 truncate, detail separate). Default range Planck→Observable lists everything; default to human→earth or similar.
- /progress: OK.
- Stop header shows category chip + identical "cosmos" tag (big_bang, multiverse, …) → remove "cosmos" tag from stops.json (3 topics) or hide tags equal to category.
- SR gendered verbs addressed to the reader ("si sačuvao", "si video"…) → use neutral constructions (e.g. "Sačuvane teme", "Teme sačuvane za kasnije").
- Footer shows "llms.txt" link to humans — keep the file, drop the visible link (or move into About).
