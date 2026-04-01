---
title: How It Works
layout: default
parent: Concepts
nav_order: 1
---

# How It Works
{: .no_toc }

The complete data flow from YAML definition to upgraded diagram.
{: .fs-6 .fw-300 }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## The big picture

```
LIBRARY TEAM                              CONSUMING TEAM
────────────                              ──────────────

draw.io canvas                            npm install
     │                                         │
     ▼                                         ▼
extract command                           draw.io: import library XML
     │                                         │
     ▼                                         ▼
shapes/*.yaml (source of truth)           drag shapes → create diagrams
     │                                         │
     ▼                                         ▼
validate (JSON schema)                    commit .drawio files
     │
     ▼                                    ... time passes ...
build → libraries/*.xml                   ... library v0.2.0 released ...
     │
     ▼                                         │
GitHub Release                                 ▼
     │                                    npm update / dependabot PR
     ▼                                         │
npm publish + GitHub Packages                  ▼
                                          CI: npx architecture-blocks check
                                               │ (exit code 1 = stale)
                                               ▼
                                          npx architecture-blocks upgrade
                                               │
                                               ▼
                                          commit updated .drawio files ✓
```

## Step by step: what happens during an upgrade

### 1. Scan

The CLI recursively finds all `.drawio` files in the given path. Skips `node_modules/`, `dist/`, and dotfiles. Respects `.gitignore` patterns. Supports monorepos with workspace detection.

### 2. Parse

Each `.drawio` file is XML. The parser handles:
- **Uncompressed XML** — reads directly
- **Compressed content** — base64-decodes, inflates, then parses
- **Multi-page diagrams** — processes each page independently

The parser extracts every `<mxCell>` and `<object>` element with its style string, attributes, and geometry.

### 3. Match

For each shape (vertex), the matcher looks for `data-block-id` in:
1. The cell's custom attributes (if wrapped in `<object>`)
2. The style string (e.g., `data-block-id=application-component`)

If found, it looks up the corresponding YAML definition. If the `data-library-version` doesn't match the current library version, the shape is flagged as needing upgrade.

Shapes without `data-block-id` are silently skipped — they're not managed by this library.

### 4. Diff

The differ compares the shape's current style against the YAML definition. It only checks **visual properties**:

| Checked (visual) | NOT checked (layout) |
|-------------------|---------------------|
| fillColor | x, y position |
| strokeColor | width, height |
| strokeWidth | connections (edges) |
| fontColor | labels / text content |
| fontSize | parent / grouping |
| fontStyle | rotation |
| fontFamily | |

### 5. Upgrade

The upgrader applies style changes by doing a **string replacement** on the raw XML. This is intentional — it guarantees that positions, connections, labels, and every other attribute survives untouched. The XML is not reparsed and re-serialized, which would risk reordering attributes or reformatting whitespace.

It also updates `data-library-version` to the new version.

### 6. Validate and write

Before writing:
1. A `.drawio.bak` backup is created
2. The modified XML is validated (syntax check + `<mxfile>` root check)
3. If validation fails → abort, restore from backup
4. If validation passes → write the file, remove the backup

## Why string replacement instead of DOM manipulation?

draw.io files are XML, but their structure is loose and varies between draw.io versions, platforms, and user actions. Re-serializing after DOM parsing can:
- Reorder XML attributes
- Change whitespace and formatting
- Alter encoding of special characters
- Trigger false positives in git diffs

String replacement on the style attribute is surgical — it changes exactly what needs to change and nothing else. The tradeoff is that it requires the style string to be an exact match, which is why we use `data-block-id` as the lookup key rather than guessing based on visual appearance.

## What about custom properties?

Properties (owner, status, criticality, etc.) are stored as XML attributes on `<object>` elements:

```xml
<object id="2" label="My Component" owner="Team Alpha" status="active" criticality="high">
  <mxCell style="shape=mxgraph.archimate3.application;..." vertex="1" parent="1">
    <mxGeometry width="120" height="60" as="geometry"/>
  </mxCell>
</object>
```

The upgrade command **never touches properties**. It only updates the `style` attribute inside `<mxCell>`. So if a user has filled in `owner="Team Alpha"`, that value is preserved across every upgrade.

## The unique identifier

Every managed shape has this in its draw.io style string:

```
data-block-id=application-component;data-library-version=0.1.0
```

`data-block-id` is the **join key** between diagrams and the YAML library. It's set when the shape is first placed on a canvas (from the library) and never changes during upgrades.

This is what makes deterministic matching possible — no guessing based on visual appearance, no pattern matching on shape names. A `data-block-id=application-component` shape will always match the `application-component.yaml` definition.
