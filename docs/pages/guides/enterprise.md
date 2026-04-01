---
layout: default
title: Enterprise Adoption Guide
---

# Enterprise Adoption Guide

How to evaluate, pilot, and roll out architecture-blocks across your organization.

## Phased rollout

### Phase 1: Evaluate (1 team, 1 week)

1. Install in a single project: `npm install @ea-toolkit/architecture-blocks`
2. Import library into draw.io
3. Create a few diagrams using managed shapes
4. Run `check` and `upgrade` commands to see how they work
5. Assess: does the library cover your ArchiMate needs?

### Phase 2: Pilot (2-3 teams, 2 weeks)

1. Add to shared dev dependencies
2. Add `npx architecture-blocks check` to CI pipelines
3. Teams create diagrams using the standard library
4. Gather feedback on missing shapes, property needs, style preferences
5. Create extension shapes for org-specific notation

### Phase 3: Standardize (org-wide)

1. Add to org-level CI template
2. Set up shape change governance (CODEOWNERS)
3. Publish extension shape packs for different business units
4. Document in architecture team wiki
5. Set up scheduled upgrade workflow

## CI integration patterns

### Pattern 1: PR check (blocking)

```yaml
- name: Check diagram styles
  run: npx architecture-blocks check
```

Exit code 1 fails the pipeline if shapes are outdated. Best for teams that want strict consistency.

### Pattern 2: Scheduled auto-upgrade

```yaml
name: Upgrade Diagrams
on:
  schedule:
    - cron: '0 9 * * 1'  # Monday mornings
jobs:
  upgrade:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npx architecture-blocks upgrade
      - uses: peter-evans/create-pull-request@v6
        with:
          title: 'chore: upgrade architecture block styles'
          branch: chore/upgrade-diagram-styles
```

Automatic, low-friction. A PR appears every Monday if shapes are stale.

### Pattern 3: PR comment (non-blocking)

```yaml
- name: Check diagrams
  id: check
  run: npx architecture-blocks check 2>&1 || true
  continue-on-error: true
- name: Comment on PR
  if: steps.check.outcome == 'failure'
  uses: actions/github-script@v7
  with:
    script: |
      github.rest.issues.createComment({
        issue_number: context.issue.number,
        owner: context.repo.owner,
        repo: context.repo.repo,
        body: 'Some diagram shapes are outdated. Run `npx architecture-blocks upgrade` to fix.'
      })
```

Informational. Doesn't block the PR, just nudges the developer.

## Shape properties for governance

Properties are where architecture governance meets daily work. Define properties that match your governance model:

```yaml
properties:
  - key: owner
    label: Owner
    type: string
    description: Team responsible for this component
  - key: status
    label: Status
    type: enum
    options: [active, deprecated, planned, retiring]
  - key: dataClassification
    label: Data Classification
    type: enum
    options: [public, internal, confidential, restricted]
```

When architects use these shapes, they're prompted to fill in governance metadata as they draw — not as an afterthought.

## Extension shapes

Teams can add org-specific shapes without forking:

1. Create a `custom-shapes/` directory with the same layer structure
2. Add `.architecture-blocksrc.json`:

```json
{
  "extensions": ["./custom-shapes"]
}
```

3. Extension shapes follow the same YAML schema
4. Included in check/upgrade commands automatically

## Governance workflow

### Who owns the shape library?
The architecture team or platform team. Shape changes go through PR review.

### How are changes proposed?
GitHub issue templates:
- **Shape Request** — new shapes
- **Style Change** — color/font updates
- **Bug Report** — rendering issues

### How are changes approved?
1. PR with YAML changes in `shapes/`
2. CODEOWNERS review (architecture team)
3. CI validates YAML, runs 415 tests, checks round-trip integrity
4. Merge → GitHub Release → npm publish (automated)

## Version management

| Release type | Safety | Action |
|-------------|--------|--------|
| Patch (0.1.x) | Safe to auto-upgrade | Style-only changes |
| Minor (0.x.0) | Review migration guide | May add new shapes |
| Major (x.0.0) | Read breaking changes | May remove shapes |

```bash
# Before upgrading
npx architecture-blocks diff-versions 0.1.0 0.2.0
npx architecture-blocks upgrade --dry-run

# Upgrade
npx architecture-blocks upgrade

# Roll back one file if needed
npx architecture-blocks rollback path/to/diagram.drawio
```

## Monorepo support

The scanner detects npm/yarn/pnpm workspaces and scans all packages:

```bash
npx architecture-blocks check    # scans all workspace packages
```

## FAQ

**Does this work offline?**
Yes. No network requests at runtime. Everything is local.

**Can I use this with draw.io online?**
Yes. Import the library XML through File > Open Library from > Device.

**What about diagrams created before adoption?**
Existing shapes without `data-block-id` are silently skipped. Only library shapes are managed.

**Can teams use different versions?**
Yes. Each project pins its own version in package.json.

**Is there telemetry?**
No. Zero analytics, zero tracking, fully offline.

**What about supply chain security?**
npm provenance attestation on every release. Verify with `npm audit signatures`. 3 runtime dependencies, all audited.
