# 001 — Curriculum Architect

## 1. Thesis
A system that converts a desired Islamic science into a disciplined study path: prerequisites, sequencing, phases, checkpoints, and scope control.

## 2. User Problem
Students often know they want to study a science, but not where to begin, what should come before what, when a text is too advanced, or how to avoid chaotic hopping between materials.

## 3. Why This Matters for Islamic Study
Order matters enormously in Islamic learning. Wrong sequencing causes confusion, weak foundations, false confidence, and wasted years.

## 4. Strategic Value
This system reduces curriculum chaos and helps the user progress deliberately rather than impulsively.

## 5. Scope Boundary
In scope:
- science selection,
- dependency mapping,
- stage-based pathways,
- text ordering,
- checkpointing,
- warnings about premature study.

Out of scope for MVP:
- automatic final scholarly endorsement,
- full personalization from sparse signals,
- dynamic integration with every possible school or institute.

## 6. Primary Users
- serious self-directed student,
- teacher-guided student,
- future long-horizon student using `kr` as base infrastructure.

## 7. Inputs
- science taxonomy,
- topic dependency graph,
- source/text metadata,
- text difficulty metadata,
- user background profile,
- user goals,
- prior completed study artifacts.

## 8. Outputs
- staged study plan,
- prerequisite map,
- ordered text list,
- topic readiness flags,
- checkpoint suggestions,
- warnings about gaps.

## 9. Core Workflow
1. User selects a science and a goal.
2. System checks existing background.
3. System constructs a recommended sequence.
4. System explains why each stage exists.
5. User adjusts with human preferences or teacher guidance.
6. System tracks progress and unlocks later stages.

## 10. Core Entities / Data Model
- Science
- Topic
- TopicDependency
- StudyStage
- Text
- TextDifficulty
- StudentProfile
- GoalProfile
- ReadinessAssessment
- CurriculumPlan
- Checkpoint

## 11. System Behavior
The system ranks next-study candidates using prerequisite completeness, stage fit, declared goals, difficulty level, and coherence with the wider path.

## 12. Source-Backed vs Inferred Data
Source-backed:
- text metadata,
- explicit prerequisite relations,
- authored curriculum structures.

Inferred/computed:
- readiness estimates,
- best-next-step ranking,
- gap warnings.

## 13. Correctness Constraints
- Must not imply mastery from exposure.
- Must not recommend advanced materials without surfacing missing prerequisites.
- Must distinguish authored curriculum guidance from computed recommendations.

## 14. Human Review Requirements
Teachers or the user must be able to override sequencing, difficulty labels, and stage boundaries.

## 15. Failure Modes
- over-rigid sequencing,
- pretending certainty where multiple valid paths exist,
- bad prerequisite mapping,
- pushing cosmetic personalization without enough data.

## 16. MVP
A single-science planner that supports:
- manual dependency graph,
- staged pathway,
- user goal selection,
- generated ordered plan with rationale.

## 17. V2 / V3 Expansion
- multi-science balancing,
- teacher-authored curriculum presets,
- adaptive remediation,
- integration with memorization and question systems.

## 18. Evaluation Criteria
- Are users less confused about what to study next?
- Does the system correctly surface prerequisite gaps?
- Can a human reviewer understand and approve the path?

## 19. Dependencies
- topic IDs,
- source/text metadata,
- science taxonomy,
- user profile primitives.

## 20. Open Questions
- How should multiple valid curriculum traditions be represented?
- How much automation is desirable before teacher oversight?
- What is the right granularity for prerequisites?

## 21. Claude Code Implementation Brief
Build a spec-driven planning engine that models sciences, topics, dependencies, texts, and stages. Support generating a sequenced study path from a user goal and background profile. Every recommendation must include a rationale and surface prerequisite gaps explicitly.
