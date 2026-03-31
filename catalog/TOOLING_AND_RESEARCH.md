# Tooling and Research

## Tools

| ID | Tool | Category | Status | Note |
|---|---|---|---|---|
| T-001 | WSL2 runtime clone | execution host | adopted | Preferred unattended host so long runs stay isolated from the interactive Windows checkout. |
| T-002 | Codex CLI | primary agent runtime | adopted | Primary writing and integration lane for the control tower and future handoff packets. |
| T-003 | Claude Code | secondary agent runtime | evaluating | Useful as an independent verification or exploration lane when cross-provider disagreement matters. |
| T-004 | Gemini CLI | secondary agent runtime | evaluating | Useful as a local multi-provider research or verification lane without requiring a separate API key. |
| T-005 | Paperclip | agent control plane reference | watching | Reference for multi-agent orchestration and UI, but not yet trusted as the canonical core. |
| T-006 | pg-boss | durable queue | superseded | Was a candidate durable queue for the runtime; runtime has been extracted per ADR-011. |

## Research Artifacts

| ID | Artifact | Status | Focus | Note |
|---|---|---|---|---|
| R-001 | Autonomous system architecture survey | active | Control plane options, WSL runtime, durable queues, and local-first orchestration. | Paperclip, OpenAI Agents SDK, and Temporal have already been sampled. |
| R-002 | Foundations-first bottleneck map | active | Qur'an, Arabic, memorization, question capture, and private study continuity. | This remains a working analytical map and still needs explicit source-backed grounding. |

## Evidence Links

| ID | Title | Source | Note |
|---|---|---|---|
| ev-001 | Paperclip architecture | official docs | Useful as a multi-agent control plane reference. |
| ev-002 | OpenAI Agents SDK | official docs | Use for structured handoffs, tools, and agent orchestration. |
| ev-003 | Temporal docs | official docs | Durable execution reference considered and deferred for stack simplicity. |
