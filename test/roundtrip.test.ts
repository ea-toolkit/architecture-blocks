import { describe, it, expect } from "vitest";
import { SHAPES } from "../src/library/shapes.js";
import { generateLibraryXml } from "../src/library/generator.js";
import { VERSION } from "../src/index.js";

describe("round-trip validation", () => {
  const libraryXml = generateLibraryXml();

  // Parse the mxlibrary JSON content
  const match = libraryXml.match(/<mxlibrary>\[(.+)\]<\/mxlibrary>/s);
  const entries: Array<{ xml: string; w: number; h: number; title: string }> =
    match ? JSON.parse(`[${match[1]}]`) : [];

  it("generates entries for all shapes", () => {
    expect(entries.length).toBe(SHAPES.length);
  });

  for (const shape of SHAPES) {
    describe(`shape: ${shape.blockId}`, () => {
      const entry = entries.find((e) => e.title === shape.name);

      it("has a library entry", () => {
        expect(entry).toBeDefined();
      });

      it("preserves data-block-id in style", () => {
        expect(entry!.xml).toContain(`data-block-id=${shape.blockId}`);
      });

      it("preserves data-library-version in style", () => {
        expect(entry!.xml).toContain(`data-library-version=${VERSION}`);
      });

      it("preserves fillColor in style", () => {
        expect(entry!.xml).toContain(`fillColor=${shape.fillColor}`);
      });

      it("preserves strokeColor in style", () => {
        expect(entry!.xml).toContain(`strokeColor=${shape.strokeColor}`);
      });

      it("preserves dimensions", () => {
        expect(entry!.w).toBe(shape.width);
        expect(entry!.h).toBe(shape.height);
      });
    });
  }
});
