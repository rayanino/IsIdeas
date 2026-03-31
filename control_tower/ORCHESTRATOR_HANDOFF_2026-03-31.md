# Orchestrator Handoff — 2026-03-31

This file exists to let a fresh orchestrator session take over cleanly.

## What Has Already Been Done

- `IsIdeas` was reset from implementation-host drift back to factory-only scope.
- The accidental in-repo Fixed-Text Preservation app was quarantined out of active scope.
- The factory now preserves:
  - handoff packets
  - quarantined build records
  - implementation learnings
- `Fixed-Text Preservation System` is `handoff_ready` and no longer consumes active deep attention.
- One specific published curriculum sequence has now been sourced and preserved for `I-002 Curriculum Architect`.
- The sourced sequence has now been translated into a formal authority-boundary model and a smallest honest MVP boundary.
- A generic expert validation packet now exists for that source and model.
- Two external responses have now landed.
- Those responses disagree on `overall_honest`, but they converge that no second source is required yet and that authority-sensitive framing needed tightening before the next review.
- That terminology revision is now absorbed into the active packet and dossier.
- The factory's active focus has shifted from internal revision to obtaining the next external response against the revised packet.

## Current Canonical State

Read these first:

1. `README.md`
2. `control_tower/CHARTER.md`
3. `catalog/ACTIVE_FOCUS.md`
4. `catalog/IDEA_REGISTRY.md`
5. `catalog/HANDOFF_QUEUE.md`
6. `catalog/QUARANTINED_BUILDS.md`
7. `catalog/INTEGRITY_BOARD.md`
8. `decisions/ADR-010-ISIDEAS-IS-FACTORY-ONLY.md`
9. `decisions/ADR-012-I-002-MODELABILITY-DETERMINATION.md`
10. `research/I-002-MODELABILITY-SESSION-2026-03-31.md`
11. `research/I-002-JAMIA-BINORIA-DARS-E-NIZAMI-SEQUENCE-2026-03-31.md`
12. `ideas/curriculum-architect/RESEARCH.md`
13. `ideas/curriculum-architect/EXTERNAL_REVIEW_CHATGPT_DEEP_RESEARCH_2026-03-31.md`
14. `ideas/curriculum-architect/EXTERNAL_REVIEW_CLAUDE_OPUS_2026-03-31.md`

## Single Best Next Move

Obtain the next external validation response against the revised packet.

The repo already says this in multiple places:
- `catalog/ACTIVE_FOCUS.md`
- `catalog/INTEGRITY_BOARD.md`
- `catalog/REPO_HEALTH.md`
- the audits in `audits/`

Do not reopen `I-001`.
Do not start building apps in this repo.
Do not start another broad meta-review chain unless the new work surfaces a real ambiguity.

## Do Now

1. treat the sourced Jamia Binoria sequence, formal model, MVP boundary, revised packet, and both preserved external reviews as the active I-002 baseline unless a real insufficiency appears
2. preserve those artifacts as governed factory truth
3. obtain the next external review against the revised packet and preserve it verbatim
4. do not promote the idea before the revised packet receives further external scrutiny

## Do Later

- move quarantined build custody to a more durable location than a machine-local path
- formalize the handoff freeze / reopen rule if it still feels too implicit
- revisit whether extra scope-boundary enforcement is needed after more real factory use

## Out Of Scope

- product implementation inside `IsIdeas`
- new dashboard/runtime/tooling work unless it directly serves the factory and stays markdown-first
- reopening `Fixed-Text Preservation System` for in-repo build activity

## Session Rule

If a fresh session ends without moving the revised I-002 packet closer to the next external verdict, it likely drifted back into meta-work.
