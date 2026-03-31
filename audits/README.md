# Audits

This directory stores repo-level audit findings, review notes, and synthesis inputs.

Use it when a session produces findings that are broader than one idea workspace and need to be preserved in full detail for later comparison or synthesis.

## What Belongs Here

- repo hardening audits
- architecture and integrity reviews
- cross-session findings that will be merged into one ranked action list
- reviewer-specific findings that should remain accessible even after the governed docs are updated

## What Does Not Belong Here

- canonical portfolio truth
- idea dossiers or specs
- handoff packets
- quarantined build artifacts themselves

## Naming Rule

Use:

`YYYY-MM-DD-<reviewer>-<scope>.md`

Examples:

- `2026-03-31-codex-factory-hardening-verification.md`
- `2026-03-31-claude-repo-scope-audit.md`

## Truth Rule

Files in `audits/` are version-controlled evidence, not canonical truth by themselves.

If an audit changes repo judgment, the relevant governed files must also change:

- `catalog/`
- `control_tower/`
- `decisions/`
- `ideas/`
- `workflows/`

An audit may justify a change, but it does not replace that change.
