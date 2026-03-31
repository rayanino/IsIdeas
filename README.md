# IsIdeas

`IsIdeas` is a **Codex-led idea factory and development-preparation system** for a future canonical personal Islamic hub.

This repo is not the final knowledge store and not a place for application code.
It is the place where bottlenecks are mapped, candidate systems are challenged, dossiers/specs are hardened, build packets are prepared, and portfolio progress is tracked.

## Core Thesis

The end state is one evolving personal Islamic environment where:

- knowledge lives safely,
- study workflows compound over years,
- memorization and review stay honest,
- uncertainty is preserved instead of hidden,
- and software acts as leverage without corrupting truth.

`kr` remains the knowledge substrate.
`IsIdeas` owns the surrounding portfolio and development-preparation machinery.

## What Changed

The earlier workshop model assumed `ChatGPT judges / Codex executes`.
That model has been retired.

The current model is:

- Codex is the default factory lead for this repo,
- the owner supplies resources and high-value personal context,
- integrity outranks convenience,
- and every serious change must remain traceable.

## Scope Rule

`IsIdeas` is a pure markdown factory. It may create:

- dossiers
- specs
- research notes
- critique artifacts
- handoff/build packets (in `handoff/`)
- bottleneck maps, portfolio tracking, and governance documents

`IsIdeas` may **not** host application implementations, runtime code, build tooling, or `package.json` files. See `control_tower/FACTORY_SCOPE_BOUNDARY.md` for the full boundary definition and `workflows/QUARANTINE_PROTOCOL.md` for what to do when out-of-scope code is discovered.

## Submitting Ideas

The owner submits ideas by creating tracked markdown files:

- **Quick capture**: create a file in `capture/YYYY-MM-DD-<slug>.md` using `templates/QUICK_CAPTURE_TEMPLATE.md`
- **Structured intake**: use `templates/OWNER_SUBMISSION_TEMPLATE.md` for deliberate, detailed submissions

Submitted ideas enter the triage cadence and may be promoted through the factory lifecycle.

## Repo Map

```text
IsIdeas/
  README.md
  CLAUDE.md
  control_tower/          # Codex-led charter, operating docs, and scope boundary
  catalog/                # current frontier, portfolio records, bottleneck map, registries
    HANDOFF_QUEUE.md      # handoff-ready ideas waiting to be built elsewhere
    QUARANTINED_BUILDS.md # out-of-scope builds preserved as records only
  decisions/              # architecture decision records (ADRs)
  ideas/                  # idea workspaces (dossiers, specs, research)
  handoff/                # builder-facing handoff packets
  codex/                  # operator-facing usage guidance
  audits/                 # session-level findings and synthesis inputs
  research/               # promoted source-backed surveys
  capture/                # raw idea intake
  submissions/            # submission tracking
  shared/                 # glossary, kr boundary, shared primitives
  workflows/              # lifecycle, promotion, consistency rules
  templates/              # document templates
  principles/             # guiding principles
  roadmaps/               # strategic roadmaps
```

## Non-Negotiables

- no silent knowledge corruption
- no false scholarly authority
- no generic productivity drift
- no untraceable stage or priority changes
- no assumption that legacy ideas deserve survival
- no application code in this repository

## Immediate Use

1. Submit ideas through markdown files in `capture/`.
2. Pressure-test the frontier before promoting anything.
3. When an idea becomes handoff-ready, move it into the handoff queue instead of building it here.
