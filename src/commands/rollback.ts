import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { restoreBackup } from "../lib/backup.js";

export function rollbackCommand(file: string): void {
  const filePath = resolve(file);
  const backupPath = `${filePath}.bak`;

  if (!existsSync(backupPath)) {
    process.stderr.write(`No backup found: ${backupPath}\n`);
    process.exit(2);
  }

  if (restoreBackup(filePath)) {
    process.stdout.write(`Restored ${filePath} from backup.\n`);
  } else {
    process.stderr.write(`Failed to restore from backup.\n`);
    process.exit(2);
  }
}
