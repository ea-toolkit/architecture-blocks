import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const LIBRARY_PATH = join(__dirname, "..", "libraries");
export const VERSION = "0.1.0";

export { SHAPES, SHAPES_BY_ID, LAYER_COLORS } from "./library/shapes.js";
export type { ShapeDefinition, ArchiMateLayer } from "./library/shapes.js";
export { generateLibraryXml, generateLibraryForLayer } from "./library/generator.js";
