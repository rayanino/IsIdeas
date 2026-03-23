# Idea Stage Semantics

This document gives each idea stage a precise meaning.

The goal is to prevent stage drift, where labels exist but no longer constrain behavior.

## 1. Spark

### Meaning
A potentially valuable thought that is worth preserving but is not yet trusted.

### Typical Artifact
A quick capture in `capture/`.

### Allowed Moves
- reject immediately
- park lightly
- promote to incubating if it survives initial scrutiny

### Not Yet Allowed
- entry into the serious idea registry
- dossier work
- implementation talk beyond rough intuition

## 2. Incubating

### Meaning
An idea that looks promising enough to deserve real discussion and a dedicated workspace.

### Typical Artifacts
- idea workspace `README.md`
- very early `DOSSIER.md`
- registry entry

### Required Characteristics
- there is a named bottleneck
- there is a plausible leverage case
- there is a reason this may matter over years

### Main Question
Does this actually deserve a dossier-level investment of attention?

## 3. Dossier

### Meaning
The idea is under active serious examination.
This is the main design-thinking stage.

### Typical Artifacts
- developed `DOSSIER.md`
- optional `RESEARCH.md`
- optional session history
- updated registry and open questions

### Required Characteristics
- the problem is becoming sharper
- main objections are being recorded honestly
- boundaries and risks are being explored
- alternatives are being compared when relevant

### Main Question
Should this idea mature into formal specification, or weaken and be parked/rejected?

## 4. Spec-ready

### Meaning
The idea is no longer mainly exploratory.
It is precise enough to justify formal specification work.

### Typical Artifacts
- strong dossier
- clear next-move judgment toward spec work
- often draft structure for `SPEC.md`

### Required Characteristics
- problem is precise
- leverage case remains strong after challenge
- boundaries are visible
- data model is becoming intelligible
- major failure modes are named
- MVP shape is plausible

### Main Question
Can this now be turned into an implementation-grade spec without premature guessing?

## 5. Handoff-ready

### Meaning
The idea has a mature spec and can responsibly be handed to Claude Code.

### Typical Artifacts
- completed `SPEC.md`
- complete handoff packet
- explicit dependencies and constraints

### Required Characteristics
- implementation goal is clear
- correctness constraints are explicit
- success criteria are testable
- ambiguity is low enough that implementation does not require inventing fundamentals

### Main Question
Should this now be built?

## 6. Parked

### Meaning
The idea is not active now, but remains preserved for possible future reconsideration.

### Required Record
Why it was parked, and what would justify revisiting it.

## 7. Rejected

### Meaning
The idea is strategically weak enough that it should not continue consuming attention.

### Required Record
Why it was rejected.
This protects the repo from repeating the same error.
