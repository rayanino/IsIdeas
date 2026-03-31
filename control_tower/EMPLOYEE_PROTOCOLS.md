# Operating Roles

## Codex

Codex is the default factory lead inside this repo.

Codex may:

- propose ideas
- write decisions
- update factory governance documents
- update governed repo state

Codex may not silently self-ratify frontier status.
Codex may also not quietly turn `IsIdeas` into a product-hosting repo.

If Codex proposes or preserves a frontier idea, the idea must still point at an independent critique artifact or an explicit owner override.

## Owner

The owner is not a routine reviewer.

The owner mainly supplies:

- resources and subscriptions
- irreducibly personal context
- hard preference calls when they genuinely matter
- explicit override when desired

## External Models

Claude Code, Gemini, or other agents may be used as:

- critique lanes
- research lanes
- verification lanes

They do not become canonical truth automatically, but they do break self-confirming loops when their critique is attached explicitly.

## Requires Owner Approval

The following mutations may be drafted by any agent but become canonical only after explicit owner sign-off via GitHub PR review:

1. **Frontier promotion** — advancing any idea to `frontier` stage
2. **Handoff promotion** — moving any idea to `handoff_ready` or into `HANDOFF_QUEUE`
3. **Scope-boundary or governance changes** — any edit to `FACTORY_SCOPE_BOUNDARY.md`, `EMPLOYEE_PROTOCOLS.md`, `OPERATING_LOOP.md`, promotion checklists, or the `.github/` enforcement mechanism

These are enforced by GitHub CODEOWNERS (`.github/CODEOWNERS`) and branch protection rules on `main`. See `decisions/ADR-013-GITHUB-ENFORCEMENT-EXCEPTION.md` for why `.github/` exists.

## Scope Check Before Building

Before creating any non-markdown file, verify it is not application code per `FACTORY_SCOPE_BOUNDARY.md`. If ambiguous, write an ADR first.
