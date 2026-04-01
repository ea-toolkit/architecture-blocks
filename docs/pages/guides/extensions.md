---
layout: default
title: Custom Extensions
---

# Custom Extensions

Add org-specific shapes without forking the library.

## Why extensions?

Your organization likely has notation beyond standard ArchiMate — internal system types, custom classification shapes, org-specific diagram elements. Extensions let you:

- Define custom shapes that follow the same YAML schema
- Include them in `check` and `upgrade` commands
- Generate library XML that combines standard + custom shapes
- Keep custom shapes in your own repo, version-controlled

## Setting up extensions

### 1. Create extension shapes directory

```
your-project/
├── custom-shapes/
│   ├── internal/
│   │   ├── microservice.yaml
│   │   └── data-lake.yaml
│   └── compliance/
│       ├── gdpr-boundary.yaml
│       └── pci-zone.yaml
├── .architecture-blocksrc.json
└── package.json
```

### 2. Add config file

```json
// .architecture-blocksrc.json
{
  "extensions": ["./custom-shapes"]
}
```

Or in `package.json`:

```json
{
  "architecture-blocks": {
    "extensions": ["./custom-shapes"]
  }
}
```

### 3. Write extension shape YAML

Follow the exact same schema as standard shapes:

```yaml
# custom-shapes/internal/microservice.yaml
blockId: custom-microservice
name: Microservice
layer: application
archimate:
  stencil: mxgraph.archimate3.application
  typeAttr: appType
  typeValue: comp
visual:
  fillColor: "#B8E6FF"
  strokeColor: "#4A90D9"
  fontColor: "#000000"
  fontSize: 12
  fontStyle: 0
dimensions:
  width: 120
  height: 60
properties:
  - key: runtime
    label: Runtime
    type: enum
    default: node
    options: [node, java, python, go, dotnet]
  - key: team
    label: Owning Team
    type: string
```

### 4. Validate

```bash
npx architecture-blocks check
# Now includes both standard and extension shapes
```

## Naming convention

Prefix extension blockIds to avoid collisions with the standard library:

```yaml
blockId: custom-microservice      # good
blockId: org-data-lake            # good
blockId: application-component    # bad — collides with standard library
```

## Extracting extension shapes

Use the extract command with a custom output directory:

```bash
npx architecture-blocks extract our-reference.drawio --output custom-shapes/
```

## Distributing extensions

### Option 1: In-repo (simplest)
Keep `custom-shapes/` in your project repo. Everyone who clones the repo gets them.

### Option 2: Separate npm package
Publish your extensions as a package:

```json
// .architecture-blocksrc.json
{
  "extensions": ["./node_modules/@your-org/architecture-extensions/shapes"]
}
```

### Option 3: Shared directory
Point to a shared network or mounted drive:

```json
{
  "extensions": ["/shared/architecture/custom-shapes"]
}
```
