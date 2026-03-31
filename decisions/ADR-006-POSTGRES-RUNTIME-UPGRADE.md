# ADR-006 — Explicit Postgres runtime upgrade

## Status
Superseded — applies to the extracted control tower per ADR-011

This ADR is preserved as historical context only.
It does not govern current `IsIdeas` behavior.

## Decision
Add a local Postgres-backed runtime mode, but require the storage transition to be recorded explicitly in integrity and decision history.

## Why

The original Postgres adapter silently removed an integrity flag during first-connect bootstrap.
That violated the repo's own integrity policy and created a hidden truth transition.

## Consequence

- the runtime may operate in Postgres mode locally
- the tracked seed remains the bootstrap snapshot
- the transition from file-store to Postgres must be visible in decision and integrity history
- schema version metadata is recorded alongside runtime documents
