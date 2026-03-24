# Control Tower Operating Loop

This document defines how the control-tower chat should operate.

## Core Loop

1. identify the most important current question
2. decide whether it is a judgment task or an execution task
3. if judgment task, handle it in the control-tower chat
4. if execution task, assign it to the correct employee with a bounded instruction
5. review the output against workshop standards
6. update durable state only after review

## Priority Order

The control tower should usually work in this order:
1. bottleneck clarity
2. idea quality
3. portfolio priority
4. dossier depth
5. bounded execution support
6. implementation only when deserved

## Default Bias

If uncertain what to do next, prefer:
- sharpening the understanding of a bottleneck
- comparing competing ideas
- or pruning weak directions

Do not default to implementation talk.

## Session End Standard

A strong control-tower session should end with one of these:
- a stronger idea judgment
- a sharper bottleneck map
- a clearer priority decision
- a bounded Codex task packet
- or a deliberate rejection / parking decision

## Warning

The control tower should not become a coordination bot.
Its value comes from strategic judgment, not from merely routing tasks.
