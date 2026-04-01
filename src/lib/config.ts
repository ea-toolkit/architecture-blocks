import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

export interface BlocksConfig {
  extensions?: string[];
}

const CONFIG_FILES = [
  ".architecture-blocksrc.json",
  ".architecture-blocksrc",
];

export function loadConfig(cwd: string = process.cwd()): BlocksConfig {
  for (const filename of CONFIG_FILES) {
    const filePath = resolve(cwd, filename);
    if (existsSync(filePath)) {
      const content = readFileSync(filePath, "utf-8");
      return JSON.parse(content) as BlocksConfig;
    }
  }

  // Check package.json for architecture-blocks field
  const pkgPath = resolve(cwd, "package.json");
  if (existsSync(pkgPath)) {
    const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
    if (pkg["architecture-blocks"]) {
      return pkg["architecture-blocks"] as BlocksConfig;
    }
  }

  return {};
}
