---
layout: default
title: CLI Reference
---

# CLI Reference

Complete reference for all `architecture-blocks` CLI commands.

## Global

```bash
npx architecture-blocks --help
npx architecture-blocks --version    # npm package version
```

---

## upgrade

Update shape styles in `.drawio` files to match the current library.

```bash
npx architecture-blocks upgrade [path] [options]
```

**Arguments:**
- `path` — directory or file to upgrade (default: current directory)

**Options:**
- `--dry-run` — show what would change without modifying files
- `--no-backup` — skip creating `.drawio.bak` backup files
- `-v, --verbose` — show per-shape detail

**What it does:**
1. Scans for `.drawio` files recursively
2. Parses each file, finds shapes with `data-block-id`
3. Compares current style against library YAML definitions
4. Updates only visual style properties (fillColor, strokeColor, fontColor, fontSize, etc.)
5. Updates `data-library-version` to current version

**What it NEVER modifies:**
- Positions (x, y coordinates)
- Connections (edges, arrows)
- Labels (text content)
- Grouping (parent-child relationships)
- Custom property values (owner, status, etc.)
- Dimensions (width, height as placed on canvas)

**Examples:**
```bash
# Preview changes
npx architecture-blocks upgrade ./diagrams --dry-run
# [dry-run] diagrams/arch.drawio (Page-1)
#   would update application-component: fillColor, strokeColor

# Upgrade all diagrams
npx architecture-blocks upgrade ./diagrams
# 5 blocks found, 3 upgraded across 2 of 4 files

# Upgrade a single file
npx architecture-blocks upgrade path/to/diagram.drawio

# Upgrade without backups
npx architecture-blocks upgrade --no-backup
```

---

## check

Report stale shapes without modifying files. Designed for CI pipelines.

```bash
npx architecture-blocks check [path] [options]
```

**Arguments:**
- `path` — directory or file to check (default: current directory)

**Options:**
- `-v, --verbose` — show per-shape detail with property diffs

**Exit codes:**
- `0` — all shapes up to date
- `1` — stale shapes found

**Examples:**
```bash
# Check all diagrams
npx architecture-blocks check
# All 5 blocks up to date across 3 files

# Check with detail
npx architecture-blocks check --verbose
# stale-file.drawio (Page-1)
#   stale application-component: fillColor: #80e0e0 → #99ffff

# CI usage
npx architecture-blocks check || echo "Stale shapes found!"
```

---

## extract

Extract shape definitions from a `.drawio` file to YAML.

```bash
npx architecture-blocks extract <file> [options]
```

**Arguments:**
- `file` — path to `.drawio` file (required)

**Options:**
- `-o, --output <dir>` — output directory for YAML files (default: `shapes`)
- `--force` — overwrite existing YAML files

**What it captures:**
- ArchiMate stencil type and layer
- Visual styles (colors, font, dimensions)
- Custom properties from `<object>` elements (Edit Data attributes)

**Examples:**
```bash
# Extract from reference diagram
npx architecture-blocks extract reference.drawio
#   extracted application-component → application/application-component.yaml
#   extracted business-actor → business/business-actor.yaml
# 2 shapes extracted, 0 skipped.

# Extract to custom directory
npx architecture-blocks extract reference.drawio --output my-shapes/

# Overwrite existing definitions
npx architecture-blocks extract reference.drawio --force

# Bulk: drop 20 shapes on one canvas, extract all at once
npx architecture-blocks extract all-shapes.drawio
# 20 shapes extracted, 0 skipped.
```

---

## version

Show installed library version and shape count.

```bash
npx architecture-blocks version
# architecture-blocks v0.1.0
#   Shapes: 60
#   Library: /path/to/libraries
```

---

## versions

List all available library versions with their changes.

```bash
npx architecture-blocks versions
# 0.1.0 (current) — 2026-03-30
#   - Initial shape library with all ArchiMate layers
```

---

## diff-versions

Show changes between two library versions.

```bash
npx architecture-blocks diff-versions <from> <to>
```

**Examples:**
```bash
npx architecture-blocks diff-versions 0.1.0 0.2.0
# # Migration Guide: 0.1.0 → 0.2.0
# ## 0.2.0 (2026-04-15)
# - Updated Application layer colors
# - Added 3 new strategy shapes
```

---

## rollback

Restore a `.drawio` file from its `.bak` backup.

```bash
npx architecture-blocks rollback <file>
```

Backup files are created automatically during `upgrade` (unless `--no-backup` is used). The rollback command copies the `.drawio.bak` back to the original file.

**Examples:**
```bash
npx architecture-blocks rollback path/to/diagram.drawio
# Restored path/to/diagram.drawio from backup.
```
