# Adversarial Architecture & Integrity Review

**Repo**: IsIdeas (Codex-led R&D command system)
**Branch**: `codex/portfolio-truth-idea-002-p1`
**Date**: 2026-03-30
**Reviewer**: Claude Opus 4.6 (external, adversarial posture)
**Posture**: Assume overbuilt, self-confirming, or strategically miscalibrated until proven otherwise.

---

## FINDING 1 — CRITICAL: Silent Integrity Flag Mutation in Postgres Mode

**File**: `src/lib/postgres-repository.ts:39`

```typescript
seed.integrityFlags = seed.integrityFlags.filter((flag) => flag.id !== "F-001");
```

When Postgres connects for the first time, the runtime silently deletes integrity flag F-001 ("Runtime is still in bootstrap file-store mode") from the seed state before inserting it into the database. No decision record. No human confirmation. No audit trail.

**Why this is the worst finding**: The INTEGRITY_POLICY and OPERATING_LOOP both require written decision records for "serious state changes." An integrity flag is the system's own alarm mechanism. Silently filtering one out during a storage-backend transition is the exact pathology the governance docs were designed to prevent — silent corruption behind an elegant interface.

**Cascading damage**: The morning report (`src/lib/tick.ts:45`) filters flags by `status !== "resolved"`. In Postgres mode, F-001 doesn't exist at all — it doesn't even show as resolved. A human reading morning reports across file-store to Postgres transition sees the flag vanish with no explanation.

---

## FINDING 2 — CRITICAL: Codex Judges Its Own Work With No Recusal Mechanism

**Files**: `control_tower/EMPLOYEE_PROTOCOLS.md`, `control_tower/AUTONOMOUS_LOOPS.md`, `runtime/seed/state.json`

The governance structure assigns Codex three conflicting roles simultaneously:
- **Proposer**: Codex generates ideas and bottleneck definitions
- **Recorder**: Codex writes decision records and state.json mutations
- **Critic**: Codex runs the daily "red-team critique" loop (L-004)

There is no recusal rule, no external verification gate, and no conflict-of-interest policy. The EMPLOYEE_PROTOCOLS say external models "do not become canonical truth by existing" but there is no reciprocal constraint saying Codex proposals are not automatically canonical.

**The self-confirming loop**: Codex decides I-002 is frontier -> writes positive decision record -> updates state.json -> runs red-team critique loop (which Codex controls) -> no force in the system prevents circular reinforcement. The owner can override but the system does not require owner involvement in idea judgment.

---

## FINDING 3 — CRITICAL: Canonical Source Priority Inversion

**File**: `workflows/CONSISTENCY_AND_SOURCE_OF_TRUTH.md`

The doc declares a ranked truth hierarchy (README -> control_tower -> catalog -> seed) but then introduces a hidden override: "newer Codex-led control-tower documents win over legacy workshop language."

This creates a unidirectional truth-mutation vector. A Codex-generated control_tower/ file can silently supersede catalog/ files without requiring the catalog to update. Future readers see conflicting canonical assertions across directories and must re-read the consistency doc to know which one "should" be believed.

**The self-confirming loop**: The very document designed to prevent truth-drift legitimizes a mechanism for it by building the override into its definition of consistency.

---

## FINDING 4 — HIGH: `kr` Is Asserted As Existing But Is Undefined

**Files**: All idea dossiers, `README.md:18`, `runtime/seed/state.json`

Every idea declares a dependency on `kr`:
- I-001: "Consumes canonical fixed text from kr"
- I-002: "Depends on topics/sources/excerpt relationships from kr"
- I-003: "Links back to excerpts/topics/sources in kr"
- I-004: "May link lecture artifacts into kr later"

There is no `kr/` directory. No specification. No boundary definition. No API contract. No timeline.

The README says "`kr` remains the knowledge substrate" as settled fact. But `kr` is undefined. All four ideas are blocked on a dependency that has no clear owner, spec, or timeline — yet none of the dossiers treat this as a blocker. Stage advancement criteria (spec-ready, handoff-ready) cannot be met without `kr` being defined.

**Adversarial read**: The portfolio appears active but is actually stalled on missing infrastructure, using `kr` as a convenient deferral: "We don't need to think about the data model because kr will handle it."

---

## FINDING 5 — HIGH: State.json Mutations Outpace Decision Records

**Files**: `runtime/seed/state.json` vs `decisions/` (5 ADRs, zero idea-specific decisions)

state.json contains:
- 5 bottleneck definitions with leverage scores
- 4 ideas with stage, priority, and timestamps
- 6 tools with evaluation status
- 2 integrity flags
- 5 autonomous loop definitions
- 1 decision record (D-0001)

The `decisions/` directory has 5 ADRs, all about governance structure. Zero decision records explain: why any idea reached its current stage, why bottlenecks have their leverage scores, why tools were evaluated as they were, or why any state.json field has its current value.

The OPERATING_LOOP says "record decisions and generate the next report." The INTEGRITY_POLICY says "a written decision record is required for serious state changes." state.json is the most mutation-heavy truth source in the repo — and has the least traceability.

---

## FINDING 6 — HIGH: Schema and Seed Auto-Creation Without Migration Record

**File**: `src/lib/postgres-repository.ts:26-55`

```typescript
await pool.query(`CREATE TABLE IF NOT EXISTS runtime_documents (...)`);
```

The table is created dynamically on first DB connect. No explicit migration. No version tracking. If the app connects to an incompatible schema, `IF NOT EXISTS` silently succeeds. The file repository and Postgres repository have different implicit schemas (JSONB blob vs. typed JSON files parsed with Zod), meaning two active runtime instances can diverge without detection.

No ADR documents when or why Postgres support was added.

---

## FINDING 7 — HIGH: "Candidate" Stage Is Undefined and Universally Used

**Files**: `catalog/IDEA_REGISTRY.md:5-8`, all `ideas/*/README.md:5`

All four ideas are labeled `stage: candidate`. But "candidate" does not exist in:
- `workflows/IDEA_STAGE_SEMANTICS.md` (defines: Spark, Incubating, Dossier, Spec-ready, Handoff-ready)
- `workflows/IDEA_LIFECYCLE.md` (same stages)
- `workflows/STAGE_DEFINITION_OF_DONE.md` (same stages)

Meanwhile, the ideas have developed DOSSIER.md files with working theses, risk analyses, domain models, MVP scopes, and open questions — clearly beyond "incubating." The stage label and actual content are out of sync. The integrity-checking logic cannot verify stage compliance because the stage value isn't defined.

Two conflicting vocabularies operate simultaneously. The old one ("candidate") is used everywhere. The new one (Spark through Handoff-ready) is documented everywhere. Neither has been reconciled, violating CONSISTENCY_AND_SOURCE_OF_TRUTH's own consistency rule.

---

## FINDING 8 — HIGH: Focus Discipline Violated With No Acknowledgment

**Files**: `catalog/ACTIVE_FOCUS.md` vs `workflows/FOCUS_DISCIPLINE.md`

FOCUS_DISCIPLINE says "no more than three idea workspaces under meaningful ongoing deep attention." ACTIVE_FOCUS currently shows 4 ideas (2 frontier + 2 challenge) plus "Codex-led control tower bootstrap" consuming major attention cycles.

No document acknowledges the violation. No exception is recorded. A future session reads ACTIVE_FOCUS, sees 4 ideas as the baseline, and the focus limit drifts upward silently.

---

## FINDING 9 — MEDIUM-HIGH: Autonomous Loops Have No Failure Accountability

**File**: `runtime/seed/state.json` (loops L-001 through L-005)

Five loops are defined with cadences (hourly to daily) and status ("healthy" or "watching"). But:
- No definition of what "healthy" or "watching" means
- No threshold for loop failure detection
- No escalation procedure if a loop misses its cadence
- No output storage proving a loop actually ran
- No integrity flag is raised if a loop goes silent

The INTEGRITY_POLICY says "do not let autonomy create silent corruption." But if L-002 (Bottleneck Map Refresh) stops running, the bottleneck map goes stale silently. Nothing in the system would notice.

---

## FINDING 10 — MEDIUM: Zero Parked/Rejected Ideas Despite "Ruthless Rejection" Policy

**File**: `catalog/PARKED_AND_REJECTED.md` (empty of actual entries)

The CHARTER says "ruthless rejection of weak ideas." The README says "no survival advantage for legacy ideas." codex/START_HERE says "do not preserve a weak idea just because it has a directory."

Yet the parked/rejected register is empty. Zero ideas have been formally rejected. Either all ideas are genuinely strong (unlikely for any portfolio) or rejection is happening silently without formalization — which is exactly what the governance docs were designed to prevent.

---

## FINDING 11 — MEDIUM: Bottleneck Map Contains Unsubstantiated Scholarly Claims

**File**: `runtime/seed/state.json` (bottlenecks B-001 through B-005)

The CHARTER prohibits "false scholarly authority." But the bottleneck map itself makes pedagogical claims stated as settled fact:
- B-001: "Exact-text preservation attacks foundations-first bottleneck directly"
- B-002: "Reading in the wrong order distorts understanding"

These are assertions about Islamic study pedagogy. They may be correct, but they are presented without source backing, uncertainty caveats, or references to any scholarly tradition. The bottleneck map is the foundation that justifies all idea existence — and it is the one artifact that is never pressure-tested.

**Self-confirming loop**: The OPERATING_LOOP says "challenge the current frontier" (step 4) but the bottleneck definitions that select which ideas are frontier are asserted, not challenged.

---

## FINDING 12 — MEDIUM: Legacy Workshop Assumptions Still Contaminate

**File**: All idea dossiers

The README says the workshop model ("ChatGPT judges / Codex executes") has been retired. But three unstated workshop-era assumptions persist:

1. **Custom software is needed first** — no dossier references existing Islamic learning platforms, memorization apps, or curriculum frameworks. The question "what does the field already do?" is never asked.
2. **Personal/individual user is the right scope** — no dossier considers groups, classes, or institutional settings.
3. **Data model simplicity equals truth safety** — all three assume simple state models will not corrupt understanding, but none ask: who validates the model against the actual pedagogical domain?

---

## FINDING 13 — MEDIUM: Promotion Checklists Are Advisory, Not Gates

**File**: `workflows/PROMOTION_CHECKLISTS.md`

Phrased as "use these checklists before moving" — suggestion, not mandate. No workflow enforces completion. No record is required to prove a checklist was followed. A future Codex session can promote an idea and cite the checklist as the guide while skipping every item on it, and the promotion remains valid.

---

## FINDING 14 — MEDIUM: Integrity Flags Have No Escalation or Timeout

**File**: `runtime/seed/state.json` (F-001, F-002)

Both flags are `status: open, severity: medium`. F-002 explicitly admits "seed portfolio still reflects workshop-era ideas." But:
- No rule says what happens if a flag stays open beyond a certain time
- No escalation if severity increases
- No constraint prevents repo work from proceeding while critical flags are open
- The flag is documented but does not block work — meaning the system can operate indefinitely with acknowledged corruption

---

## FINDING 15 — LOW: Unrelated Networking Config in Repo Root

**File**: `` ```.txt ```

Contains Cisco switch configuration commands (`vlan 10`, `ip address 192.168.10.11`). Unrelated to IsIdeas. Noise.

---

## SELF-CONFIRMING LOOPS MATRIX

| Loop | How It Self-Confirms | What Breaks It |
|------|---------------------|----------------|
| Codex proposes / records / critiques | No external verification gate | Require owner sign-off on frontier promotions |
| control_tower overrides catalog "by recency" | Newer doc wins without requiring old doc update | Require bidirectional sync or deprecation notice |
| state.json mutations without decision records | "Traceable" means "exists in state.json" not "was argued" | Require decision records for state.json field changes |
| Bottleneck map justifies ideas / ideas validate bottleneck framing | Foundation never challenged | Require external evidence or scholarly citation for bottleneck claims |
| Focus discipline violated / ACTIVE_FOCUS becomes new baseline | No document marks the violation | Require explicit exception record when exceeding limit |
| Open integrity flags don't block work | Flags acknowledged but non-blocking | Add blocking severity level or timeout |

---

## WHAT IS ACTUALLY FINE

- **File-store mode runtime**: Clean, traceable, follows integrity policy correctly.
- **Zod type boundaries**: Well-defined, enforced at parse boundaries, schema-first.
- **Dashboard and submission intake**: Correctly reads state, validates forms, respects lifecycle.
- **The charter and integrity policy as documents**: Thoughtful, well-articulated, genuinely protective in intent.
- **ADR discipline**: The 5 existing ADRs are real decisions with real reasoning.
- **.gitignore coverage**: .env.local is correctly excluded from git (never committed).
- **WSL bootstrap scripts**: Properly structured for unattended setup.

---

## ADVERSARIAL SUMMARY

The governance architecture is exceptionally articulate but weakly enforced. The gap is not in documentation quality — it is in the absence of structural constraints that prevent the documented rules from being silently violated.

The three deepest problems are:

1. **Codex is judge, jury, and clerk** — with no structural separation between proposal, recording, and evaluation, "traceability" degrades to "self-certification."

2. **The portfolio appears active but is stalled on `kr`** — all four ideas declare a dependency on an undefined system. Motion continues (dossiers get written, state.json gets updated) but advancement is structurally blocked. This is motion masquerading as progress.

3. **The truth hierarchy has a built-in corruption vector** — the "newer docs win" rule in CONSISTENCY_AND_SOURCE_OF_TRUTH means any Codex-generated document can silently supersede existing canonical state without requiring propagation. This is not a bug in the docs — it is an architectural choice that trades consistency for speed, and the tradeoff is unacknowledged.

---

## RECOMMENDED RESPONSE PRIORITY

If Codex is tasked with addressing this review, the suggested order is:

1. **Fix the silent F-001 filter** in `postgres-repository.ts:39` — replace with a decision record mechanism
2. **Create ADR-006** documenting the Postgres runtime upgrade decision
3. **Reconcile stage vocabulary** — retire "candidate" or define it formally
4. **Define `kr` boundaries** — either spec it or acknowledge the stall explicitly
5. **Add owner-ack gate** for frontier promotions to break the self-confirming loop
6. **Acknowledge the focus discipline exception** in ACTIVE_FOCUS with end date
7. **Add escalation rules** for open integrity flags
8. **Back the bottleneck map** with scholarly references or uncertainty caveats

Everything else is lower priority and can be addressed incrementally.
