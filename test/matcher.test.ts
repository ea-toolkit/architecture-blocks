import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parseDiagram } from "../src/lib/parser.js";
import { matchCells } from "../src/lib/matcher.js";

const fixturesDir = join(import.meta.dirname, "fixtures");

function readFixture(name: string): string {
  return readFileSync(join(fixturesDir, name), "utf-8");
}

describe("matchCells", () => {
  it("matches shapes by data-block-id in style string", async () => {
    const diagram = await parseDiagram(readFixture("simple.drawio"));
    const result = matchCells(diagram.pages[0].cells);

    expect(result.matched).toHaveLength(2);
    expect(result.matched[0].blockId).toBe("application-component");
    expect(result.matched[1].blockId).toBe("business-actor");
  });

  it("reports current and library versions", async () => {
    const diagram = await parseDiagram(readFixture("simple.drawio"));
    const result = matchCells(diagram.pages[0].cells, "0.1.0");

    expect(result.matched[0].currentVersion).toBe("0.1.0");
    expect(result.matched[0].libraryVersion).toBe("0.1.0");
    expect(result.matched[0].needsUpgrade).toBe(false);
  });

  it("flags shapes needing upgrade when versions differ", async () => {
    const diagram = await parseDiagram(readFixture("stale-styles.drawio"));
    const result = matchCells(diagram.pages[0].cells, "0.1.0");

    const matched = result.matched.find(
      (m) => m.blockId === "application-component",
    );
    expect(matched).toBeDefined();
    expect(matched!.currentVersion).toBe("0.0.1");
    expect(matched!.needsUpgrade).toBe(true);
  });

  it("skips cells without data-block-id", async () => {
    const diagram = await parseDiagram(readFixture("no-blocks.drawio"));
    const result = matchCells(diagram.pages[0].cells);

    expect(result.matched).toHaveLength(0);
    expect(result.unmatched).toHaveLength(1);
    expect(result.unmatched[0].reason).toBe("no-block-id");
  });

  it("skips edges during matching", async () => {
    const diagram = await parseDiagram(readFixture("simple.drawio"));
    const result = matchCells(diagram.pages[0].cells);

    const allIds = [
      ...result.matched.map((m) => m.cell.id),
      ...result.unmatched.map((u) => u.cell.id),
    ];
    const edge = diagram.pages[0].cells.find((c) => c.edge);
    expect(allIds).not.toContain(edge!.id);
  });
});
