# 002 — Memorization OS

## 1. Thesis
A memorization system designed for Islamic study that manages matn memorization, retention decay, weak-point detection, and review planning.

## 2. User Problem
Memorization is usually managed with ad hoc repetition, which makes it difficult to preserve large bodies of text reliably over years.

## 3. Why This Matters for Islamic Study
Memorization remains central in many study paths. Retrieval software can help access knowledge, but cannot substitute for internalized texts.

## 4. Strategic Value
This system protects one of the most precious scholarly assets: retained memorized material.

## 5. Scope Boundary
In scope:
- memorization objects,
- review scheduling,
- weak-segment tracking,
- oral recall logs,
- retention analytics.

Out of scope for MVP:
- speech recognition grading,
- perfect tajwid or recitation assessment,
- full teacher replacement.

## 6. Primary Users
- students memorizing matn,
- students preserving previously memorized content,
- users who want disciplined review rather than vague repetition.

## 7. Inputs
- memorization text units,
- segmentation metadata,
- user recall results,
- review history,
- difficulty labels,
- manual teacher corrections.

## 8. Outputs
- daily review queue,
- weak-point report,
- decay-risk alerts,
- retention dashboard,
- suggested repetition pattern.

## 9. Core Workflow
1. User creates or imports a memorization object.
2. Text is segmented into reviewable units.
3. User records recall success/failure.
4. System updates strength estimates.
5. System schedules review intelligently.
6. User and teacher can inspect weak zones over time.

## 10. Core Entities / Data Model
- MemorizationObject
- Segment
- RecallAttempt
- RetentionStrength
- ReviewEvent
- WeakPointTag
- ReviewQueue
- MemorizationPlan

## 11. System Behavior
The system schedules review based on attempt history, segment difficulty, lapse frequency, and time since last stable recall.

## 12. Source-Backed vs Inferred Data
Source-backed:
- memorized text,
- segmentation definitions,
- explicit corrections,
- attempt logs.

Inferred/computed:
- retention strength,
- predicted lapse risk,
- review priority.

## 13. Correctness Constraints
- Must not present predicted retention as certainty.
- Must preserve the exact memorized text unit.
- Must separate actual recall outcomes from estimated strength scores.

## 14. Human Review Requirements
Users and teachers must be able to adjust segment boundaries, difficulty, and review judgments.

## 15. Failure Modes
- optimizing for app interaction rather than actual memorization,
- bad scheduling that creates overload,
- weak segmentation,
- overconfidence from misleading analytics.

## 16. MVP
A text-segment memorization tracker with recall logging, spaced review scheduling, and weak-segment surfacing.

## 17. V2 / V3 Expansion
- teacher dashboards,
- oral session support,
- comparative retention analytics by text type,
- integration with curriculum milestones.

## 18. Evaluation Criteria
- Does retention improve over time?
- Are weak segments surfaced earlier than the user would have noticed manually?
- Does the review load remain sustainable?

## 19. Dependencies
- text/source primitives,
- review-event primitives,
- user profile,
- future curriculum integration.

## 20. Open Questions
- What is the best unit of segmentation for different text genres?
- How much scheduling complexity helps versus distracts?
- Which analytics are actually useful and which are vanity?

## 21. Claude Code Implementation Brief
Build a memorization management system centered on exact text units, recall attempts, and review scheduling. The MVP should provide segment-level tracking, queue generation, weak-point identification, and transparent retention estimates without pretending to certify mastery.
