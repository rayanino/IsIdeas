# Consistency And Source Of Truth

## Canonical Surfaces

The repo has two different kinds of truth:

1. **Governed repo truth**
   - `README.md`
   - `control_tower/`
   - `catalog/`
   - `shared/`
   - `decisions/`
   - `runtime/seed/state.json`
2. **Operational runtime state**
   - `runtime/local/`
   - local Postgres runtime documents
   - morning reports and loop freshness data

## Main Rule

Operational runtime state may move faster than governed repo truth, but it may not silently redefine it.

If a governed claim changes:
- the relevant repo-tracked file must change,
- the change must be traceable,
- and older conflicting docs must be updated or explicitly deprecated.

## Forbidden Shortcut

No document wins merely because it is newer.

If `control_tower/`, `catalog/`, and `runtime/seed/state.json` disagree, the repo is inconsistent and needs reconciliation.

## Vocabulary Rule

Use one active portfolio vocabulary:

- stages: `spark`, `incubating`, `dossier`, `spec_ready`, `handoff_ready`, `parked`, `rejected`
- priorities: `frontier`, `challenge`, `watch`, `parked`
- attention tiers: `deep`, `visible`, `parked`
