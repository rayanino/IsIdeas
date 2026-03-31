# Consistency And Source Of Truth

## Governed Truth

All canonical truth in this repo lives in version-controlled markdown:

- `README.md`
- `CLAUDE.md`
- `control_tower/`
- `catalog/`
- `audits/` (evidence and findings archive; not canonical by itself)
- `shared/`
- `decisions/`
- `ideas/`
- `research/`
- `workflows/`
- `handoff/`

## Main Rule

If a governed claim changes:
- the relevant repo-tracked file must change,
- the change must be traceable,
- and older conflicting docs must be updated or explicitly deprecated.

Audit files may justify changes, but they do not replace the governed file that owns the truth.

## Forbidden Shortcut

No document wins merely because it is newer.

If `control_tower/`, `catalog/`, and other governed directories disagree, the repo is inconsistent and needs reconciliation.

## Vocabulary Rule

Use one active portfolio vocabulary:

- stages: `spark`, `incubating`, `dossier`, `spec_ready`, `handoff_ready`, `parked`, `rejected`
- priorities: `frontier`, `challenge`, `watch`, `parked`
- attention tiers: `deep`, `visible`, `parked`
