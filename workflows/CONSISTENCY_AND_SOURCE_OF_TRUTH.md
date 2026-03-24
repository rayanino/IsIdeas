# Consistency and Source of Truth

This document defines which artifact owns which kind of truth.

Without this, the repository will slowly accumulate contradictory states.

## Core Rule

Not every file should be equally authoritative about the same thing.
Some artifacts are for summary, some for reasoning, and some for portfolio control.

## Portfolio Source of Truth

### 1. `catalog/IDEA_REGISTRY.md`
This is the authoritative portfolio-level record for all currently live serious ideas.

It owns:
- stable idea ID
- idea name
- current stage
- current priority band
- short statement of why it matters
- short statement of main risk
- next move

If another artifact disagrees with the registry on these portfolio-level fields, the registry should be treated as the operative source until the inconsistency is resolved.

### 2. `ideas/<idea-slug>/README.md`
This is the authoritative local summary inside the idea workspace.

It should mirror the registry for:
- current stage
- current priority band
- main risk right now
- next move

It may also include idea-local status language that is too detailed for the registry.

### 3. `ideas/<idea-slug>/DOSSIER.md`
This is the authoritative reasoning document.

It owns:
- the working thesis
- the deep articulation of the bottleneck
- the strongest arguments for and against
- boundary reasoning
- relation to `kr`
- open questions
- current judgment and rationale

A dossier may justify a stage or priority change, but it does not itself change portfolio state until the registry and workspace summary are updated.

### 4. `catalog/ACTIVE_FOCUS.md`
This is the authoritative record of the single current primary deep-focus target.

### 5. `catalog/PORTFOLIO_PRIORITY_BOARD.md`
This is the authoritative grouping of live ideas into P1, P2, and P3 bands.

### 6. `catalog/PARKED_AND_REJECTED.md`
This is the authoritative preserved record of non-active ideas that were intentionally parked or rejected.

### 7. `catalog/OPEN_QUESTIONS.md`
This is the authoritative list of repository-level open questions that affect multiple ideas or the workshop itself.

Idea-local open questions should stay in the relevant dossier unless they clearly affect cross-portfolio judgment.

### 8. `catalog/REPO_HEALTH.md`
This is the authoritative concise summary of current workshop health, watch items, and the next structural concern to monitor.

It is a summary artifact, not a substitute for the audits, decisions, or consistency work that justify its current judgment.

## Update Order

When a serious judgment changes, the safest update order is usually:
1. sharpen the reasoning in the dossier,
2. update the registry,
3. update the idea workspace README,
4. update active-focus and priority-board artifacts if affected,
5. update open-questions, parked/rejected, and repo-health artifacts if affected.

## Live vs Non-Live Ideas

The idea registry is for currently live serious ideas.
If an idea is parked or rejected, preserve it in `PARKED_AND_REJECTED.md` and remove it from the live registry.
Its historical ID should still be preserved there.

## Consistency Minimums

At minimum, these fields should stay synchronized between registry and workspace README:
- stage
- priority band
- main risk
- next move

## Warning

If the repository contains multiple conflicting summaries of the same idea, trust erodes quickly.
Consistency is not clerical fussiness here.
It is part of strategic control.
