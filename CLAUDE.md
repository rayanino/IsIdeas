# CLAUDE.md

This repository contains **implementation-grade idea specifications** for a long-horizon Islamic-study software environment.

The job here is not to brainstorm casually.
The job is to produce ideas that are strategically valuable, rigorously scoped, and clear enough for Claude Code to implement without guessing at fundamentals.

## Core Rule

Do not treat this repository as a notebook of interesting thoughts.
Treat it as a **specification system**.

Every substantial addition should either:
- improve the methodology of the repository, or
- add/refine a software idea specification.

## Repository Priorities

Optimize for:
- strategic leverage,
- correctness,
- clarity,
- explicit tradeoffs,
- implementation readiness,
- cross-app coherence.

Do not optimize for:
- novelty for its own sake,
- inflated scope,
- aesthetic fluff,
- vague product language,
- pseudo-scholarly claims,
- features without a real bottleneck behind them.

## How To Work On Ideas

For every idea, think through the full chain:
1. What exact study bottleneck does this attack?
2. Why is software the right tool here?
3. Why is this specifically useful in Islamic study, rather than generic studying?
4. What are the core entities and data contracts?
5. What must be source-backed versus inferred?
6. Where are the correctness risks?
7. What must remain under human control?
8. What is the MVP boundary?
9. How would we know whether it worked?
10. How does it compound with the rest of the portfolio?

## Required Standard For Specs

A spec is not complete unless it includes:
- thesis,
- user problem,
- strategic value,
- workflow,
- inputs,
- outputs,
- data model,
- system behavior,
- constraints,
- failure modes,
- evaluation criteria,
- MVP and later phases,
- implementation brief.

## Islamic-Study Specific Discipline

Be careful not to smuggle in assumptions that belong to scholars, teachers, or mature students.

The software may:
- structure,
- retrieve,
- compare,
- schedule,
- trace,
- flag,
- organize,
- assist review.

The software may not responsibly:
- invent scholarly judgments,
- hide uncertainty,
- flatten meaningful disagreement,
- present inferred claims as established knowledge,
- bypass human review where scholarly risk is meaningful.

## Writing Standard

Write like a senior systems designer preparing work for implementation.
Prefer sharp definitions over expansive prose.
Every major claim should cash out into architecture, workflow, or scope.

## Portfolio Coherence Rule

Do not create isolated apps unless there is a strong reason.
Prefer systems that share primitives with the rest of the portfolio, such as:
- source IDs
- topic IDs
- excerpt IDs
- scholar IDs
- claim IDs
- memorization objects
- review events
- uncertainty markers

## Default Move

When in doubt, improve the specification quality of an existing high-value idea instead of adding a new lower-quality one.
