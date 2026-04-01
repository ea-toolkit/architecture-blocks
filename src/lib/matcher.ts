import type { CellData } from "./parser.js";
import { parseStyleString } from "./parser.js";
import { SHAPES_BY_ID, type ShapeDefinition } from "../library/shapes.js";
import { VERSION } from "../index.js";

export interface MatchedShape {
  cell: CellData;
  definition: ShapeDefinition;
  blockId: string;
  currentVersion: string;
  libraryVersion: string;
  needsUpgrade: boolean;
  deprecated: boolean;
  replacedBy?: string;
}

export interface UnmatchedCell {
  cell: CellData;
  reason: "no-block-id" | "unknown-block-id";
  blockId?: string;
}

export interface MatchResult {
  matched: MatchedShape[];
  unmatched: UnmatchedCell[];
}

export function matchCells(
  cells: CellData[],
  libraryVersion: string = VERSION,
): MatchResult {
  const matched: MatchedShape[] = [];
  const unmatched: UnmatchedCell[] = [];

  for (const cell of cells) {
    if (!cell.vertex) continue;

    const styleMap = parseStyleString(cell.style);
    const blockId =
      cell.attributes["data-block-id"] ?? styleMap.get("data-block-id");

    if (!blockId) {
      unmatched.push({ cell, reason: "no-block-id" });
      continue;
    }

    const definition = SHAPES_BY_ID.get(blockId);
    if (!definition) {
      unmatched.push({ cell, reason: "unknown-block-id", blockId });
      continue;
    }

    const currentVersion =
      cell.attributes["data-library-version"] ??
      styleMap.get("data-library-version") ??
      "unknown";

    matched.push({
      cell,
      definition,
      blockId,
      currentVersion,
      libraryVersion,
      needsUpgrade: currentVersion !== libraryVersion,
      deprecated: definition.deprecated ?? false,
      replacedBy: definition.replacedBy,
    });
  }

  return { matched, unmatched };
}
