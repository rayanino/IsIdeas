# Fixed-Text Preservation System — Dossier

## Working Thesis
Build a Fixed-Text Preservation System with a Qur'an-first MVP focused on preserving already-memorized exact passages over time, not tutoring initial acquisition or managing generic memorization workflows.

## Why This Might Matter
Exact-text continuity is one of the few study assets that is both deeply valuable and easy to lose quietly. Once a passage is memorized, preserving it over years requires disciplined review and honest visibility into where continuity is becoming fragile.

## The Bottleneck
Students can spend serious effort acquiring exact text and then lose it gradually through weak preservation structure. The missing loop is not generic memorization support. It is an honest preservation workflow for already-memorized passages that surfaces fragility without pretending to measure mastery precisely.

## MVP Scope
- In scope: a Qur'an-first preservation MVP for already-memorized passages, using oral full-passage retrieval events, explicit verification mode, simple preservation states, and a minimal due-ordering system.
- Out of scope: initial acquisition coaching, Qur'an tutoring, tajwid pedagogy, audio auto-grading, generalized multi-text support, and claim or position retention such as "madhhab X says Y."

## Minimum v1 Domain Model
- `Passage`: a contiguous ayah-bounded Qur'anic range attempted as one preservation unit.
- `Segment`: one ayah within that passage, used for diagnosis after the attempt, not as the primary scheduled object.
- `Review event`: one oral full-passage attempt to retrieve one passage from start to end in one sitting, performed outside the system and recorded afterward.
- `Verification mode`: `Self-checked`, `Peer-checked`, `Teacher-checked`.
- `Outcome states`: `Clean`, `Hesitant`, `Break`, `Fail`.

## Minimum v1 Preservation Logic
- First-break rule: only the first break is recorded in v1. `Segment` remains diagnostic, not the main scheduled object.
- Preservation states: `Stable`, `Watch`, `Relearn soon`.
- Acquisition gate: a passage does not enter preservation tracking until one full-passage event establishes that it is actually memorized enough to be tracked as preservation work rather than acquisition debt.
- Mapping logic: `Clean` maps to `Stable`, unless the passage is recovering from `Relearn soon`, in which case `Clean` maps to `Watch`. `Hesitant` maps to `Watch`. `Break` maps to `Relearn soon`. `Fail` maps to `Relearn soon`.
- Recovery rule: after `Break` or `Fail`, two later `Clean` full-passage review events are required to regain `Stable`. The first later `Clean` moves the passage to `Watch`. The second later `Clean` moves it to `Stable`.
- `Hesitant` vs `Break`: `Hesitant` means unstable but still unaided exact continuity. `Break` means the first point where unaided exact continuity is lost.
- Verification stance: v1 accepts self-reported events because a preservation system with no low-friction path is not usable, but every review event must store its verification mode so the system remains honest about confidence.
- Scheduling stance: v1 is not just a journal. It must emit the next-due order. The exact day counts remain provisional, but the order is fixed: `Relearn soon` before `Watch` before `Stable`.
- Initial due-order defaults for hardening discussion: `Relearn soon` daily, `Watch` every 3 days, `Stable` every 7 days. These numbers are provisional and explicitly open to calibration.

## Interaction Model
The system does not verify recitation directly in v1.
The review event happens outside the app, usually as oral recitation to oneself, a peer, or a teacher.
The app records:
- which passage was reviewed,
- verification mode,
- outcome state,
- and the next due bucket.

This makes the v1 product a preservation scheduler and record, not a recitation engine.

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
- self-reported review events may still overstate correctness if verification mode is ignored or downplayed
- provisional due-order defaults may feel precise before they are empirically justified

## Relationship To `kr`
`kr` should own canonical text, provenance, source freezing, and traceability-critical substrate.
This idea should not absorb source preservation, claim modeling, or comparison logic.

The independent critique surfaced a harder dependency than the earlier dossier admitted: the system needs a real canonical-text contract for passage boundaries and reference text.
So the honest current status is:
- dossier work may continue now
- build work is blocked until `kr` or an explicit provisional substitute defines canonical fixed-text access and stable passage IDs

## Current Open Questions
- what passage sizing conventions are honest enough for v1 while remaining ayah-bounded and usable?
- what is the lightest correction workflow after a full-passage review event that preserves discipline without adding noise?
- what exact initial due-order defaults are honest enough for v1 without pretending to scientific calibration?
- what minimal visibility is enough to surface fragile passages without tempting fake mastery metrics?
- what evidence from a Qur'an-first MVP would justify later expansion without widening the idea prematurely?

## Current Judgment
This narrower thesis is still stronger than the old broad memorization framing, and the independent critique outcome stayed strong enough for handoff.
The factory has now done enough on this idea:
- dossier
- specification
- build packet
- implementation learnings

Further application development belongs outside `IsIdeas`.

## Next Move
Preserve the packet and the implementation learnings here, then let the factory move on to the next frontier selection.
