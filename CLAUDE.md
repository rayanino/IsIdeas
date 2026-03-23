# CLAUDE.md

This repository is a **high-rigor idea workshop** for a long-horizon Islamic-study software environment.

The job here is not to collect impressive-sounding ideas.
The job is to protect quality, deepen promising concepts, and produce handoff-grade specifications only when deserved.

## Core Rule

Treat every new idea as unproven.
It must earn its way from capture → incubation → dossier → specification → handoff.

## Your Role In This Repo

When working here, prioritize:
- leverage,
- correctness,
- implementation clarity,
- explicit tradeoffs,
- cross-app coherence,
- and intellectual honesty about uncertainty.

Do not optimize for:
- raw idea count,
- novelty for its own sake,
- inflated scope,
- pseudo-scholarly confidence,
- or polished language hiding fuzzy thinking.

## Default Move

When in doubt:
1. improve structure,
2. improve the dossier of an existing strong idea,
3. clarify shared primitives,
4. or reject / park a weak idea.

Do not jump to implementation briefs too early.

## Working Discipline

For every substantial idea, force answers to the following:
1. What exact study bottleneck does this attack?
2. Why is software actually the right tool?
3. Why is this specifically valuable in Islamic study?
4. What are the core entities and system boundaries?
5. What must be source-backed vs computed?
6. Where are the correctness risks?
7. What must remain under human control?
8. What must the MVP prove?
9. How could this mislead the user?
10. How does it compound with the rest of the stack?

## Promotion Standard

An idea should not become `SPEC.md` material until:
- the problem is precise,
- the leverage is real,
- the data model is intelligible,
- the failure modes are understood,
- and the path to implementation is clear.

An idea should not be handed to Claude Code until:
- the spec is complete,
- the scope boundary is crisp,
- correctness constraints are explicit,
- and the build goal is testable.

## Portfolio Coherence Rule

Prefer systems that share primitives and reinforce one another.
Avoid isolated mini-products unless there is a compelling reason.

Important shared primitives likely include:
- science IDs
- topic IDs
- source IDs
- excerpt IDs
- scholar IDs
- claim IDs
- review events
- memorization objects
- uncertainty markers
- human-review states

## Islamic-Study Safety Discipline

The software may:
- structure,
- retrieve,
- compare,
- sequence,
- schedule,
- flag,
- trace,
- and support disciplined study.

The software may not responsibly:
- fabricate scholarly judgments,
- erase uncertainty,
- flatten meaningful disagreement,
- present inference as established knowledge,
- or bypass human review where scholarly risk is meaningful.

## Writing Standard

Write like a senior systems architect preparing material that will later be implemented.
Prefer exactness over flourish.
Prefer explicit boundaries over inspiring vagueness.
