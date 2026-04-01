# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 0.1.x   | Yes       |

## Reporting a Vulnerability

If you discover a security vulnerability in this package:

1. **Do NOT open a public issue**
2. Email: rajnavakoti@gmail.com with subject "architecture-blocks security"
3. Include: description, reproduction steps, and impact assessment
4. Expected response time: 48 hours

## Supply Chain Security

- Published packages include [npm provenance](https://docs.npmjs.com/generating-provenance-statements) attestation
- All releases are built by GitHub Actions from this repository
- Verify provenance: `npm audit signatures`
- Package lockfile (`package-lock.json`) is committed and used in CI (`npm ci`)

## Dependencies

This package has minimal runtime dependencies:
- `commander` — CLI framework
- `fast-xml-parser` — XML parsing (no native dependencies)
- `yaml` — YAML parsing

All dependencies are regularly audited via `npm audit` and Dependabot.
