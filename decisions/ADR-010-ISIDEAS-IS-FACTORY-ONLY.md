# ADR-010 — IsIdeas is factory-only

## Status
Accepted

## Decision
`IsIdeas` is a factory for:

- bottleneck discovery
- idea generation
- dossier hardening
- specification
- build/handoff packet preparation
- progress tracking and research

`IsIdeas` is **not** a host for application implementations.

## Why

The repo drifted from “idea factory and development preparation” into “host the products here too.”
That scope expansion consumed attention on building apps rather than generating, selecting, and hardening ideas.

The owner explicitly clarified that `IsIdeas` must stop before implementation and remain focused on idea generation plus development preparation.

## Consequence

- application source trees are out of scope here
- handoff-ready ideas leave active frontier work and enter a handoff queue
- any accidental build experiment may be preserved as a quarantined record, but not as active repo scope
