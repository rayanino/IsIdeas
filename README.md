# IsIdeas

A specification-first repository for software systems that materially increase the ceiling of serious Islamic study.

This repository is **not** for random app ideas.
It is for designing a coherent **study operating system**: a portfolio of software that improves structure, retrieval, sequencing, retention, comparison, verification, and long-horizon study execution.

## Strategic Thesis

The biggest advantage available to a modern student is not mere access to texts, but the disciplined use of software to reduce recurring scholarly friction.

The goal is not to replace scholarship.
The goal is to remove avoidable waste so the student can spend more effort on:
- understanding,
- memorizing,
- comparing,
- verifying,
- asking better questions,
- and benefiting correctly from teachers and books.

## Relationship to `kr`

`kr` is the knowledge substrate: the intelligent library layer.

`IsIdeas` sits around and above that substrate. It defines the surrounding software environment that turns a powerful library into a full study system.

In simple terms:
- `kr` = structured knowledge base
- `IsIdeas` = portfolio of leverage applications built on top of, around, or alongside that base

## What Belongs Here

A good idea in this repo usually does at least one of the following:
- improves correctness or traceability,
- improves study sequencing,
- improves memorization and retention,
- improves question capture and gap closure,
- improves cross-source comparison,
- improves disagreement mapping,
- improves self-correction and error detection,
- compounds with `kr` and other future systems.

## What Does **Not** Belong Here

Do not add ideas that are merely:
- flashy,
- UI-driven but strategically shallow,
- generic productivity tools with no Islamic-study specificity,
- impossible to specify clearly,
- built on silent inference for scholarly claims,
- convenience features that add complexity without lifelong leverage.

## Portfolio Layers

### 1. Knowledge Substrate
Systems that store, structure, and trace knowledge.
- `kr`
- evidence graph
- terminology graph
- provenance inspector

### 2. Study Execution
Systems that help the student actually study.
- curriculum architect
- memorization OS
- question & confusion ledger
- lesson digestion assistant
- review scheduler

### 3. Scholarly Leverage
Systems that create uncommon comparative advantage.
- khilaf mapper
- concept genealogy tracker
- ta'lil / reasoning-pattern miner
- scholar comparison workspace
- argument map builder

### 4. Self-Correction
Systems that protect against bad knowledge.
- contradiction detector
- ambiguity flagger
- confidence and evidence scoring
- citation verifier
- human review checkpoints

## Initial Build Order

1. Establish repository method documents
2. Define shared primitives and terminology
3. Write first high-quality idea specs
4. Keep ideas spec-first until design quality is consistently high
5. Hand selected specs to Claude Code for implementation

## Current First-Priority Ideas

1. Curriculum Architect
2. Memorization OS
3. Question & Confusion Ledger
4. Evidence / Citation Graph
5. Khilaf Mapper

## Repository Structure

```text
IsIdeas/
  README.md
  CLAUDE.md
  principles/
    STUDY_OS_PRINCIPLES.md
    IDEA_EVALUATION_RUBRIC.md
    SPEC_TEMPLATE.md
  ideas/
    001-curriculum-architect.md
    002-memorization-os.md
    003-question-confusion-ledger.md
  roadmaps/
    THREE_YEAR_ROADMAP.md
  shared/
    GLOSSARY.md
```

## Workflow

1. Capture a serious study bottleneck
2. Test whether software can truly attack it
3. Score the idea using the rubric
4. Write a full spec using the template
5. Stress-test failure modes and correctness risks
6. Only then hand it to implementation

## Non-Negotiables

- Source traceability
- Explicit uncertainty handling
- Human override where scholarly risk is meaningful
- Clear scope boundaries
- Evaluation criteria before implementation
- No silent hallucinated scholarly claims

## Immediate Next Step

The repository is now scaffolded with foundational documents and the first three idea specs.
From here, work should proceed by refining those specs and then adding the next tier: Evidence Graph and Khilaf Mapper.
