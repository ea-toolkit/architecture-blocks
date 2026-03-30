# Architecture Blocks

Versioned draw.io shape library for ArchiMate architecture blocks with a CLI to keep diagrams in sync.

## Install

```bash
npm install @ea-toolkit/architecture-blocks
```

## Usage

### Import the library into draw.io

1. Open draw.io
2. File > Open Library from > Device
3. Select `node_modules/@ea-toolkit/architecture-blocks/libraries/architecture-blocks.xml`

Per-layer libraries are also available (e.g., `architecture-blocks-application.xml`, `architecture-blocks-business.xml`).

### Check for stale shapes

```bash
npx architecture-blocks check [path]
```

Reports shapes whose styles don't match the current library version. Exits with code 1 if stale shapes are found — useful for CI.

```bash
npx architecture-blocks check ./diagrams --verbose
# 5 blocks found, 1 stale across 1 of 3 files
```

### Upgrade shapes

```bash
npx architecture-blocks upgrade [path]
```

Updates visual styles (colors, stroke, font) to match the current library. Positions, connections, labels, and grouping are never modified.

```bash
# Preview changes without modifying files
npx architecture-blocks upgrade ./diagrams --dry-run

# Upgrade without creating .bak files
npx architecture-blocks upgrade ./diagrams --no-backup

# Show per-shape details
npx architecture-blocks upgrade ./diagrams --verbose
```

A `.drawio.bak` backup is created before each file is modified. If the output XML is malformed, the backup is restored automatically.

### Show version info

```bash
npx architecture-blocks version
# architecture-blocks v0.1.0
#   Shapes: 60
#   Library: /path/to/libraries
```

## How it works

Every shape in the library has a `data-block-id` attribute (e.g., `application-component`, `business-actor`) and a `data-library-version` attribute. These persist when shapes are dragged onto a canvas and saved in the diagram XML.

The CLI parses `.drawio` files, matches shapes by `data-block-id`, compares their current styles against the library definition, and updates only visual properties.

## ArchiMate layers

| Layer | Fill | Shapes |
|-------|------|--------|
| Application | `#99ffff` | Component, Interface, Function, Process, Event, Service, Collaboration, Data Object |
| Business | `#ffff99` | Actor, Role, Collaboration, Interface, Process, Function, Event, Service, Object, Contract, Representation, Product |
| Technology | `#99ff99` | Node, Device, System Software, Interface, Process, Function, Event, Service, Collaboration, Artifact, Communication Network, Path |
| Strategy | `#F5DEAA` | Resource, Capability, Value Stream, Course of Action |
| Motivation | `#CCCCFF` | Stakeholder, Driver, Assessment, Goal, Outcome, Principle, Requirement, Constraint, Meaning, Value |
| Implementation | `#FFE0E0` | Work Package, Deliverable, Event, Plateau, Gap |
| Physical | `#99ff99` | Equipment, Facility, Distribution Network, Material |
| Composite | `#E0E0E0` | Grouping, Location |

## Programmatic API

```typescript
import { SHAPES, SHAPES_BY_ID, generateLibraryXml, VERSION, LIBRARY_PATH } from "@ea-toolkit/architecture-blocks";
```

## CI integration

Add to your CI pipeline to catch stale diagrams:

```yaml
- name: Check diagram styles
  run: npx architecture-blocks check ./diagrams
```

The check command exits with code 1 if any shapes need upgrading, failing the pipeline.

## Exit codes

| Code | Meaning |
|------|---------|
| 0 | Success / all shapes up to date |
| 1 | Stale shapes found (check command) |
| 2 | Error (parse failure, write failure) |

## License

MIT
