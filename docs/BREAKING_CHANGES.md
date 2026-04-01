# Breaking Change Policy

## What counts as breaking

| Change | Breaking? | Process |
|--------|-----------|---------|
| Shape removed | **Yes** | Deprecate for 2 minor versions, then remove in next major |
| blockId renamed | **Yes** | Old ID aliased for 2 minor versions, upgrade command migrates |
| Layer reassignment | **Yes** | Same as blockId rename process |
| Style change (colors, font) | No | Handled by `upgrade` command |
| New shape added | No | Additive, no impact on existing diagrams |
| CLI command removed | **Yes** | Deprecation warning for 2 minor versions |
| CLI option renamed | **Yes** | Old option aliased for 2 minor versions |

## Deprecation lifecycle

```
v0.3.0 — Shape marked deprecated: true, deprecatedSince: "0.3.0"
          CLI check/upgrade commands show deprecation warning
          replacedBy field points to new shape (if applicable)

v0.4.0 — Shape still functional, warnings continue
          Migration docs available

v0.5.0 — Shape still functional (last minor before removal)
          Upgrade command auto-migrates to replacement

v1.0.0 — Shape removed
          Major version bump signals breaking change
```

## YAML deprecation fields

```yaml
blockId: old-shape-name
deprecated: true
deprecatedSince: "0.3.0"
replacedBy: new-shape-name
```

## How the CLI handles deprecated shapes

### `architecture-blocks check`
```
⚠ deprecated old-shape-name (since 0.3.0, use new-shape-name)
```

### `architecture-blocks upgrade`
- Updates style properties as normal
- If `replacedBy` is set: updates `data-block-id` to the new blockId
- Shows migration message in output

## Consumer protection

1. **Never surprise consumers.** Breaking changes only in major versions.
2. **Always provide migration path.** Upgrade command handles transitions.
3. **Document everything.** Each release notes breaking changes prominently.
4. **Test backward compat.** CI tests that deprecated shapes still parse and match.
