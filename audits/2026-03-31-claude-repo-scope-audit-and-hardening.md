# 2026-03-31 Claude Repo Scope Audit, Factory Hardening, and I-002 Determination

## Session Role

- reviewer: Claude Opus 4.6 (1M context)
- scope: independent audit of factory-only compliance, full hardening execution, and bounded I-002 Curriculum Architect determination
- branch: `codex/portfolio-truth-idea-002-p1`
- commits produced: `fdf8df6`, `e8938a0`, `8cfac43`, `d8f4516`
- PR: rayanino/IsIdeas#14

## Executive Summary

The repo was NOT factory-only when audited. It contained ~40,000 lines of application code across two separate implementation surfaces: a quarantined-but-uncommitted product app (`apps/fixed-text-preservation/`) and a 2,793-line Next.js control tower dashboard (`src/`). The dashboard was the subtler and more dangerous problem — governance docs called it "factory infrastructure," but it was built in the same commit as the product app and represented the same structural pattern that caused the original drift.

This session:
1. Committed the uncommitted quarantine (31,575 lines deleted)
2. Extracted the dashboard to quarantine (7,908 lines deleted)
3. Migrated `runtime/seed/state.json` to 4 governed markdown tables
4. Created safeguard documents and fixed stale references across 22+ files
5. Ran a bounded I-002 determination session producing a defined re-entry path

The repo is now a pure markdown factory with 98 tracked files, zero application code, and structural safeguards against future drift.

---

## Part 1: Initial Audit Findings (ordered by severity)

### CRITICAL-1: The quarantine was uncommitted

**Evidence:** `git diff --stat HEAD` showed 56 files changed with ~31,500 lines in limbo. The `apps/fixed-text-preservation/` directory was deleted from disk but still tracked by git. A single `git checkout -- apps/` would have resurrected the entire product app.

**Why this was critical:** The previous session's quarantine was not real — it was one accidental reset away from undone. All governance corrections (ADR-010, HANDOFF_QUEUE, QUARANTINED_BUILDS, catalog updates) existed only as unstaged changes.

**Disposition:** Committed as `fdf8df6`.

### CRITICAL-2: The `src/` directory was a full application, not "factory tracking"

**Evidence:** 2,793 lines of Next.js code across 20+ files:

| File | Lines | What it did |
|---|---|---|
| `src/lib/redteam.ts` | 811 | AI-powered red-team critique via OpenAI/OpenRouter APIs |
| `src/lib/state.ts` | 603 | State management and normalization |
| `src/lib/types.ts` | 259 | Zod schemas for domain models |
| `src/app/page.tsx` | 240 | Full dashboard with metrics, sections, dynamic data |
| `src/lib/tick.ts` | 177 | Autonomous control-tower cycle logic |
| `src/lib/postgres-repository.ts` | 159 | PostgreSQL integration with table creation |
| + 14 more files | ~544 | Components, API routes, repository abstractions, utilities |

Plus: `package.json` (Next.js 16, React 19, pg, pg-boss, zod), `tsconfig.json`, `next.config.ts`, `vitest.config.ts`, `scripts/` with 8 TypeScript scripts, `tests/` with 3 test files.

**Why this was critical:** The governance docs called this "control tower infrastructure" but:
- It was built in the same commit as the product MVP (`f006bc1`: "Build control tower and fixed-text preservation MVP")
- The line between "factory dashboard" and "product app" was a naming convention, not a structural boundary
- This was the exact pattern that caused the original drift

**Disposition:** Extracted to `IsIdeas_quarantine/control-tower_2026-03-31/` with its own git repo. Committed as `e8938a0`.

### HIGH-1: README contradicted factory-only claim

**Evidence:** The README simultaneously said:
- "IsIdeas may not host application implementations" (line 100)
- "This repository now includes a runnable local control tower: Next.js dashboard at the repo root" (lines 35-36)
- Listed `npm install`, `npm run dev`, `npm run build` commands (lines 52-58)

**Why this mattered:** A repo that says "no implementations" while documenting how to run its implementation sends mixed signals. This ambiguity is how drift gets rationalized.

**Disposition:** README fully rewritten for pure markdown factory. Committed in `8cfac43`.

### HIGH-2: No structural enforcement against future drift

**Evidence:** No automated mechanism prevented a future session from creating `apps/`, adding product code to `src/`, installing dependencies, or writing application code disguised as "factory tooling." ADR-010 was a policy document — policies prevent deliberate violations but not drift.

**Why this mattered:** The original drift was not deliberate. It was incremental: "just building factory tooling" became "building the app."

**Disposition:** Created `FACTORY_SCOPE_BOUNDARY.md` (explicit whitelist/blocklist), `QUARANTINE_PROTOCOL.md` (step-by-step procedure), scope-check in EMPLOYEE_PROTOCOLS and OPERATING_LOOP. Physical absence of code is the strongest safeguard. Note: no in-repo automated guard exists — this is a deliberate tradeoff (see CF-004 in Codex's audit).

### HIGH-3: `CLAUDE.md` said "runtime" — actively inviting drift

**Evidence:** CLAUDE.md mission: "Build the portfolio, **runtime**, research base..." Priority 5: "tooling and **runtime** leverage." AI agents read CLAUDE.md first. The word "runtime" in the mission would actively invite future sessions to build or maintain runtime code.

**Why this mattered:** CLAUDE.md is the most-read file by AI agents. If it says "runtime," agents will try to build runtime.

**Disposition:** Removed "runtime" from mission and priorities. Committed in `8cfac43`.

### HIGH-4: `runtime/seed/state.json` was governed truth stored as opaque JSON

**Evidence:** `workflows/CONSISTENCY_AND_SOURCE_OF_TRUTH.md` line 13 listed `runtime/seed/state.json` as governed repo truth. The file contained 529 lines of portfolio intelligence: 10 decisions, 5 bottlenecks, 4 ideas, critique artifacts, integrity flags, tools, research — all in a JSON blob opaque to git diffs.

**Why this mattered:** Governed truth should be legible. JSON state files are opaque to reviewers — a changed leverage score or updated bottleneck appears as a byte diff, not a visible fact change. The two-tier truth model (governed markdown + governed JSON) created confusion about what was canonical.

**Disposition:** Migrated to 4 governed markdown tables: `BOTTLENECK_MAP.md`, `CRITIQUE_REGISTRY.md`, `INTEGRITY_BOARD.md`, `TOOLING_AND_RESEARCH.md`. Runtime-only fields (loops, runs, runtimeMode, schemaVersion) were NOT migrated — they belonged to the extracted dashboard. Committed in `e8938a0`.

### MEDIUM-1: Unstaged changes mixed quarantine corrections with dashboard code

**Evidence:** The 56 unstaged files included two distinct categories:
- Category A (quarantine corrections): `apps/` deletion, catalog updates, governance edits, new ADR-010
- Category B (dashboard feature work): modifications to `src/app/page.tsx`, `src/lib/state.ts`, `src/lib/types.ts`, etc.

Committing both as "quarantine governance" would have been exactly the kind of silent scope mixing the governance docs exist to prevent.

**Disposition:** Split into separate commits: Category A in `fdf8df6`, Category B discarded when `src/` was deleted in `e8938a0`.

### MEDIUM-2: `.env.local` contained live API keys on disk

**Evidence:** `.env.local` (gitignored) contained `OPENAI_API_KEY`, `OPENROUTER_API_KEY`, `ANTHROPIC_API_KEY` values.

**Disposition:** Deleted from disk in pre-step. Not a git-tracked issue but a disk-hygiene issue.

### MEDIUM-3: Stray `` `.txt `` file at repo root

**Evidence:** An untracked file containing Cisco switch VLAN configuration commands. Completely unrelated to IsIdeas.

**Disposition:** Deleted from disk in pre-step.

### MEDIUM-4: `AUTONOMOUS_LOOPS.md` framed governance as running software

**Evidence:** The file tracked loops as "implemented" or "accountability-only" — implying software that runs, not practices an operator follows.

**Disposition:** Renamed to `OPERATING_CADENCES.md` and rewritten as a documentation-only cadence ledger. "Loops" implies code; "cadences" describes rhythms.

### MEDIUM-5: Handoff packets buried in `codex/` instead of having their own exit lane

**Evidence:** The handoff task packet was at `codex/FIXED_TEXT_PRESERVATION_MVP_TASK_PACKET.md` — mixed with operator guidance.

**Disposition:** Created `handoff/` as a top-level directory. Moved the packet there. The factory's purpose is to produce handoff packets — they deserve their own exit lane.

### MEDIUM-6: No defined submission flow after dashboard removal

**Evidence:** `submissions/README.md` said "the live app writes submissions into runtime/local/state.json." With the app gone, there was no defined way for the owner to submit ideas.

**Disposition:** Redefined as markdown-native intake: `capture/YYYY-MM-DD-<slug>.md` with `templates/OWNER_SUBMISSION_TEMPLATE.md`. Created `capture/` directory.

---

## Part 2: Stale Reference Sweep

22+ governance documents contained references to the dashboard, runtime, npm, Next.js, PostgreSQL, or other extracted concepts. Each was read and surgically edited.

### Files updated in the stale-reference sweep (Commit 3: `8cfac43`)

| File | What was fixed |
|---|---|
| `README.md` | Full rewrite for pure markdown factory |
| `CLAUDE.md` | Removed "runtime" from mission and priorities |
| `control_tower/EMPLOYEE_PROTOCOLS.md` | Removed "implement factory/runtime changes," added scope-check section |
| `control_tower/OPERATING_LOOP.md` | Added scope-drift check, removed "runtime loop state" auto-write target |
| `control_tower/ARCHITECTURE.md` | Rewritten for pure-document architecture |
| `control_tower/README.md` | Removed dashboard/runtime references |
| `control_tower/START_HERE.md` | Removed "dashboard and bootstrap runtime are live" |
| `control_tower/BOOTSTRAP_PROMPT.md` | Removed `runtime/README.md` reference |
| `control_tower/SUPERVISED_PROVING_RUN.md` | Added historical-context header (ADR-011) |
| `control_tower/INTEGRITY_POLICY.md` | Removed runtime mutation reference |
| `control_tower/SESSION_CHECKLIST.md` | Checked — no stale references found |
| `workflows/CONSISTENCY_AND_SOURCE_OF_TRUTH.md` | Major rewrite: removed two-tier truth model, single governed-markdown tier |
| `workflows/CHATGPT_CODEX_OPERATING_SYSTEM.md` | Removed "the repo, runtime, and research surface" |
| `workflows/SESSION_OPERATING_PROTOCOL.md` | Checked — no stale references found |
| `workflows/PROMOTION_CHECKLISTS.md` | Checked — no stale references found |
| `submissions/README.md` | Rewritten for markdown-native intake |
| `research/README.md` | Removed "dashboard surfaces research status" |
| `codex/HUMAN_OPERATING_PLAYBOOK.md` | Removed dashboard and runtime references |
| `codex/IMMEDIATE_NEXT_ACTIONS.md` | Updated for new state |
| `codex/START_HERE.md` | Removed runtime/dashboard lane |
| `codex/README.md` | Removed "build/runtime notes" |
| `ideas/memorization-os/SPEC.md` | Updated "runtime primitives" reference |
| `catalog/REPO_HEALTH.md` | Updated health status |
| `decisions/ADR-006-POSTGRES-RUNTIME-UPGRADE.md` | Marked as superseded per ADR-011 |
| `ADVERSARIAL_REVIEW_2026-03-30.md` | Added historical-context header |
| `.gitignore` | Stripped to `.DS_Store` and `*.log` only |

---

## Part 3: What Was Already Strong

These findings matter for the synthesis because they are load-bearing strengths that should NOT be changed:

1. **ADR-010 is clear and well-written.** The factory-only decision is explicit, motivated by a real failure, and states consequences. Good decision-record discipline.

2. **The quarantine pattern is correct.** Moving out-of-scope code to `IsIdeas_quarantine/` with commit references and `QUARANTINED_BUILDS.md` entries. Both quarantined builds now have their own git repos for integrity.

3. **HANDOFF_QUEUE.md creates a real exit lane.** Ideas that are "done enough" leave active depth. This prevents the factory from endlessly deepening work on ideas that should leave.

4. **PROMOTION_CHECKLISTS.md is rigorous.** Stage gates ask real questions. The handoff-ready gate asks "would implementation still need to guess about core behavior?" — that's the right bar.

5. **EMPLOYEE_PROTOCOLS.md names the exact failure mode.** "Codex may also not quietly turn `IsIdeas` into a product-hosting repo."

6. **The 16 workflow documents are comprehensive.** Lifecycle semantics, staleness rules, focus discipline, consistency rules, naming conventions — unusually thorough for a personal project.

7. **The catalog/control_tower/decisions separation is well-structured.** Governed truth has clear ownership surfaces. The vocabulary rule prevents definitional drift.

8. **Implementation learnings were preserved.** `ideas/memorization-os/RESEARCH.md` captures what the quarantined build taught the factory, with a note that learnings ≠ permission to rebuild.

9. **IDEA_REGISTRY.md is clean.** I-001 properly at `handoff_ready`. I-002 properly at `challenge` with concrete blockers.

---

## Part 4: Safeguards Added

| Safeguard | File | What it does |
|---|---|---|
| Factory scope boundary | `control_tower/FACTORY_SCOPE_BOUNDARY.md` | Explicit whitelist of allowed file types (.md, .json, .yaml). Explicit blocklist of forbidden types (.ts, .tsx, .js, .jsx, .py, .sql, package.json, build configs). The test: "Is this documentation, governance, or a handoff artifact?" |
| Quarantine protocol | `workflows/QUARANTINE_PROTOCOL.md` | 7-step procedure: detect → stop → copy to quarantine → git init inside → record in QUARANTINED_BUILDS → delete from repo → commit immediately. Quarantined builds never re-merge. |
| ADR-011 | `decisions/ADR-011-EXTRACT-CONTROL-TOWER-DASHBOARD.md` | Records the extraction decision with root cause (same-commit as MVP), consequence (pure markdown), and what remains. Prevents quiet re-introduction. |
| CLAUDE.md hardened | `CLAUDE.md` | "Runtime" removed from mission and priority 5. AI agents can no longer misread the mission as including runtime work. |
| Scope-check in protocols | `control_tower/EMPLOYEE_PROTOCOLS.md` | New "Scope Check Before Building" section. Before creating any non-markdown file, verify it's not application code. If ambiguous, write an ADR first. |
| Drift detection in loop | `control_tower/OPERATING_LOOP.md` | Step 1 now includes "verify no application code has entered the repo." |
| Operating cadences | `control_tower/OPERATING_CADENCES.md` | Replaces AUTONOMOUS_LOOPS.md. Documented rhythms, not running software. Removes the framing of governance as automated systems. |
| Handoff directory | `handoff/` | Dedicated exit lane for builder-facing packets. Separates handoff artifacts from operator guidance. |
| Markdown-native intake | `capture/`, `templates/OWNER_SUBMISSION_TEMPLATE.md` | Submissions as tracked markdown files, not runtime-local JSON state. |
| Single-tier truth model | `workflows/CONSISTENCY_AND_SOURCE_OF_TRUTH.md` | Removed the two-tier model (governed vs. operational runtime). All truth is governed markdown. |

**Strongest safeguard:** Physical absence of application code. No `src/`, no `package.json`, no build tooling. Any future implementation requires creating infrastructure from scratch — a visible, deliberate act.

**Known gap:** No in-repo automated guard exists. This is a deliberate tradeoff: reintroducing automated checks would itself reintroduce the toolchain surface the boundary now forbids. See CF-004 in Codex's audit.

---

## Part 5: I-002 Curriculum Architect Determination

### Session Design

The original questions ("Can prerequisites be modeled? What authority boundary rule?") were reframed after adversarial review:

**Problem with original framing:** Defining a prerequisite ontology and testing it against Islamic sciences is a scholarly act. Claude doing this would violate the "no false scholarly authority" non-negotiable.

**Reframed questions:**
1. Can software hold multiple contradictory prerequisite structures from real traditions without taking a position? (architecture question)
2. Do published Islamic curricula already provide explicit prerequisite structures that software could consume? (empirical question)

### Results

**Authority boundary architecture: PASS**

The system is a container, not a source. Key design:
- Every prerequisite edge carries source attribution (which curriculum, which teacher)
- No default sequence — student must select a curriculum or enter teacher guidance
- Teacher override on every edge — system never frames teacher as wrong
- Visible disagreement between traditions — never hidden behind a single recommendation

This is a legitimate software-architecture judgment. High confidence.

**Published curricula survey: PASS (qualified)**

| Source | Explicit sequence? | Granularity | Consumable? |
|---|---|---|---|
| Dars-e-Nizami | Yes | Text-level | Yes, as one named curriculum |
| Al-Azhar | Yes | Science-level, partial text | Yes, at science level |
| Mauritanian mahadra | Broad yes | Science-level; text-level varies | Partially |
| Online platforms | Some yes | Course-level | Yes, where provided |
| Classical texts | General principles | Conceptual | No (principles, not data) |

Evidence is based on general knowledge (medium confidence), not primary sources. Needs verification.

**kr dependency: Does NOT block frontier re-entry**

kr blocks build, not factory work. Dossier-deepening, curriculum sourcing, data model design, and spec work can all proceed without kr.

### Verdict: Outcome A — Stays at challenge/visible with defined re-entry path

I-002 is NOT parked and NOT promoted. It has a 4-step re-entry path:

1. Source at least one specific, complete published curriculum sequence
2. Design the authority boundary data model at spec-ready granularity
3. Write a concrete MVP scope
4. Find a scholar or curriculum expert to validate the sourced curriculum and the authority boundary mechanism

### What argument the decision defeated

"Prerequisite structures cannot be modeled without claiming false scholarly authority." Wrong in strong form (published curricula already model them). Correct in weak form (the system must consume existing structures, not invent its own).

### What uncertainty remains

- Curricula survey needs primary-source verification
- Whether science-level granularity is useful enough for real students — user-research question
- Whether authority boundary prevents false authority in practice — requires scholarly validation
- I-001 lesson: practical surprises are expected

### Full analysis

See `research/I-002-MODELABILITY-SESSION-2026-03-31.md` and `decisions/ADR-012-I-002-MODELABILITY-DETERMINATION.md`.

---

## Part 6: Synthesis-Ready Action Extraction

### Open / still relevant

1. **Source one specific published curriculum sequence** for I-002 (e.g., obtain a detailed Dars-e-Nizami text list with year-by-year ordering). This is the single best next move for the factory.
2. **Begin the authority-boundary data model design** at spec-ready granularity once a published sequence is sourced.
3. **Find a scholar or curriculum expert** who can validate the sourced curriculum and the authority boundary mechanism.
4. **Decide whether boundary enforcement should be added outside the repo** (external CI, review workflow, or accept pure-markdown discipline as sufficient). This is the CF-004 tradeoff from Codex's audit.
5. **Validate the curricula survey with primary sources.** The I-002 determination is based on general knowledge; the re-entry path requires verified evidence.

### Already resolved in this session

1. Committed the uncommitted quarantine (apps/ deletion + governance updates)
2. Extracted the control tower dashboard to quarantine
3. Migrated state.json to governed markdown
4. Created handoff/ directory and moved builder packet
5. Rewrote README, CLAUDE.md, and 20+ governance docs
6. Added FACTORY_SCOPE_BOUNDARY, QUARANTINE_PROTOCOL, OPERATING_CADENCES
7. Ran I-002 modelability determination and defined 4-step re-entry path
8. Created ADR-010, ADR-011, ADR-012

### Resolved by Codex in parallel session

(Per `2026-03-31-codex-factory-hardening-verification.md`)

1. Deleted `control_tower/SUPERVISED_PROVING_RUN.md` (I had added a historical header; Codex judged deletion was better — I agree)
2. Tightened runtime/control-plane framing in several docs I also touched
3. Synced all portfolio surfaces to one explicit next move

---

## Part 7: Bottom-Line Judgment

The factory-only scope correction is complete. The repo contains zero application code, zero build tooling, and zero hidden mutable state. Governed truth is legible markdown. The quarantine pattern works and is documented. The safeguard documents make the boundary explicit and procedural.

The main residual risks are:
1. **No in-repo automated guard** — drift prevention is structural (no code surface) plus documentary (FACTORY_SCOPE_BOUNDARY). This is a deliberate tradeoff.
2. **I-002 curricula evidence is unverified** — the determination is based on general knowledge. The re-entry path requires primary-source validation.
3. **Scholarly validation is needed** — the authority boundary mechanism is architecturally sound but needs a domain expert to confirm it doesn't misrepresent traditions.

The single best next move for the factory is: **source one specific published curriculum sequence for I-002.**
