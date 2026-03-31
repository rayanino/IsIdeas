# ADR-011 — Extract control tower dashboard from IsIdeas

## Status
Accepted

## Decision
Extract the control tower dashboard and all runtime/app surfaces from IsIdeas. Migrate canonical state from `runtime/seed/state.json` into governed markdown tables. IsIdeas becomes a pure markdown factory with no application code, no `package.json`, no TypeScript, and no build tooling.

## Why

The control tower dashboard was built in the same commit as the fixed-text-preservation product MVP (`f006bc1`). They were conceived as one unit.

This created a structural invitation to scope drift: the `src/` directory contained 2,793 lines of Next.js application code (React UI, API routes, PostgreSQL integration, AI-powered red-team system) that the governance docs called "factory infrastructure." But the line between "factory dashboard" and "product app" was a naming convention, not a structural boundary.

An independent audit found:
- The README contradicted itself — claiming "no implementations" while documenting `npm run dev`
- `CLAUDE.md` said "runtime" in its mission statement, actively inviting AI agents to build runtime code
- `runtime/seed/state.json` was a hidden mutable canonical state file that governed surfaces referenced but could not easily inspect
- The dashboard code lived in `src/`, the standard product directory, with no marker distinguishing it from product code

This is the operationalization of ADR-010. ADR-010 established the factory-only mandate; ADR-011 removes the code that violated it.

## Consequence

- `src/`, `scripts/`, `runtime/`, `tests/`, `package.json`, and all build configs are removed from IsIdeas
- Dashboard code is quarantined to `C:\Users\Rayane\Desktop\IsIdeas_quarantine\control-tower_2026-03-31\`
- Portfolio data from `runtime/seed/state.json` is migrated into `catalog/BOTTLENECK_MAP.md`, `catalog/CRITIQUE_REGISTRY.md`, `catalog/INTEGRITY_BOARD.md`, and `catalog/TOOLING_AND_RESEARCH.md`
- Handoff packets move to a dedicated `handoff/` directory
- The dashboard may be rebuilt in a separate repository if needed
- ADR-006 (Postgres runtime upgrade) is superseded — it applies to the extracted control tower
