/**
 * Pre-generate responsive variants of every stop image.
 *
 *   public/images/atom.webp  →  public/images/w640/atom.webp, …
 *
 * Cloudflare Workers have no built-in Next.js image optimizer, so
 * `lib/imageLoader.ts` points <Image> at these static files instead of
 * `/_next/image`. Re-run after adding or replacing an image:
 *
 *   node scripts/resize-images.mjs
 */
import sharp from "sharp";
import { mkdirSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// Keep in sync with IMAGE_WIDTHS in lib/imageLoader.ts.
const WIDTHS = [384, 640, 828, 1080];

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "public/images");

let written = 0;
for (const file of readdirSync(dir)) {
  if (!file.endsWith(".webp")) continue;
  const src = join(dir, file);
  const { width } = await sharp(src).metadata();
  for (const w of WIDTHS) {
    const outDir = join(dir, `w${w}`);
    mkdirSync(outDir, { recursive: true });
    const out = join(outDir, file);
    try {
      if (statSync(out).mtimeMs >= statSync(src).mtimeMs) continue;
    } catch {}
    await sharp(src)
      .resize({ width: Math.min(w, width), withoutEnlargement: true })
      .webp({ quality: 72, effort: 6 })
      .toFile(out);
    written++;
  }
}
console.log(`Wrote ${written} variants`);
