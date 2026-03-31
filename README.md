# IsIdeas

`IsIdeas` is now a **Codex-led idea factory and development-preparation system** for a future canonical personal Islamic hub.

This repo is not the final knowledge store.
It is the place where bottlenecks are mapped, candidate systems are challenged, dossiers/specs are hardened, build packets are prepared, and the autonomous control tower tracks factory progress.

## Core Thesis

The end state is one evolving personal Islamic environment where:

- knowledge lives safely,
- study workflows compound over years,
- memorization and review stay honest,
- uncertainty is preserved instead of hidden,
- and software acts as leverage without corrupting truth.

`kr` remains the knowledge substrate.
`IsIdeas` owns the surrounding portfolio, the autonomous factory layer, and the development-preparation machinery.

## What Changed

The earlier workshop model assumed `ChatGPT judges / Codex executes`.
That model has been retired.

The current model is:

- Codex is the default factory lead for this repo,
- the owner supplies resources and high-value personal context,
- integrity outranks convenience,
- and every serious change must remain traceable.

## Current Runtime

This repository now includes a runnable local control tower:

- Next.js dashboard at the repo root
- bootstrap file-store runtime in `runtime/`
- owner idea submission intake
- deterministic runtime tick and morning report generation
- WSL bootstrap scripts for unattended operation

What it does **not** include anymore:

- application source trees
- product implementations
- active in-repo build work

## Commands

```bash
npm install
npm run dev
npm run runtime:doctor
npm run runtime:tick
npm run runtime:report
npm run test
```

## State Model

The autonomous system works with these artifact types:

- `StudyBottleneck`
- `CritiqueArtifact`
- `Dossier`
- `Spec`
- `ResearchArtifact`
- `ToolCandidate`
- `DecisionRecord`
- `Submission`
- `RunRecord`
- `IntegrityFlag`

The current lifecycle is:

`submission -> triaged -> spark/incubating -> dossier -> spec_ready -> handoff_ready -> parked/rejected`

`handoff_ready` means the factory is done enough for a builder elsewhere.
It does not mean the app should now live inside this repo.

## Runtime Truth

- Tracked docs and `runtime/seed/state.json` are governed repo truth.
- `runtime/local/` and local Postgres state are operational runtime state.
- Operational state may move faster, but it may not silently redefine governed repo truth.
- The repo now supports both bootstrap file-store mode and local Postgres runtime mode.

## Scope Rule

`IsIdeas` may create:

- dossiers
- specs
- research notes
- critique artifacts
- handoff/build packets
- queue and progress tracking

`IsIdeas` may not host application implementations.

## Repo Map

```text
IsIdeas/
  README.md
  CLAUDE.md
  src/                    # dashboard and control-plane app
  scripts/                # runtime helpers and WSL bootstrap
  runtime/
    seed/                 # tracked bootstrap snapshot
    local/                # gitignored mutable runtime state
  control_tower/          # Codex-led charter and operating docs
  catalog/                # current frontier and portfolio records
    HANDOFF_QUEUE.md      # handoff-ready ideas waiting to be built elsewhere
    QUARANTINED_BUILDS.md # out-of-scope implementation experiments preserved as records only
  codex/                  # operator-facing usage guidance
  research/               # promoted source-backed surveys
  submissions/            # durable intake packets when promoted
  ideas/                  # legacy seed workspaces, now contestable candidates
```

## Non-Negotiables

- no silent knowledge corruption
- no false scholarly authority
- no generic productivity drift
- no untraceable stage or priority changes
- no assumption that legacy ideas deserve survival

## Immediate Use

1. Start the dashboard.
2. Submit ideas through the owner intake form.
3. Run a manual tick and inspect loop accountability plus integrity flags.
4. Use the WSL scripts when you want the unattended host.
5. Pressure-test the frontier before promoting anything.
6. When an idea becomes handoff-ready, move it into the handoff queue instead of building it here.
