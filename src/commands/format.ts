import { relative } from "node:path";
import type { ShapeDiff } from "../lib/differ.js";
import type { MatchedShape } from "../lib/matcher.js";

export function formatUpgradeResult(
  file: string,
  pageName: string,
  stale: ShapeDiff[],
  dryRun: boolean,
): void {
  const rel = relative(process.cwd(), file);
  const prefix = dryRun ? "[dry-run] " : "";
  process.stdout.write(`\n${prefix}${rel} (${pageName})\n`);

  for (const diff of stale) {
    const props = diff.changes.map((c) => c.property).join(", ");
    process.stdout.write(`  ${dryRun ? "would update" : "updated"} ${diff.blockId}: ${props}\n`);
  }
}

export function formatCheckResult(
  file: string,
  pageName: string,
  stale: ShapeDiff[],
): void {
  const rel = relative(process.cwd(), file);
  process.stdout.write(`\n${rel} (${pageName})\n`);

  for (const diff of stale) {
    const props = diff.changes.map((c) => `${c.property}: ${c.current} → ${c.expected}`).join(", ");
    process.stdout.write(`  stale ${diff.blockId}: ${props}\n`);
  }
}

export function formatSummary(
  totalBlocks: number,
  totalUpgraded: number,
  filesChanged: number,
  filesScanned: number,
  dryRun?: boolean,
): void {
  const prefix = dryRun ? "[dry-run] " : "";
  process.stdout.write(
    `\n${prefix}${totalBlocks} blocks found, ${totalUpgraded} ${dryRun ? "need" : "upgraded"} across ${filesChanged} of ${filesScanned} files\n`,
  );
}

export function formatDeprecationWarnings(matched: MatchedShape[]): void {
  const deprecated = matched.filter((m) => m.deprecated);
  for (const m of deprecated) {
    const replacement = m.replacedBy ? `, use ${m.replacedBy}` : "";
    process.stderr.write(`  ⚠ deprecated ${m.blockId}${replacement}\n`);
  }
}

export function formatCheckSummary(
  totalBlocks: number,
  totalStale: number,
  staleFiles: number,
  filesScanned: number,
): void {
  if (totalStale === 0) {
    process.stdout.write(`\nAll ${totalBlocks} blocks up to date across ${filesScanned} files\n`);
  } else {
    process.stdout.write(
      `\n${totalBlocks} blocks found, ${totalStale} stale across ${staleFiles} of ${filesScanned} files\n`,
    );
  }
}
