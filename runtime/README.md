# Runtime

`runtime/seed/` contains the tracked governed snapshot for the control tower.

`runtime/local/` is the live mutable state for the local dashboard and unattended loops.
It is intentionally gitignored so the autonomous system can run without dirtying the repo on every tick.

## Commands

- `npm run runtime:doctor` checks the local execution environment.
- `npm run runtime:baseline` writes a baseline snapshot packet into `runtime/local/baselines/`.
- `npm run runtime:pilot` runs one supervised proving run and writes a before/after packet into `runtime/local/proving-runs/`.
- `npm run runtime:redteam -- --mode=manual|scheduled [--target <slug>]` runs the independent critique loop and writes a packet into `runtime/local/critique-runs/`.
- `npm run runtime:reset` restores `runtime/local/` from the tracked seed.
- `npm run runtime:tick` runs one deterministic control-tower cycle.
- `npm run runtime:report` prints the latest generated morning report.

## Truth Boundary

- tracked docs and `runtime/seed/state.json` are governed repo truth
- `runtime/local/` and local Postgres documents are operational runtime state
- operational state may not silently override governed repo truth

## Modes

- `bootstrap_file_store`: seed-derived local working copy
- `postgres_runtime`: local Postgres-backed working state with explicit transition recording

The file-store path remains useful for isolated testing.
