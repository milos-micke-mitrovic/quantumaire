---
name: gsc-indexing
description: Request Google indexing for the next batch of Quantumaire URLs in Search Console via the Chrome extension (~10/day quota). Use when the user says "do today's indexing" or after new pages ship.
---

# Daily Search Console indexing

1. Open `docs/indexing-log.md`; take the next ~10 URLs from the queue
   (newest important pages first; EN before SR).
2. Load the Chrome tools in one ToolSearch call; open a new tab at
   `https://search.google.com/search-console?resource_id=https%3A%2F%2Fquantumaire.space%2F`.
3. Per URL (batch these actions): click the top "Inspect any URL" bar
   (~680,32 in a 1280-wide frame), type the URL, Enter, wait ~8 s, click
   "REQUEST INDEXING" (~1164,362), wait ~28 s, screenshot to confirm
   "Indexing requested", dismiss (~858,383).
   If the live test reports 404/5xx, stop and investigate the site first.
4. If Google reports the daily quota is exhausted, stop for today.
5. Move the done URLs to the "Done" section of `docs/indexing-log.md`
   with the date. Close the tab when finished.
