import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { VERSION } from "../index.js";
import { scanDrawioFiles } from "../lib/scanner.js";
import { parseDiagram } from "../lib/parser.js";
import { matchCells } from "../lib/matcher.js";
import { diffShapes, getStaleShapes } from "../lib/differ.js";
import { formatCheckResult, formatCheckSummary } from "./format.js";

interface CheckOptions {
  verbose?: boolean;
}

export async function checkCommand(
  path: string | undefined,
  options: CheckOptions,
): Promise<void> {
  const targetPath = resolve(path || ".");
  const files = scanDrawioFiles(targetPath);

  if (files.length === 0) {
    process.stdout.write("No .drawio files found.\n");
    return;
  }

  let totalBlocks = 0;
  let totalStale = 0;
  let staleFiles = 0;

  for (const file of files) {
    const xml = readFileSync(file, "utf-8");
    let diagram;
    try {
      diagram = await parseDiagram(xml);
    } catch {
      process.stderr.write(`  Skipping ${file}: failed to parse\n`);
      continue;
    }

    let fileStale = 0;
    let fileBlocks = 0;

    for (const page of diagram.pages) {
      const { matched } = matchCells(page.cells, VERSION);
      const diffs = diffShapes(matched);
      const stale = getStaleShapes(diffs);

      fileBlocks += matched.length;
      fileStale += stale.length;

      if (options.verbose && stale.length > 0) {
        formatCheckResult(file, page.name, stale);
      }
    }

    if (fileStale > 0) staleFiles++;
    totalBlocks += fileBlocks;
    totalStale += fileStale;
  }

  formatCheckSummary(totalBlocks, totalStale, staleFiles, files.length);

  if (totalStale > 0) {
    process.exit(1);
  }
}
