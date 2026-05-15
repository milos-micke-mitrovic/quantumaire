import sharp from "sharp";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");

const svg = readFileSync(resolve(root, "app/icon.svg"));

const out = await Promise.all([
  sharp(svg).resize(192, 192).png().toFile(resolve(root, "public/icon-192.png")),
  sharp(svg).resize(512, 512).png().toFile(resolve(root, "public/icon-512.png")),
  sharp(svg)
    .resize(512, 512)
    .png({ compressionLevel: 9 })
    .toFile(resolve(root, "public/icon-512-maskable.png")),
]);

console.log("Wrote", out.map((x) => x.size + " bytes").join(" / "));
