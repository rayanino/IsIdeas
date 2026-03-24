# Codex Prompt Library

Use these as starting points for background repo work.

## 1. Consistency Audit Prompt

Read the workshop rules and audit all live idea workspaces for consistency against:
- `catalog/IDEA_REGISTRY.md`
- `workflows/CONSISTENCY_AND_SOURCE_OF_TRUTH.md`
- `workflows/WORKSPACE_CONTRACT.md`
- `workflows/STAGE_DEFINITION_OF_DONE.md`

Produce:
- a concise drift report
- a proposed PR that fixes only unambiguous inconsistencies

Do not:
- change idea stages
- change priority bands
- rewrite dossier reasoning beyond consistency cleanup

## 2. Workspace Contract Compliance Prompt

Audit all live idea workspaces for compliance with `workflows/WORKSPACE_CONTRACT.md`.
Fix only clear structural issues and open a PR.
Preserve idea meaning and portfolio state.

## 3. Template Propagation Prompt

A workshop template has changed.
Inspect the updated template and propagate only the relevant structural changes across the affected files.
Do not force cosmetic rewrites.
Open a PR with a summary of what changed.

## 4. Repo Health Check Prompt

Inspect:
- `catalog/REPO_HEALTH.md`
- `catalog/IDEA_REGISTRY.md`
- `catalog/ACTIVE_FOCUS.md`
- `catalog/PORTFOLIO_PRIORITY_BOARD.md`
- all live idea workspace READMEs

Report any structural inconsistencies, stale summaries, or contract violations.
Open a PR only for changes that are clearly justified by the current workshop rules.

## 5. Research Scaffold Prompt

For a specified live idea, create or refine a `RESEARCH.md` scaffold only if the dossier clearly indicates unresolved questions that would benefit from external research.
Do not invent research needs where none are justified.
Open a PR.

## Rule
These prompts are starting points, not licenses for open-ended improvisation.
Every Codex task should still be bounded by a task packet.
