# Curriculum Architect — Dossier

## Working Thesis
Build a system that helps a student move through an Islamic science in the right order, with explicit prerequisite awareness and stage discipline.

## Why This Might Matter
A huge amount of wasted study effort comes from bad sequencing rather than lack of effort.

## The Bottleneck
Students often know they want to study a science, but not what must come first, what counts as sufficient readiness, or how to move without chaotic hopping.

## Why This Might Be Strong
- attacks a high-leverage recurring bottleneck
- relevant across multiple sciences
- compounds strongly with `kr`
- can improve disciplined study rather than mere convenience

## Why This Might Be Weak
- may become falsely authoritative
- prerequisite relationships may be much harder to model than they first appear
- multiple valid curricular paths may resist neat systematization

## Main Risks
The system could become misleading if it presents one path as if it were the only legitimate path, or if it implies readiness too early.

## Relationship To `kr`
`kr` should provide structured topic, source, and excerpt substrate. This system should sit above that substrate and help sequence study behavior rather than re-implement library responsibilities.

## Current Open Questions
- what exactly counts as a prerequisite?
- how should multiple valid paths be represented?
- where should teacher guidance override system logic?
- what is the smallest honest MVP?

## Modelability Determination (2026-03-31)

A bounded session tested two questions: (1) can software hold contradictory prerequisite structures without taking a position, and (2) do published curricula provide explicit structures the system could consume?

**Key finding:** The system must be a container for structures that traditions already publish, not a source of its own prerequisite structures. This reframes the idea from "a system that models prerequisites" (authority claim) to "a system that presents what traditions already model" (honest container).

**Authority boundary:** Architecturally sound. Source-attributed edges, no default path, teacher override, visible disagreement. Each prerequisite relationship carries a named source. The system never recommends.

**Published structures exist:** Dars-e-Nizami provides text-level sequencing. Al-Azhar provides science-level sequencing. Multiple online platforms treat prerequisites as explicit and modelable. Classical texts (Ta'lim al-Muta'allim, Muqaddima) validate the concept.

**Evidence qualification:** Survey is based on general knowledge, not verified primary sources. Next step requires actual sourcing.

See `research/I-002-MODELABILITY-SESSION-2026-03-31.md` for full analysis.

## Current Judgment
Structurally sound but dossier-thin. The idea has a defined re-entry path to frontier.

## Re-Entry Path (all four required before frontier promotion)
1. Source at least one complete published curriculum sequence (e.g., detailed Dars-e-Nizami text list)
2. Design the data model for the authority boundary mechanism at spec-ready granularity
3. Write a concrete MVP scope
4. Find a scholar or curriculum expert who can validate the sourced curriculum and the authority boundary mechanism

## Next Move
Source a specific published curriculum sequence and begin data model design.
