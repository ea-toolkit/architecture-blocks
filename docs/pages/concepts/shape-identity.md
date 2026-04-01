---
layout: default
title: Shape Identity
---

# Shape Identity

How shapes are identified, versioned, and tracked across diagrams.

## data-block-id

Every shape in the library carries a `data-block-id` in its style string. This is a stable, kebab-case identifier that uniquely identifies the shape type:

```
data-block-id=application-component
data-block-id=business-actor
data-block-id=technology-service
```

The block ID:
- Is set when the shape is first placed on a canvas from the library
- Persists in the `.drawio` XML file when saved
- Survives copy-paste, export/import, and draw.io version upgrades
- Is never modified by the upgrade command
- Is the **join key** between diagrams and YAML definitions

## data-library-version

Each shape also carries the library version that created or last upgraded it:

```
data-library-version=0.1.0
```

The CLI uses this to determine if a shape is stale:
- If `data-library-version` matches the installed library → up to date
- If it doesn't match → stale, needs upgrade

## Where they live in the XML

### Simple shapes (no custom properties)

```xml
<mxCell id="2"
        value="My Component"
        style="shape=mxgraph.archimate3.application;fillColor=#99ffff;...;data-block-id=application-component;data-library-version=0.1.0"
        vertex="1" parent="1">
  <mxGeometry x="100" y="200" width="120" height="60" as="geometry"/>
</mxCell>
```

### Shapes with custom properties

```xml
<object id="2" label="My Component" owner="Team Alpha" status="active">
  <mxCell style="shape=mxgraph.archimate3.application;fillColor=#99ffff;...;data-block-id=application-component;data-library-version=0.1.0"
          vertex="1" parent="1">
    <mxGeometry x="100" y="200" width="120" height="60" as="geometry"/>
  </mxCell>
</object>
```

Note: `data-block-id` and `data-library-version` are in the **style string**, not as separate XML attributes. This ensures they survive draw.io's internal operations.

## How matching works

```
Diagram shape                     Library definition
─────────────                     ──────────────────
style contains                    shapes/application/
  data-block-id=                    application-component.yaml
  application-component    ──→       blockId: application-component
                                     visual:
style contains                         fillColor: "#A0E8E8"  ← compare
  fillColor=#99ffff        ──→         (different!)

Result: STALE — needs upgrade
```

The matcher:
1. Parses the style string to extract `data-block-id`
2. Looks up the corresponding YAML definition by `blockId`
3. Compares visual style properties
4. Reports whether the shape needs an upgrade

## What if a shape has no data-block-id?

It's silently skipped. This means:
- Shapes from other libraries → ignored
- Shapes created manually → ignored
- Plain draw.io shapes (rectangles, arrows, text) → ignored

Only shapes placed from the architecture-blocks library are managed.

## Renaming a block ID (breaking change)

Renaming a `blockId` is a breaking change because every existing diagram references the old ID. The [deprecation process](../reference/breaking-changes.html) handles this:

1. Old shape marked `deprecated: true`, `replacedBy: new-id`
2. Stays functional for 2 minor versions
3. Upgrade command migrates `data-block-id` to the new value
4. Old shape removed in next major version
