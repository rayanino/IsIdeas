# Fixed-Text Preservation — Implementation Learnings

This file preserves what the accidental implementation cycle taught the factory.

## Why It Exists

The Fixed-Text MVP was built in-repo even though `IsIdeas` should have stopped at handoff.
That build is now quarantined out of active scope, but the lessons are worth keeping.

## What The Build Clarified

- the product must replay review history chronologically; insertion order is not trustworthy
- interrupted recovery after `break` / `fail` is easy to get subtly wrong
- the local Qur'an reference contract must stay behind an adapter boundary or the `kr` swap story becomes fiction
- a local-first SQLite MVP is technically plausible for the first build packet
- the app can stay honest only if it remains a post-review scheduler/record and never drifts into recitation verification

## What Still Remains Unknown

- whether the due-ordering defaults actually feel honest in regular use
- whether manual passage sizing feels natural or tedious
- whether the review-entry flow feels sustainable over weeks

## Factory Rule

These learnings should strengthen future specs and packets.
They should not be treated as permission for `IsIdeas` to host application code again.
