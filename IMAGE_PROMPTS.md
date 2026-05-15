# Quantumaire — Gemini image prompts (new entities)

These are the **only** images that still need generating. The existing 23
stop images in `public/images/` are already in place — leave them alone.

When all of the prompts below have been generated and saved, **delete this
file** (`rm IMAGE_PROMPTS.md`).

## Brand palette — use these exact hex values in every prompt

| Token | Hex |
|---|---|
| `cosmos.void` | `#03030a` (deep background) |
| `cosmos.deep` | `#0a0a1f` |
| `cosmos.nebula` | `#1a1245` |
| `cosmos.aurora` | `#7c5cff` (primary accent) |
| `cosmos.plasma` | `#c084fc` |
| `cosmos.nova` | `#f0abfc` |
| `cosmos.star` | `#e0f2fe` (starlight) |
| `cosmos.ember` | `#fb7185` (warm contrast) |

## Universal style block — prepend to every prompt

> Style: hyperrealistic scientific illustration, cinematic lighting, deep
> cosmic background. Strict palette: deep `#03030a` and `#0a0a1f` void;
> accents in electric purple `#7c5cff`, violet `#c084fc`, pink-violet
> `#f0abfc`; starlight highlights `#e0f2fe`; coral `#fb7185` sparingly.
> Avoid greens, browns, and oversaturated reds unless the subject demands
> them. No text, no logos, no watermarks. Ample negative space. Output
> 1024×1024 for squares, 1376×768 for wides, 896×1200 for portraits.

---

## 1 · Voyager 1 → `public/images/voyager1.webp` (16:9 wide)

Voyager 1 spacecraft drifting through interstellar space — its large white
high-gain dish antenna pointed back toward a tiny pale-blue Earth in the
distance. Gold thermal-control foil catching faint `#f0abfc` and `#7c5cff`
highlights. The Milky Way band arcs across the background in deep `#03030a`
void with `#e0f2fe` star specks and faint `#1a1245` nebular haze.
Cinematic, awe-inspiring, wide crop. Ultra-detailed photographic render.

## 2 · Laniakea Supercluster → `public/images/laniakea-supercluster.webp` (16:9 wide)

A vast cosmic web of galaxy clusters flowing toward a central gravitational
basin — the Great Attractor — at the heart of the Laniakea Supercluster.
Bright `#c084fc` and `#f0abfc` knots of galaxy concentrations along glowing
filaments of `#7c5cff`. Wisps of intergalactic gas in `#1a1245`. Mark the
Milky Way as a small `#e0f2fe` node near the outer edge of the structure.
Background: deep `#03030a` void. Wide cinematic scientific render,
ultra-detailed.

## 3 · TON 618 → `public/images/ton-618.webp` (16:9 wide)

TON 618 — an ultramassive quasar black hole at the centre of a distant
galaxy. A black sphere ringed by a vast luminous accretion disk in `#fb7185`
and `#f0abfc`, polar relativistic jets shooting out in bright `#c084fc`,
gravitational lensing distorting the surrounding stars and galaxies. Deep
`#03030a` void with `#1a1245` nebular haze. Awe-inspiring cinematic
scientific render, wide crop, ultra-detailed.

## 4 · Phoenix-A → `public/images/phoenix-a.webp` (16:9 wide)

Phoenix-A — among the most massive black holes ever measured — a giant
black sphere at the heart of the Phoenix Cluster, ringed by an enormous
swirling accretion disk in `#fb7185` and `#f0abfc`, surrounded by streamers
of `#7c5cff` intracluster gas, hot X-ray plasma haze in `#c084fc`, the host
galaxy a faint glow behind it. Deep `#03030a` void. Cinematic astrophysical
render, wide crop, ultra-detailed.

## 5 · Virgo Cluster (replacing the old galaxy-cluster image) → `public/images/galaxy-cluster.webp` (16:9 wide)

The Virgo Cluster — over a thousand galaxies bound by gravity, with a giant
brightest cluster galaxy (M87) at the centre rendered in bright `#c084fc`.
Surrounding spirals and ellipticals in `#f0abfc` and `#7c5cff` at various
orientations. A faint X-ray-like glow of intracluster gas in `#7c5cff`
permeating the space between them. Background: deep `#03030a` void with
hints of `#1a1245` cosmic web filaments stretching outward. Wide cinematic
crop, ultra-detailed.

*(If you keep the existing `galaxy-cluster.webp` image you're already happy
with, skip this one — the filename is shared.)*

## 6 · Moon → `public/images/moon.webp` (1:1 square)

The Moon as seen from low Earth orbit — full disc, sharply lit from one
side by direct sunlight. Maria rendered in soft `#1a1245` grey-blue,
highlands in pale `#e0f2fe`. Crisp rim of craters along the terminator
line. Background: deep `#03030a` void with a sparse field of `#f0abfc`
stars. Photographic scientific render, ultra-detailed, NASA-grade
clarity.

## 7 · Jupiter → `public/images/jupiter.webp` (1:1 square)

Jupiter as a gas giant — banded cloud belts in `#c084fc`, `#f0abfc`, and
warm cream, the Great Red Spot a clear anticyclonic vortex below the
equator. Four Galilean moons (Io, Europa, Ganymede, Callisto) visible as
small specks beside the planet in correct rough relative size. Deep
`#03030a` space background scattered with `#e0f2fe` stars. Photographic
scientific render, ultra-detailed.

## 8 · Proxima Centauri → `public/images/proxima-centauri.webp` (1:1 square)

Proxima Centauri — a small, dim red-dwarf star glowing in deep `#f0abfc`
and warm crimson tones, surface mottled with magnetic activity and a
small stellar flare arc. The silhouette of a terrestrial exoplanet
(Proxima b) crossing the disc. In the far background, the brighter Alpha
Centauri A/B pair as a tight `#e0f2fe` binary. Deep `#03030a` void with
a sparse `#7c5cff` star field. Photographic scientific render,
ultra-detailed.

---

## After generation

1. Save each as **WebP**, quality ~85.
2. Drop into `public/images/` using the exact paths above.
3. Refresh — `ImagePlaceholder` swaps from placeholder to real artwork
   automatically.
4. **Delete this file** when all three are in.

Note: Topic header images (`/topics/stars`, `/topics/planets`,
`/topics/black-holes`, `/topics/nebulae`, `/topics/moons`) are intentionally
**not** image-driven — the topic pages use coloured headings and section
cards, no hero artwork, so there's no Gemini prompt to write for them. If
you later decide you want hero illustrations on the topic pages, tell me
and I'll add prompts for those too.
