import { getVersionsBetween, VERSION_HISTORY } from "../library/versions.js";

export function diffVersionsCommand(from: string, to: string): void {
  if (!VERSION_HISTORY.find((v) => v.version === from)) {
    process.stderr.write(`Unknown version: ${from}\n`);
    process.stderr.write(`Available: ${VERSION_HISTORY.map((v) => v.version).join(", ")}\n`);
    process.exit(2);
  }

  if (!VERSION_HISTORY.find((v) => v.version === to)) {
    process.stderr.write(`Unknown version: ${to}\n`);
    process.stderr.write(`Available: ${VERSION_HISTORY.map((v) => v.version).join(", ")}\n`);
    process.exit(2);
  }

  const versions = getVersionsBetween(from, to);

  if (versions.length === 0) {
    process.stdout.write(`No changes between ${from} and ${to}\n`);
    return;
  }

  process.stdout.write(`\n# Migration Guide: ${from} → ${to}\n\n`);

  for (const entry of versions) {
    process.stdout.write(`## ${entry.version} (${entry.date})\n\n`);
    for (const change of entry.changes) {
      process.stdout.write(`- ${change}\n`);
    }
    process.stdout.write("\n");
  }

  process.stdout.write(
    `Run \`architecture-blocks upgrade\` to apply all style changes.\n`,
  );
}
