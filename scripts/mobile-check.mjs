#!/usr/bin/env node
/**
 * Phone-viewport check: screenshots + horizontal-overflow report.
 *
 *   node scripts/mobile-check.mjs [--out DIR] [--full] [--base URL] <path|url> ...
 *
 * Paths ("/en/stop/titan") are resolved against --base (default
 * http://localhost:5739). Emulates a 390×844 touch phone at 2× DPR.
 * Prints one line per page: status, scrollWidth vs viewport, and up to three
 * elements that stick out past the right edge (ignoring scrollable shelves).
 * Exit code 1 if any page overflows or fails to load.
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const args = process.argv.slice(2);
let out = null;
let full = false;
let base = "http://localhost:5739";
const targets = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--out") out = args[++i];
  else if (args[i] === "--full") full = true;
  else if (args[i] === "--base") base = args[++i];
  else targets.push(args[i]);
}
if (targets.length === 0) {
  console.error("usage: node scripts/mobile-check.mjs [--out DIR] [--full] [--base URL] <path|url> ...");
  process.exit(2);
}
if (out) mkdirSync(out, { recursive: true });

// The installed Google Chrome (headless, separate profile) — no browser
// download needed; falls back to Playwright's own build if present.
const browser = await chromium
  .launch({ channel: "chrome" })
  .catch(() => chromium.launch());
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
});
const page = await context.newPage();
let failed = false;

for (const t of targets) {
  const url = /^https?:/.test(t) ? t : base + t;
  try {
    const res = await page.goto(url, { waitUntil: "networkidle", timeout: 30_000 });
    const report = await page.evaluate(() => {
      const w = window.innerWidth;
      const bad = [...document.querySelectorAll("body *")]
        .filter((e) => {
          const r = e.getBoundingClientRect();
          if (r.width === 0 || r.right <= w + 1) return false;
          // Horizontal shelves scroll on purpose.
          for (let p = e.parentElement; p; p = p.parentElement) {
            const ox = getComputedStyle(p).overflowX;
            if (ox === "auto" || ox === "scroll" || ox === "hidden") return false;
          }
          return true;
        })
        .slice(0, 3)
        .map((e) => `${e.tagName.toLowerCase()}.${String(e.className).slice(0, 40)} "${(e.textContent ?? "").trim().slice(0, 30)}"`);
      return { scrollWidth: document.documentElement.scrollWidth, width: w, bad };
    });
    const overflow = report.scrollWidth > report.width || report.bad.length > 0;
    if (overflow || !res?.ok()) failed = true;
    console.log(
      `${overflow ? "✗" : "✓"} ${res?.status()} ${t}  ${report.scrollWidth}/${report.width}` +
        (report.bad.length ? `  ${report.bad.join(" | ")}` : "")
    );
    if (out) {
      const name = t.replace(/^https?:\/\/[^/]+/, "").replace(/[^a-z0-9]+/gi, "_").replace(/^_|_$/g, "") || "root";
      await page.screenshot({ path: join(out, `${name}.png`), fullPage: full });
    }
  } catch (err) {
    failed = true;
    console.log(`✗ ERR ${t}  ${err.message.split("\n")[0]}`);
  }
}

await browser.close();
process.exit(failed ? 1 : 0);
