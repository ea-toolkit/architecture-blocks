export interface ShapeDefinition {
  blockId: string;
  name: string;
  layer: ArchiMateLayer;
  style: string;
  fillColor: string;
  strokeColor: string;
  width: number;
  height: number;
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

function makeStyle(
  archimateShape: string,
  typeAttr: string,
  typeValue: string,
  layer: ArchiMateLayer,
): string {
  const { fill, stroke } = LAYER_COLORS[layer];
  return [
    `shape=mxgraph.archimate3.${archimateShape}`,
    `fillColor=${fill}`,
    `strokeColor=${stroke}`,
    `fontColor=#000000`,
    `fontSize=12`,
    `fontStyle=0`,
    `${typeAttr}=${typeValue}`,
    `whiteSpace=wrap`,
    `html=1`,
  ].join(";");
}

function shape(
  blockId: string,
  name: string,
  layer: ArchiMateLayer,
  archimateShape: string,
  typeAttr: string,
  typeValue: string,
  width = 120,
  height = 60,
): ShapeDefinition {
  const { fill, stroke } = LAYER_COLORS[layer];
  return {
    blockId,
    name,
    layer,
    style: makeStyle(archimateShape, typeAttr, typeValue, layer),
    fillColor: fill,
    strokeColor: stroke,
    width,
    height,
  };
}

export const SHAPES: ShapeDefinition[] = [
  // Application Layer
  shape("application-component", "Application Component", "application", "application", "appType", "comp"),
  shape("application-interface", "Application Interface", "application", "application", "appType", "interface"),
  shape("application-function", "Application Function", "application", "application", "appType", "func"),
  shape("application-interaction", "Application Interaction", "application", "application", "appType", "interaction"),
  shape("application-process", "Application Process", "application", "application", "appType", "proc"),
  shape("application-event", "Application Event", "application", "application", "appType", "event"),
  shape("application-service", "Application Service", "application", "application", "appType", "serv"),
  shape("application-collaboration", "Application Collaboration", "application", "application", "appType", "collab"),
  shape("data-object", "Data Object", "application", "application", "appType", "data"),

  // Business Layer
  shape("business-actor", "Business Actor", "business", "business", "busType", "actor"),
  shape("business-role", "Business Role", "business", "business", "busType", "role"),
  shape("business-collaboration", "Business Collaboration", "business", "business", "busType", "collab"),
  shape("business-interface", "Business Interface", "business", "business", "busType", "interface"),
  shape("business-process", "Business Process", "business", "business", "busType", "proc"),
  shape("business-function", "Business Function", "business", "business", "busType", "func"),
  shape("business-interaction", "Business Interaction", "business", "business", "busType", "interaction"),
  shape("business-event", "Business Event", "business", "business", "busType", "event"),
  shape("business-service", "Business Service", "business", "business", "busType", "serv"),
  shape("business-object", "Business Object", "business", "business", "busType", "object"),
  shape("contract", "Contract", "business", "business", "busType", "contract"),
  shape("representation", "Representation", "business", "business", "busType", "representation"),
  shape("product", "Product", "business", "business", "busType", "product"),

  // Technology Layer
  shape("node", "Node", "technology", "technology", "techType", "node"),
  shape("device", "Device", "technology", "technology", "techType", "device"),
  shape("system-software", "System Software", "technology", "technology", "techType", "sysSw"),
  shape("technology-interface", "Technology Interface", "technology", "technology", "techType", "interface"),
  shape("technology-process", "Technology Process", "technology", "technology", "techType", "proc"),
  shape("technology-function", "Technology Function", "technology", "technology", "techType", "func"),
  shape("technology-interaction", "Technology Interaction", "technology", "technology", "techType", "interaction"),
  shape("technology-event", "Technology Event", "technology", "technology", "techType", "event"),
  shape("technology-service", "Technology Service", "technology", "technology", "techType", "serv"),
  shape("technology-collaboration", "Technology Collaboration", "technology", "technology", "techType", "collab"),
  shape("artifact", "Artifact", "technology", "technology", "techType", "artifact"),
  shape("communication-network", "Communication Network", "technology", "technology", "techType", "commNet"),
  shape("path", "Path", "technology", "technology", "techType", "path"),

  // Strategy Layer
  shape("resource", "Resource", "strategy", "strategy", "stratType", "resource"),
  shape("capability", "Capability", "strategy", "strategy", "stratType", "capability"),
  shape("value-stream", "Value Stream", "strategy", "strategy", "stratType", "valueStream"),
  shape("course-of-action", "Course of Action", "strategy", "strategy", "stratType", "courseOfAction"),

  // Motivation Layer
  shape("stakeholder", "Stakeholder", "motivation", "motivation", "motType", "stakeholder"),
  shape("driver", "Driver", "motivation", "motivation", "motType", "driver"),
  shape("assessment", "Assessment", "motivation", "motivation", "motType", "assessment"),
  shape("goal", "Goal", "motivation", "motivation", "motType", "goal"),
  shape("outcome", "Outcome", "motivation", "motivation", "motType", "outcome"),
  shape("principle", "Principle", "motivation", "motivation", "motType", "principle"),
  shape("requirement", "Requirement", "motivation", "motivation", "motType", "requirement"),
  shape("constraint", "Constraint", "motivation", "motivation", "motType", "constraint"),
  shape("meaning", "Meaning", "motivation", "motivation", "motType", "meaning"),
  shape("value", "Value", "motivation", "motivation", "motType", "value"),

  // Implementation & Migration Layer
  shape("work-package", "Work Package", "implementation", "implementation", "implType", "workPackage"),
  shape("deliverable", "Deliverable", "implementation", "implementation", "implType", "deliverable"),
  shape("implementation-event", "Implementation Event", "implementation", "implementation", "implType", "event"),
  shape("plateau", "Plateau", "implementation", "implementation", "implType", "plateau"),
  shape("gap", "Gap", "implementation", "implementation", "implType", "gap"),

  // Physical Layer
  shape("equipment", "Equipment", "physical", "physical", "phyType", "equipment"),
  shape("facility", "Facility", "physical", "physical", "phyType", "facility"),
  shape("distribution-network", "Distribution Network", "physical", "physical", "phyType", "distributionNetwork"),
  shape("material", "Material", "physical", "physical", "phyType", "material"),

  // Composite Layer
  shape("grouping", "Grouping", "composite", "composite", "compType", "grouping", 200, 150),
  shape("location", "Location", "composite", "composite", "compType", "location"),
];

export const SHAPES_BY_ID = new Map<string, ShapeDefinition>(
  SHAPES.map((s) => [s.blockId, s]),
);
