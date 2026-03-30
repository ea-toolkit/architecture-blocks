import { SHAPES, type ShapeDefinition } from "./shapes.js";
import { VERSION } from "../index.js";

function shapeToLibraryEntry(shape: ShapeDefinition, version: string): string {
  const styleWithMeta = [
    shape.style,
    `data-block-id=${shape.blockId}`,
    `data-library-version=${version}`,
  ].join(";");

  const xml = [
    `<mxGraphModel>`,
    `  <root>`,
    `    <mxCell id="0"/>`,
    `    <mxCell id="1" parent="0"/>`,
    `    <mxCell id="2" value="${escapeXml(shape.name)}" style="${escapeXml(styleWithMeta)}" vertex="1" parent="1">`,
    `      <mxGeometry width="${shape.width}" height="${shape.height}" as="geometry"/>`,
    `    </mxCell>`,
    `  </root>`,
    `</mxGraphModel>`,
  ].join("");

  return JSON.stringify({
    xml,
    w: shape.width,
    h: shape.height,
    title: shape.name,
    aspect: "fixed",
  });
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function generateLibraryXml(
  shapes: ShapeDefinition[] = SHAPES,
  version: string = VERSION,
): string {
  const entries = shapes.map((s) => shapeToLibraryEntry(s, version));
  return `<mxlibrary>[${entries.join(",")}]</mxlibrary>\n`;
}

export function generateLibraryForLayer(
  layer: string,
  version: string = VERSION,
): string {
  const filtered = SHAPES.filter((s) => s.layer === layer);
  return generateLibraryXml(filtered, version);
}
