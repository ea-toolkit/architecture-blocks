# Architecture Blocks

Versioned draw.io shape library for ArchiMate architecture blocks — with a CLI to extract, upgrade, check, and manage shapes across your diagrams.

**60 shapes** covering all 8 ArchiMate 3.2 layers. **YAML-driven** definitions with custom properties. **CI-ready** with exit codes for pipeline integration.

[Full Documentation](https://ea-toolkit.github.io/architecture-blocks/) | [ArchiMate Coverage](docs/archimate-coverage.md) | [Enterprise Guide](docs/enterprise-guide.md)

## Install

```bash
npm install @ea-toolkit/architecture-blocks
```

## Quick Start

### 1. Import the library into draw.io

Open draw.io, then File > Open Library from > Device and select:
```
node_modules/@ea-toolkit/architecture-blocks/libraries/architecture-blocks.xml
```

Per-layer libraries are also available (e.g., `architecture-blocks-application.xml`).

### 2. Use shapes in your diagrams

Drag shapes from the library onto your canvas. Each shape comes with:
- `data-block-id` — unique identifier for upgrade matching
- `data-library-version` — tracks which library version created it
- Custom properties (owner, status, criticality, etc.) — accessible via Edit > Edit Data

### 3. Check for stale shapes

```bash
npx architecture-blocks check [path]
# 5 blocks found, 1 stale across 1 of 3 files
# Exit code 1 if stale (for CI)
```

### 4. Upgrade shapes

```bash
npx architecture-blocks upgrade [path]
# Updates visual styles only. Never touches positions, connections, or labels.
```

## CLI Commands

| Command | Description |
|---------|-------------|
| `upgrade [path]` | Update shape styles to match current library |
| `check [path]` | Report stale shapes without modifying (exit 1 = stale) |
| `extract <file>` | Extract shapes from a .drawio file to YAML definitions |
| `version` | Show installed library version and shape count |
| `versions` | List all library version history |
| `diff-versions <from> <to>` | Show changes between two versions |
| `rollback <file>` | Restore a .drawio file from its .bak backup |

### Upgrade options

```bash
npx architecture-blocks upgrade ./diagrams --dry-run    # Preview without modifying
npx architecture-blocks upgrade ./diagrams --no-backup  # Skip .bak creation
npx architecture-blocks upgrade ./diagrams --verbose    # Per-shape detail
```

### Extract shapes from draw.io

No need to hand-write YAML. Drop shapes on a draw.io canvas and extract:

```bash
npx architecture-blocks extract reference.drawio --output shapes/
#   extracted application-component -> application/application-component.yaml
#   extracted business-actor -> business/business-actor.yaml
#   ...
# 20 shapes extracted, 0 skipped.
```

Bulk extraction: drop as many shapes as you want on one canvas, extract all at once.

## How It Works

```
YAML shape files (shapes/*.yaml)
        |
        v
  Build (npm run build)
        |
        v
Library XML (libraries/*.xml)  -->  draw.io imports this
        |
        v
  Shapes on diagrams have data-block-id + data-library-version
        |
        v
  CLI matches shapes by data-block-id, diffs styles, upgrades
```

Every shape in the library carries a `data-block-id` in its style string. When you drag a shape onto your canvas and save, that ID persists in the `.drawio` XML. The CLI uses this ID to:
- **Match** diagram shapes to library definitions
- **Diff** current styles against the YAML source of truth
- **Upgrade** only visual properties (colors, stroke, font)
- **Never touch** positions, connections, labels, or grouping

## Shape Properties

Shapes can define custom properties that appear in draw.io's Edit Data dialog:

```yaml
# shapes/application/application-component.yaml
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
  - key: criticality
    label: Criticality
    type: enum
    default: medium
    options: [low, medium, high, critical]
```

Properties give shapes **context** — they're not just visual elements, they carry metadata about ownership, lifecycle, criticality, automation level, etc.

## ArchiMate 3.2 Coverage

60 of 60 element types covered (100%):

| Layer | Shapes | Fill |
|-------|--------|------|
| Application | 9 | `#99ffff` |
| Business | 13 | `#ffff99` |
| Technology | 13 | `#99ff99` |
| Strategy | 4 | `#F5DEAA` |
| Motivation | 10 | `#CCCCFF` |
| Implementation | 5 | `#FFE0E0` |
| Physical | 4 | `#99ff99` |
| Composite | 2 | `#E0E0E0` |

[Full coverage report](docs/archimate-coverage.md)

## CI Integration

```yaml
- name: Check diagram styles
  run: npx architecture-blocks check ./diagrams
```

Exit code 1 fails the pipeline when shapes are stale. See the [Enterprise Guide](docs/enterprise-guide.md) for advanced patterns (scheduled upgrades, PR comments).

## Custom Extensions

Add org-specific shapes without forking:

```json
// .architecture-blocksrc.json
{
  "extensions": ["./custom-shapes"]
}
```

Extension shapes follow the same YAML schema and are included in check/upgrade commands.

## Programmatic API

```typescript
import {
  SHAPES, SHAPES_BY_ID, generateLibraryXml,
  VERSION, LIBRARY_PATH
} from "@ea-toolkit/architecture-blocks";
```

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Success / all shapes up to date |
| 1 | Stale shapes found (check command) |
| 2 | Error (parse failure, write failure) |

## Documentation

- [Full Documentation (GitHub Pages)](https://ea-toolkit.github.io/architecture-blocks/)
- [Enterprise Adoption Guide](docs/enterprise-guide.md)
- [ArchiMate 3.2 Coverage](docs/archimate-coverage.md)
- [Versioning Strategy](docs/VERSIONING.md)
- [Breaking Change Policy](docs/BREAKING_CHANGES.md)
- [Security Policy](SECURITY.md)

## License

MIT
