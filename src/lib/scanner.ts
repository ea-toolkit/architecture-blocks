import { readdirSync, statSync, readFileSync, existsSync } from "node:fs";
import { join, relative } from "node:path";

export function scanDrawioFiles(
  rootPath: string,
  respectGitignore = true,
): string[] {
  const ignorePatterns = respectGitignore
    ? loadGitignorePatterns(rootPath)
    : [];

  const files: string[] = [];
  walk(rootPath, rootPath, ignorePatterns, files);
  return files.sort();
}

function walk(
  dir: string,
  rootPath: string,
  ignorePatterns: string[],
  result: string[],
): void {
  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return;
  }

  for (const entry of entries) {
    if (entry.startsWith(".")) continue;

    const fullPath = join(dir, entry);
    const relativePath = relative(rootPath, fullPath);

    if (isIgnored(relativePath, ignorePatterns)) continue;

    let stat;
    try {
      stat = statSync(fullPath);
    } catch {
      continue;
    }

    if (stat.isDirectory()) {
      if (entry === "node_modules" || entry === "dist") continue;
      walk(fullPath, rootPath, ignorePatterns, result);
    } else if (entry.endsWith(".drawio")) {
      result.push(fullPath);
    }
  }
}

function loadGitignorePatterns(rootPath: string): string[] {
  const gitignorePath = join(rootPath, ".gitignore");
  if (!existsSync(gitignorePath)) return [];

  const content = readFileSync(gitignorePath, "utf-8");
  return content
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("#"));
}

function isIgnored(relativePath: string, patterns: string[]): boolean {
  for (const pattern of patterns) {
    const clean = pattern.replace(/\/$/, "");
    if (relativePath === clean || relativePath.startsWith(`${clean}/`)) {
      return true;
    }
  }
  return false;
}
