# Enterprise Adoption Guide

Guide for architecture teams evaluating and rolling out architecture-blocks across an organization.

## Quick Start

```bash
npm install @ea-toolkit/architecture-blocks
npx architecture-blocks version
npx architecture-blocks check ./diagrams
```

## Phased Rollout

### Phase 1: Evaluate (1 team, 1 week)
1. Install in a single project
2. Import library into draw.io: `libraries/architecture-blocks.xml`
3. Create a few diagrams using the managed shapes
4. Run `check` command to see how it works
5. Assess: does the library cover your needs?

### Phase 2: Pilot (2-3 teams, 2 weeks)
1. Add to shared dev dependencies
2. Add `npx architecture-blocks check` to CI pipeline
3. Teams create diagrams using the standard library
4. Gather feedback on missing shapes or style preferences

### Phase 3: Standardize (org-wide)
1. Add to org-level CI template
2. Set up shape change governance (CODEOWNERS)
3. Create extension shapes for org-specific notation
4. Document in architecture team wiki

## CI Integration Patterns

### PR Check (block on stale shapes)
```yaml
- name: Check diagram styles
  run: npx architecture-blocks check
```
Exit code 1 fails the pipeline if shapes are outdated.

### Scheduled Upgrade (auto-fix on a cadence)
```yaml
# .github/workflows/upgrade-diagrams.yml
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

### PR Comment (informational, non-blocking)
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
        body: '⚠️ Some diagram shapes are outdated. Run `npx architecture-blocks upgrade` to fix.'
      })
```

## Governance

### Who owns the shape library?
The architecture team or platform team should own the library definition. Shape changes go through PR review with CODEOWNERS approval.

### How are changes proposed?
Use the GitHub issue templates:
- **Shape Request** — for new shapes
- **Style Change** — for color/font updates
- **Bug Report** — for rendering issues

### How are changes approved?
1. PR created with YAML changes in `shapes/` directory
2. CODEOWNERS (architecture team) reviews
3. CI validates YAML, runs tests, checks round-trip
4. Merge → release → consumers upgrade

## Extension Shapes

Teams can add custom shapes without forking:

1. Create a `custom-shapes/` directory with the same layer/YAML structure
2. Add config:
```json
// .architecture-blocksrc.json
{
  "extensions": ["./custom-shapes"]
}
```
3. Extension shapes are included in check/upgrade commands
4. Extension shapes must follow the same YAML schema

## Version Management

### When to upgrade
- **Patch releases** (0.1.x): Safe to auto-upgrade. Style-only changes.
- **Minor releases** (0.x.0): Review migration guide first. May add new shapes.
- **Major releases** (x.0.0): Read breaking changes carefully. May remove shapes.

### How to test before rolling out
```bash
# Preview what the upgrade will change
npx architecture-blocks upgrade --dry-run

# Check migration guide
npx architecture-blocks diff-versions 0.1.0 0.2.0

# Upgrade and verify
npx architecture-blocks upgrade
# Open affected .drawio files in draw.io to visually verify
```

### How to roll back
```bash
# Restore from backup (created automatically during upgrade)
npx architecture-blocks rollback path/to/diagram.drawio
```

## Troubleshooting

### "No .drawio files found"
The scanner looks recursively from the given path, skipping `node_modules/` and `dist/`. Make sure your .drawio files aren't in an ignored directory.

### Shapes not matching
Each shape needs a `data-block-id` in its style string. Shapes dragged from the architecture-blocks library have this automatically. Shapes created manually or from other libraries won't be matched.

### CI failing on stale shapes
Run `npx architecture-blocks upgrade` locally, commit the changes, and push.

### Custom shapes not detected
Verify your `.architecture-blocksrc.json` is in the project root and the `extensions` paths are correct relative to the config file.

## FAQ

**Q: Does this work offline?**
Yes. The library is distributed inside the npm package. No network requests at runtime.

**Q: Can I use this with draw.io online?**
Yes. Import the library XML file through File → Open Library from → Device.

**Q: What happens to diagrams created before adopting this package?**
Existing shapes won't have `data-block-id` attributes, so they'll be ignored by check/upgrade. Only shapes from the architecture-blocks library are managed.

**Q: Can different teams use different versions?**
Yes. Each project pins its own version in package.json. Teams upgrade on their own schedule.

**Q: Is there telemetry or data collection?**
No. The package is fully offline. No analytics, no phone-home, no tracking.
