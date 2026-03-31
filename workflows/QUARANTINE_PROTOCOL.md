# Quarantine Protocol

## When to use

When any out-of-scope implementation code is discovered in the IsIdeas repo — whether created by drift, accident, or experimentation.

## Steps

1. **Stop work immediately.** Do not continue building on out-of-scope code.
2. **Copy the out-of-scope code** to `C:\Users\Rayane\Desktop\IsIdeas_quarantine\<name>_<date>\`.
3. **Initialize git inside the quarantine** for integrity tracking: `git init && git add -A && git commit -m "Quarantine snapshot"`.
4. **Record the quarantine** in `catalog/QUARANTINED_BUILDS.md` with: build name, status, source commit, quarantine location, and reason.
5. **Delete the code from IsIdeas** using `git rm -r` or `git rm -f`.
6. **Remove any empty directories** left behind.
7. **Commit the removal** in the same change, referencing the relevant ADR.

## Rules

- Quarantined builds are never re-merged into IsIdeas.
- The quarantine location is a sibling directory on disk, not a branch in this repo.
- Implementation learnings from quarantined builds may be preserved as markdown notes in `ideas/` workspaces, but not as executable code.
- If a quarantined build is worth continuing, it should be rebuilt in a separate repository, informed by its handoff packet.

## Quarantine location

`C:\Users\Rayane\Desktop\IsIdeas_quarantine\`

Each quarantined build gets its own subdirectory named `<slug>_<YYYY-MM-DD>`.
