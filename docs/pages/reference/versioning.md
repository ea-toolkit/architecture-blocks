---
layout: default
title: Versioning & Upgrades
---

# Versioning & Upgrades

How versions work, when to upgrade, and how to roll back.

## Semantic versioning

| Bump | When | Examples |
|------|------|---------|
| **Major** (1.0.0) | Shape removed, blockId renamed, breaking CLI change | Removing `old-shape`, renaming `app-comp` → `application-component` |
| **Minor** (0.2.0) | New shapes added, new CLI commands, new YAML fields | Adding strategy shapes, `extract` command |
| **Patch** (0.1.1) | Style updates, bug fixes, docs | Color change, parser fix |

## Consumer upgrade workflow

### 1. Check what changed

```bash
npx architecture-blocks diff-versions 0.1.0 0.2.0
```

### 2. Preview the upgrade

```bash
npx architecture-blocks upgrade --dry-run
# [dry-run] Shows what would change without modifying files
```

### 3. Upgrade

```bash
npx architecture-blocks upgrade
# Backups created automatically (.drawio.bak)
```

### 4. Verify

Open the affected `.drawio` files in draw.io. Visual styles should be updated, everything else untouched.

### 5. Roll back if needed

```bash
# Per file
npx architecture-blocks rollback path/to/diagram.drawio

# Or revert to old package version
npm install @ea-toolkit/architecture-blocks@0.1.0
```

## Per-diagram upgrade

You don't have to upgrade everything at once:

```bash
# Upgrade one file
npx architecture-blocks upgrade path/to/critical-diagram.drawio

# Upgrade one directory
npx architecture-blocks upgrade src/diagrams/

# Check one file
npx architecture-blocks check path/to/diagram.drawio
```

## Version pinning

Each project pins its own version in `package.json`. Teams upgrade on their own schedule.

```json
{
  "dependencies": {
    "@ea-toolkit/architecture-blocks": "0.1.0"
  }
}
```

Use exact versions (no `^` or `~`) if you want full control over when upgrades happen.

## Checking current version across diagrams

Each shape in a diagram carries `data-library-version=0.1.0` in its style. The `check` command reports which shapes are on which version:

```bash
npx architecture-blocks check --verbose
# diagram.drawio (Page-1)
#   stale application-component: fillColor: #80e0e0 → #99ffff
```

## Automated upgrades in CI

See the [Enterprise Guide](../guides/enterprise.html) for patterns like:
- Scheduled Monday morning upgrade PRs
- PR comments when stale shapes are detected
- Blocking CI when shapes don't match
