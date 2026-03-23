# Naming and Numbering Conventions

This document standardizes how ideas and core artifacts are named.

The goal is to preserve findability, ordering, and consistency as the repository grows.

## Idea IDs

Serious ideas tracked in the registry should receive stable numeric IDs.

Format examples:
- `001`
- `002`
- `003`

Rules:
- IDs are assigned only when an idea enters the serious registry.
- IDs are never reused.
- Parked or rejected ideas keep their historical ID.

## Idea Slugs

Each serious idea should have a slug used for its workspace path.

Format:
- lowercase
- words separated by hyphens
- concise but descriptive

Examples:
- `curriculum-architect`
- `memorization-os`
- `question-confusion-ledger`

## Workspace Paths

Use paths like:
- `ideas/curriculum-architect/README.md`
- `ideas/curriculum-architect/DOSSIER.md`
- `ideas/curriculum-architect/SPEC.md`
- `ideas/curriculum-architect/RESEARCH.md`

## File Naming

Prefer descriptive uppercase names for stable top-level artifacts and templates.
Examples:
- `IDEA_REGISTRY.md`
- `OPEN_QUESTIONS.md`
- `QUALITY_BAR.md`

Use short, consistent names for idea-local artifacts.
Examples:
- `README.md`
- `DOSSIER.md`
- `SPEC.md`
- `RESEARCH.md`

## ADR Naming

Architecture decision records should follow names like:
- `ADR-001-workshop-first.md`
- `ADR-002-one-workspace-per-idea.md`

The number is chronological and never reused.

## Registry Display Names

In the registry:
- use the stable numeric ID,
- use the human-readable idea name,
- and keep the slug out of the user-facing title column unless needed.

## Capture Naming

Quick-capture files may use lightweight naming.
Recommended format:
- `YYYY-MM-DD-short-slug.md`

This keeps intake chronological without pretending the idea is already serious.
