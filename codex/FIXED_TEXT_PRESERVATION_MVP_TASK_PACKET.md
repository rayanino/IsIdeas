# Fixed-Text Preservation MVP — Task Packet

## Title
Build the Qur'an-first Fixed-Text Preservation MVP as a standalone local-first app.

## Objective
Implement the first working version of the Fixed-Text Preservation System described in `ideas/memorization-os/SPEC.md`.

The MVP must let one user:
- define ayah-bounded passages
- activate passages for preservation tracking
- record oral review events after the fact
- compute preservation state and next due date
- view a due queue and per-passage history

## Why This Matters
This is the strongest current frontier idea in `IsIdeas`.
If the MVP works, it proves whether software can honestly protect already-memorized exact text over years without pretending to verify recitation or teach acquisition.

## Build Target
Build this as a **standalone app outside the `IsIdeas` control-tower surface**.

Use this technical shape:
- Next.js 16 App Router
- TypeScript
- local-first persistence with SQLite
- `better-sqlite3` plus a thin typed data layer
- no auth
- no multi-user support

Do **not** build the product UI inside the existing `IsIdeas` dashboard app.

## Inputs To Read First
- `ideas/memorization-os/SPEC.md`
- `ideas/memorization-os/DOSSIER.md`
- `ideas/memorization-os/README.md`
- `decisions/ADR-008-PROVISIONAL-QURAN-REFERENCE-CONTRACT-FOR-FIXED-TEXT-PRESERVATION.md`
- `shared/KR_STATUS.md`

## Required Product Decisions

These are locked for the MVP and must not be reinvented:

### Product posture
- This is a preservation scheduler and record.
- It is not a recitation verifier.
- It is not an acquisition tutor.
- It is not a generic memorization platform.

### Verification authority
- Review events are human-entered.
- Every review event stores `verification_mode`.
- Allowed values:
  - `self_checked`
  - `peer_checked`
  - `teacher_checked`
- The UI must never imply that the app itself verified correctness.

### Interaction model
- The user performs oral review outside the app.
- After the review, the user records one outcome event in the app.

### Scheduling defaults
- `relearn_soon`: due in 1 day
- `watch`: due in 3 days
- `stable`: due in 7 days
- These constants must live in one explicit config module.

### Acquisition gate
- A tracked passage starts in `pending_acquisition_gate`.
- The first `clean` review event activates preservation tracking.
- Before activation, events are stored but do not change preservation-state scheduling.

### Preservation mapping
- `clean` -> `stable`, except first clean after `relearn_soon` -> `watch`
- `hesitant` -> `watch`
- `break` -> `relearn_soon`
- `fail` -> `relearn_soon`
- After `break` or `fail`, two later consecutive `clean` events are required to return to `stable`

### Passage boundaries
- Passage definitions are manual and ayah-bounded.
- No automatic chunking.
- No learner-tailored passage generation.

### Canonical text dependency
- Use a pinned local Qur'an reference package for the MVP.
- Treat it as provisional infrastructure that must remain swappable with future `kr` integration.
- Keep reference access isolated behind a small adapter module.

## Required Data Model

Implement these entities:

### `quran_reference_ayah`
- `surah_number`
- `ayah_number`
- `uthmani_text`

### `passage_definition`
- `passage_id`
- `surah_number`
- `ayah_start`
- `ayah_end`
- `label`

### `tracked_passage`
- `tracked_passage_id`
- `passage_id`
- `tracking_status`
- `current_preservation_state`
- `next_due_at`
- `consecutive_clean_since_relearn`
- `created_at`
- `updated_at`

### `review_event`
- `review_event_id`
- `tracked_passage_id`
- `reviewed_at`
- `verification_mode`
- `outcome_state`
- `note`

Do **not** implement `first_break_segment_index` in the MVP.
It remains deferred until it proves necessary.

## Required Screens

### 1. Due Queue
- ordered by preservation urgency then `next_due_at`
- shows verification-aware labels without mastery language

### 2. Tracked Passages
- list of active and pending passages
- ability to create a new tracked passage from an ayah-bounded range

### 3. Passage Detail
- current preservation state
- next due date
- review history

### 4. Review Event Entry
- select tracked passage
- choose verification mode
- choose outcome state
- optional note
- save event and recompute state

### 5. Settings / Constants
- display current scheduling constants read-only or minimally editable in dev
- clearly label them as provisional defaults

## Required Constraints
- no audio upload
- no speech recognition
- no automated tajwid/correctness claims
- no gamified scores
- no mastery percentage
- no hidden scheduling logic
- no inferred verification mode
- no silent canonical-text edits
- no product language that makes `stable` sound like guaranteed safety

## Expected Output
- a standalone local-first MVP app
- local seeded Qur'an reference package
- typed persistence layer
- deterministic preservation logic module
- minimal tests covering state transitions and queue ordering

## Acceptance Criteria
- user can manually create an ayah-bounded passage definition
- first `clean` event activates tracking from `pending_acquisition_gate`
- review event entry updates preservation state correctly
- due queue orders `relearn_soon` before `watch` before `stable`
- verification mode is visible on review history entries
- all scheduling constants are explicit and centralized
- UI avoids verification and mastery overclaims
- app works for one local user with no auth

## Failure Modes To Avoid
- treating this like a recitation engine
- quietly widening scope into acquisition or tutoring
- hiding the provisional nature of scheduling constants
- coupling the app too tightly to `kr`
- inventing analytics that imply more certainty than the model supports

## Notes For Review
- inspect the language around `clean`, `stable`, and due dates carefully
- inspect whether the local Qur'an reference adapter is easy to swap later
- inspect whether the acquisition gate and recovery rule are implemented exactly as specified
