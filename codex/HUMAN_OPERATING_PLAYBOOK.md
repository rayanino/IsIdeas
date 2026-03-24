# Human Operating Playbook

This file tells the human operator how to use the workshop with minimal friction.

## The Three Roles

### 1. Human
Owns final intent, scarce attention, and merge decisions.

### 2. ChatGPT
Owns high-judgment work:
- idea generation
- idea criticism
- bottleneck analysis
- dossier hardening
- promotion judgment
- review of Codex output

### 3. Codex
Owns bounded background execution:
- consistency audits
- structural cleanup
- template propagation
- research scaffolds
- PR preparation

## Normal Mode

Use this default loop:
1. choose one current target
2. ask ChatGPT to sharpen the thinking or produce a Codex task packet
3. hand the packet to Codex
4. let Codex open a PR
5. return to ChatGPT for critical review before merging

## When You Are Busy

If you are studying or occupied, the best use of Codex is:
- repo consistency work
- bounded audits
- structural cleanup
- scaffold creation

Do not spend background time on open-ended idea generation.
That should stay with ChatGPT.

## When To Use ChatGPT Instead Of Codex

Use ChatGPT when the question is:
- what idea is actually worthy?
- what is the real bottleneck?
- what is dangerously misleading here?
- what should be the current focus?
- should this idea be promoted, parked, or rejected?

## Merge Discipline

Do not merge a Codex PR just because it looks tidy.
Merge only after checking:
- does it follow the task packet?
- did it preserve workshop rules?
- did it quietly change meaning rather than structure?
- did it overstep into strategic judgment?

## High-Value Default

If uncertain what to do next, deepen the current P1 idea with ChatGPT or run a bounded consistency audit with Codex.
