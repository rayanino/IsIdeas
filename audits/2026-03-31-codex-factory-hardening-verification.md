# 2026-03-31 Codex Factory Hardening Verification

## Session Role

- reviewer: Codex
- scope: verify whether the factory-only reset was actually sufficient, identify remaining implementation-drift mechanisms, and close any active gaps without reintroducing app code

## Executive Summary

The repo is now structurally much closer to the intended factory-only shape than it was during the initial planning pass.

At audit time, the tracked implementation surfaces were already gone:

- no `src/`
- no `runtime/`
- no `scripts/`
- no `tests/`
- no `package.json`
- no build configs

The remaining problems were no longer code-level product drift. They were documentation-level and focus-level loopholes:

1. one historical runtime protocol still lived in the active `control_tower/` docs
2. several active documents still used control-plane/runtime language that could normalize the old scope mistake
3. the repo's "single best next move" was still phrased too generically across some portfolio surfaces
4. one structural risk remains open by design: because the repo now forbids `package.json` and executable tooling, there is no in-repo automated guardrail that can fail when future drift reappears

## Current-State Verification

Verified absent during this session:

- `src`
- `runtime`
- `scripts`
- `tests`
- `package.json`
- `next.config.ts`
- `next-env.d.ts`
- `.env.example`

Repo-wide grep found no remaining active guidance strings such as:

- `npm run dev`
- `runtime:baseline`
- `runtime:pilot`
- `submit ideas through the dashboard`
- `existing IsIdeas dashboard app`
- `out-architect the control plane`

Historical references still remain in historical or archival contexts by design:

- `decisions/ADR-011-EXTRACT-CONTROL-TOWER-DASHBOARD.md`
- `catalog/QUARANTINED_BUILDS.md`
- archived notes inside `catalog/TOOLING_AND_RESEARCH.md`
- builder-facing technology choices inside `handoff/`

## Ranked Findings

| Rank | ID | Severity | Status | Finding | Why it mattered | Disposition |
|---|---|---|---|---|---|---|
| 1 | CF-001 | medium | resolved | Historical runtime protocol remained in active control-tower docs | A new session could treat the extracted runtime as still operational guidance | Deleted `control_tower/SUPERVISED_PROVING_RUN.md` in this session |
| 2 | CF-002 | medium | resolved | Active docs still used control-plane/runtime framing | This kept the old scope mistake mentally alive even after the code was removed | Rewrote the affected docs and handoff wording in this session |
| 3 | CF-003 | medium | resolved | The factory's next move was still stated too generically in some live portfolio surfaces | Generic phrasing invites fresh focus drift and reopens "what should happen now?" | Synced active focus, repo health, immediate actions, and integrity board to one next move |
| 4 | CF-004 | medium | open | No executable in-repo scope guard exists | Future drift is now blocked mainly by repo shape and review discipline, not by an automated failing check | Keep as a known structural tradeoff unless enforcement is moved outside the repo |

## Expanded Findings

### CF-001 — Historical runtime protocol remained in active control-tower docs

**Evidence at audit time**

- `control_tower/SUPERVISED_PROVING_RUN.md` still existed under the active control-tower directory
- it contained runtime-oriented commands and pass/fail criteria for the extracted dashboard

**Why this mattered**

Even with a historical disclaimer, leaving that document inside the live control-tower surface kept a runnable-runtime mental model inside the factory's active operating docs.

That is exactly how scope drift re-enters: not first as code, but first as a sanctioned way of thinking.

**Action taken**

- deleted `control_tower/SUPERVISED_PROVING_RUN.md`

### CF-002 — Active docs still used control-plane/runtime framing

**Evidence at audit time**

- `catalog/TOOLING_AND_RESEARCH.md` still treated runtime/control-plane tooling as active directions
- `codex/HUMAN_OPERATING_PLAYBOOK.md` still told the owner not to "out-architect the control plane"
- `handoff/FIXED_TEXT_PRESERVATION_MVP_TASK_PACKET.md` still referred to the old dashboard boundary
- `ideas/memorization-os/SPEC.md` still used "runtime primitives" language
- `decisions/ADR-006-POSTGRES-RUNTIME-UPGRADE.md` still read as if it might govern current repo behavior rather than extracted history

**Why this mattered**

The repo had already removed the code, but these docs still carried the vocabulary that previously legitimized the mistake.

That kind of wording drift is dangerous because it tells a future session:

- there used to be a dashboard here
- runtime infrastructure was part of the repo's normal scope
- perhaps a smaller or "better named" version would be acceptable again

**Action taken**

- rewrote `catalog/TOOLING_AND_RESEARCH.md`
- rewrote `codex/HUMAN_OPERATING_PLAYBOOK.md`
- tightened the external-builder boundary in `handoff/FIXED_TEXT_PRESERVATION_MVP_TASK_PACKET.md`
- replaced "runtime primitives" wording in `ideas/memorization-os/SPEC.md`
- marked ADR-006 as historical-only in practice, not just superseded in title

### CF-003 — The next move was still stated too generically

**Evidence at audit time**

- `catalog/ACTIVE_FOCUS.md` still said "Next frontier selection after handoff queue promotion"
- `catalog/REPO_HEALTH.md` still said "Choose the next active frontier"
- `codex/IMMEDIATE_NEXT_ACTIONS.md` still referenced an earlier I-002 session step that had already been completed
- `catalog/INTEGRITY_BOARD.md` still told the repo to "Select the next frontier idea deliberately"

**Why this mattered**

The repo had already produced ADR-012 and a concrete I-002 re-entry path.

Leaving the next move generic created avoidable ambiguity and made the factory look less decided than it actually was.

**Action taken**

- updated `catalog/ACTIVE_FOCUS.md`
- updated `catalog/REPO_HEALTH.md`
- updated `codex/IMMEDIATE_NEXT_ACTIONS.md`
- updated `catalog/INTEGRITY_BOARD.md`

**Resulting single best next move**

Source one specific published curriculum sequence for I-002 and begin the authority-boundary data model design.

### CF-004 — No executable in-repo scope guard exists

**Evidence at audit time**

- the repo intentionally forbids `package.json`, build tooling, and executable scripts
- therefore there is no tracked test, lint, or audit command that can fail automatically if future app code reappears

**Why this matters**

The current hardening is strong in shape:

- no implementation tree
- no build toolchain
- no hidden runtime state

But it is not fully self-enforcing.

A future contributor could still add forbidden code or tooling in a single change. The repo would clearly violate its boundary, but the violation would be detected by review and grep, not by a built-in failing check.

**Why this remained open**

The repo has chosen a stricter solution:

- pure markdown factory
- no `package.json`
- no executable tooling inside the repo

Reintroducing automated checks inside the repo would itself reintroduce some of the toolchain surface that the current boundary now forbids.

**Recommended use in synthesis**

Treat this as a real but deliberate tradeoff, not as a missed cleanup step.

If stronger enforcement is later desired, prefer one of these approaches:

1. enforce it outside the repo through external review/synthesis workflow
2. accept a carefully scoped exception for a non-app audit toolchain and document that exception explicitly

Do not quietly slide back into build tooling under the label of "just guardrails."

## Changes Made In This Session

- deleted `control_tower/SUPERVISED_PROVING_RUN.md`
- updated `catalog/TOOLING_AND_RESEARCH.md`
- updated `codex/HUMAN_OPERATING_PLAYBOOK.md`
- updated `handoff/FIXED_TEXT_PRESERVATION_MVP_TASK_PACKET.md`
- updated `ideas/memorization-os/SPEC.md`
- updated `decisions/ADR-006-POSTGRES-RUNTIME-UPGRADE.md`
- updated `catalog/ACTIVE_FOCUS.md`
- updated `catalog/REPO_HEALTH.md`
- updated `codex/IMMEDIATE_NEXT_ACTIONS.md`
- updated `catalog/INTEGRITY_BOARD.md`

## Synthesis-Ready Action Extraction

### Open / still relevant

1. Source one specific published curriculum sequence for I-002 and begin the authority-boundary data model design.
2. Decide whether the repo should continue relying on pure-markdown boundary discipline alone, or whether boundary enforcement should be added outside the repo.

### Already resolved in this session

1. Remove the lingering historical runtime protocol from active control-tower docs.
2. Remove control-plane/runtime framing from active factory docs.
3. Sync all live portfolio surfaces to one explicit next move.

## Bottom-Line Judgment

The original implementation-scope mistake is no longer active in tracked code or active operating guidance.

The repo now behaves like a factory-only markdown workspace.

The main residual risk is not hidden product code. It is that the current pure-markdown boundary relies on repo shape plus review discipline, not on an automated in-repo failing check.
