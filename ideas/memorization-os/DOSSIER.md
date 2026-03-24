# Fixed-Text Preservation System — Dossier

## Working Thesis
Build a Fixed-Text Preservation System with a Qur'an-first MVP focused on preserving already-memorized exact passages over time, not tutoring initial acquisition or managing generic memorization workflows.

## Why This Might Matter
Exact-text continuity is one of the few study assets that is both deeply valuable and easy to lose quietly. Once a passage is memorized, preserving it over years requires disciplined review and honest visibility into where continuity is becoming fragile.

## The Bottleneck
Students can spend serious effort acquiring exact text and then lose it gradually through weak preservation structure. The missing loop is not generic memorization support. It is an honest preservation workflow for already-memorized passages that surfaces fragility without pretending to measure mastery precisely.

## MVP Scope
- In scope: a Qur'an-first preservation MVP for already-memorized passages, using full-passage retrieval attempts and simple preservation states.
- Out of scope: initial acquisition coaching, Qur'an tutoring, tajwid pedagogy, audio auto-grading, generalized multi-text support, and claim or position retention such as "madhhab X says Y."

## Minimum v1 Domain Model
- `Passage`: a contiguous ayah-bounded Qur'anic range attempted as one preservation unit.
- `Segment`: one ayah within that passage, used for diagnosis after the attempt, not as the primary scheduled object.
- `Review event`: one full unaided attempt to retrieve one passage from start to end in one sitting, with correction after the attempt if needed.
- `Outcome states`: `Clean`, `Hesitant`, `Break`, `Fail`.

## Minimum v1 Preservation Logic
- First-break rule: only the first break is recorded in v1. `Segment` remains diagnostic, not the main scheduled object.
- Preservation states: `Stable`, `Watch`, `Relearn soon`.
- Mapping logic: `Clean` maps to `Stable`, unless the passage is recovering from `Relearn soon`, in which case `Clean` maps to `Watch`. `Hesitant` maps to `Watch`. `Break` maps to `Relearn soon`. `Fail` maps to `Relearn soon`.
- Recovery rule: after `Break` or `Fail`, two later `Clean` full-passage review events are required to regain `Stable`. The first later `Clean` moves the passage to `Watch`. The second later `Clean` moves it to `Stable`.
- `Hesitant` vs `Break`: `Hesitant` means unstable but still unaided exact continuity. `Break` means the first point where unaided exact continuity is lost.

## Why This Might Be Strong
- narrow enough to prove something real without generic memorization-product sprawl
- focused on exact-text preservation, where disciplined software support may matter over years
- honest about limited states and limited claims, which fits the repo's anti-fake-precision stance
- complements `kr` by acting on fixed text in the learner rather than re-owning canonical text storage

## Why This Might Be Weak
- the Qur'an-first MVP could still be widened carelessly into a vague memorization platform
- even simple outcome states can be misread as richer mastery judgments than they really are
- a weak passage boundary or awkward review loop could make the system feel mechanical rather than honest

## Main Risks
- fake precision: simple preservation states could quietly turn into implied mastery scoring
- boundary drift into tutoring, pedagogy, or speculative analytics
- boundary drift into claim or position retention that belongs closer to a future structured-claims or comparison frontier
- confusion between preserving exact text in the learner and preserving canonical source artifacts in `kr`

## Relationship To `kr`
`kr` should own canonical text, provenance, source freezing, and traceability-critical substrate. This idea should begin after that fixed text already exists and should focus on preserving the learner's exact-text continuity over time. It should not absorb source preservation, claim modeling, or comparison logic.

## Current Open Questions
- what passage sizing conventions are honest enough for v1 while remaining ayah-bounded and usable?
- what is the lightest correction workflow after a full-passage review event that preserves discipline without adding noise?
- what minimal visibility is enough to surface fragile passages without tempting fake mastery metrics?
- what evidence from a Qur'an-first MVP would justify later expansion without widening the idea prematurely?

## Current Judgment
This narrower thesis is materially stronger than the old broad framing because it is about exact-text preservation rather than generic memorization management. The workspace slug and catalog files still carry the legacy label for scope reasons, but this dossier should use the narrowed thesis. It remains a dossier-stage idea, not a broader portfolio decision.

## Next Move
Hold the boundary and keep sharpening the idea on this narrower ground: Qur'an-first, already-memorized exact passages, full-passage review, first-break diagnosis, and honest recovery states without speculative analytics.
