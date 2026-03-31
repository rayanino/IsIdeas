# Integrity Board

| ID | Severity | Status | Concern | Opened | Updated | Meaning | Next action |
|---|---|---|---|---|---|---|---|
| F-001 | medium | resolved | Storage backend transition must be explicitly recorded | 2026-03-30 | 2026-03-31 | The tracked seed snapshot began in bootstrap file-store mode. The runtime has been extracted per ADR-011, so this flag is now resolved by removal of the runtime surface. | No action needed; the runtime no longer lives in this repo. |
| F-002 | medium | open | Seed portfolio still reflects workshop-era assumptions | 2026-03-30 | 2026-03-31 | Factory scope drift has been corrected and I-002 now has a primary-source anchor, a formal authority-boundary model, a plausible MVP boundary, and a generic expert validation packet. The remaining question is whether the first external response supports, conditions, or blocks future promotion. | Obtain and preserve the first external validation response to the I-002 packet. |

## Rule

Integrity flags must not be silently deleted. They are resolved with a status change and an explanation, or they escalate.
