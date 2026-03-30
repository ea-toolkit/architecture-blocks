import { VERSION, SHAPES, LIBRARY_PATH } from "../index.js";

export function versionCommand(): void {
  process.stdout.write(`architecture-blocks v${VERSION}\n`);
  process.stdout.write(`  Shapes: ${SHAPES.length}\n`);
  process.stdout.write(`  Library: ${LIBRARY_PATH}\n`);
}
