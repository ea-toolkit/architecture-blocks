import { parseStyleString } from "./parser.js";
import type { MatchedShape } from "./matcher.js";
import type { ShapeDiff, StyleChange } from "./differ.js";
import { VERSION } from "../index.js";

export interface UpgradeResult {
  xml: string;
  updatedCount: number;
  skippedCount: number;
}

const STYLE_PROPERTIES_TO_UPDATE = new Set([
  "fillColor",
  "strokeColor",
  "strokeWidth",
  "fontColor",
  "fontSize",
  "fontStyle",
  "fontFamily",
  "opacity",
  "gradientColor",
  "gradientDirection",
  "shadow",
  "dashed",
  "dashPattern",
  "rounded",
]);

export function upgradeXml(
  xml: string,
  matched: MatchedShape[],
  diffs: ShapeDiff[],
  targetVersion: string = VERSION,
): UpgradeResult {
  let result = xml;
  let updatedCount = 0;
  let skippedCount = 0;

  const diffMap = new Map(diffs.map((d) => [d.cellId, d]));

  for (const match of matched) {
    const diff = diffMap.get(match.cell.id);
    if (!diff || !diff.hasChanges) {
      skippedCount++;
      continue;
    }

    const oldStyle = match.cell.style;
    const newStyle = applyStyleChanges(oldStyle, diff.changes, targetVersion);

    if (oldStyle === newStyle) {
      skippedCount++;
      continue;
    }

    result = replaceStyleInXml(result, oldStyle, newStyle);
    updatedCount++;
  }

  return { xml: result, updatedCount, skippedCount };
}

function applyStyleChanges(
  currentStyle: string,
  changes: StyleChange[],
  targetVersion: string,
): string {
  const styleMap = parseStyleString(currentStyle);

  for (const change of changes) {
    if (STYLE_PROPERTIES_TO_UPDATE.has(change.property)) {
      styleMap.set(change.property, change.expected);
    }
  }

  styleMap.set("data-library-version", targetVersion);

  const parts: string[] = [];
  for (const [key, value] of styleMap) {
    parts.push(value === "" ? key : `${key}=${value}`);
  }
  return parts.join(";");
}

function replaceStyleInXml(xml: string, oldStyle: string, newStyle: string): string {
  const escaped = escapeForRegex(oldStyle);
  const pattern = new RegExp(`style="${escaped}"`, "g");
  return xml.replace(pattern, `style="${newStyle}"`);
}

function escapeForRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
