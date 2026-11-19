import { describe, expect, it } from "vitest";
import { linkTopicNames } from "@/lib/topicLinks";

const NAMES = [
  { id: "jupiter", name: "Jupiter" },
  { id: "milky_way", name: "Milky Way" },
  { id: "big_bang", name: "The Big Bang" },
  { id: "cell", name: "Cell" },
];

describe("linkTopicNames", () => {
  it("links the first mention of each name once", () => {
    const seen = new Set<string>();
    const out = linkTopicNames("Jupiter is big. Jupiter again, after the Big Bang.", NAMES, seen);
    expect(out).toEqual([
      { id: "jupiter", text: "Jupiter" },
      " is big. Jupiter again, after the ",
      { id: "big_bang", text: "Big Bang" },
      ".",
    ]);
    expect(linkTopicNames("Jupiter once more", NAMES, seen)).toEqual(["Jupiter once more"]);
  });

  it("accepts short inflected endings but not other words", () => {
    const out = linkTopicNames("od Jupitera do Mlečnog puta; Jupiterlike", [{ id: "jupiter", name: "Jupiter" }], new Set());
    expect(out[1]).toEqual({ id: "jupiter", text: "Jupitera" });
  });

  it("is case-sensitive, so ordinary words stay plain", () => {
    expect(linkTopicNames("every cell divides", NAMES, new Set())).toEqual(["every cell divides"]);
  });
});
