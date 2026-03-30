import { copyFileSync, mkdirSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const librariesDir = join(__dirname, "..", "libraries");
const targetDir = process.env.ARCHITECTURE_BLOCKS_DIR || "./drawio-libraries";

function main(): void {
  mkdirSync(targetDir, { recursive: true });

  const files = readdirSync(librariesDir).filter((f) => f.endsWith(".xml"));
  for (const file of files) {
    copyFileSync(join(librariesDir, file), join(targetDir, file));
  }

  process.stdout.write(
    `Copied ${files.length} library file(s) to ${targetDir}\n`,
  );
}

main();
