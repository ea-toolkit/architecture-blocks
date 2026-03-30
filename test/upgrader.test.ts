import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { readFileSync, writeFileSync, existsSync, unlinkSync, mkdtempSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { parseDiagram } from "../src/lib/parser.js";
import { matchCells } from "../src/lib/matcher.js";
import { diffShapes } from "../src/lib/differ.js";
import { upgradeXml } from "../src/lib/upgrader.js";
import { createBackup, restoreBackup, removeBackup } from "../src/lib/backup.js";
import { validateDrawioXml, validateBeforeWrite } from "../src/lib/validator.js";

const fixturesDir = join(import.meta.dirname, "fixtures");

function readFixture(name: string): string {
  return readFileSync(join(fixturesDir, name), "utf-8");
}

describe("upgradeXml", () => {
  it("updates stale styles to match library definitions", async () => {
    const xml = readFixture("stale-styles.drawio");
    const diagram = await parseDiagram(xml);
    const { matched } = matchCells(diagram.pages[0].cells, "0.1.0");
    const diffs = diffShapes(matched);

    const result = upgradeXml(xml, matched, diffs, "0.1.0");

    expect(result.updatedCount).toBe(1);
    expect(result.xml).toContain("fillColor=#99ffff");
    expect(result.xml).toContain("strokeColor=#00cccc");
    expect(result.xml).toContain("data-library-version=0.1.0");
  });

  it("preserves positions and geometry", async () => {
    const xml = readFixture("stale-styles.drawio");
    const diagram = await parseDiagram(xml);
    const { matched } = matchCells(diagram.pages[0].cells, "0.1.0");
    const diffs = diffShapes(matched);

    const result = upgradeXml(xml, matched, diffs, "0.1.0");

    expect(result.xml).toContain('x="200"');
    expect(result.xml).toContain('y="200"');
    expect(result.xml).toContain('width="140"');
    expect(result.xml).toContain('height="70"');
  });

  it("preserves labels and values", async () => {
    const xml = readFixture("stale-styles.drawio");
    const diagram = await parseDiagram(xml);
    const { matched } = matchCells(diagram.pages[0].cells, "0.1.0");
    const diffs = diffShapes(matched);

    const result = upgradeXml(xml, matched, diffs, "0.1.0");

    expect(result.xml).toContain('value="Old Component"');
    expect(result.xml).toContain('value="Plain Box"');
  });

  it("preserves connections (edges)", async () => {
    const xml = readFixture("simple.drawio");
    const diagram = await parseDiagram(xml);
    const { matched } = matchCells(diagram.pages[0].cells, "0.1.0");
    const diffs = diffShapes(matched);

    const result = upgradeXml(xml, matched, diffs, "0.1.0");

    expect(result.xml).toContain('source="2"');
    expect(result.xml).toContain('target="3"');
    expect(result.xml).toContain("edgeStyle=orthogonalEdgeStyle");
  });

  it("handles multi-page files", async () => {
    const xml = readFixture("multi-page.drawio");
    const diagram = await parseDiagram(xml);

    let totalUpdated = 0;
    let resultXml = xml;
    for (const page of diagram.pages) {
      const { matched } = matchCells(page.cells, "0.1.0");
      const diffs = diffShapes(matched);
      const result = upgradeXml(resultXml, matched, diffs, "0.1.0");
      resultXml = result.xml;
      totalUpdated += result.updatedCount;
    }

    expect(totalUpdated).toBe(0);
    expect(resultXml).toContain('name="Application"');
    expect(resultXml).toContain('name="Business"');
  });

  it("is a no-op for files with zero context blocks", async () => {
    const xml = readFixture("no-blocks.drawio");
    const diagram = await parseDiagram(xml);
    const { matched } = matchCells(diagram.pages[0].cells, "0.1.0");
    const diffs = diffShapes(matched);

    const result = upgradeXml(xml, matched, diffs, "0.1.0");

    expect(result.updatedCount).toBe(0);
    expect(result.xml).toBe(xml);
  });
});

describe("backup", () => {
  let tempDir: string;
  let testFile: string;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), "ab-test-"));
    testFile = join(tempDir, "test.drawio");
    writeFileSync(testFile, "<mxfile>original</mxfile>");
  });

  afterEach(() => {
    for (const f of [testFile, `${testFile}.bak`]) {
      if (existsSync(f)) unlinkSync(f);
    }
  });

  it("creates a .bak file", () => {
    const backupPath = createBackup(testFile);

    expect(existsSync(backupPath)).toBe(true);
    expect(readFileSync(backupPath, "utf-8")).toBe("<mxfile>original</mxfile>");
  });

  it("restores from backup", () => {
    createBackup(testFile);
    writeFileSync(testFile, "<mxfile>corrupted</mxfile>");
    restoreBackup(testFile);

    expect(readFileSync(testFile, "utf-8")).toBe("<mxfile>original</mxfile>");
  });

  it("removes backup file", () => {
    const backupPath = createBackup(testFile);
    removeBackup(testFile);

    expect(existsSync(backupPath)).toBe(false);
  });

  it("restoreBackup returns false when no backup exists", () => {
    expect(restoreBackup(testFile)).toBe(false);
  });
});

describe("validator", () => {
  it("validates correct drawio XML", () => {
    const xml = readFixture("simple.drawio");
    const result = validateDrawioXml(xml);
    expect(result.valid).toBe(true);
  });

  it("rejects malformed XML", () => {
    const result = validateDrawioXml("<mxfile><unclosed>");
    expect(result.valid).toBe(false);
  });

  it("rejects XML without mxfile root", () => {
    const result = validateDrawioXml("<root></root>");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("mxfile");
  });

  it("validates before write — accepts valid modifications", () => {
    const original = readFixture("simple.drawio");
    const result = validateBeforeWrite(original, original);
    expect(result.valid).toBe(true);
  });

  it("validates before write — rejects empty output", () => {
    const original = readFixture("simple.drawio");
    const result = validateBeforeWrite(original, "");
    expect(result.valid).toBe(false);
  });
});
