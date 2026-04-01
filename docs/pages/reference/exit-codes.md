---
title: Exit Codes
layout: default
parent: Reference
nav_order: 2
---

# Exit Codes

Every CLI command returns a meaningful exit code for scripting and CI.

| Code | Meaning | When |
|------|---------|------|
| **0** | Success | All shapes up to date, upgrade completed, extraction done |
| **1** | Stale shapes found | `check` command found shapes that don't match the library |
| **2** | Error | File not found, parse failure, write failure, validation error |

## CI usage

```bash
# Fail the pipeline if any shapes are stale
npx architecture-blocks check
# Exit 0 = pass, Exit 1 = fail

# Use in conditional logic
if npx architecture-blocks check; then
  echo "All diagrams up to date"
else
  echo "Run: npx architecture-blocks upgrade"
  exit 1
fi
```

## In GitHub Actions

```yaml
- name: Check diagram styles
  run: npx architecture-blocks check
  # Job fails automatically on exit code 1
```
