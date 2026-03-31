# ADR-012 — I-002 Curriculum Architect modelability determination

## Status
Accepted

## Decision
I-002 Curriculum Architect remains at `dossier/challenge/visible` with a defined 4-step re-entry path to frontier. It is NOT parked and NOT promoted. The modelability and authority assumptions from ADR-007 have been partially validated but require primary-source verification.

## Why

ADR-007 demoted I-002 because its "modelability and authority assumptions" were unvalidated. A bounded determination session (2026-03-31) tested two questions:

1. **Can software hold contradictory prerequisite structures without taking a position?** — Yes. The authority boundary architecture (source-attributed edges, no default path, teacher override, visible disagreement) is sound. The system is designed as a container, not a source.

2. **Do published curricula provide explicit prerequisite structures?** — Yes, at the science level and partially at the text level. Dars-e-Nizami, Al-Azhar, and multiple online platforms provide consumable structures. Classical texts show that concern for sequencing has historical precedent.

The critical reframing: the system does not model prerequisites (authority claim). It presents what traditions already model (honest container). This resolves the false-authority risk at the architectural level.

## What Argument This Decision Defeated

The strongest argument against I-002 was: "prerequisite structures cannot be modeled without claiming false scholarly authority." This is wrong in its strong form — published curricula already publish ordered curricular structures the system could consume. It is correct in its weak form — the system must consume existing structures, not invent its own. The authority boundary mechanism resolves this.

## What Uncertainty Remains

- The curricula survey is based on general knowledge, not primary sources. Evidence needs verification.
- Whether science-level granularity is useful enough for real students is a user-research question.
- Whether the authority boundary mechanism prevents false authority in practice requires scholarly validation.
- The I-001 lesson applies: practical surprises are expected.

## Consequence

- I-002 stays at `dossier/challenge/visible`
- A 4-step re-entry path is defined: (1) source a published curriculum, (2) design the authority boundary data model, (3) write MVP scope, (4) scholarly validation
- `kr` does not block dossier-deepening or spec work
- The research note is at `research/I-002-MODELABILITY-SESSION-2026-03-31.md`
