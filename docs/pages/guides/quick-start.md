---
title: Quick Start
layout: default
parent: Guides
nav_order: 2
---

# Quick Start
{: .no_toc }

Get from zero to managed architecture diagrams in 5 minutes.
{: .fs-6 .fw-300 }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Step 1: Install

```bash
npm install @ea-toolkit/architecture-blocks
```

## Step 2: Import into draw.io

1. Open draw.io
2. **File > Open Library from > Device**
3. Select `node_modules/@ea-toolkit/architecture-blocks/libraries/architecture-blocks.xml`

You'll see 60 ArchiMate shapes in the sidebar, organized by layer.

## Step 3: Create a diagram

Drag shapes from the library onto your canvas. Each shape automatically carries:

- **`data-block-id`** — e.g., `application-component` (the upgrade key)
- **`data-library-version`** — e.g., `0.1.0` (tracks which version created it)
- **Custom properties** — accessible via **Edit > Edit Data** (owner, status, criticality, etc.)

Draw connections, add labels, position things however you like. Save as `my-architecture.drawio`.

## Step 4: Check your diagram

```bash
npx architecture-blocks check .
# All 5 blocks up to date across 1 files
```

All shapes match the library. Exit code 0.

## Step 5: Simulate a library update

After updating the package to a new version with changed styles:

```bash
npx architecture-blocks check .
# 5 blocks found, 3 stale across 1 of 1 files
```

Three shapes have outdated styles. Preview, then fix:

```bash
# Preview what would change
npx architecture-blocks upgrade --dry-run
# [dry-run] my-architecture.drawio (Page-1)
#   would update application-component: fillColor, strokeColor

# Apply the upgrade
npx architecture-blocks upgrade .
# 3 upgraded across 1 of 1 files
```

Open the file in draw.io — positions, connections, and labels are exactly where you left them. Only visual styles (colors, font) were updated.

## Step 6: Add to CI

```yaml
# .github/workflows/check-diagrams.yml
- name: Check diagram styles
  run: npx architecture-blocks check
```

PRs that introduce stale shapes will now fail CI.

## What just happened?

```
Installed a versioned shape library
  → Imported into draw.io (shapes carry data-block-id)
    → Created diagrams using managed shapes
      → CLI can match, diff, and upgrade shapes
        → CI catches drift before it reaches master
```
