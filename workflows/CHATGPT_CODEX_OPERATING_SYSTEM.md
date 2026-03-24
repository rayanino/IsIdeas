# ChatGPT–Codex Operating System

This document defines how the workshop should use ChatGPT and Codex together.

The core principle is simple:

- ChatGPT owns judgment.
- Codex owns bounded execution.
- GitHub PRs are the review gate.

## Why This Split Exists

The most dangerous failure mode is letting execution outrun judgment.

A second dangerous failure mode is using a high-judgment system for repetitive repo work it does not need to do manually.

The correct split is:
- use ChatGPT for strategic thinking, idea criticism, dossier hardening, and promotion judgment
- use Codex for concrete, reviewable background tasks in the repo

## What ChatGPT Should Own

ChatGPT should lead on:
- idea generation from real bottlenecks
- idea comparison and pruning
- boundary setting
- risk detection
- dossier hardening
- deciding whether an idea should be promoted, parked, or rejected
- reviewing Codex output before it becomes durable repo truth

## What Codex Should Own

Codex should be delegated tasks like:
- repo consistency audits
- workspace contract compliance passes
- propagating template changes across idea workspaces
- creating draft research scaffolds
- producing drift reports
- making bounded doc updates
- preparing PRs from precise task packets

## What Codex Should Not Own

Do not ask Codex to be the final judge of:
- whether an idea is strategically extraordinary
- whether a system is scholar-safe enough
- whether a bottleneck is truly high leverage
- whether an idea should become the primary focus

Those are judgment tasks, not execution tasks.

## Standard Loop

1. ChatGPT sharpens the question or task.
2. A bounded Codex task packet is written.
3. Codex executes in the repo and opens a PR.
4. ChatGPT reviews the result critically.
5. Only then is the output accepted into durable repo state.

## Golden Rule

Codex should not invent the standard.
Codex should execute against the standard.
