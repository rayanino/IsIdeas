# kr Boundary

This document exists to prevent blurred boundaries between `kr` and adjacent applications in `IsIdeas`.

## Core Distinction

`kr` is the knowledge substrate.
Its job is to ingest, structure, preserve, and trace knowledge artifacts.

`IsIdeas` applications are surrounding systems that use, extend, or coordinate around that substrate to improve study itself.

## `kr` Should Generally Own
- source ingestion and freezing
- source metadata and provenance
- excerpt extraction and linkage
- science/topic structure when part of the library substrate
- traceability-critical knowledge representation

## `IsIdeas` Apps Should Generally Own
- sequencing and curriculum support
- memorization workflows
- question/confusion management
- study planning and review orchestration
- higher-order comparative or reflective workflows

## Boundary Warning Signs

A design may be crossing the boundary badly if:
- an app re-implements substrate responsibilities that belong in `kr`
- `kr` is being asked to absorb workflow logic better handled by a dedicated app
- shared primitives are being duplicated inconsistently
- the relationship between knowledge storage and study behavior is becoming muddy

## Rule Of Thumb

If the responsibility is primarily about preserving structured knowledge faithfully, it leans toward `kr`.
If the responsibility is primarily about helping the student act on knowledge over time, it leans toward `IsIdeas`.

## Current Status

This file defines the conceptual boundary only.
For the current practical contract status and build blockers, see `shared/KR_STATUS.md`.
