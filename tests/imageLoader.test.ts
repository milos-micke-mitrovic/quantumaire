import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { STOPS } from "@/lib/content";
import imageLoader, { IMAGE_WIDTHS } from "@/lib/imageLoader";

describe("imageLoader", () => {
  it("picks the smallest variant covering the requested width", () => {
    expect(imageLoader({ src: "/images/atom.webp", width: 300 })).toBe("/images/w384/atom.webp");
    expect(imageLoader({ src: "/images/atom.webp", width: 640 })).toBe("/images/w640/atom.webp");
    expect(imageLoader({ src: "/images/atom.webp", width: 1200 })).toBe("/images/atom.webp");
  });

  it("passes non-stop images through untouched", () => {
    expect(imageLoader({ src: "/logo.svg", width: 640 })).toBe("/logo.svg");
  });

  it("has every variant generated for every stop image", () => {
    for (const stop of STOPS) {
      for (const w of IMAGE_WIDTHS) {
        const file = `public${stop.image.src.replace("/images/", `/images/w${w}/`)}`;
        expect(existsSync(file), file).toBe(true);
      }
    }
  });
});
