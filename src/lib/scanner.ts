import { readdirSync, statSync, readFileSync, existsSync } from "node:fs";
import { join, relative } from "node:path";

export interface ScanResult {
  files: string[];
  workspace?: string;
  packages?: Array<{ name: string; path: string; files: string[] }>;
}

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

export function scanWorkspace(rootPath: string): ScanResult {
  const pkgPath = join(rootPath, "package.json");
  if (!existsSync(pkgPath)) {
    return { files: scanDrawioFiles(rootPath) };
  }

  const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
  const workspaces: string[] | undefined =
    pkg.workspaces || pkg.workspaces?.packages;

  if (!workspaces || workspaces.length === 0) {
    return { files: scanDrawioFiles(rootPath) };
  }

  const packages: Array<{ name: string; path: string; files: string[] }> = [];
  const allFiles: string[] = [];

  for (const pattern of workspaces) {
    const clean = pattern.replace(/\/\*$/, "");
    const wsDir = join(rootPath, clean);

    if (!existsSync(wsDir)) continue;

    const entries = readdirSync(wsDir);
    for (const entry of entries) {
      const pkgDir = join(wsDir, entry);
      const pkgJson = join(pkgDir, "package.json");

      if (!existsSync(pkgJson)) continue;

      const innerPkg = JSON.parse(readFileSync(pkgJson, "utf-8"));
      const files = scanDrawioFiles(pkgDir);

      if (files.length > 0) {
        packages.push({
          name: innerPkg.name || entry,
          path: relative(rootPath, pkgDir),
          files,
        });
        allFiles.push(...files);
      }
    }
  }

  // Also scan root-level .drawio files
  const rootFiles = scanDrawioFiles(rootPath).filter(
    (f) => !allFiles.includes(f),
  );
  allFiles.push(...rootFiles);

  return {
    files: allFiles.sort(),
    workspace: pkg.name,
    packages,
  };
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
