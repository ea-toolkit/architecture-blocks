import { XMLParser } from "fast-xml-parser";
import { inflate } from "node:zlib";
import { promisify } from "node:util";

const inflateAsync = promisify(inflate);

export interface CellData {
  id: string;
  value: string;
  style: string;
  vertex: boolean;
  edge: boolean;
  parent: string;
  source?: string;
  target?: string;
  attributes: Record<string, string>;
  geometry?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface PageData {
  name: string;
  cells: CellData[];
}

export interface DiagramData {
  pages: PageData[];
}

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  parseAttributeValue: false,
  isArray: (name) => name === "diagram" || name === "mxCell" || name === "object",
});

export async function parseDiagram(xml: string): Promise<DiagramData> {
  const parsed = xmlParser.parse(xml);
  const mxfile = parsed.mxfile;
  if (!mxfile) {
    throw new Error("Invalid .drawio file: missing <mxfile> root element");
  }

  const diagrams = ensureArray(mxfile.diagram);
  const pages: PageData[] = [];

  for (const diagram of diagrams) {
    const name = diagram["@_name"] || "Page-1";
    let rootContent: unknown;

    if (diagram.mxGraphModel) {
      rootContent = diagram.mxGraphModel;
    } else if (typeof diagram["#text"] === "string") {
      const decompressed = await decompressContent(diagram["#text"]);
      const innerParsed = xmlParser.parse(decompressed);
      rootContent = innerParsed.mxGraphModel;
    } else {
      continue;
    }

    const cells = extractCells(rootContent);
    pages.push({ name, cells });
  }

  return { pages };
}

function extractCells(graphModel: unknown): CellData[] {
  if (!graphModel || typeof graphModel !== "object") return [];

  const root = (graphModel as Record<string, unknown>).root;
  if (!root || typeof root !== "object") return [];

  const result: CellData[] = [];
  const rootObj = root as Record<string, unknown>;

  const mxCells = ensureArray(rootObj.mxCell);
  for (const cell of mxCells) {
    const parsed = parseMxCell(cell);
    if (parsed) result.push(parsed);
  }

  const objects = ensureArray(rootObj.object);
  for (const obj of objects) {
    const parsed = parseObjectCell(obj);
    if (parsed) result.push(parsed);
  }

  return result;
}

function parseMxCell(cell: unknown): CellData | null {
  if (!cell || typeof cell !== "object") return null;
  const c = cell as Record<string, unknown>;

  const id = String(c["@_id"] ?? "");
  if (!id || id === "0" || id === "1") return null;

  const style = String(c["@_style"] ?? "");
  const attributes = extractAttributes(c);

  return {
    id,
    value: String(c["@_value"] ?? ""),
    style,
    vertex: c["@_vertex"] === "1",
    edge: c["@_edge"] === "1",
    parent: String(c["@_parent"] ?? ""),
    source: c["@_source"] ? String(c["@_source"]) : undefined,
    target: c["@_target"] ? String(c["@_target"]) : undefined,
    attributes,
    geometry: extractGeometry(c),
  };
}

function parseObjectCell(obj: unknown): CellData | null {
  if (!obj || typeof obj !== "object") return null;
  const o = obj as Record<string, unknown>;

  const id = String(o["@_id"] ?? "");
  if (!id) return null;

  const attributes = extractAttributes(o);
  const innerCell = o.mxCell as Record<string, unknown> | undefined;
  const style = String(innerCell?.["@_style"] ?? o["@_style"] ?? "");

  return {
    id,
    value: String(o["@_label"] ?? o["@_value"] ?? ""),
    style,
    vertex: innerCell?.["@_vertex"] === "1" || o["@_vertex"] === "1",
    edge: innerCell?.["@_edge"] === "1" || o["@_edge"] === "1",
    parent: String(innerCell?.["@_parent"] ?? o["@_parent"] ?? ""),
    source: innerCell?.["@_source"] ? String(innerCell["@_source"]) : undefined,
    target: innerCell?.["@_target"] ? String(innerCell["@_target"]) : undefined,
    attributes,
    geometry: extractGeometry(innerCell ?? o),
  };
}

function extractAttributes(obj: Record<string, unknown>): Record<string, string> {
  const attrs: Record<string, string> = {};
  for (const [key, val] of Object.entries(obj)) {
    if (key.startsWith("@_") && val !== undefined) {
      const attrName = key.slice(2);
      if (!["id", "value", "style", "vertex", "edge", "parent", "source", "target", "label"].includes(attrName)) {
        attrs[attrName] = String(val);
      }
    }
  }
  return attrs;
}

function extractGeometry(obj: Record<string, unknown>): CellData["geometry"] | undefined {
  const geo = obj.mxGeometry as Record<string, unknown> | undefined;
  if (!geo) return undefined;
  return {
    x: Number(geo["@_x"] ?? 0),
    y: Number(geo["@_y"] ?? 0),
    width: Number(geo["@_width"] ?? 0),
    height: Number(geo["@_height"] ?? 0),
  };
}

async function decompressContent(encoded: string): Promise<string> {
  const buffer = Buffer.from(encoded, "base64");
  const decompressed = await inflateAsync(buffer);
  return decodeURIComponent(decompressed.toString());
}

function ensureArray<T>(val: T | T[] | undefined | null): T[] {
  if (val === undefined || val === null) return [];
  return Array.isArray(val) ? val : [val];
}

export function parseStyleString(style: string): Map<string, string> {
  const result = new Map<string, string>();
  for (const part of style.split(";")) {
    const eq = part.indexOf("=");
    if (eq > 0) {
      result.set(part.slice(0, eq), part.slice(eq + 1));
    } else if (part.length > 0) {
      result.set(part, "");
    }
  }
  return result;
}
