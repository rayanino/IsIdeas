# 003 — Question & Confusion Ledger

## 1. Thesis
A system for capturing, classifying, tracing, and resolving points of confusion that arise during study.

## 2. User Problem
Serious study produces many unresolved questions. Without a disciplined system, they are forgotten, repeated, or left to quietly distort understanding.

## 3. Why This Matters for Islamic Study
A major portion of real progress comes from identifying exactly what one does not understand and resolving it carefully.

## 4. Strategic Value
This system turns confusion from a source of drift into a structured asset for learning.

## 5. Scope Boundary
In scope:
- question capture,
- confusion typing,
- linkage to sources/topics,
- resolution states,
- teacher-ask queues,
- gap clustering.

Out of scope for MVP:
- automatic final scholarly answers,
- pretending that retrieval equals resolution,
- replacing teacher consultation.

## 6. Primary Users
- active students reading dense material,
- students attending lessons,
- users building a disciplined long-term study record.

## 7. Inputs
- user questions,
- source references,
- excerpt links,
- topic links,
- lesson notes,
- teacher answers,
- self-authored tentative resolutions.

## 8. Outputs
- question inbox,
- categorized confusion ledger,
- unresolved queue,
- teacher-ask list,
- recurring confusion clusters,
- resolution history.

## 9. Core Workflow
1. User captures a confusion immediately.
2. System asks for minimal classification.
3. User links it to source/topic/context.
4. System groups and prioritizes unresolved questions.
5. User records tentative or teacher-backed resolution.
6. System preserves the full resolution history.

## 10. Core Entities / Data Model
- QuestionItem
- ConfusionType
- SourceLink
- TopicLink
- ResolutionEntry
- ResolutionStatus
- TeacherAskQueue
- ConfusionCluster

## 11. System Behavior
The system ranks unresolved items by age, recurrence, centrality to current study, and number of dependent confusions.

## 12. Source-Backed vs Inferred Data
Source-backed:
- source locations,
- teacher responses,
- linked excerpts,
- user-authored notes.

Inferred/computed:
- clustering,
- urgency score,
- dependency suggestions.

## 13. Correctness Constraints
- Must not mark an item resolved merely because related text was retrieved.
- Must preserve distinctions between tentative, user-supplied, and teacher-verified answers.
- Must keep source links explicit.

## 14. Human Review Requirements
Users must explicitly confirm status changes. Teacher-backed resolutions should be marked distinctly when available.

## 15. Failure Modes
- turning into a dumping ground with no prioritization,
- blurring real resolution with superficial notes,
- creating false closure,
- missing links between repeated confusions.

## 16. MVP
A structured question inbox with categorization, source/topic linking, resolution states, and prioritized review queues.

## 17. V2 / V3 Expansion
- teacher session preparation mode,
- automatic duplicate and cluster detection,
- curriculum-aware prioritization,
- confusion heatmaps by science.

## 18. Evaluation Criteria
- Are fewer confusions forgotten?
- Are repeated confusions surfaced clearly?
- Does the system improve the quality of questions brought to teachers?

## 19. Dependencies
- topic IDs,
- source and excerpt IDs,
- future curriculum and lesson primitives.

## 20. Open Questions
- What confusion taxonomy is most useful in practice?
- How much structure can be imposed without slowing capture?
- How should tentative resolutions age or expire?

## 21. Claude Code Implementation Brief
Build a question-tracking system for Islamic study that supports fast capture, structured classification, explicit source/topic linkage, and durable resolution tracking. The MVP must distinguish unresolved, tentatively resolved, and teacher-verified items, and must help the user surface the most important open gaps.
