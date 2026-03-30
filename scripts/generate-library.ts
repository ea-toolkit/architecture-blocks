import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "libraries");

async function main(): Promise<void> {
  const { generateLibraryXml, generateLibraryForLayer } = await import(
    "../src/library/generator.js"
  );
  const { LAYER_COLORS } = await import("../src/library/shapes.js");

  mkdirSync(outDir, { recursive: true });

  const fullLibrary = generateLibraryXml();
  writeFileSync(join(outDir, "architecture-blocks.xml"), fullLibrary);

  for (const layer of Object.keys(LAYER_COLORS)) {
    const layerXml = generateLibraryForLayer(layer);
    writeFileSync(join(outDir, `architecture-blocks-${layer}.xml`), layerXml);
  }

  const count = fullLibrary.split(',"title":').length;
  process.stdout.write(`Generated library files in ${outDir} (${count} shapes)\n`);
}

main();
