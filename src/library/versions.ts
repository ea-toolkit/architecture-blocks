import { VERSION } from "../index.js";

export interface VersionEntry {
  version: string;
  date: string;
  changes: string[];
}

export const VERSION_HISTORY: VersionEntry[] = [
  {
    version: "0.1.0",
    date: "2026-03-30",
    changes: [
      "Initial shape library with all ArchiMate layers",
      "Application, Business, Technology, Strategy, Motivation, Implementation, Physical, Composite",
    ],
  },
];

export function getLatestVersion(): string {
  return VERSION;
}

export function getVersionHistory(): VersionEntry[] {
  return [...VERSION_HISTORY];
}

export function isVersionStale(currentVersion: string): boolean {
  if (currentVersion === "unknown") return true;
  return currentVersion !== VERSION;
}

export function getVersionsBetween(
  fromVersion: string,
  toVersion: string,
): VersionEntry[] {
  const fromIndex = VERSION_HISTORY.findIndex((v) => v.version === fromVersion);
  const toIndex = VERSION_HISTORY.findIndex((v) => v.version === toVersion);

  if (fromIndex === -1 || toIndex === -1) return [];
  if (fromIndex >= toIndex) return [];

  return VERSION_HISTORY.slice(fromIndex + 1, toIndex + 1);
}
