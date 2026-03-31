# ADR-013: Allow .github/ directory as enforcement exception to pure-markdown boundary

## Status

Accepted

## Context

ADR-010 established that IsIdeas is factory-only. FACTORY_SCOPE_BOUNDARY.md defines allowed file types as markdown, JSON, YAML, and plain text. The repo intentionally contains no application code, build tooling, or executable scripts.

Three independent audits (Claude, Codex, ChatGPT) on 2026-03-31 identified two enforcement gaps:

1. **No automated scope guard (CF-004).** The repo has no mechanism that fails when forbidden file types appear. Enforcement relies on repo shape plus review discipline.
2. **No GitHub-level owner-approval requirement.** EMPLOYEE_PROTOCOLS.md says agents may not self-ratify frontier status, but this is advisory prose. The original scope drift happened despite advisory rules.

All three audits agreed that adding in-repo application tooling (package.json, scripts) would be self-defeating. The enforcement must live outside the repo's content model.

## Decision

Allow a `.github/` directory containing:

1. **CODEOWNERS** — requires owner review for PRs touching governance, scope-boundary, and lifecycle documents
2. **workflows/scope-boundary-check.yml** — GitHub Actions workflow that rejects PRs containing forbidden file types per FACTORY_SCOPE_BOUNDARY.md

## Why this is not scope drift

- `.github/` is platform-level access control and CI configuration, not application code
- It does not introduce `package.json`, build tooling, runtime dependencies, or executable product logic
- It exists solely to enforce the boundary, not to build within it
- The YAML workflow is a declarative CI check, not a runtime system

## What this replaces

- Pure-prose enforcement in EMPLOYEE_PROTOCOLS.md (still exists but now backed by mechanical checks)
- Review-only detection of forbidden files (now automated)

## What argument this defeated

"The repo should be 100% markdown with zero exceptions." That position is coherent but leaves the two enforcement gaps identified by all three audits open. A narrow, documented exception for platform-level enforcement is less risky than no enforcement at all.

## What uncertainty remains

- Whether CODEOWNERS enforcement works on a solo-owner repo depends on GitHub's branch protection settings (owner must enable "require review from code owners" and cannot approve their own PR when acting as a required reviewer — this may require a second GitHub account or org-level settings)
- The forbidden-file pattern may need updates as new file types emerge
