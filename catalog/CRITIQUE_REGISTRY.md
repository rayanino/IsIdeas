# Critique Registry

| ID | Date | Target | Reviewer | Independence | Verdict | Location | Summary |
|---|---|---|---|---|---|---|---|
| CA-2026-03-30-adversarial-review | 2026-03-30 | Architecture and integrity review | Claude Opus 4.6 | external | 15 findings (3 critical, 5 high) | `ADVERSARIAL_REVIEW_2026-03-30.md` | External adversarial review of the Codex-led reset and runtime architecture. Code references in this review apply to the extracted control tower (ADR-011). |
| I-002-2026-03-31-chatgpt-deep-research | 2026-03-31 | I-002 Curriculum Architect | ChatGPT Deep Research | external | `overall_honest: no`; `second_source_required_before_further_work: no`; 4 conditional axes | `ideas/curriculum-architect/EXTERNAL_REVIEW_CHATGPT_DEEP_RESEARCH_2026-03-31.md` | External integrity review found the main remaining leak in authority-loaded terms such as `validated`, `core`, `optional`, `anomaly`, and teacher-as-deviation framing. |
| I-002-2026-03-31-claude-opus-review | 2026-03-31 | I-002 Curriculum Architect | Claude Opus 4.6 | external | `overall_honest: yes`; `second_source_required_before_further_work: no`; 4 conditional axes | `ideas/curriculum-architect/EXTERNAL_REVIEW_CLAUDE_OPUS_2026-03-31.md` | External adversarial review agreed no second source is required yet, but flagged teacher-authority framing, anomaly taxonomy, MVP framing, and evidence durability before dispatch. |
| I-002-2026-03-31-chatgpt-current-main-gate | 2026-03-31 | I-002 Curriculum Architect | ChatGPT Deep Research | external | `overall_honest: no`; `second_source_required_before_further_work: no`; `ready_for_domain_facing_review: no` | `ideas/curriculum-architect/EXTERNAL_REVIEW_CHATGPT_CURRENT_MAIN_2026-03-31.md` | Fresh gate review of current `main` found the remaining blocker in bundle-level coherence: older teacher-override framing persisted in supporting truth docs even after the packet itself had been revised. |

## Rule

Frontier ideas require at least one independent critique artifact or an explicit owner override. Self-confirming proposer-recorder-critic loops are a known failure mode.
