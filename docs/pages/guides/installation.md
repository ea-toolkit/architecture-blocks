---
title: Installation
layout: default
parent: Guides
nav_order: 1
---

# Installation
{: .no_toc }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Requirements

- Node.js 18 or later
- npm (comes with Node.js)
- draw.io desktop or online (app.diagrams.net)

## Install the package

```bash
npm install @ea-toolkit/architecture-blocks
```

Or as a dev dependency (if you only need it for CI checks):

```bash
npm install --save-dev @ea-toolkit/architecture-blocks
```

## Import the shape library into draw.io

### Full library (all 60 shapes)

1. Open draw.io
2. **File > Open Library from > Device**
3. Navigate to `node_modules/@ea-toolkit/architecture-blocks/libraries/`
4. Select **`architecture-blocks.xml`**

The shapes appear in the sidebar panel, ready to drag onto your canvas.

### Per-layer libraries

If you only work with specific ArchiMate layers, import just what you need:

| File | Shapes |
|:-----|:-------|
| `architecture-blocks-application.xml` | 9 application shapes |
| `architecture-blocks-business.xml` | 13 business shapes |
| `architecture-blocks-technology.xml` | 13 technology shapes |
| `architecture-blocks-strategy.xml` | 4 strategy shapes |
| `architecture-blocks-motivation.xml` | 10 motivation shapes |
| `architecture-blocks-implementation.xml` | 5 implementation shapes |
| `architecture-blocks-physical.xml` | 4 physical shapes |
| `architecture-blocks-composite.xml` | 2 composite shapes |

### draw.io plugin (auto-import)

For teams who want the library loaded automatically:

1. Copy `plugin/architecture-blocks-plugin.js` to a shared location
2. In draw.io: **Extras > Plugins > Add** > select the file
3. Restart draw.io

## Verify installation

```bash
npx architecture-blocks version
# architecture-blocks v0.1.0
#   Shapes: 60
#   Library: /path/to/libraries
```

## What's in the package?

```
@ea-toolkit/architecture-blocks/
├── dist/           # CLI + library JavaScript
├── libraries/      # Generated draw.io XML files (importable)
├── shapes/         # YAML source definitions
└── schemas/        # JSON Schema for shape YAML validation
```
