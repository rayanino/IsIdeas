# Integrity Board

| ID | Severity | Status | Concern | Opened | Updated | Meaning | Next action |
|---|---|---|---|---|---|---|---|
| F-001 | medium | resolved | Storage backend transition must be explicitly recorded | 2026-03-30 | 2026-03-31 | The tracked seed snapshot began in bootstrap file-store mode. The runtime has been extracted per ADR-011, so this flag is now resolved by removal of the runtime surface. | No action needed; the runtime no longer lives in this repo. |
| F-002 | medium | open | Seed portfolio still reflects workshop-era assumptions | 2026-03-30 | 2026-03-31 | Factory scope drift has been corrected and I-002 now has a primary-source anchor, a formal authority-boundary model, a plausible MVP boundary, a revised validation packet, and two external reviews. Those reviews converge that no second source is required yet, but the idea still depends on further external scrutiny before promotion. | Obtain the next external validation response against the revised packet and preserve it verbatim. |

## Rule

Integrity flags must not be silently deleted. They are resolved with a status change and an explanation, or they escalate.
