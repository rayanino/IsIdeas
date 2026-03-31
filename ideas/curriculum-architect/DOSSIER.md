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
- is the Jamia Binoria sequence representative enough to validate one real Dars-e-Nizami variant without adding a second source first?
- does the authority-boundary model preserve teacher supremacy and source visibility in a way a scholar or curriculum expert would accept?
- is the smallest honest MVP still useful once recommendation and default-path behavior are removed?
- what level of disagreement should the first validation pass test: stage order, subject rows, or text assignments?

## Modelability Determination (2026-03-31)

A bounded session tested two questions: (1) can software hold contradictory prerequisite structures without taking a position, and (2) do published curricula provide explicit structures the system could consume?

**Key finding:** The system must be a container for structures that traditions already publish, not a source of its own prerequisite structures. This reframes the idea from "a system that models prerequisites" (authority claim) to "a system that presents what traditions already model" (honest container).

**Authority boundary:** Architecturally sound. Source-attributed edges, no default path, teacher override, visible disagreement. Each prerequisite relationship carries a named source. The system never recommends.

**Published structures exist:** Dars-e-Nizami provides text-level sequencing. Al-Azhar provides science-level sequencing. Multiple online platforms treat prerequisites as explicit and modelable. Classical texts (Ta'lim al-Muta'allim, Muqaddima) validate the concept.

**Evidence qualification:** Survey is based on general knowledge, not verified primary sources. Next step requires actual sourcing.

See `research/I-002-MODELABILITY-SESSION-2026-03-31.md` for full analysis.

## Sourced Curriculum Anchor (2026-03-31)

The first re-entry requirement is now complete.

`research/I-002-JAMIA-BINORIA-DARS-E-NIZAMI-SEQUENCE-2026-03-31.md` preserves one specific published curriculum sequence from Jamia Binoria Aalamia's official Dars-e-Nizami page.

This matters because I-002 no longer depends only on general claims like "published curricula exist."
It now has one institution-bound sequence with:

- explicit 8-year stage order
- named subject rows with assigned texts
- published alternatives inside some rows
- at least one apparently surprising internal ordering that must be preserved literally rather than normalized

The source should be treated as:
- one concrete sequence the system can ingest honestly
- not a universal Dars-e-Nizami standard
- not a replacement for later scholarly validation

## Initial Data-Model Requirements From The Sourced Sequence

The sourced Jamia Binoria sequence sharpens the authority boundary into concrete model requirements:

- `curriculum_source` must be first-class so institution-bound variants do not collapse into one generic `Dars-e-Nizami`
- `curriculum_stage` must preserve literal labels (`Aamma`, `Khassa`, `Aalia`, `Aalamia`) alongside ordinal order
- `stage_unit` must allow multiple texts under one published subject row
- `text_assignment` must allow explicit alternatives and selections from within a single source
- source-attributed sequence edges must be stored as published, even when the source contains surprising internal order
- teacher guidance must sit in a parallel overlay, not by mutating the published source
- co-curricular and optional lanes must be distinguishable from the core sequence

## Authority-Boundary Data Model (2026-03-31)

The model below is the smallest durable structure that can hold the sourced Jamia Binoria sequence honestly.
It is intentionally source-first rather than ontology-first.

### What This Model Does Not Claim

- it does not claim a universal prerequisite graph for Islamic study
- it does not claim that Jamia Binoria's sequence is the correct Dars-e-Nizami order
- it does not create a default path across traditions or even across variants of one tradition
- it does not normalize surprising published order into cleaner internal logic
- it does not replace teacher guidance; teacher guidance remains a higher local authority for the student's path

### Core Entities

#### `CurriculumSource`

The named published source being represented.

- `source_id`: stable local identifier for the source record
- `institution_name`: publishing institution name
- `source_title`: literal title of the published source
- `source_url`: source page URL
- `accessed_on`: date the factory accessed the source
- `tradition_label` optional: broad tradition family if the source self-identifies or the repo uses a careful descriptive label
- `scope_note`: what this source does and does not represent
- `representativeness_status`: `unvalidated`, `validated`, or `disputed`

#### `CurriculumStage`

One ordered stage inside one named source.

- `stage_id`: stable local identifier
- `source_id`: owning published source
- `literal_stage_label`: published label such as `Aamma Part 1`
- `stage_ordinal`: machine-sortable order inside the source
- `published_year_number` optional: the source's year number when explicitly given
- `stage_note` optional: clarification about what this stage bundles

Constraint:
- every stage belongs to exactly one source
- stage order is preserved literally from the published source

#### `StageUnit`

One published subject row inside one stage.

- `unit_id`: stable local identifier
- `stage_id`: owning stage
- `subject_label`: published or minimally normalized subject label
- `lane_tag`: `core`, `co_curricular`, or `optional`
- `display_order`: row order inside the stage
- `unit_note` optional: comments about grouped texts, mixed subjects, or extraction ambiguity

Constraint:
- each published row remains a distinct unit even if two rows look conceptually similar
- `lane_tag` separates core sequence from attached institutional extras

#### `TextAssignment`

One text or memorization assignment attached to one unit.

- `text_assignment_id`: stable local identifier
- `unit_id`: owning unit
- `published_text_label`: literal text label from the source
- `assignment_mode`: `required`, `alternative`, `selection`, or `memorization`
- `choice_group_id` optional: groups multiple alternative assignments inside one unit
- `display_order`: order inside the unit
- `assignment_note` optional: translation or extraction note

Constraint:
- multiple texts may attach to one unit
- alternatives stay explicit rather than being collapsed into one merged label

#### `CurriculumEdge`

An ordered relation preserved from the source or introduced by teacher guidance.

- `edge_id`: stable local identifier
- `source_id`: originating source or overlay basis
- `from_stage_id` optional
- `from_unit_id` optional
- `from_text_assignment_id` optional
- `to_stage_id` optional
- `to_unit_id` optional
- `to_text_assignment_id` optional
- `edge_basis`: `published_sequence` or `teacher_specified`
- `edge_note` optional: why the edge exists or why it looks surprising

Constraint:
- published edges may only describe order that the source itself makes visible
- edges are source-attributed and never treated as universal truths
- surprising order is stored as published, not auto-corrected

#### `CurriculumObservation`

A note that preserves ambiguity, anomaly, or extraction caution.

- `observation_id`: stable local identifier
- `source_id`: owning source
- `stage_id` optional
- `unit_id` optional
- `text_assignment_id` optional
- `observation_type`: `anomaly`, `ambiguity`, or `translation_note`
- `description`: human-readable explanation of what must not be silently flattened

Constraint:
- observations explain oddities without changing the source record itself

#### `TeacherSpecifiedPath`

A local overlay representing teacher guidance for one student's path.

- `teacher_path_id`: stable local identifier
- `teacher_attribution`: named teacher or careful attribution label
- `based_on_source_id` optional: published source being overlaid
- `affected_stage_id` optional
- `affected_unit_id` optional
- `affected_text_assignment_id` optional
- `override_description`: what the teacher changed or emphasized
- `override_scope`: `add`, `remove`, `resequence`, or `emphasize`

Constraint:
- teacher guidance overlays the published source; it does not mutate or erase it
- published data and teacher guidance must remain simultaneously visible when they differ

### Worked Mapping From The Jamia Binoria Source

| Source feature | Model representation | Why it matters |
|---|---|---|
| `Aamma Part 2` appears as the second year/stage | `CurriculumStage` with `literal_stage_label = Aamma Part 2` and `stage_ordinal = 2` | Literal label and sortable order are both preserved. |
| A Year 3 fiqh row lists `Al-Ikhtiyar` or `Kanz al-Daqa'iq` | One `StageUnit` plus two `TextAssignment` records sharing one `choice_group_id` and `assignment_mode = alternative` | The source's internal alternative remains visible instead of being normalized away. |
| `Al-Hidaya` part 4 appears in Year 6 while part 3 appears in Year 7 | Two `TextAssignment` records in separate stages, a `CurriculumEdge` that preserves Year 6 before Year 7 as `published_sequence`, plus one `CurriculumObservation` of type `anomaly` | The model stores the source literally and records the surprise without auto-correction. |

### Minimum Rules That Make The Model Honest

- every stage, unit, text assignment, and edge must remain attributable to a named source or named teacher overlay
- every source keeps its own ordering; no cross-source merge creates a hidden canonical path
- a source may contain alternatives, optional lanes, and anomalies without losing fidelity
- teacher guidance may contradict a published source, but the contradiction must remain visible rather than silently replacing the source

## Smallest Honest MVP Boundary (2026-03-31)

The smallest honest MVP is not a recommendation engine.
It is a source-attributed curriculum container with one teacher-overlay lane.

### In Scope

- one named published curriculum source loaded as a full ordered sequence
- stage-level and row-level browsing of that source
- visible source attribution on every stage, unit, text assignment, and sequence edge
- explicit display of alternatives inside one source
- explicit distinction between `core`, `co_curricular`, and `optional` rows
- preservation of anomalies and ambiguities through `CurriculumObservation`
- one teacher-specified overlay path that can coexist with the published source without mutating it

### Out Of Scope

- recommendation of the best path
- auto-generated prerequisite graphs beyond what the source itself makes visible
- cross-tradition synthesis or ranking
- readiness scoring or mastery claims
- silent normalization of odd source order
- generalized comparison across many curricula
- any attempt to replace teacher judgment with system judgment

### Smallest Honest User Value

The MVP helps a student or teacher answer:

- what does this named published curriculum actually contain?
- in what order does this institution publish it?
- where does the source itself offer alternatives or optional lanes?
- where has my teacher told me to diverge from the published sequence?

It does not help answer:

- what should every student study first?
- which Dars-e-Nizami variant is best?
- whether a student is truly ready for the next text

### What This MVP Does Not Claim

- "this is the correct Dars-e-Nizami path"
- "the system knows the real prerequisites"
- "teacher deviations are exceptions to the true order"
- "published order and pedagogical necessity are identical"

## Validation Target For The Next Pass

The validation packet now exists at `ideas/curriculum-architect/RESEARCH.md`.

It is written for a generic scholar or curriculum expert and asks for structured judgment on four axes:

1. Is the Jamia Binoria source representative enough to validate one real Dars-e-Nizami variant?
2. Does the model preserve authority boundaries honestly, especially around source attribution and teacher override?
3. Is literal preservation of anomalies the right behavior, or does the model still hide a false claim somewhere?
4. Is the MVP useful enough once recommendation behavior is removed?

The next pass should obtain and preserve the first external validation response rather than expanding the model further on internal judgment alone.

## Current Judgment
Structurally sound, source-anchored, and now backed by an intelligible authority-boundary model plus a plausible MVP boundary.
The idea is materially stronger than before, and the first validation packet now exists, but it should not be promoted yet because external scholarly or curriculum validation still decides whether this model is honest enough in practice.

## Re-Entry Path (all four required before frontier promotion)
1. Completed 2026-03-31: source at least one complete published curriculum sequence
2. Completed 2026-03-31: formalize the data model for the authority boundary mechanism at spec-ready granularity
3. Completed 2026-03-31: write a concrete MVP scope
4. Find a scholar or curriculum expert who can validate the sourced curriculum and the authority boundary mechanism

## Next Move
Obtain and preserve the first scholar or curriculum-expert response to `ideas/curriculum-architect/RESEARCH.md`, without promoting the idea before that validation lands.
