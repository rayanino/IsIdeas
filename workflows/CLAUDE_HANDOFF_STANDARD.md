# Claude Handoff Standard

A handoff to Claude Code should happen only when the idea is mature enough to build responsibly.

## Minimum Requirements

Before handoff, the repository should contain:
- a clear idea workspace,
- a mature dossier,
- a completed spec,
- explicit dependencies,
- correctness constraints,
- evaluation criteria,
- and a concise implementation brief.

## Handoff Packet Must Answer

1. What is being built?
2. What exact problem does it solve?
3. What is in scope for the MVP?
4. What is explicitly out of scope?
5. What data entities are required?
6. What must be source-backed vs computed?
7. What are the main failure modes?
8. What should the implementation not do?
9. What would count as success?
10. What future expansions are intentionally deferred?

## Handoff Rule

If Claude Code would still have to guess about core behavior, the handoff is premature.

## Preferred Shape

A clean handoff should let Claude Code begin implementation work without needing to invent:
- architecture fundamentals,
- domain boundaries,
- data contracts,
- or success criteria.

## Anti-Pattern

Do not hand off an idea simply because it sounds exciting.
Hand off only when it has survived challenge.
