# Context Blocks — Draw.io Shape Library Package

## What This Is

An npm package (`@ea-toolkit/context-blocks-drawio`) that distributes a custom draw.io shape library for architecture diagrams (ArchiMate context blocks) and includes a CLI tool to upgrade existing diagrams when the library changes.

Think: versioned shape library with a `npx context-blocks upgrade` command that updates styles across all your .drawio files.

## Architecture

```
context-blocks-drawio/
├── CLAUDE.md
├── REQUIREMENTS.md
├── package.json              # npm package config
├── tsconfig.json
├── vitest.config.ts
├── src/
│   ├── index.ts              # Package exports (library path, version)
│   ├── cli.ts                # CLI entry point (upgrade, check, version)
│   ├── lib/
│   │   ├── parser.ts         # Draw.io XML parser (extract cells, shapes, edges)
│   │   ├── matcher.ts        # Match diagram shapes to library definitions via data-block-id
│   │   ├── differ.ts         # Diff shape styles (current vs library)
│   │   ├── upgrader.ts       # Apply style updates to diagram XML
│   │   ├── backup.ts         # File backup/restore (.drawio.bak)
│   │   └── validator.ts      # XML validation (before/after modification)
│   └── library/
│       ├── shapes.ts         # Shape definitions (block-id, style, colors, dimensions)
│       ├── generator.ts      # Generate library XML from shape definitions
│       └── versions.ts       # Version tracking and migration map
├── dist/                     # Built output
├── libraries/                # Generated .xml library files
├── test/
│   ├── fixtures/             # Sample .drawio files for testing
│   ├── parser.test.ts
│   ├── matcher.test.ts
│   ├── differ.test.ts
│   ├── upgrader.test.ts
│   └── cli.test.ts
└── scripts/
    └── postinstall.ts        # Copy library to configurable location
```

## Tech Stack

- **Language:** TypeScript (strict mode)
- **Build:** tsup (bundles CLI + library)
- **Testing:** vitest
- **Package manager:** npm
- **XML parsing:** fast-xml-parser (lightweight, no native dependencies)
- **CLI:** commander.js
- **No runtime dependencies on draw.io** — operates purely on XML files

## Key Concepts

### Shape Identity
Every shape has a `data-block-id` attribute (e.g., "bounded-context", "aggregate", "domain-event") and a `data-library-version` attribute. These are the join keys that make upgrades possible — they survive drag-and-drop onto a canvas and persist in the diagram XML.

### Upgrade Logic
The CLI finds all .drawio files, parses the XML, matches shapes by `data-block-id`, compares current style against library definition, and updates only visual properties (colors, stroke, font). Never touches positions, connections, labels, or grouping.

### Safety
- Backups created before writing (.drawio.bak)
- XML validated before and after modification
- Malformed output → abort and restore backup
- Exit codes: 0 = success, 1 = stale shapes found, 2 = error

## ArchiMate Layer Colors

From architecture-catalog convention:
- Application: #99ffff
- Business: #ffff99
- Technology: #99ff99
- Strategy: #F5DEAA
- Motivation: #CCCCFF
- Implementation: #FFE0E0
- Physical: #99ff99
- Composite: #E0E0E0

## Git Strategy

- Small, focused commits with conventional prefixes
- Never commit to main — feature branches with PRs
- Personal git config: rajnavakoti / rajnavakoti@gmail.com

## Reference

- Existing Python scripts in media-manager/demo/ for XML generation patterns
- Draw.io XML format: shapes use mxGraphModel > root > mxCell with style attributes
- ArchiMate 3 stencils: `shape=mxgraph.archimate3.*` with layer-specific type attributes
