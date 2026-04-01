---
title: YAML Schema
layout: default
parent: Concepts
nav_order: 4
---

# YAML Schema
{: .no_toc }

The shape definition format explained field by field.
{: .fs-6 .fw-300 }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## File structure

Each shape is one YAML file at `shapes/<layer>/<block-id>.yaml`:

```
shapes/
├── application/
│   ├── application-component.yaml
│   ├── application-service.yaml
│   └── ...
├── business/
│   ├── business-actor.yaml
│   └── ...
└── ...
```

## Complete example

```yaml
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
    description: Team or person responsible
  - key: status
    label: Status
    type: enum
    default: active
    options: [active, deprecated, planned, retiring]
```

## Field reference

### Required fields

| Field | Type | Description |
|-------|------|-------------|
| `blockId` | string | Unique kebab-case identifier. Becomes `data-block-id` in draw.io. **Never rename without deprecation.** |
| `name` | string | Human-readable name shown in draw.io shape palette |
| `layer` | enum | ArchiMate layer: `application`, `business`, `technology`, `strategy`, `motivation`, `implementation`, `physical`, `composite` |
| `archimate.stencil` | string | draw.io stencil ID (e.g., `mxgraph.archimate3.application`) |
| `archimate.typeAttr` | string | ArchiMate type attribute name (e.g., `appType`) |
| `archimate.typeValue` | string | ArchiMate type value (e.g., `comp`, `serv`, `actor`) |
| `visual.fillColor` | hex | Background color (`#RRGGBB`) |
| `visual.strokeColor` | hex | Border color (`#RRGGBB`) |
| `visual.fontColor` | hex | Text color (`#RRGGBB`) |
| `visual.fontSize` | integer | Font size (8-48) |
| `dimensions.width` | integer | Default width in pixels (20-500) |
| `dimensions.height` | integer | Default height in pixels (20-500) |

### Optional fields

| Field | Type | Description |
|-------|------|-------------|
| `visual.fontStyle` | integer | 0=normal, 1=bold, 2=italic, 3=bold+italic |
| `properties` | array | Custom properties (see below) |
| `deprecated` | boolean | Whether this shape is deprecated |
| `deprecatedSince` | string | Version when deprecated (e.g., "0.3.0") |
| `replacedBy` | string | blockId of replacement shape |

### Property fields

Each entry in the `properties` array:

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `key` | yes | string | Attribute name in XML (camelCase recommended) |
| `label` | yes | string | Display label in draw.io Edit Data |
| `type` | no | enum | `string`, `enum`, `boolean`, `number` (default: `string`) |
| `default` | no | string | Default value |
| `options` | no | string[] | Valid values for `enum` type |
| `required` | no | boolean | Whether this property must be filled in |
| `description` | no | string | Help text |

## Validation

YAML files are validated against `schemas/shape.schema.json` during build:

```bash
npm run validate
# All 60 shape YAML files valid.
```

The validator catches:
- Missing required fields
- Invalid `layer` values
- Malformed hex color codes
- blockId not matching kebab-case pattern
- Dimensions outside valid range
- Unknown fields (strict schema, no extras)

## The JSON Schema

The full schema is at `schemas/shape.schema.json`. It uses JSON Schema draft-07 and can be used with any JSON Schema validator.

To validate a single file manually:

```bash
npx ajv validate -s schemas/shape.schema.json -d shapes/application/application-component.yaml
```
