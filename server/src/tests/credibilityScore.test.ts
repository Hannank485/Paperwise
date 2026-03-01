import { describe, it, expect } from "vitest";
import credibilityCheck from "../utils/credibilityCheck";

describe("Credibility Score Check", () => {
  it("True For Valid Document ", () => {
    const string = "abstract " + Array(2000).fill("word").join(" ");
    expect(credibilityCheck(string)).toBe(true);
    const string2 = "Abstract literally " + Array(2000).fill("word").join(" ");
    expect(credibilityCheck(string2)).toBe(true);
  });

  it("false for Invalid Document", () => {
    const string = "Abstract " + "word ".repeat(1500);
    expect(credibilityCheck(string)).toBe(false);

    const string2 = Array(2000).fill("word").join(" ");
    expect(credibilityCheck(string2)).toBe(false);

    const string3 =
      "Abstract sort of literally stuff super " +
      Array(2000).fill("word").join(" ");

    expect(credibilityCheck(string3)).toBe(false);
  });
});
