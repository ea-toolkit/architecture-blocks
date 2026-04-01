import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";
import Ajv from "ajv";

const __dirname = dirname(fileURLToPath(import.meta.url));
const shapesDir = join(__dirname, "..", "shapes");
const schemaPath = join(__dirname, "..", "schemas", "shape.schema.json");

const schema = JSON.parse(readFileSync(schemaPath, "utf-8"));
const ajv = new Ajv({ allErrors: true });
const validate = ajv.compile(schema);

let total = 0;
let failed = 0;
const errors: string[] = [];

const layers = readdirSync(shapesDir).filter((d) => !d.startsWith("."));

for (const layer of layers) {
  const layerDir = join(shapesDir, layer);
  const files = readdirSync(layerDir).filter((f) => f.endsWith(".yaml"));

  for (const file of files) {
    total++;
    const filePath = join(layerDir, file);
    const content = readFileSync(filePath, "utf-8");

    let parsed: unknown;
    try {
      parsed = parseYaml(content);
    } catch (err) {
      failed++;
      errors.push(`${layer}/${file}: YAML parse error — ${err}`);
      continue;
    }

    const valid = validate(parsed);
    if (!valid) {
      failed++;
      const msgs = validate.errors?.map(
        (e) => `  ${e.instancePath || "/"}: ${e.message}`,
      );
      errors.push(`${layer}/${file}:\n${msgs?.join("\n")}`);
    }
  }
}

if (errors.length > 0) {
  process.stderr.write(`\nValidation failed for ${failed} of ${total} shapes:\n\n`);
  for (const err of errors) {
    process.stderr.write(`${err}\n\n`);
  }
  process.exit(1);
} else {
  process.stdout.write(`All ${total} shape YAML files valid.\n`);
}
