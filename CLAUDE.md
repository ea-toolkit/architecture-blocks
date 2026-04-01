# Architecture Blocks — Draw.io Shape Library Package

## What This Is

An npm package (`@ea-toolkit/architecture-blocks`) that distributes a versioned draw.io shape library for ArchiMate architecture blocks. Includes a CLI to extract shape definitions from draw.io, upgrade existing diagrams when the library changes, and check for stale shapes in CI.

Think: versioned, YAML-driven shape library with `npx architecture-blocks upgrade` to keep all your .drawio files in sync, and `npx architecture-blocks extract` to capture new shapes directly from draw.io.

## Architecture

```
architecture-blocks/
├── CLAUDE.md
├── REQUIREMENTS.md
├── README.md
├── SECURITY.md
├── LICENSE
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── tsup.config.ts
├── schemas/
│   └── shape.schema.json         # JSON Schema for YAML shape files
├── shapes/                        # YAML shape definitions (source of truth)
│   ├── application/               # One YAML file per shape, organized by layer
│   │   ├── application-component.yaml
│   │   ├── application-service.yaml
│   │   └── ...
│   ├── business/
│   ├── technology/
│   ├── strategy/
│   ├── motivation/
│   ├── implementation/
│   ├── physical/
│   └── composite/
├── src/
│   ├── index.ts                   # Package exports (shapes, generator, version)
│   ├── cli.ts                     # CLI entry point (7 commands)
│   ├── commands/
│   │   ├── upgrade.ts             # Upgrade shape styles in .drawio files
│   │   ├── check.ts               # Report stale shapes (CI-ready, exit code 1)
│   │   ├── extract.ts             # Extract shapes from .drawio → YAML
│   │   ├── version.ts             # Show version and shape count
│   │   ├── rollback.ts            # Restore .drawio from .bak backup
│   │   ├── diff-versions.ts       # Show changes between library versions
│   │   └── format.ts              # Terminal output formatting
│   ├── lib/
│   │   ├── parser.ts              # Draw.io XML parser (multi-page, compressed)
│   │   ├── matcher.ts             # Match shapes by data-block-id
│   │   ├── differ.ts              # Diff visual styles (current vs library)
│   │   ├── upgrader.ts            # Apply style updates (preserves layout)
│   │   ├── backup.ts              # .drawio.bak create/restore
│   │   ├── validator.ts           # XML validation before/after modification
│   │   ├── scanner.ts             # Recursive .drawio finder + monorepo support
│   │   └── config.ts              # Consumer config (.architecture-blocksrc.json)
│   └── library/
│       ├── shapes.ts              # YAML loader → ShapeDefinition[]
│       ├── generator.ts           # Generate library XML from shapes
│       └── versions.ts            # Version history and migration map
├── dist/                          # Built output (CLI + library)
├── libraries/                     # Generated .xml library files
├── plugin/                        # draw.io plugin for auto-import
├── scripts/
│   ├── generate-library.ts        # Build step: YAML → library XML
│   └── validate-shapes.ts         # Build step: validate YAML against schema
├── test/
│   ├── fixtures/                  # Sample .drawio files
│   ├── parser.test.ts
│   ├── matcher.test.ts
│   ├── differ.test.ts
│   ├── upgrader.test.ts
│   ├── cli.test.ts
│   ├── roundtrip.test.ts          # 361 tests: generate → parse → verify
│   └── coverage.test.ts           # ArchiMate 3.2 completeness (60/60)
├── docs/
│   ├── enterprise-guide.md
│   ├── archimate-coverage.md
│   ├── VERSIONING.md
│   └── BREAKING_CHANGES.md
└── .github/
    ├── workflows/
    │   ├── ci.yml                 # Test/lint/build on PR (Node 18+20)
    │   ├── publish.yml            # npm publish with provenance on release
    │   └── publish-gpr.yml        # GitHub Packages publish on release
    ├── dependabot.yml
    ├── CODEOWNERS
    ├── pull_request_template.md
    └── ISSUE_TEMPLATE/
        ├── shape-request.yml
        ├── bug-report.yml
        └── style-change.yml
```

## Tech Stack

- **Language:** TypeScript (strict mode)
- **Build:** tsup (bundles CLI + library)
- **Testing:** vitest (415 tests)
- **Package manager:** npm
- **XML parsing:** fast-xml-parser
- **YAML:** yaml (shape definitions)
- **CLI:** commander.js
- **CI/CD:** GitHub Actions
- **No runtime dependencies on draw.io** — operates purely on XML files

## Key Concepts

### Shape Identity
Every shape has a `data-block-id` attribute (e.g., "application-component") and a `data-library-version` attribute embedded in the draw.io style string. These survive drag-and-drop onto a canvas and persist in the diagram XML — they're the join keys that make upgrades possible.

### YAML as Source of Truth
Shapes are defined in individual YAML files under `shapes/<layer>/`. Each YAML file specifies the archimate stencil, visual properties, dimensions, and optional custom properties. The build reads YAML and generates draw.io library XML.

### Shape Properties (Context)
Shapes can define custom properties (key-value metadata) that appear in draw.io's Edit Data dialog. Properties like `owner`, `status`, `criticality` give shapes context beyond visual appearance. Properties are embedded as `<object>` attributes in the generated XML.

### Upgrade Logic
The CLI finds .drawio files, parses XML, matches shapes by `data-block-id`, compares current style against the YAML definition, and updates only visual properties (colors, stroke, font). Never touches positions, connections, labels, or grouping.

### Safety
- Backups created before writing (.drawio.bak)
- XML validated before and after modification
- Malformed output → abort and restore backup
- Exit codes: 0 = success, 1 = stale shapes found, 2 = error

## CLI Commands

| Command | Purpose |
|---------|---------|
| `upgrade [path]` | Update shape styles to match current library |
| `check [path]` | Report stale shapes without modifying (CI-ready) |
| `extract <file>` | Extract shapes from .drawio to YAML definitions |
| `version` | Show installed version and shape count |
| `versions` | List all library version history |
| `diff-versions <from> <to>` | Show changes between two versions |
| `rollback <file>` | Restore .drawio from .bak backup |

## ArchiMate Layer Colors

| Layer | Fill | Stroke |
|-------|------|--------|
| Application | #99ffff | #00cccc |
| Business | #ffff99 | #cccc00 |
| Technology | #99ff99 | #00cc00 |
| Strategy | #F5DEAA | #c4a050 |
| Motivation | #CCCCFF | #9999cc |
| Implementation | #FFE0E0 | #cc9999 |
| Physical | #99ff99 | #00cc00 |
| Composite | #E0E0E0 | #999999 |

## Git Strategy

- Small, focused commits with conventional prefixes
- Never commit to main — feature branches with PRs
- Personal git config: rajnavakoti / rajnavakoti@gmail.com
