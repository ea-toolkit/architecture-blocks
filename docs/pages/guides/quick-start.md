---
layout: default
title: Quick Start
---

# Quick Start

Get from zero to managed architecture diagrams in 5 minutes.

## Step 1: Install

```bash
npm install @ea-toolkit/architecture-blocks
```

## Step 2: Import into draw.io

1. Open draw.io
2. File > Open Library from > Device
3. Select `node_modules/@ea-toolkit/architecture-blocks/libraries/architecture-blocks.xml`

You'll see 60 ArchiMate shapes in the sidebar, organized by layer.

## Step 3: Create a diagram

Drag shapes from the library onto your canvas. Each shape automatically carries:
- **data-block-id** — e.g., `application-component` (the upgrade key)
- **data-library-version** — e.g., `0.1.0` (tracks which version created it)
- **Custom properties** — accessible via Edit > Edit Data (owner, status, criticality, etc.)

Draw your connections, add labels, position things however you like. Save as `my-architecture.drawio`.

## Step 4: Check your diagram

```bash
npx architecture-blocks check .
# 5 blocks found, 0 stale across 1 of 1 files
```

All shapes are up to date. Exit code 0 means everything matches the library.

## Step 5: Simulate a library update

Imagine the library team updates the Application layer colors in the next release. After updating the package:

```bash
npx architecture-blocks check .
# 5 blocks found, 3 stale across 1 of 1 files
# Exit code: 1
```

Three shapes have outdated styles. Fix them:

```bash
npx architecture-blocks upgrade .
# Upgraded 3 shapes in my-architecture.drawio
```

Open the file in draw.io — positions, connections, and labels are exactly where you left them. Only the visual styles (colors, font) changed to match the new library.

## Step 6: Add to CI

```yaml
# .github/workflows/check-diagrams.yml
- name: Check diagram styles
  run: npx architecture-blocks check
```

Now PRs that introduce stale shapes will fail CI.

## What just happened?

```
You installed a versioned shape library
  ↓
Imported it into draw.io (shapes carry data-block-id)
  ↓
Created diagrams using managed shapes
  ↓
CLI can match, diff, and upgrade shapes across all .drawio files
  ↓
CI catches drift before it reaches master
```

## Next steps

- [How It Works](../concepts/how-it-works.html) — understand the full data flow
- [Shape Properties](../concepts/shape-properties.html) — add context metadata to shapes
- [For Library Authors](library-authors.html) — add your own shapes
- [Enterprise Guide](enterprise.html) — roll out across your organization
