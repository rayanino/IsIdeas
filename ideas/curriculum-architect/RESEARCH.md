# Curriculum Architect — Expert Validation Packet

## Purpose

This packet asks a scholar or curriculum expert to stress-test whether `I-002 Curriculum Architect` remains honest as a source-attributed curriculum container.

The review is about:
- one institution-bound published curriculum source
- one authority-boundary model derived from that source
- one smallest honest MVP boundary

The review is **not** asking for:
- endorsement of software in general
- a ranking of Islamic curricula
- a universal prerequisite graph
- implementation or UI advice

## What Is Fixed For This Review

These points are already locked for the first validation pass:

- single-source first: Jamia Binoria Aalamia's published Dars-e-Nizami sequence
- source-attributed model: the system presents what a named source publishes
- teacher-guided path: teacher guidance may function as the student's primary local path while the published source remains visible for comparison
- no default path: the system does not choose a recommended sequence
- no recommendation behavior: the MVP is a container, not a judge

## Source Summary Under Review

- institution: Jamia Binoria Aalamia
- source page: `Dars e Nizami`
- source URL: <https://www.binoria.edu.pk/darsEnizami>
- accessed: 2026-03-31
- published shape: 8 ordered stages from `Aamma Part 1` through `Aalamia Part 2`

Why this source was chosen:
- it is a real institution-bound published curriculum
- it gives enough stage and text-level structure to test honest modeling
- it contains real complications, including alternatives and at least one non-monotonic published order

What is **not** being claimed:
- that this source represents all Dars-e-Nizami variants
- that Jamia Binoria's sequence is the correct universal order
- that every published sequence should be modeled the same way

## Authority-Boundary Model Under Review

You do **not** need to review software entity names.
What matters for this packet is the behavior the model is trying to preserve:

- a named published source remains visible as its own path
- the source keeps its literal stage order, row structure, alternatives, and oddities
- source notes explain non-monotonic or otherwise noteworthy source details without rewriting the source or claiming error
- teacher guidance can remain primary in the student's local context without erasing the published source
- the system refuses to turn one institution's sequence into a universal recommendation

The model is trying to obey four minimum honesty rules:

- every stage, unit, text assignment, and edge remains attributable to a named source or named teacher-guided path
- every source keeps its own ordering; no hidden cross-source merge creates a canonical path
- a source may contain alternatives, source notes, and editorial display groupings without losing fidelity
- teacher guidance may differ from a published source, but the difference must remain visible rather than silently replacing either path

The model explicitly refuses to:

- invent a universal prerequisite graph
- create a default recommended path
- silently normalize non-monotonic published order
- demote teacher guidance beneath software judgment

## Smallest Honest MVP Under Review

The current MVP boundary is intentionally narrow.

### In Scope

- one named published curriculum source displayed as an ordered sequence
- visible source attribution on stages, units, text assignments, and sequence edges
- explicit display of alternatives inside one source
- clear editorial distinction between sequence rows, supplementary rows, and elective rows, labeled as a reading aid rather than a scholarly category unless the source itself says otherwise
- source notes and ambiguity notes
- one teacher-guided path that coexists with the source

### Out Of Scope

- recommendation of the best path
- auto-generated prerequisite graphs beyond what the source itself makes visible
- cross-tradition ranking or synthesis
- readiness scoring
- silent correction of odd source order
- replacement of teacher judgment with system judgment

## Edge Cases For Review

Two specific source features matter for the review:

1. **Alternative texts inside one source**
The Jamia Binoria sequence includes rows such as `Al-Ikhtiyar` or `Kanz al-Daqa'iq`.
The model preserves those as explicit alternatives rather than flattening them into one normalized choice.

2. **The `Al-Hidaya` source-order note**
The source places `Al-Hidaya` part 4 in Year 6 and part 3 in Year 7.
The model stores that order literally and attaches a neutral source note rather than "fixing" the sequence internally.

## Questions Requiring Domain Judgment

These questions are not software-design preferences. They concern how traditional pedagogical authority should be represented if a published curriculum is placed inside a digital tool.

1. **Teacher-guided path as linked changes vs. primary path.**
   If a teacher skips, adds, or resequences texts for a particular student, may the tool represent that only as changes relative to the institution's published sequence, or must it also support the teacher's path as a primary path that can stand on its own without constant comparison back to the institution?

2. **Editorial grouping as reading aid vs. hidden judgment.**
   When an institution publishes classical and contemporary subjects side by side on one year-page, is it ever acceptable for the tool to separate them into display groupings, or does that impose a judgment about what the "real" curriculum is unless the grouping maps directly to explicit source-page structure?

3. **Neutral source notes on non-numerical ordering.**
   If a source places Part 4 of a text before Part 3, is a neutral explanatory note acceptable source-fidelity context, or does the act of flagging the order at all project an unwanted expectation that numerical order should normally dictate study order?

## Validation Axes

### Axis 1 — Representativeness

**Claim under test:** Jamia Binoria is sufficient as a first single-source anchor for one real Dars-e-Nizami variant, even if it is not universal.

**Question:** Is this source representative enough to validate one real institutional variant, or does it require a second source before meaningful judgment is possible?

**Failure signal:** The source is too atypical, too incomplete, or too institution-specific to support even first-pass validation.

### Axis 2 — Teacher-Guided-Path Honesty

**Claim under test:** Treating teacher guidance as the student's primary local path, while preserving the published source for comparison, preserves the right authority hierarchy.

**Worked example:** If a teacher wants `Al-Hidaya` part 3 studied before part 4, the system would preserve the published source and show the teacher-guided path alongside it as a second attributed path.

**Question:** Does this teacher-guided-path model preserve teacher supremacy honestly, or does the published-source-first framing subtly demote the teacher's authority?

**Failure signal:** The model still centers software or source order in a way that misrepresents teacher guidance.

### Axis 3 — Literal Source Preservation

**Claim under test:** Preserving non-monotonic published order literally, with annotation, is more honest than silently correcting it.

**Worked example:** `Al-Hidaya` part 4 appears before part 3 in the source and remains stored that way with a neutral source note explaining the non-monotonic numbering.

**Question:** Is literal preservation with a neutral source note the right behavior, or does that itself create a misleading impression?

**Failure signal:** Literal preservation falsely implies endorsement, or annotation is not enough to prevent misunderstanding.

### Axis 4 — MVP Usefulness Without Recommendation

**Claim under test:** A browse-only source container with one teacher-guided path is still useful enough as an integrity-safe mechanism once recommendation behavior is removed.

**Question:** Is the remaining MVP useful enough as an integrity-safe mechanism for a student or teacher to consult, or does usefulness pressure still predict a slide back toward recommendation/default-path behavior?

**Failure signal:** The MVP is too thin to matter without creating pressure to reintroduce implicit recommendation, ranking, or choice-support behavior.

## Requested Response Format

Please respond to each axis using this structure:

```text
axis: 1 | 2 | 3 | 4
verdict: valid | conditional | invalid
confidence: high | moderate | low
reason: <short explanation>
would_change_if: <optional; what additional evidence or revision would change your verdict>
```

Then provide one overall section:

```text
overall_honest: yes | no
second_source_required_before_further_work: yes | no
blocking_concern: <optional; the single strongest reason to pause or revise>
misuse_risk: <optional; the most dangerous likely misuse by a student or builder>
open_note: <optional; anything the four axes did not capture>
```

## Submission Instructions

- A short markdown response is enough.
- Direct disagreement is more valuable than politeness.
- If your answer is `conditional` or `invalid`, please name the smallest revision or extra evidence that would change your view.
- The factory will preserve your response verbatim as governed truth before drawing any new conclusion.

## Packet Goal

The goal of this packet is not to prove that `I-002` should be built.
The goal is to discover whether the current source-attributed model and smallest honest MVP boundary survive serious outside scrutiny without collapsing into false scholarly authority.
