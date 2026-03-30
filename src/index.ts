import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const LIBRARY_PATH = join(__dirname, "..", "libraries");
export const VERSION = "0.1.0";
