import { VERSION, SHAPES, LIBRARY_PATH } from "../index.js";
import { getVersionHistory } from "../library/versions.js";

export function versionCommand(): void {
  process.stdout.write(`architecture-blocks v${VERSION}\n`);
  process.stdout.write(`  Shapes: ${SHAPES.length}\n`);
  process.stdout.write(`  Library: ${LIBRARY_PATH}\n`);
}

export function versionsCommand(): void {
  const history = getVersionHistory();
  for (const entry of history.reverse()) {
    const current = entry.version === VERSION ? " (current)" : "";
    process.stdout.write(`\n${entry.version}${current} — ${entry.date}\n`);
    for (const change of entry.changes) {
      process.stdout.write(`  - ${change}\n`);
    }
  }
}
