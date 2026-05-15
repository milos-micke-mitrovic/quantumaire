import sharp from "sharp";
import { readFileSync } from "node:fs";

const svg = readFileSync("public/logo.svg");
for (const size of [32, 64, 128, 256]) {
  await sharp(svg)
    .resize(size, size, { fit: "contain", background: { r: 3, g: 3, b: 10, alpha: 1 } })
    .png()
    .toFile(`/tmp/q-logo-${size}.png`);
}
console.log("Wrote 4 preview sizes to /tmp/q-logo-*.png");
