# 2026-03-31 ChatGPT PR-14 Scope Audit

## Provenance

- source: user-pasted findings from a parallel ChatGPT session
- scope described by source: evaluation of the corrected candidate state on PR #14 versus then-live `main`
- preservation note: saved here as an external audit artifact for later synthesis; this file is not canonical truth by itself

---

I evaluated the corrected candidate state on PR #14, because current `main` still does **not** contain several of the files you listed. That distinction matters: the reset is structurally strong on the branch, but it is not yet true at the repo level while the live default state is still split. ([GitHub][1])

## Findings, ordered by severity

1. **The reset is not operationally complete yet.**
   Right now, the "factory-only" correction lives in an **open PR**, while current `main` still lacks `ADR-010`, `HANDOFF_QUEUE`, and `QUARANTINED_BUILDS`, and still shows older portfolio semantics with Fixed-Text Preservation as active focus. That means you do not yet have one enforced source of truth; you have a corrected branch competing with an older live repo state. ([GitHub][1])

2. **On the corrected branch, the repo is mostly factory-only.**
   The branch root is document/workflow/handoff oriented rather than app/runtime oriented; `README` says the repo is not the place for application code; `ADR-010` explicitly says IsIdeas is a factory and not an implementation host; `FACTORY_SCOPE_BOUNDARY` forbids app languages, product UI/API/runtime artifacts, `package.json`, Docker/CI/CD, and unattended loops; and the operating loop explicitly starts by checking that no application code has entered the repo. That is a real structural correction, not just a slogan. ([GitHub][2])

3. **The original drift was architectural, not incidental.**
   The repo had previously absorbed a quarantined product implementation in `apps/` and also a 2,793-line Next.js control tower dashboard/runtime with `src/`, `scripts/`, `runtime/`, `tests/`, `package.json`, database/API layers, and AI red-team machinery. Once idea evaluation, runtime state, and product code sat in the same repository, implementation drift was no longer a mistake; it was the path of least resistance. ([GitHub][3])

4. **The repo drifted because "factory infrastructure" became a disguised app.**
   The most dangerous failure mode was not just building the product itself; it was treating dashboard/runtime software as legitimate factory tooling inside the same repo. That created a moral loophole: product code could re-enter under the label of "control tower," "state management," or "portfolio operations," even though it was still application engineering. ([GitHub][3])

5. **Your remaining biggest risk is AI-led self-confirmation.**
   The corrected branch makes Codex the "default factory lead" and allows it to write decisions and update governed state. There is a useful anti-self-ratification clause, but there is still no hard requirement that frontier promotion, handoff promotion, or scope-boundary changes receive explicit owner approval before becoming canonical. That means the repo still has a built-in tendency to let the operator justify its own work. ([GitHub][4])

6. **The portfolio semantics are much better, but still slightly mislabeled.**
   The new board distinguishes `frontier`, `handoff`, `challenge`, and `watch`, which is exactly the right direction. But in `IDEA_REGISTRY`, the field still called `Priority` is now being used as an operating lane (`handoff`, `challenge`) rather than a ranking dimension, which will eventually muddy portfolio reading and encourage silent semantic drift. ([GitHub][5])

7. **The handoff queue solves status confusion, but not implementation gravity.**
   I-001 is correctly moved out of active focus and into `HANDOFF_QUEUE`, and `ACTIVE_FOCUS` explicitly says the factory should not keep working on implementation-adjacent detail after handoff. That is good. But the repo still contains a detailed build packet for the standalone app, so unless you add a strict "re-open only by ADR" rule, the handoff lane can slowly become a shadow implementation lane. ([GitHub][6])

8. **Quarantine exists, but the custody model is weak.**
   `QUARANTINED_BUILDS.md` records the removed prototype to a **local desktop path** and the protocol says to move out-of-scope code there. That preserves memory, but it is not durable institutional handling; it is machine-specific, non-portable, and hard to review later. A quarantine that depends on one local filesystem is not a hardened boundary. ([GitHub][7])

9. **You removed code-infrastructure, but you may be drifting toward process-infrastructure.**
   The corrected branch adds many governance surfaces: bottleneck map, critique registry, integrity board, tooling/research, handoff queue, repo health, task queue, cadences. That is acceptable only if each surface has a distinct decision purpose and an expiry/pruning rule. Otherwise the repo stops being code-heavy and starts becoming bureaucracy-heavy. ([GitHub][8])

10. **Some references are already stale, which is a governance smell.**
    The file you asked me to read, `control_tower/AUTONOMOUS_LOOPS.md`, has been renamed to `OPERATING_CADENCES.md`. That is fine substantively, but stale file references in prompts or checklists are exactly how old mental models survive after a reset. ([GitHub][3])

## What is actually good

* The corrected branch finally makes the scope boundary explicit in more than one place: `README`, `ADR-010`, `FACTORY_SCOPE_BOUNDARY`, and the operating loop all say the repo is for idea discovery, critique, hardening, and handoff-not for shipping software. ([GitHub][9])

* The handoff/quarantine split is the right structural move. `HANDOFF_QUEUE` gives mature ideas a place to go without staying in deep focus, and `QUARANTINED_BUILDS` gives out-of-scope implementation work a documented exile path. ([GitHub][10])

* `ACTIVE_FOCUS` is doing the right thing after the scope reset. It explicitly clears deep attention after I-001 becomes handoff-ready, which is exactly how you stop a factory from polishing a build forever. ([GitHub][6])

* The critique requirement is materially stronger than before. The branch says Codex cannot silently self-ratify frontier status and must attach an independent critique artifact when preserving or advancing a frontier idea. That is one of the few rules here that directly fights self-confirming loops. ([GitHub][4])

## What must change so this mistake cannot recur

1. **Make the corrected branch the live repo immediately.**
   Until PR #14 becomes the default branch state, the reset is not real; it is a proposal. Your first control failure is branch-level ambiguity. ([GitHub][1])

2. **Add a platform-level forbidden-file gate.**
   Do not rely on prose. Add a required PR check outside the repo's content model that fails on forbidden patterns: `apps/`, `src/`, `runtime/`, `tests/`, `package.json`, lockfiles, `.ts/.tsx/.js/.jsx/.py`, Docker files, deploy configs, migrations, API routes, and other runtime artifacts. The branch already defines the forbidden classes in `FACTORY_SCOPE_BOUNDARY`; now enforce them mechanically. ([GitHub][11])

3. **Require explicit owner approval for three classes of mutation:**

   * frontier promotion
   * handoff promotion
   * any change to scope-boundary or governance docs
     The current anti-self-ratification language is good but insufficient. These mutations should never become canonical by agent momentum alone. ([GitHub][4])

4. **Freeze handoff items unless formally re-opened by ADR.**
   Once an idea enters `HANDOFF_QUEUE`, it should be effectively read-only inside IsIdeas except for bug-level clarifications. Any substantive change should require an ADR called something like "Re-open from handoff to factory." Otherwise packet refinement becomes implementation creep in slow motion. ([GitHub][10])

5. **Fix the lifecycle vocabulary.**
   Rename `Priority` in `IDEA_REGISTRY` to `Lane` or split it into two fields: `Stage` and `Lane`. Right now you have improved semantics trapped in a misleading column name. That is exactly the kind of small inconsistency that later causes portfolio confusion and sloppy promotion logic. ([GitHub][5])

6. **Move quarantine custody out of a local desktop path.**
   A quarantined build should live in a dedicated separate repo or durable archive reference with a recorded commit pointer, not in `C:\Users\...`. Quarantine should be reviewable, recoverable, and independent of one machine. ([GitHub][7])

7. **Ban in-repo dashboards permanently.**
   Not "ban dashboards unless they are small." Ban them. If you ever want a dashboard again, it must live in a separate repo and consume exported markdown/structured snapshots from IsIdeas. The prior dashboard was one of the main re-entry routes for implementation gravity. ([GitHub][3])

## The single best next move

**Make PR #14 the live default state and lock it with a forbidden-file gate.**
That is the move. Not more portfolio work, not more ideation, not more packet polishing. Until the corrected branch becomes the actual repo and the scope boundary is mechanically enforced, every other improvement is reversible by drift. ([GitHub][1])

## Concrete next-3-steps sequence

1. **Merge or fast-forward to the corrected branch, then delete the branch-level ambiguity.**
   After that, update any stale references such as `AUTONOMOUS_LOOPS.md` so every bootstrap path points at the same operating model. ([GitHub][1])

2. **Install two hard controls immediately:**
   a) required forbidden-file check on every PR,
   b) required owner approval for frontier/handoff/scope-boundary changes.
   Those two controls directly target the two recurrence mechanisms that remain: implementation creep and self-ratification. ([GitHub][11])

3. **Run one bounded frontier-selection cycle on I-002 vs I-003, while keeping I-001 frozen in handoff.**
   That is the first healthy proof that the factory is functioning again: it should generate and challenge the next candidate, not keep orbiting the already-built thing. The corrected branch already points in that direction via `ACTIVE_FOCUS`, the board, and Codex immediate next actions. ([GitHub][6])

Net judgment: **the corrected branch is close to a real factory-only repo; the live repo is not there yet.** The reset is structurally credible, but it is not finished until it is the default state and protected by hard gates.

[1]: https://github.com/rayanino/IsIdeas/pulls "Pull requests · rayanino/IsIdeas · GitHub"
[2]: https://github.com/rayanino/IsIdeas/tree/codex/portfolio-truth-idea-002-p1 "https://github.com/rayanino/IsIdeas/tree/codex/portfolio-truth-idea-002-p1"
[3]: https://github.com/rayanino/IsIdeas/pull/14 "Harden factory-only scope and advance idea pipeline by rayanino · Pull Request #14 · rayanino/IsIdeas · GitHub"
[4]: https://github.com/rayanino/IsIdeas/blob/codex/portfolio-truth-idea-002-p1/control_tower/EMPLOYEE_PROTOCOLS.md "https://github.com/rayanino/IsIdeas/blob/codex/portfolio-truth-idea-002-p1/control_tower/EMPLOYEE_PROTOCOLS.md"
[5]: https://github.com/rayanino/IsIdeas/blob/codex/portfolio-truth-idea-002-p1/catalog/IDEA_REGISTRY.md "https://github.com/rayanino/IsIdeas/blob/codex/portfolio-truth-idea-002-p1/catalog/IDEA_REGISTRY.md"
[6]: https://github.com/rayanino/IsIdeas/blob/codex/portfolio-truth-idea-002-p1/catalog/ACTIVE_FOCUS.md "https://github.com/rayanino/IsIdeas/blob/codex/portfolio-truth-idea-002-p1/catalog/ACTIVE_FOCUS.md"
[7]: https://github.com/rayanino/IsIdeas/blob/codex/portfolio-truth-idea-002-p1/catalog/QUARANTINED_BUILDS.md "https://github.com/rayanino/IsIdeas/blob/codex/portfolio-truth-idea-002-p1/catalog/QUARANTINED_BUILDS.md"
[8]: https://github.com/rayanino/IsIdeas/pull/14/files "https://github.com/rayanino/IsIdeas/pull/14/files"
[9]: https://github.com/rayanino/IsIdeas/blob/codex/portfolio-truth-idea-002-p1/README.md "https://github.com/rayanino/IsIdeas/blob/codex/portfolio-truth-idea-002-p1/README.md"
[10]: https://github.com/rayanino/IsIdeas/blob/codex/portfolio-truth-idea-002-p1/catalog/HANDOFF_QUEUE.md "https://github.com/rayanino/IsIdeas/blob/codex/portfolio-truth-idea-002-p1/catalog/HANDOFF_QUEUE.md"
[11]: https://github.com/rayanino/IsIdeas/blob/codex/portfolio-truth-idea-002-p1/control_tower/FACTORY_SCOPE_BOUNDARY.md "https://github.com/rayanino/IsIdeas/blob/codex/portfolio-truth-idea-002-p1/control_tower/FACTORY_SCOPE_BOUNDARY.md"
