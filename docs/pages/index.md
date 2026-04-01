---
layout: default
title: Home
---

# Architecture Blocks

Versioned draw.io shape library for ArchiMate architecture diagrams — with a CLI to extract, upgrade, check, and manage shapes across all your `.drawio` files.

**60 shapes** covering all 8 ArchiMate 3.2 layers. **YAML-driven** definitions with custom properties. **CI-ready** with exit codes for pipeline integration.

---

## What problem does this solve?

Architecture teams create diagrams in draw.io using ArchiMate shapes. Over time, problems emerge:

- **Style drift** — different people use different colors, fonts, and sizes for the same shape type
- **No version control** — when the team agrees on a new color scheme, someone has to manually update every diagram
- **No governance** — anyone can change a shape's appearance, and there's no review process
- **No context** — shapes are just visual boxes with no metadata (who owns this? what's the status?)
- **Painful onboarding** — new architects have to find the right shapes, learn the conventions, and hope they match everyone else

Architecture Blocks solves all of these by making shapes **versioned**, **YAML-defined**, **automatically upgradeable**, and **enriched with context properties**.

---

## How it works in 60 seconds

```
1. Install:          npm install @ea-toolkit/architecture-blocks
2. Import into draw.io: File > Open Library > architecture-blocks.xml
3. Draw:             Drag shapes onto your canvas (they carry version + metadata)
4. Check:            npx architecture-blocks check    (CI: exit 1 if stale)
5. Upgrade:          npx architecture-blocks upgrade   (updates styles, preserves layout)
```

---

## Documentation

### Getting Started
- [Installation](guides/installation.html) — Install the package and import into draw.io
- [Quick Start](guides/quick-start.html) — Create your first managed diagram in 5 minutes
- [For Library Authors](guides/library-authors.html) — How to add, update, and manage shapes

### Core Concepts
- [How It Works](concepts/how-it-works.html) — The data flow from YAML to draw.io and back
- [Shape Identity](concepts/shape-identity.html) — data-block-id, versioning, and the upgrade mechanism
- [Shape Properties](concepts/shape-properties.html) — Custom metadata that gives shapes context
- [YAML Schema](concepts/yaml-schema.html) — The shape definition format explained

### CLI Reference
- [All Commands](reference/cli.html) — Complete CLI reference with examples
- [Exit Codes](reference/exit-codes.html) — What each exit code means

### Enterprise
- [Enterprise Adoption Guide](guides/enterprise.html) — Rollout strategy, CI patterns, governance
- [Custom Extensions](guides/extensions.html) — Add org-specific shapes without forking
- [Versioning & Upgrades](reference/versioning.html) — Semver rules, migration, rollback

### Reference
- [ArchiMate 3.2 Coverage](reference/archimate-coverage.html) — 60/60 element types covered
- [Breaking Change Policy](reference/breaking-changes.html) — How changes are communicated
- [Security](reference/security.html) — Supply chain, provenance, vulnerability reporting

---

## Quick links

- [GitHub Repository](https://github.com/ea-toolkit/architecture-blocks)
- [npm Package](https://www.npmjs.com/package/@ea-toolkit/architecture-blocks)
- [Issue Tracker](https://github.com/ea-toolkit/architecture-blocks/issues)
