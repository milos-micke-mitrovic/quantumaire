import { describe, expect, it } from "vitest";
import { parseInline, stripInline } from "@/lib/inlineMarkdown";

describe("parseInline", () => {
  it("splits bold and italic runs", () => {
    expect(parseInline("It is **established theory**; what *is* it?")).toEqual([
      { text: "It is " },
      { text: "established theory", bold: true },
      { text: "; what " },
      { text: "is", italic: true },
      { text: " it?" },
    ]);
  });
  it("leaves names ending in an asterisk alone", () => {
    const s = "Sagittarius A* and M87* are black holes.";
    expect(parseInline(s)).toEqual([{ text: s }]);
  });
  it("strips markers for plain text", () => {
    expect(stripInline("**Status: real.** Not *inside* space; M87*.")).toBe(
      "Status: real. Not inside space; M87*."
    );
  });
});
