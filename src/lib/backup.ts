import { copyFileSync, unlinkSync, existsSync } from "node:fs";

export function createBackup(filePath: string): string {
  const backupPath = `${filePath}.bak`;
  copyFileSync(filePath, backupPath);
  return backupPath;
}

export function restoreBackup(filePath: string): boolean {
  const backupPath = `${filePath}.bak`;
  if (!existsSync(backupPath)) return false;
  copyFileSync(backupPath, filePath);
  return true;
}

export function removeBackup(filePath: string): void {
  const backupPath = `${filePath}.bak`;
  if (existsSync(backupPath)) {
    unlinkSync(backupPath);
  }
}
