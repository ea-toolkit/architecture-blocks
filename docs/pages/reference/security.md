---
title: Security
layout: default
parent: Reference
nav_order: 6
---

# Security

Supply chain security, provenance, and vulnerability reporting.

## Reporting vulnerabilities

If you discover a security issue:

1. **Do NOT open a public issue**
2. Email: rajnavakoti@gmail.com with subject "architecture-blocks security"
3. Include: description, reproduction steps, and impact assessment
4. Expected response time: 48 hours

## Supply chain security

- Published packages include [npm provenance](https://docs.npmjs.com/generating-provenance-statements) attestation
- All releases are built by GitHub Actions from the repository
- Verify provenance: `npm audit signatures`
- Package lockfile (`package-lock.json`) committed and used in CI (`npm ci`)

## Dependencies

Minimal runtime dependencies — each one justified:

| Package | Purpose | Why not built-in? |
|---------|---------|-------------------|
| `commander` | CLI framework | Standard CLI library, battle-tested |
| `fast-xml-parser` | XML parsing | No native deps, faster than alternatives |
| `yaml` | YAML shape definitions | Standard YAML parser |

## Automated dependency updates

Dependabot is configured for both npm packages and GitHub Actions, scanning weekly.

## Offline operation

This package makes **zero network requests** at runtime. Everything operates on local files. No analytics, no telemetry, no phone-home.
