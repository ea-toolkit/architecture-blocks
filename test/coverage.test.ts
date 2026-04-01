import { describe, it, expect } from "vitest";
import { SHAPES, LAYER_COLORS, type ArchiMateLayer } from "../src/library/shapes.js";

// ArchiMate 3.2 spec element counts per layer
const SPEC_ELEMENT_COUNTS: Record<ArchiMateLayer, number> = {
  application: 9,
  business: 13,
  technology: 13,
  strategy: 4,
  motivation: 10,
  implementation: 5,
  physical: 4,
  composite: 2,
};

describe("ArchiMate 3.2 coverage", () => {
  it("covers all 60 ArchiMate element types", () => {
    expect(SHAPES.length).toBe(60);
  });

  for (const [layer, expectedCount] of Object.entries(SPEC_ELEMENT_COUNTS)) {
    it(`${layer} layer has ${expectedCount} shapes`, () => {
      const count = SHAPES.filter((s) => s.layer === layer).length;
      expect(count).toBe(expectedCount);
    });
  }

  it("covers all layers defined in LAYER_COLORS", () => {
    const shapeLayers = new Set(SHAPES.map((s) => s.layer));
    for (const layer of Object.keys(LAYER_COLORS)) {
      expect(shapeLayers.has(layer as ArchiMateLayer)).toBe(true);
    }
  });

  it("every shape has a unique blockId", () => {
    const ids = SHAPES.map((s) => s.blockId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every shape has valid layer colors", () => {
    for (const shape of SHAPES) {
      const layerColors = LAYER_COLORS[shape.layer];
      expect(shape.fillColor).toBe(layerColors.fill);
      expect(shape.strokeColor).toBe(layerColors.stroke);
    }
  });
});
