# Session Operating Protocol

Use this protocol for any serious idea session.

## Objective
A session should not merely generate thoughts.
It should leave the repository in a better state.

## Default Session Flow

### 1. Select the target
Choose one idea, one repo-level architectural concern, or one cross-cutting open question.

### 2. Review the current state
Before pushing forward, inspect:
- the idea workspace,
- current stage,
- open questions,
- previous decisions,
- and relevant shared-primitives or boundary docs.

### 3. Push the core question hard
A good session usually tries to clarify one of these:
- the real bottleneck,
- the leverage case,
- the boundary of the system,
- the data model,
- the main failure mode,
- or the reason the idea may not deserve to live.

### 4. Separate signal from excitement
Record what became sharper, what became weaker, and what remains unproven.

### 5. Update artifacts
A serious session should usually update one or more of:
- `DOSSIER.md`
- `README.md` in the idea workspace
- `catalog/IDEA_REGISTRY.md`
- `catalog/OPEN_QUESTIONS.md`
- `catalog/PARKED_AND_REJECTED.md`
- `decisions/` if a repo-level judgment was made
- a session note when preserving discussion history matters

### 6. End with a clear state transition or no-transition judgment
At the end of the session, decide explicitly:
- stays where it is,
- promote one stage,
- park,
- reject,
- or needs research before judgment.

## Session Output Standard

A session is strong if it leaves behind:
- at least one clarified judgment,
- at least one sharper boundary,
- and less ambiguity than before.

## Anti-Patterns

Avoid sessions that mainly produce:
- more idea quantity,
- inflated enthusiasm,
- vague prose with no architectural consequence,
- or premature implementation language.

## Default Bias

Deepen the best idea already on the table before opening too many new fronts.
