# Codex Task Queue

This is the recommended initial queue of bounded background tasks for Codex.

These are deliberately chosen to strengthen the workshop without outsourcing high-judgment idea selection.

## Task 1 — Live Workspace Consistency Audit

### Goal
Audit all live serious idea workspaces for consistency with:
- `catalog/IDEA_REGISTRY.md`
- `workflows/CONSISTENCY_AND_SOURCE_OF_TRUTH.md`
- `workflows/WORKSPACE_CONTRACT.md`
- `workflows/STAGE_DEFINITION_OF_DONE.md`

### Expected Output
- a drift report
- a PR that fixes only unambiguous inconsistencies

## Task 2 — Repo Health Follow-Through

### Goal
Audit the repository against `catalog/REPO_HEALTH.md` and identify concrete structural drift or missing follow-through.

### Expected Output
- a concise health follow-through report
- a PR only if the fixes are clearly structural and unambiguous

## Task 3 — Priority and Focus Alignment Check

### Goal
Check alignment among:
- `catalog/ACTIVE_FOCUS.md`
- `catalog/PORTFOLIO_PRIORITY_BOARD.md`
- `catalog/IDEA_REGISTRY.md`
- live idea workspace READMEs

### Expected Output
- a consistency report
- a PR for any clearly justified alignment fixes

## Task 4 — Optional Research Need Scan

### Goal
Inspect live dossiers and determine whether any idea genuinely deserves a `RESEARCH.md` scaffold based on unresolved questions that clearly need outside investigation.

### Expected Output
- a recommendation note
- optional PR creating only justified research scaffolds

## Task 5 — Template Compliance Check

### Goal
Check whether the current live workspaces and key artifacts still materially fit the current templates and contracts.

### Expected Output
- a compliance report
- a PR for unambiguous structural improvements only

## Queue Rule
Do not run multiple broad Codex tasks at once unless they are clearly independent.
Narrow, reviewable work beats parallel noise.
