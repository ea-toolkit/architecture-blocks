import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, join } from "node:path";
import { stringify } from "yaml";
import { parseDiagram, parseStyleString } from "../lib/parser.js";

const ARCHIMATE_STENCIL_PREFIX = "mxgraph.archimate3.";

const TYPE_ATTR_MAP: Record<string, { layer: string; typeAttr: string }> = {
  appType: { layer: "application", typeAttr: "appType" },
  busType: { layer: "business", typeAttr: "busType" },
  techType: { layer: "technology", typeAttr: "techType" },
  stratType: { layer: "strategy", typeAttr: "stratType" },
  motType: { layer: "motivation", typeAttr: "motType" },
  implType: { layer: "implementation", typeAttr: "implType" },
  phyType: { layer: "physical", typeAttr: "phyType" },
  compType: { layer: "composite", typeAttr: "compType" },
};

interface ExtractOptions {
  output?: string;
  force?: boolean;
}

export async function extractCommand(
  file: string,
  options: ExtractOptions,
): Promise<void> {
  const filePath = resolve(file);
  const outputDir = resolve(options.output || "shapes");

  if (!existsSync(filePath)) {
    process.stderr.write(`File not found: ${filePath}\n`);
    process.exit(2);
  }

  const xml = readFileSync(filePath, "utf-8");
  const diagram = await parseDiagram(xml);

  let extracted = 0;
  let skipped = 0;

  for (const page of diagram.pages) {
    for (const cell of page.cells) {
      if (!cell.vertex || !cell.style) continue;

      const styleMap = parseStyleString(cell.style);
      const shape = styleMap.get("shape");
      if (!shape || !shape.startsWith(ARCHIMATE_STENCIL_PREFIX)) continue;

      const stencil = shape;
      const stencilSuffix = shape.slice(ARCHIMATE_STENCIL_PREFIX.length);

      let layer = "";
      let typeAttr = "";
      let typeValue = "";

      for (const [attr, info] of Object.entries(TYPE_ATTR_MAP)) {
        const val = styleMap.get(attr);
        if (val) {
          layer = info.layer;
          typeAttr = info.typeAttr;
          typeValue = val;
          break;
        }
      }

      if (!layer) {
        layer = stencilSuffix;
      }

      const blockId = inferBlockId(layer, typeValue, stencilSuffix);
      const layerDir = join(outputDir, layer);
      const yamlPath = join(layerDir, `${blockId}.yaml`);

      if (existsSync(yamlPath) && !options.force) {
        process.stdout.write(`  skip ${blockId} (exists, use --force to overwrite)\n`);
        skipped++;
        continue;
      }

      const yamlDoc = {
        blockId,
        name: inferName(blockId),
        layer,
        archimate: { stencil, typeAttr, typeValue },
        visual: {
          fillColor: styleMap.get("fillColor") || "#FFFFFF",
          strokeColor: styleMap.get("strokeColor") || "#000000",
          fontColor: styleMap.get("fontColor") || "#000000",
          fontSize: parseInt(styleMap.get("fontSize") || "12", 10),
          fontStyle: parseInt(styleMap.get("fontStyle") || "0", 10),
        },
        dimensions: {
          width: cell.geometry?.width || 120,
          height: cell.geometry?.height || 60,
        },
      };

      mkdirSync(layerDir, { recursive: true });
      writeFileSync(yamlPath, stringify(yamlDoc));
      process.stdout.write(`  extracted ${blockId} → ${layer}/${blockId}.yaml\n`);
      extracted++;
    }
  }

  process.stdout.write(
    `\n${extracted} shapes extracted, ${skipped} skipped.\n`,
  );
}

function inferBlockId(layer: string, typeValue: string, stencilSuffix: string): string {
  const typeMap: Record<string, Record<string, string>> = {
    application: {
      comp: "application-component",
      interface: "application-interface",
      func: "application-function",
      interaction: "application-interaction",
      proc: "application-process",
      event: "application-event",
      serv: "application-service",
      collab: "application-collaboration",
      data: "data-object",
    },
    business: {
      actor: "business-actor",
      role: "business-role",
      collab: "business-collaboration",
      interface: "business-interface",
      proc: "business-process",
      func: "business-function",
      interaction: "business-interaction",
      event: "business-event",
      serv: "business-service",
      object: "business-object",
      contract: "contract",
      representation: "representation",
      product: "product",
    },
    technology: {
      node: "node",
      device: "device",
      sysSw: "system-software",
      interface: "technology-interface",
      proc: "technology-process",
      func: "technology-function",
      interaction: "technology-interaction",
      event: "technology-event",
      serv: "technology-service",
      collab: "technology-collaboration",
      artifact: "artifact",
      commNet: "communication-network",
      path: "path",
    },
    strategy: {
      resource: "resource",
      capability: "capability",
      valueStream: "value-stream",
      courseOfAction: "course-of-action",
    },
    motivation: {
      stakeholder: "stakeholder",
      driver: "driver",
      assessment: "assessment",
      goal: "goal",
      outcome: "outcome",
      principle: "principle",
      requirement: "requirement",
      constraint: "constraint",
      meaning: "meaning",
      value: "value",
    },
    implementation: {
      workPackage: "work-package",
      deliverable: "deliverable",
      event: "implementation-event",
      plateau: "plateau",
      gap: "gap",
    },
    physical: {
      equipment: "equipment",
      facility: "facility",
      distributionNetwork: "distribution-network",
      material: "material",
    },
    composite: {
      grouping: "grouping",
      location: "location",
    },
  };

  return typeMap[layer]?.[typeValue] || `${layer}-${typeValue || stencilSuffix}`;
}

function inferName(blockId: string): string {
  return blockId
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
