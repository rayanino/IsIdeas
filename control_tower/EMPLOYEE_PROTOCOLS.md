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

## Scope Check Before Building

Before creating any non-markdown file, verify it is not application code per `FACTORY_SCOPE_BOUNDARY.md`. If ambiguous, write an ADR first.
