import { parseStyleString } from "./parser.js";
import type { MatchedShape } from "./matcher.js";

const VISUAL_PROPERTIES = new Set([
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

export interface StyleChange {
  property: string;
  current: string | undefined;
  expected: string;
}

export interface ShapeDiff {
  blockId: string;
  cellId: string;
  changes: StyleChange[];
  hasChanges: boolean;
}

export function diffShape(matched: MatchedShape): ShapeDiff {
  const currentStyle = parseStyleString(matched.cell.style);
  const expectedStyle = parseStyleString(matched.definition.style);
  const changes: StyleChange[] = [];

  for (const [property, expected] of expectedStyle) {
    if (!VISUAL_PROPERTIES.has(property)) continue;

    const current = currentStyle.get(property);
    if (current !== expected) {
      changes.push({ property, current, expected });
    }
  }

  return {
    blockId: matched.blockId,
    cellId: matched.cell.id,
    changes,
    hasChanges: changes.length > 0,
  };
}

export function diffShapes(matched: MatchedShape[]): ShapeDiff[] {
  return matched.map(diffShape);
}

export function getStaleShapes(diffs: ShapeDiff[]): ShapeDiff[] {
  return diffs.filter((d) => d.hasChanges);
}
