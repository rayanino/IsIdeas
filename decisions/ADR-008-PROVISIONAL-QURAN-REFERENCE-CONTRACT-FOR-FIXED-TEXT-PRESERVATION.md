# ADR-008 — Provisional Qur'an reference contract for Fixed-Text Preservation MVP

## Status
Accepted

## Decision
Allow the `Fixed-Text Preservation System` Qur'an-first MVP to proceed with a provisional local reference contract instead of waiting for full `kr` integration.

The provisional contract is:

- a pinned canonical Qur'an reference package owned by the app
- ayah-bounded passage definitions
- stable local passage/reference identifiers
- explicit migration debt to swap this source with `kr` later

## Why

The dossier is ready to move into real specification work, but a full `kr` machine contract for canonical text is not ready yet.
Blocking all build-facing work on that dependency would keep the idea abstract longer than necessary.

This exception is acceptable because:

- the MVP is Qur'an-first and text is fixed
- the boundary is explicit rather than hidden
- the migration debt is known up front
- and the app still does not absorb broader substrate responsibilities that belong in `kr`

## Consequence

- `Fixed-Text Preservation System` may become spec-ready now
- the spec must treat the local Qur'an reference package as provisional infrastructure
- any later implementation must keep the reference contract swappable with `kr`
- this exception does not automatically generalize to other `IsIdeas` applications
