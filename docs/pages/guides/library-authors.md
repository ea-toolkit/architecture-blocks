---
layout: default
title: For Library Authors
---

# For Library Authors

How to add new shapes, update styles, and manage the shape library.

## Adding a new shape

### Option A: Extract from draw.io (recommended)

The fastest way. No hand-writing YAML or XML.

1. **Open draw.io** and drag the ArchiMate shape you want onto a blank canvas
2. Style it how you want (colors, font, size)
3. Add custom properties via Edit > Edit Data (owner, status, etc.)
4. Save as `reference.drawio`
5. Run the extract command:

```bash
npx architecture-blocks extract reference.drawio --output shapes/
#   extracted application-component → application/application-component.yaml
```

6. Review the generated YAML file
7. Commit, create PR, get review, merge

**Bulk extraction**: drop as many shapes as you want on the canvas. The extract command processes all of them in one go.

### Option B: Write YAML manually

Create a file like `shapes/application/my-new-shape.yaml`:

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

Run `npm run validate` to check it against the schema.

## Updating a reference file

When you use the same `reference.drawio` over time:

| Action | What happens |
|--------|-------------|
| **Add new shapes** to canvas, re-run extract | New shapes extracted, existing ones skipped |
| **Update existing shapes** on canvas, re-run extract | Skipped by default. Use `--force` to overwrite |
| **Remove shapes** from canvas, re-run extract | YAML files stay (not auto-deleted for safety). Remove manually if needed |

```bash
# First time: extracts everything
npx architecture-blocks extract reference.drawio

# Later: added 3 new shapes to reference.drawio
npx architecture-blocks extract reference.drawio
#   skip application-component (exists, use --force to overwrite)
#   extracted new-shape-1 → ...
#   extracted new-shape-2 → ...
#   extracted new-shape-3 → ...

# Force overwrite all (after updating styles):
npx architecture-blocks extract reference.drawio --force
```

## Updating visual styles

To change colors, fonts, or dimensions:

1. Edit the YAML file(s) directly — e.g., change `fillColor` from `#99ffff` to `#A0E8E8`
2. Or update shapes in `reference.drawio` and re-extract with `--force`
3. Run the build to regenerate library XML:

```bash
npm run validate   # Check YAML is valid
npm run build      # Regenerate libraries/*.xml
npm test           # Verify round-trip integrity
```

## Adding shape properties

Properties give shapes context. Define them in the YAML:

```yaml
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
    options:
      - active
      - deprecated
      - planned
      - retiring
    description: Current lifecycle status
```

Property types:
- **string** — free text
- **enum** — dropdown with predefined options
- **boolean** — true/false
- **number** — numeric value

Properties appear in draw.io's Edit > Edit Data dialog when someone uses the shape.

## Deprecating a shape

Don't delete shapes — deprecate them first:

```yaml
blockId: old-shape
deprecated: true
deprecatedSince: "0.3.0"
replacedBy: new-shape
```

The CLI will warn consumers during check/upgrade. After 2 minor versions, the shape can be removed in a major release. See [Breaking Change Policy](../reference/breaking-changes.html).

## The build pipeline

```
shapes/*.yaml  →  npm run validate  →  npm run build  →  libraries/*.xml
                  (schema check)       (tsup + generate)  (draw.io libraries)
```

### What `npm run build` does:
1. **tsup** bundles TypeScript → `dist/` (CLI + library)
2. **generate-library.ts** reads all YAML → generates `libraries/*.xml`

### What `npm run validate` does:
- Reads every YAML file in `shapes/`
- Validates against `schemas/shape.schema.json`
- Fails with clear error if any file is invalid

### What `npm test` does (415 tests):
- **Parser tests** — XML parsing, multi-page, compressed content
- **Matcher tests** — shape matching by data-block-id
- **Differ tests** — style comparison
- **Upgrader tests** — style updates, position preservation, backup
- **CLI tests** — all commands, exit codes
- **Round-trip tests** — generate XML → parse back → verify all 60 shapes
- **Coverage tests** — ArchiMate 3.2 completeness (60/60)

## Releasing

1. Commit your changes, create PR, get review
2. Merge to master → CI runs automatically
3. Create a GitHub Release with a semver tag (e.g., `v0.2.0`)
4. GitHub Actions publishes to npm (with provenance) and GitHub Packages

See [Versioning Strategy](../reference/versioning.html) for when to bump major/minor/patch.
