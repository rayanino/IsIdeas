# Supervised Proving Run

Use this before treating the control tower as something that can just run unattended.

## Goal

Prove that the runtime can handle one real owner input without:

- silently changing governed portfolio truth
- hiding integrity issues
- or producing generic activity instead of a useful next move

## Commands

```bash
npm run runtime:baseline
npm run runtime:pilot
```

## Pass Conditions

- the submission is triaged honestly
- idea stage/priority/attention envelopes do not drift
- the morning report changes in a meaningful way
- the resulting packet is strong enough to choose the next real recurring loop

## Failure Conditions

- any governed portfolio envelope changes as a side effect
- the submission disappears or duplicates unclearly
- the morning report becomes noisier rather than more useful
- the run hides an integrity or loop-accountability issue
