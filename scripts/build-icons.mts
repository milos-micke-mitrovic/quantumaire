/**
 * Regenerate every logo/icon file from lib/logo.ts:
 *   node --experimental-strip-types scripts/build-icons.mts
 */
import { writeFileSync } from "node:fs";
import sharp from "sharp";
import { iconSvg, logoSvg } from "../lib/logo.ts";

const png = (svg: string, size: number, file: string) =>
  sharp(Buffer.from(svg), { density: 600 }).resize(size, size).png().toFile(file);

writeFileSync("public/logo.svg", logoSvg());
writeFileSync("app/icon.svg", iconSvg());
await png(iconSvg({ rounded: false }), 180, "app/apple-icon.png");
await png(iconSvg(), 192, "public/icon-192.png");
await png(iconSvg(), 512, "public/icon-512.png");
// Maskable: full-bleed background, mark inside the 80% safe zone.
await png(iconSvg({ pad: 0.12, rounded: false }), 512, "public/icon-512-maskable.png");
console.log("icons written");
