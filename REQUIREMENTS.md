# Context Blocks Draw.io — Requirements

## Vision

An npm package that distributes a versioned draw.io shape library for architecture context blocks and includes a CLI to upgrade existing diagrams when the library changes. Install once, `npx context-blocks upgrade` to keep all your diagrams in sync.

---

## Milestone 1: Project Foundation (Issues 1-4)

### 1. Project setup
- Initialize npm package with TypeScript
- Configure tsup for CLI + library build
- Configure vitest for testing
- Set up package.json with name `@ea-toolkit/context-blocks-drawio`, bin entry for CLI
- .gitignore, tsconfig.json, vitest.config.ts

### 2. Shape definitions
- `src/library/shapes.ts` — define all ArchiMate context block shapes
- Each shape has: blockId (stable identifier), name, layer, style string, fill color, dimensions
- Cover all layers: application, business, technology, strategy, motivation, implementation, physical, composite
- Include ArchiMate type attributes (appType, busType, techType, etc.)

### 3. Library XML generator
- `src/library/generator.ts` — generate draw.io library XML from shape definitions
- Each shape gets `data-block-id` and `data-library-version` attributes embedded in the XML
- Output: valid .xml file importable by draw.io as custom shape library
- Version stamped from package.json

### 4. Library distribution
- `scripts/postinstall.ts` — copies generated library to configurable location (default: ./drawio-libraries/)
- `src/index.ts` — exports library path and version for programmatic use
- Generate library XML during build step

---

## Milestone 2: XML Parsing & Matching (Issues 5-8)

### 5. Draw.io XML parser
- `src/lib/parser.ts` — parse .drawio files (XML, optionally multi-page)
- Extract all mxCell and object elements with their styles, attributes, geometry
- Handle both compressed (base64+deflate) and uncompressed diagram content
- Return structured representation: pages > cells (vertices + edges)

### 6. Shape matcher
- `src/lib/matcher.ts` — match diagram shapes to library definitions
- Match by `data-block-id` attribute on cells
- Return: matched shapes with current version, library version, and whether upgrade needed
- Handle shapes that have no data-block-id (skip gracefully)

### 7. Style differ
- `src/lib/differ.ts` — compare current shape style against library definition
- Parse style strings into key-value pairs
- Identify changed properties (fillColor, strokeColor, strokeWidth, fontColor, fontSize, etc.)
- Only flag visual style changes — ignore position, size, label content

### 8. Parser + matcher tests
- `test/fixtures/` — create sample .drawio files with known shapes
- `test/parser.test.ts` — test XML parsing, multi-page handling, compressed content
- `test/matcher.test.ts` — test shape matching by data-block-id
- `test/differ.test.ts` — test style comparison and diff output

---

## Milestone 3: Upgrade Engine (Issues 9-13)

### 9. Upgrader core
- `src/lib/upgrader.ts` — apply style updates to matched shapes
- Update only style properties (colors, stroke, font)
- Update `data-library-version` attribute
- NEVER modify: positions, connections, labels/text, grouping, geometry

### 10. Backup and safety
- `src/lib/backup.ts` — create .drawio.bak before writing
- `src/lib/validator.ts` — validate XML before and after modification
- If output XML is malformed → abort and restore from backup
- Support --no-backup flag

### 11. Upgrader tests
- `test/upgrader.test.ts` — end-to-end upgrade tests
- Test: shape style updated, version bumped
- Test: positions, connections, labels preserved
- Test: multi-page files handled correctly
- Test: files with zero context blocks = no-op
- Test: backup created and restored on failure

### 12. File scanner
- Recursive .drawio file finder for given path
- Default to current directory
- Respect .gitignore patterns (optional)

### 13. Version tracking
- `src/library/versions.ts` — track version history and migration paths
- Map old version styles to new version styles
- Support skipping versions (1.0.0 → 1.3.0 should work)

---

## Milestone 4: CLI (Issues 14-18)

### 14. CLI entry point
- `src/cli.ts` — commander.js based CLI
- Commands: upgrade, check, version
- Global options: --verbose, --dry-run, --no-backup

### 15. Upgrade command
- `npx context-blocks upgrade [path]`
- Find all .drawio files, parse, match, diff, upgrade
- Output: per-file summary of changes
- Dry-run mode: show what would change without modifying

### 16. Check command
- `npx context-blocks check [path]`
- Report stale shapes without modifying
- Exit code 1 if stale shapes found (useful for CI)

### 17. Version command
- `npx context-blocks version`
- Show installed library version

### 18. CLI output formatting
- Clean, readable terminal output (verbose and summary modes)
- Per-file, per-page, per-shape breakdown
- Summary line: "X blocks found, Y need upgrade across Z files"

---

## Milestone 5: Polish & Publish (Issues 19-20)

### 19. README with usage examples
- Installation instructions
- CLI usage with examples
- How to import the library into draw.io
- How the upgrade works
- CI integration example (using check command)

### 20. Package publishing prep
- Clean package.json (files, exports, bin)
- Build produces dist/ with CLI + library
- Verify npx context-blocks works from a clean install
- Add LICENSE (MIT)

---

## Success Criteria

### Milestone 1
- Shape definitions cover all ArchiMate layers
- Generated XML imports correctly in draw.io
- Shapes have data-block-id and data-library-version embedded

### Milestone 2
- Parser handles both compressed and uncompressed .drawio files
- Matcher correctly identifies shapes by data-block-id
- Differ correctly identifies style changes only

### Milestone 3
- Upgrade updates styles without touching positions/connections/labels
- Backup created before every write
- Malformed output triggers abort + restore

### Milestone 4
- All three CLI commands work via npx
- Dry-run shows accurate preview
- Check exits with code 1 on stale shapes

### Milestone 5
- Package installs cleanly from npm
- README is clear and complete
