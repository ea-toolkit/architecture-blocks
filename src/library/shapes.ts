import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";

const __dirname = dirname(fileURLToPath(import.meta.url));

function findShapesDir(): string {
  // From dist/: ../shapes. From src/library/: ../../shapes
  const candidates = [
    join(__dirname, "..", "shapes"),
    join(__dirname, "..", "..", "shapes"),
  ];
  for (const dir of candidates) {
    if (existsSync(dir)) return dir;
  }
  return candidates[0];
}

const SHAPES_DIR = findShapesDir();

export interface ShapeDefinition {
  blockId: string;
  name: string;
  layer: ArchiMateLayer;
  style: string;
  fillColor: string;
  strokeColor: string;
  width: number;
  height: number;
  deprecated?: boolean;
  deprecatedSince?: string;
  replacedBy?: string;
}

export type ArchiMateLayer =
  | "application"
  | "business"
  | "technology"
  | "strategy"
  | "motivation"
  | "implementation"
  | "physical"
  | "composite";

export const LAYER_COLORS: Record<ArchiMateLayer, { fill: string; stroke: string }> = {
  application: { fill: "#99ffff", stroke: "#00cccc" },
  business: { fill: "#ffff99", stroke: "#cccc00" },
  technology: { fill: "#99ff99", stroke: "#00cc00" },
  strategy: { fill: "#F5DEAA", stroke: "#c4a050" },
  motivation: { fill: "#CCCCFF", stroke: "#9999cc" },
  implementation: { fill: "#FFE0E0", stroke: "#cc9999" },
  physical: { fill: "#99ff99", stroke: "#00cc00" },
  composite: { fill: "#E0E0E0", stroke: "#999999" },
};

interface YamlShape {
  blockId: string;
  name: string;
  layer: ArchiMateLayer;
  archimate: {
    stencil: string;
    typeAttr: string;
    typeValue: string;
  };
  visual: {
    fillColor: string;
    strokeColor: string;
    fontColor: string;
    fontSize: number;
    fontStyle?: number;
  };
  dimensions: {
    width: number;
    height: number;
  };
  deprecated?: boolean;
  deprecatedSince?: string;
  replacedBy?: string;
}

function buildStyle(yaml: YamlShape): string {
  return [
    `shape=${yaml.archimate.stencil}`,
    `fillColor=${yaml.visual.fillColor}`,
    `strokeColor=${yaml.visual.strokeColor}`,
    `fontColor=${yaml.visual.fontColor}`,
    `fontSize=${yaml.visual.fontSize}`,
    `fontStyle=${yaml.visual.fontStyle ?? 0}`,
    `${yaml.archimate.typeAttr}=${yaml.archimate.typeValue}`,
    `whiteSpace=wrap`,
    `html=1`,
  ].join(";");
}

function loadShapesFromYaml(): ShapeDefinition[] {
  const shapes: ShapeDefinition[] = [];

  let layers: string[];
  try {
    layers = readdirSync(SHAPES_DIR).filter((d) => !d.startsWith("."));
  } catch {
    return shapes;
  }

  for (const layer of layers) {
    const layerDir = join(SHAPES_DIR, layer);
    let files: string[];
    try {
      files = readdirSync(layerDir).filter((f) => f.endsWith(".yaml"));
    } catch {
      continue;
    }

    for (const file of files) {
      const content = readFileSync(join(layerDir, file), "utf-8");
      const yaml = parseYaml(content) as YamlShape;

      shapes.push({
        blockId: yaml.blockId,
        name: yaml.name,
        layer: yaml.layer,
        style: buildStyle(yaml),
        fillColor: yaml.visual.fillColor,
        strokeColor: yaml.visual.strokeColor,
        width: yaml.dimensions.width,
        height: yaml.dimensions.height,
        deprecated: yaml.deprecated,
        deprecatedSince: yaml.deprecatedSince,
        replacedBy: yaml.replacedBy,
      });
    }
  }

  return shapes.sort((a, b) => a.blockId.localeCompare(b.blockId));
}

export const SHAPES: ShapeDefinition[] = loadShapesFromYaml();

export const SHAPES_BY_ID = new Map<string, ShapeDefinition>(
  SHAPES.map((s) => [s.blockId, s]),
);
