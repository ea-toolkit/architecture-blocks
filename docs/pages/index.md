---
title: Home
layout: default
nav_order: 1
---

# Architecture Blocks
{: .fs-9 }

Versioned draw.io shape library for ArchiMate architecture diagrams — with a CLI to extract, upgrade, check, and manage shapes across all your `.drawio` files.
{: .fs-6 .fw-300 }

[Get Started](guides/installation){: .btn .btn-primary .fs-5 .mb-4 .mb-md-0 .mr-2 }
[View on GitHub](https://github.com/ea-toolkit/architecture-blocks){: .btn .fs-5 .mb-4 .mb-md-0 }

---

## What is this?

Architecture Blocks is an npm package that solves a specific problem: **keeping ArchiMate diagrams consistent across teams**.

It gives you:
- **60 shapes** covering 100% of ArchiMate 3.2 element types
- **YAML definitions** as the single source of truth for each shape
- **Custom properties** (owner, status, criticality) that give shapes context beyond visuals
- **A CLI** that scans `.drawio` files and upgrades visual styles to match the library
- **CI integration** with exit codes — block PRs that introduce stale diagrams

## How it works in 30 seconds

```bash
# Install
npm install @ea-toolkit/architecture-blocks

# Import library into draw.io, drag shapes onto canvas, save

# Check if shapes are up to date
npx architecture-blocks check
# 5 blocks found, 1 stale across 1 of 3 files (exit code: 1)

# Upgrade styles — preserves positions, connections, labels
npx architecture-blocks upgrade
# 1 upgraded across 1 of 3 files

# Extract shapes from draw.io to YAML (no hand-writing!)
npx architecture-blocks extract reference.drawio
# 20 shapes extracted
```

## Why not just use draw.io's built-in shapes?

| Problem | With plain draw.io | With Architecture Blocks |
|---------|-------------------|------------------------|
| Style consistency | Everyone picks their own colors | Single YAML definition per shape |
| Version control | Copy shapes between files | `data-block-id` tracks every shape |
| Updates | Manually fix every diagram | `upgrade` command handles it |
| CI checks | Not possible | `check` exits 1 on stale shapes |
| Shape context | Just a colored box | Properties: owner, status, criticality |
| Onboarding | "Ask Sarah for the shapes" | `npm install` + import library |
