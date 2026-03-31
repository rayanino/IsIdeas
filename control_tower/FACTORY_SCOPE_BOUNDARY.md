# Factory Scope Boundary

## What IsIdeas produces

- dossiers
- specs
- research notes and surveys
- decision records (ADRs)
- critique artifacts and registries
- handoff/build packets (in `handoff/`)
- bottleneck maps and portfolio tracking
- governance and workflow documents

## What IsIdeas does NOT produce

- application source code (`.ts`, `.tsx`, `.js`, `.jsx`, `.py`)
- product UI or API endpoints
- database schemas, migrations, or runtime state files
- `package.json`, build configs, or npm dependency trees
- Docker, CI/CD, or deployment configurations
- servers, background workers, or unattended runtime loops

## Allowed file types

- Markdown (`.md`) — the default format for all governed truth
- JSON (`.json`) and YAML (`.yaml`) — for structured data in handoff packets or catalog snapshots
- Plain text — for templates and raw capture

## Forbidden file types

- `.ts`, `.tsx`, `.js`, `.jsx`, `.mjs`, `.cjs`
- `.py`, `.sql`, `.sh` (executable scripts)
- `package.json`, `tsconfig.json`, `next.config.*`, `vitest.config.*`
- `.env*` (except historical records)

## The test

Before creating any file in this repo, ask: **"Is this documentation, governance, or a handoff artifact?"**

If the answer is no, or ambiguous, the file does not belong here. If the answer is genuinely unclear, write an ADR resolving the ambiguity before proceeding.

## When the boundary is violated

Follow the quarantine protocol in `workflows/QUARANTINE_PROTOCOL.md`:
1. Stop work immediately
2. Copy the out-of-scope code to `IsIdeas_quarantine/`
3. Record it in `catalog/QUARANTINED_BUILDS.md`
4. Delete it from the repo
5. Commit the removal in the same change

## Why this boundary exists

ADR-010 established that IsIdeas is factory-only. ADR-011 removed the control tower dashboard because the line between "factory infrastructure" and "product code" was a naming convention, not a structural boundary. This document exists to make that boundary structural and explicit.
