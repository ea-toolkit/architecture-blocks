# Versioning Strategy

This package follows [Semantic Versioning](https://semver.org/).

## When to bump

### Major (breaking)
- Shape **removed** from the library
- Shape `blockId` **renamed** (breaks existing diagram matching)
- Shape **layer reassignment** (changes categorization)
- CLI command removed or behavior changed incompatibly

### Minor (feature)
- **New shapes** added to the library
- New CLI commands or options
- New YAML schema fields (backward-compatible)
- New layer added

### Patch (fix)
- **Style updates** (color, stroke, font changes) — handled by upgrade command
- Bug fixes in parser, matcher, differ, or upgrader
- Documentation updates
- Dependency updates

## Deprecation process

1. Shape marked `deprecated: true` in YAML with `deprecatedSince` version
2. CLI `check` command warns on deprecated shapes
3. Shape remains functional for **2 minor versions**
4. Shape removed in next major version
5. If replaced: `replacedBy` field points to new blockId, upgrade command handles migration

## Commit conventions

Use [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` → minor bump
- `fix:` → patch bump
- `feat!:` or `BREAKING CHANGE:` → major bump
- `chore:`, `docs:`, `test:`, `refactor:` → no version bump

## Changelog

Generated from conventional commits using the release workflow.
Each GitHub Release includes auto-generated release notes.

## Version files

When bumping version, update both:
1. `package.json` → `version` field
2. `src/library/versions.ts` → add new `VersionEntry`
