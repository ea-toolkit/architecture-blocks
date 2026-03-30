import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parseDiagram, parseStyleString } from "../src/lib/parser.js";

const fixturesDir = join(import.meta.dirname, "fixtures");

function readFixture(name: string): string {
  return readFileSync(join(fixturesDir, name), "utf-8");
}

describe("parseDiagram", () => {
  it("parses a simple single-page diagram", async () => {
    const result = await parseDiagram(readFixture("simple.drawio"));

    expect(result.pages).toHaveLength(1);
    expect(result.pages[0].name).toBe("Page-1");

    const cells = result.pages[0].cells;
    const vertices = cells.filter((c) => c.vertex);
    const edges = cells.filter((c) => c.edge);

    expect(vertices).toHaveLength(2);
    expect(edges).toHaveLength(1);
  });

  it("extracts cell attributes and geometry", async () => {
    const result = await parseDiagram(readFixture("simple.drawio"));
    const cell = result.pages[0].cells.find((c) => c.id === "2");

    expect(cell).toBeDefined();
    expect(cell!.value).toBe("My Component");
    expect(cell!.style).toContain("application-component");
    expect(cell!.geometry).toEqual({
      x: 100,
      y: 100,
      width: 120,
      height: 60,
    });
  });

  it("parses multi-page diagrams", async () => {
    const result = await parseDiagram(readFixture("multi-page.drawio"));

    expect(result.pages).toHaveLength(2);
    expect(result.pages[0].name).toBe("Application");
    expect(result.pages[1].name).toBe("Business");

    expect(result.pages[0].cells.filter((c) => c.vertex)).toHaveLength(1);
    expect(result.pages[1].cells.filter((c) => c.vertex)).toHaveLength(1);
  });

  it("handles diagrams with no context blocks", async () => {
    const result = await parseDiagram(readFixture("no-blocks.drawio"));

    expect(result.pages).toHaveLength(1);
    expect(result.pages[0].cells.filter((c) => c.vertex)).toHaveLength(1);
  });

  it("extracts edge source and target", async () => {
    const result = await parseDiagram(readFixture("simple.drawio"));
    const edge = result.pages[0].cells.find((c) => c.edge);

    expect(edge).toBeDefined();
    expect(edge!.source).toBe("2");
    expect(edge!.target).toBe("3");
  });

  it("rejects invalid XML without mxfile root", async () => {
    await expect(parseDiagram("<root></root>")).rejects.toThrow(
      "missing <mxfile> root element",
    );
  });
});

describe("parseStyleString", () => {
  it("parses key=value pairs from style string", () => {
    const style = parseStyleString("fillColor=#99ffff;strokeColor=#00cccc;fontSize=12");

    expect(style.get("fillColor")).toBe("#99ffff");
    expect(style.get("strokeColor")).toBe("#00cccc");
    expect(style.get("fontSize")).toBe("12");
  });

  it("handles shape identifiers without values", () => {
    const style = parseStyleString("shape=mxgraph.archimate3.application;whiteSpace=wrap;html=1");

    expect(style.get("shape")).toBe("mxgraph.archimate3.application");
    expect(style.get("html")).toBe("1");
  });

  it("handles empty style string", () => {
    const style = parseStyleString("");
    expect(style.size).toBe(0);
  });
});
