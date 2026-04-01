---
layout: default
title: Breaking Change Policy
---

# Breaking Change Policy

How shape changes are communicated and how consumers are protected.

## What counts as breaking

| Change | Breaking? | Process |
|--------|-----------|---------|
| Shape removed | Yes | Deprecate 2 minor versions, remove in major |
| blockId renamed | Yes | Alias old ID for 2 minor versions |
| Layer reassignment | Yes | Same as rename process |
| Style change (colors, font) | **No** | Handled by `upgrade` command |
| New shape added | **No** | Additive, no impact |
| New property added to shape | **No** | Additive, no impact |
| CLI command removed | Yes | Deprecation warning for 2 minor versions |

## Deprecation lifecycle

```
v0.3.0  Shape marked deprecated: true
        CLI check/upgrade show warnings
        replacedBy field points to new shape

v0.4.0  Shape still works, warnings continue

v0.5.0  Shape still works (last minor before removal)
        Upgrade command auto-migrates to replacement

v1.0.0  Shape removed
        Major version = breaking change signal
```

## YAML deprecation fields

```yaml
blockId: old-shape-name
deprecated: true
deprecatedSince: "0.3.0"
replacedBy: new-shape-name
```

## Consumer protection

1. **No surprises.** Breaking changes only in major versions.
2. **Migration path.** Upgrade command handles transitions automatically.
3. **Clear communication.** Release notes highlight breaking changes.
4. **Time to adapt.** 2 minor versions of deprecation before removal.
