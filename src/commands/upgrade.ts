import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { VERSION } from "../index.js";
import { scanDrawioFiles } from "../lib/scanner.js";
import { parseDiagram } from "../lib/parser.js";
import { matchCells } from "../lib/matcher.js";
import { diffShapes, getStaleShapes } from "../lib/differ.js";
import { upgradeXml } from "../lib/upgrader.js";
import { createBackup, restoreBackup, removeBackup } from "../lib/backup.js";
import { validateBeforeWrite } from "../lib/validator.js";
import { formatUpgradeResult, formatSummary } from "./format.js";

interface UpgradeOptions {
  dryRun?: boolean;
  backup?: boolean;
  verbose?: boolean;
}

export async function upgradeCommand(
  path: string | undefined,
  options: UpgradeOptions,
): Promise<void> {
  const targetPath = resolve(path || ".");
  const files = scanDrawioFiles(targetPath);

  if (files.length === 0) {
    process.stdout.write("No .drawio files found.\n");
    return;
  }

  let totalBlocks = 0;
  let totalUpgraded = 0;
  let totalFiles = 0;

  for (const file of files) {
    const xml = readFileSync(file, "utf-8");
    let diagram;
    try {
      diagram = await parseDiagram(xml);
    } catch {
      process.stderr.write(`  Skipping ${file}: failed to parse\n`);
      continue;
    }

    let fileXml = xml;
    let fileUpgraded = 0;
    let fileBlocks = 0;

    for (const page of diagram.pages) {
      const { matched } = matchCells(page.cells, VERSION);
      const diffs = diffShapes(matched);
      const stale = getStaleShapes(diffs);

      fileBlocks += matched.length;

      if (stale.length === 0) continue;

      if (options.dryRun) {
        fileUpgraded += stale.length;
        if (options.verbose) {
          formatUpgradeResult(file, page.name, stale, true);
        }
        continue;
      }

      const result = upgradeXml(fileXml, matched, diffs, VERSION);
      fileXml = result.xml;
      fileUpgraded += result.updatedCount;

      if (options.verbose) {
        formatUpgradeResult(file, page.name, stale, false);
      }
    }

    if (fileUpgraded > 0 && !options.dryRun) {
      const validation = validateBeforeWrite(xml, fileXml);
      if (!validation.valid) {
        process.stderr.write(`  Aborting ${file}: ${validation.error}\n`);
        continue;
      }

      if (options.backup !== false) {
        createBackup(file);
      }

      try {
        writeFileSync(file, fileXml);
      } catch (err) {
        process.stderr.write(`  Write failed for ${file}: ${err}\n`);
        if (options.backup !== false) {
          restoreBackup(file);
          process.stderr.write(`  Restored from backup: ${file}\n`);
        }
        continue;
      }

      if (options.backup !== false) {
        removeBackup(file);
      }
    }

    if (fileUpgraded > 0) totalFiles++;
    totalBlocks += fileBlocks;
    totalUpgraded += fileUpgraded;
  }

  formatSummary(totalBlocks, totalUpgraded, totalFiles, files.length, options.dryRun);
}
