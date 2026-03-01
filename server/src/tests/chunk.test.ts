import { describe, it, expect } from "vitest";
import createChunk from "../utils/chunk";

describe("Chunk Check", () => {
  it("Return true for all chunks except last having 500 words", async () => {
    const string = Array(2000).fill("word");
    const chunkExceptLast = await createChunk(string, 500);
    if (Array.isArray(chunkExceptLast)) {
      expect(
        chunkExceptLast
          .slice(0, -1)
          .every((chunk) => chunk.split(" ").length === 500),
      ).toBe(true);
    }
  });

  it("Return False for empty input", async () => {
    const string = Array(200).fill("");
    const chunkExceptLast = await createChunk(string, 500);
    expect(chunkExceptLast).toBe(false);
  });
});
