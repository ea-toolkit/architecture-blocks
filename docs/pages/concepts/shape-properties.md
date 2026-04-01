---
title: Shape Properties
layout: default
parent: Concepts
nav_order: 3
---

# Shape Properties
{: .no_toc }

Custom metadata that gives shapes context beyond visual appearance.
{: .fs-6 .fw-300 }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Why properties matter

Without properties, an "Application Component" shape is just a colored box with a label. With properties, it becomes:

| Property | Value |
|----------|-------|
| Owner | Platform Team |
| Status | Active |
| Criticality | High |
| Data Classification | Confidential |

Properties turn shapes into **context blocks** — they carry the information that architects need to make decisions, not just draw pictures.

## Defining properties in YAML

Properties are defined in the shape's YAML file:

```yaml
# shapes/application/application-component.yaml
blockId: application-component
name: Application Component
layer: application
archimate:
  stencil: mxgraph.archimate3.application
  typeAttr: appType
  typeValue: comp
visual:
  fillColor: "#99ffff"
  strokeColor: "#00cccc"
  fontColor: "#000000"
  fontSize: 12
  fontStyle: 0
dimensions:
  width: 120
  height: 60
properties:
  - key: owner
    label: Owner
    type: string
    default: ""
    description: Team or person responsible for this component
  - key: status
    label: Status
    type: enum
    default: active
    options:
      - active
      - deprecated
      - planned
      - retiring
    description: Current lifecycle status
  - key: criticality
    label: Criticality
    type: enum
    default: medium
    options:
      - low
      - medium
      - high
      - critical
    description: Business criticality level
```

## Property types

| Type | Description | Example |
|------|------------|---------|
| `string` | Free text | Owner name, URL, description |
| `enum` | Dropdown with predefined options | Status, criticality, environment |
| `boolean` | True/false toggle | isExternalFacing, requiresAuth |
| `number` | Numeric value | SLA percentage, cost tier |

## How properties appear in draw.io

When someone drags a shape with properties onto their canvas, the properties appear in **Edit > Edit Data** (or right-click > Edit Data):

- Each property shows its **label** as the field name
- **enum** types appear as dropdown selectors (if draw.io supports it via custom plugins) or as text fields where the user enters one of the options
- **default** values are pre-filled

The values are stored as XML attributes on the `<object>` element:

```xml
<object id="2" label="Payment Service"
        owner="Platform Team"
        status="active"
        criticality="high">
  <mxCell style="..." vertex="1" parent="1">
    <mxGeometry width="120" height="60" as="geometry"/>
  </mxCell>
</object>
```

## Properties survive upgrades

The upgrade command only modifies the `style` attribute inside `<mxCell>`. Property values on the `<object>` wrapper are never touched. So if a user has set `owner="Platform Team"`, that value persists through every library upgrade.

## Extracting properties from existing diagrams

If you've added properties to shapes in draw.io (via Edit Data), the extract command captures them:

```bash
npx architecture-blocks extract my-diagram.drawio
```

The extractor reads custom attributes from `<object>` elements and includes them in the generated YAML as properties.

## Property design guidelines

When designing properties for your organization:

**Do:**
- Use properties for metadata that matters for governance (owner, status, classification)
- Keep property keys short and camelCase (`dataClassification`, not `Data Classification Level`)
- Provide sensible defaults
- Use `enum` type with `options` when there's a fixed set of valid values
- Add `description` to help users understand what to fill in

**Don't:**
- Don't use properties for visual styling (that's what the `visual` section is for)
- Don't create too many properties — 3-5 per shape is usually enough
- Don't use properties for data that changes frequently (properties are set once, rarely updated)
- Don't put sensitive information in properties (diagram files are often committed to git)

## Example properties by shape type

### Application Component
```yaml
properties:
  - key: owner
    label: Owner
    type: string
  - key: status
    label: Status
    type: enum
    options: [active, deprecated, planned, retiring]
  - key: criticality
    label: Criticality
    type: enum
    options: [low, medium, high, critical]
  - key: dataClassification
    label: Data Classification
    type: enum
    options: [public, internal, confidential, restricted]
```

### Business Process
```yaml
properties:
  - key: processOwner
    label: Process Owner
    type: string
  - key: automationLevel
    label: Automation Level
    type: enum
    options: [manual, semi-automated, fully-automated]
  - key: maturity
    label: Maturity
    type: enum
    options: [initial, defined, managed, optimized]
```

### Technology Node
```yaml
properties:
  - key: environment
    label: Environment
    type: enum
    options: [dev, staging, production]
  - key: provider
    label: Cloud Provider
    type: enum
    options: [aws, azure, gcp, on-premise]
  - key: costCenter
    label: Cost Center
    type: string
```
