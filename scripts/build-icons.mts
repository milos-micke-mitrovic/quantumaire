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

// /favicon.ico for clients that ignore <link rel="icon"> — a 32 px PNG
// wrapped in a single-entry ICO container.
{
  const png32 = await sharp(Buffer.from(iconSvg()), { density: 600 })
    .resize(32, 32)
    .png()
    .toBuffer();
  const header = Buffer.alloc(22);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(1, 4); // one image
  header.writeUInt8(32, 6); // width
  header.writeUInt8(32, 7); // height
  header.writeUInt8(0, 8); // palette
  header.writeUInt8(0, 9); // reserved
  header.writeUInt16LE(1, 10); // colour planes
  header.writeUInt16LE(32, 12); // bits per pixel
  header.writeUInt32LE(png32.length, 14); // image size
  header.writeUInt32LE(22, 18); // image offset
  writeFileSync("public/favicon.ico", Buffer.concat([header, png32]));
}
