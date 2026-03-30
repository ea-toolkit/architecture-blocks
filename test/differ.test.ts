import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parseDiagram } from "../src/lib/parser.js";
import { matchCells } from "../src/lib/matcher.js";
import { diffShape, diffShapes, getStaleShapes } from "../src/lib/differ.js";

const fixturesDir = join(import.meta.dirname, "fixtures");

function readFixture(name: string): string {
  return readFileSync(join(fixturesDir, name), "utf-8");
}

describe("diffShape", () => {
  it("reports no changes for up-to-date shapes", async () => {
    const diagram = await parseDiagram(readFixture("simple.drawio"));
    const { matched } = matchCells(diagram.pages[0].cells);

    const diff = diffShape(matched[0]);
    expect(diff.hasChanges).toBe(false);
    expect(diff.changes).toHaveLength(0);
  });

  it("detects changed visual properties", async () => {
    const diagram = await parseDiagram(readFixture("stale-styles.drawio"));
    const { matched } = matchCells(diagram.pages[0].cells);

    const diff = diffShape(matched[0]);
    expect(diff.hasChanges).toBe(true);

    const changedProps = diff.changes.map((c) => c.property);
    expect(changedProps).toContain("fillColor");
    expect(changedProps).toContain("strokeColor");
    expect(changedProps).toContain("fontColor");
    expect(changedProps).toContain("fontSize");
  });

  it("includes current and expected values in changes", async () => {
    const diagram = await parseDiagram(readFixture("stale-styles.drawio"));
    const { matched } = matchCells(diagram.pages[0].cells);

    const diff = diffShape(matched[0]);
    const fillChange = diff.changes.find((c) => c.property === "fillColor");

    expect(fillChange).toBeDefined();
    expect(fillChange!.current).toBe("#80e0e0");
    expect(fillChange!.expected).toBe("#99ffff");
  });
});

describe("diffShapes", () => {
  it("diffs all matched shapes", async () => {
    const diagram = await parseDiagram(readFixture("simple.drawio"));
    const { matched } = matchCells(diagram.pages[0].cells);

    const diffs = diffShapes(matched);
    expect(diffs).toHaveLength(2);
  });
});

describe("getStaleShapes", () => {
  it("filters to only shapes with changes", async () => {
    const diagram = await parseDiagram(readFixture("stale-styles.drawio"));
    const { matched } = matchCells(diagram.pages[0].cells);

    const diffs = diffShapes(matched);
    const stale = getStaleShapes(diffs);

    expect(stale.length).toBeGreaterThan(0);
    expect(stale.every((d) => d.hasChanges)).toBe(true);
  });

  it("returns empty for up-to-date diagrams", async () => {
    const diagram = await parseDiagram(readFixture("simple.drawio"));
    const { matched } = matchCells(diagram.pages[0].cells);

    const diffs = diffShapes(matched);
    const stale = getStaleShapes(diffs);

    expect(stale).toHaveLength(0);
  });
});
