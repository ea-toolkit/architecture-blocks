---
title: For Library Authors
layout: default
parent: Guides
nav_order: 3
---

# For Library Authors
{: .no_toc }

How to add new shapes, update styles, and manage the shape library.
{: .fs-6 .fw-300 }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Adding a new shape

### Option A: Extract from draw.io (recommended)

The fastest way. No hand-writing YAML or XML.

1. Open draw.io and drag the ArchiMate shapes you want onto a blank canvas
2. Style them (colors, font, size)
3. Add custom properties via **Edit > Edit Data** (owner, status, etc.)
4. Save as `reference.drawio`
5. Run extract:

```bash
npx architecture-blocks extract reference.drawio --output shapes/
#   extracted application-component → application/application-component.yaml
#   extracted business-actor → business/business-actor.yaml
# 2 shapes extracted, 0 skipped.
```

**Bulk extraction**: drop as many shapes as you want on one canvas. The extract command processes all of them in one run.

### Option B: Write YAML manually

Create `shapes/<layer>/<block-id>.yaml`:

```yaml
blockId: my-new-shape
name: My New Shape
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
```

Validate: `npm run validate`

## Re-running extract on an updated reference file

| Action | What happens |
|:-------|:------------|
| **Add new shapes** to canvas, re-run extract | New shapes extracted, existing ones skipped |
| **Update styles** on canvas, re-run extract | Skipped by default. Use `--force` to overwrite |
| **Remove shapes** from canvas, re-run extract | YAML files stay (not auto-deleted). Remove manually |

```bash
# First time
npx architecture-blocks extract reference.drawio

# Later: added 3 new shapes
npx architecture-blocks extract reference.drawio
#   skip application-component (exists, use --force to overwrite)
#   extracted new-shape-1 → ...
# 3 shapes extracted, 5 skipped.

# Force overwrite all (after updating styles)
npx architecture-blocks extract reference.drawio --force
```

## Updating visual styles

1. Edit the YAML file directly — e.g., change `fillColor`
2. Or update in draw.io and re-extract with `--force`
3. Rebuild:

```bash
npm run validate   # Check YAML is valid
npm run build      # Regenerate libraries/*.xml
npm test           # Verify round-trip integrity (415 tests)
```

## Adding properties to shapes

Properties give shapes context. See [Shape Properties](../concepts/shape-properties) for the full guide.

```yaml
properties:
  - key: owner
    label: Owner
    type: string
    default: ""
  - key: status
    label: Status
    type: enum
    default: active
    options: [active, deprecated, planned, retiring]
```

## Deprecating a shape

Don't delete — deprecate first:

```yaml
blockId: old-shape
deprecated: true
deprecatedSince: "0.3.0"
replacedBy: new-shape
```

Shape stays functional for 2 minor versions, then removed in next major. See [Breaking Changes](../reference/breaking-changes).

## Releasing

1. Commit changes → PR → CODEOWNERS review → merge
2. Create a GitHub Release with semver tag (e.g., `v0.2.0`)
3. GitHub Actions auto-publishes to npm and GitHub Packages

See [Versioning](../reference/versioning) for semver rules.
