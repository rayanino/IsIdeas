# Fixed-Text Preservation System — SPEC

## 1. Thesis
Build a Qur'an-first preservation scheduler and record for already-memorized exact text, using explicit human-entered review outcomes and honest recovery states instead of automated recitation grading or acquisition coaching.

## 2. User Problem
Already-memorized exact text decays quietly when review is irregular or falsely optimistic.
The user needs a system that keeps fragile passages visible and due in an honest order without pretending to measure mastery precisely.

## 3. Why This Matters for Islamic Study
Exact-text preservation, especially for Qur'an, compounds over years and is costly to reacquire once weakened.
An honest preservation system protects one of the highest-value long-horizon study assets without impersonating a teacher or recitation verifier.

## 4. Strategic Value
- protects previously acquired exact text from silent decay
- creates a durable review record instead of relying on vague memory
- stays narrow enough to prove real value before broader memorization ambition expands
- can later integrate into the larger personal Islamic environment as the exact-text preservation layer

## 5. Scope Boundary

### In scope
- Qur'an-first MVP
- manually defined ayah-bounded passages
- oral review events performed outside the app and recorded afterward
- explicit verification mode on every review event
- simple preservation states and next-due scheduling
- review history and due queue

### Out of scope
- initial acquisition coaching
- tajwid instruction
- audio capture and auto-grading
- generalized multi-text memorization support
- scholarly claim or madhhab retention
- automatic passage chunking from inferred learner ability

## 6. Primary Users
Primary user: Rayane only.

Target moment: a student who already has memorized Qur'anic material and needs disciplined long-horizon preservation rather than acquisition help.

## 7. Inputs
- provisional local Qur'an reference package
- ayah-bounded passage definitions
- user-created tracked passage list
- review event entries:
  - passage ID
  - review timestamp
  - verification mode
  - outcome state
  - optional note

## 8. Outputs
- due queue ordered by preservation urgency
- current preservation state per tracked passage
- review history per passage
- recovery progress after breaks/fails
- simple visibility surfaces for fragile passages

## 9. Core Workflow
1. User selects or creates a tracked Qur'anic passage from the reference package.
2. Passage enters tracking only after the acquisition gate is satisfied.
3. User performs an oral review outside the app.
4. User records the review event with verification mode and one outcome state.
5. System updates preservation state and computes the next due date.
6. Due queue surfaces the most urgent passages first.
7. Repeated clean recovery events move a weakened passage back toward stability.

## 10. Core Entities / Data Model
- `QuranReferenceAyah`
  - `surah_number`
  - `ayah_number`
  - `uthmani_text`
- `PassageDefinition`
  - `passage_id`
  - `surah_number`
  - `ayah_start`
  - `ayah_end`
  - `label`
- `TrackedPassage`
  - `tracked_passage_id`
  - `passage_id`
  - `tracking_status` (`pending_acquisition_gate`, `active`)
  - `current_preservation_state`
  - `next_due_at`
  - `consecutive_clean_since_relearn`
- `ReviewEvent`
  - `review_event_id`
  - `tracked_passage_id`
  - `reviewed_at`
  - `verification_mode` (`self_checked`, `peer_checked`, `teacher_checked`)
  - `outcome_state` (`clean`, `hesitant`, `break`, `fail`)
  - `first_break_segment_index` optional
  - `note` optional

## 11. System Behavior

### Acquisition gate
- A passage may not enter active preservation tracking until the user explicitly marks it ready for preservation.
- The MVP default rule is:
  - user adds passage
  - first recorded `clean` event activates tracking
- Before activation, recorded events are treated as acquisition-side history, not preservation-state transitions.

### Preservation state mapping
- `clean` -> `stable`, unless recovering from `relearn_soon`, then first `clean` -> `watch`
- `hesitant` -> `watch`
- `break` -> `relearn_soon`
- `fail` -> `relearn_soon`

### Recovery rule
- after `break` or `fail`:
  - first later `clean` -> `watch`
  - second consecutive later `clean` -> `stable`

### Due-order behavior
- state priority is fixed:
  - `relearn_soon` before `watch`
  - `watch` before `stable`
- initial default intervals:
  - `relearn_soon`: 1 day
  - `watch`: 3 days
  - `stable`: 7 days
- these defaults are provisional constants, not scientific truth claims

### Queue ordering inside a bucket
- earliest `next_due_at` first
- tie-break by oldest last review timestamp
- final tie-break by stable `tracked_passage_id`

### Passage boundaries
- v1 uses manually defined ayah-bounded passages only
- no automatic chunking or learner-tailored boundary generation

## 12. Source-Backed vs Computed Data

### Source-backed or fixed-reference
- Qur'an reference text
- surah/ayah boundaries
- passage boundary definitions

### User-authored
- review event outcome
- verification mode
- optional notes

### Computed
- current preservation state
- next due date
- recovery progress counters
- urgency ordering in the queue

## 13. Correctness Constraints
- never claim that the app verified recitation correctness
- never hide or drop verification mode
- never silently modify the canonical reference text
- never present preservation state as mastery score
- never auto-promote acquisition-side events into preservation tracking without the acquisition gate
- never silently change scheduling constants

## 14. Human Review Requirements
- Every review event is ultimately human-entered
- Verification may be self, peer, or teacher mediated
- The app does not replace human listening or scholarly review
- Future calibration of scheduling defaults should be human-reviewed before being trusted

## 15. Failure Modes
- self-reported `clean` events may overstate correctness
- weak passage boundaries may distort review burden
- overly aggressive scheduling may create fatigue and abandonment
- overly lax scheduling may create false stability
- users may interpret `stable` as “fully safe” rather than “currently lower urgency”
- expansion pressure may widen the product back into generic memorization tooling

## 16. MVP
The MVP is a local-first Qur'an preservation tracker that:
- uses a pinned Qur'an reference package
- lets the user track passages manually
- records oral review events after the fact
- computes preservation state and next due date
- shows a due queue and history

## 17. Later Expansion
- configurable scheduling defaults after evidence gathering
- richer passage analytics if they remain honest
- additional fixed-text domains beyond Qur'an
- eventual swap from provisional local reference package to `kr`

## 18. Evaluation Criteria
- does the user actually review fragile passages sooner and more consistently?
- does the due queue feel honest rather than arbitrary?
- does the system reduce surprise decay in memorized passages?
- do verification mode and state labels remain interpretable without fake precision?
- does the user keep using it over weeks rather than abandoning it after novelty fades?

## 19. Dependencies
- provisional local Qur'an reference package defined by ADR-008
- passage-definition storage
- implementation primitives in the external builder repo (not in IsIdeas)
- eventual migration path to `kr`

## 20. Open Questions
- what is the most honest initial library of passage sizes for Qur'an-first use?
- should the first-break segment index be stored in v1 or omitted until clearly useful?
- what minimal reporting surface best shows fragility without implying mastery metrics?
- what evidence threshold should justify changing the provisional due-order constants?

## 21. Claude Code Implementation Brief
Build a local-first MVP for the Qur'an-first Fixed-Text Preservation System.

Requirements:
- no audio grading
- no acquisition tutoring
- no recitation verification claims
- use a pinned local Qur'an reference package for v1
- support manual tracked passages, manual review event entry, computed preservation state, and a due queue
- persist verification mode on every review event
- keep scheduling constants explicit and configurable in one place
- ensure all user-facing language avoids mastery claims and makes the human-entered nature of outcomes obvious
