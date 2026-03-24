# IsIdeas

A high-rigor workshop for designing the software environment that will support serious Islamic study over the next three years and beyond.

This repository is not an idea dump.
It is a **quality-controlled idea workshop**.

The purpose is to give every promising idea its own room, its own scrutiny, and its own path from spark to implementation.

## Strategic Thesis

The opportunity is not merely to gather more information.
The opportunity is to build a study operating system that reduces chaos, preserves attention, surfaces gaps, strengthens retention, and compounds over a lifetime of study.

`kr` is the knowledge substrate.
`IsIdeas` is the surrounding portfolio and design workshop.

## What This Repo Is For

This repo should make it easy to do six things well:
1. capture ideas quickly without losing them,
2. incubate one idea deeply in a dedicated workspace,
3. enforce a very high quality bar before promotion,
4. preserve architectural decisions and rejected paths,
5. control focus so attention does not fragment,
6. hand only mature ideas to Claude Code for implementation.

## Core Working Model

Every idea moves through stages.

- **Spark** — worth recording, not yet trusted
- **Incubating** — worth serious discussion
- **Dossier** — working document after deep discussion and research
- **Spec-ready** — precise enough to harden into an implementation spec
- **Handoff-ready** — mature enough for Claude Code
- **Parked / Rejected** — intentionally not active

The default move is **not** to turn a fresh idea into a build request.
The default move is to give it a workspace, challenge it, and see whether it deserves to live.

## Repository Map

```text
IsIdeas/
  README.md
  CLAUDE.md
  principles/
    STUDY_OS_PRINCIPLES.md
    QUALITY_BAR.md
    ANTI_CHAOS_RULES.md
    IDEA_EVALUATION_RUBRIC.md
    EXTRAORDINARY_IDEA_STANDARD.md
  workflows/
    IDEA_LIFECYCLE.md
    IDEA_STAGE_SEMANTICS.md
    STAGE_DEFINITION_OF_DONE.md
    SESSION_OPERATING_PROTOCOL.md
    CHAT_SCOPING_RULES.md
    FOCUS_DISCIPLINE.md
    REVIEW_CADENCE.md
    STALENESS_AND_DORMANCY_RULES.md
    PROMOTION_CHECKLISTS.md
    PORTFOLIO_PRIORITIZATION_FRAMEWORK.md
    NAMING_AND_NUMBERING_CONVENTIONS.md
    CONSISTENCY_AND_SOURCE_OF_TRUTH.md
    WORKSPACE_CONTRACT.md
    IDEA_GENERATION_PROTOCOL.md
    CHATGPT_CODEX_OPERATING_SYSTEM.md
    CLAUDE_HANDOFF_STANDARD.md
  templates/
    QUICK_CAPTURE_TEMPLATE.md
    IDEA_DOSSIER_TEMPLATE.md
    IDEA_SPEC_TEMPLATE.md
    IDEA_WORKSPACE_README_TEMPLATE.md
    SESSION_NOTE_TEMPLATE.md
    RESEARCH_NOTE_TEMPLATE.md
    IDEA_AUDIT_TEMPLATE.md
    AUDIT_CHECKLIST.md
    CODEX_TASK_PACKET_TEMPLATE.md
  capture/
    README.md
  catalog/
    ACTIVE_FOCUS.md
    PORTFOLIO_PRIORITY_BOARD.md
    IDEA_REGISTRY.md
    OPEN_QUESTIONS.md
    PARKED_AND_REJECTED.md
    REPO_HEALTH.md
  codex/
    README.md
    START_HERE.md
    HUMAN_OPERATING_PLAYBOOK.md
    PROMPT_LIBRARY.md
    TASK_QUEUE.md
    PR_REVIEW_CHECKLIST.md
    IMMEDIATE_NEXT_ACTIONS.md
  control_tower/
    README.md
    CHARTER.md
    EMPLOYEE_PROTOCOLS.md
    OPERATING_LOOP.md
    START_HERE.md
    BOOTSTRAP_PROMPT.md
    SESSION_CHECKLIST.md
  ideas/
    README.md
    <idea-slug>/
      README.md
      DOSSIER.md
      SPEC.md              # only when promoted
      RESEARCH.md          # optional when needed
      SESSIONS/            # optional, when discussion history matters
  shared/
    GLOSSARY.md
    SHARED_PRIMITIVES.md
    KR_BOUNDARY.md
  decisions/
    README.md
    ADR-001-WORKSHOP-FIRST.md
    ADR-002-ONE-WORKSPACE-PER-IDEA.md
    ADR-003-CAPTURE-SEPARATE-FROM-SERIOUS-REGISTRY.md
    ADR-004-FOCUS-IS-INTENTIONALLY-NARROW.md
    ADR-005-PORTFOLIO-TRUTH-MUST-HAVE-CLEAR-OWNERS.md
  roadmaps/
    THREE_YEAR_ROADMAP.md
```

## How We Will Use It

Recommended operating rhythm:
1. capture or identify one promising idea,
2. decide whether it stays a spark or deserves incubation,
3. deepen one serious target at a time into the dossier,
4. pressure-test it hard,
5. record decisions and open questions,
6. only then decide whether it deserves spec work.

## Non-Negotiables

- quality over quantity,
- no shallow idea inflation,
- no silent scholarly overreach,
- explicit uncertainty when needed,
- traceability where claims matter,
- clear stage separation,
- clear reason for every promotion,
- preserved record of important decisions,
- active attention kept narrow enough for depth.

## Current Starting Point

The repo begins with three incubating idea workspaces:
- curriculum architect,
- memorization OS,
- question & confusion ledger.

These are starting seeds, not final verdicts.

## Practical Rule

If an idea cannot survive deep challenge, that is success, not failure.
Rejecting weak ideas is part of protecting the three-year opportunity.
