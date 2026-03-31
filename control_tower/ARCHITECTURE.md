# Architecture

## Canonical Structure

IsIdeas is a governed markdown factory. All durable truth lives in version-controlled markdown documents organized into purpose-specific directories.

## Directory Roles

- `control_tower/` — charter, operating loop, cadences, integrity policy, role boundaries
- `catalog/` — idea registry, active focus, bottleneck map, open questions, health status
- `decisions/` — architectural decision records (ADRs)
- `ideas/` — per-idea workspaces (README, DOSSIER, SPEC, RESEARCH)
- `research/` — source-backed surveys, tool comparisons, bottleneck studies
- `shared/` — cross-cutting primitives and boundary definitions
- `workflows/` — lifecycle semantics, promotion checklists, session protocols
- `handoff/` — implementation-ready task packets for ideas leaving the factory
- `submissions/` — owner intake lane
- `codex/` — operator guidance and session startup context
- `templates/` — reusable document templates

## Version Control Layer

Git is the sole version control and audit mechanism. All state changes are traceable through commit history. There is no runtime, database, or application layer inside this repo.

## Truth Ownership

Each directory owns a specific class of truth. When documents in different directories conflict, the resolution follows the rules in `workflows/CONSISTENCY_AND_SOURCE_OF_TRUTH.md`. No document wins merely because it is newer.

## Scope Boundary

This repo produces governed markdown documents only. Application code, runtime infrastructure, and build tooling belong in separate repositories. See `FACTORY_SCOPE_BOUNDARY.md` and ADR-011 for the extraction rationale.
