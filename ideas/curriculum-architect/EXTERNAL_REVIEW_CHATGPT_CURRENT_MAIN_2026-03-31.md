# I-002 Adversarial Integrity Review of Current `main` State

## Evidence base

All judgments below are grounded only in the current default-branch (`main`) contents of the specified markdown files in the `rayanino/IsIdeas` repository on GitHub, read in the required order.

## Axis verdicts

axis: 1 | 2 | 3 | 4  
verdict: conditional  
confidence: moderate  
reason: The current packet is careful about **not** claiming universality and explicitly frames representativeness as the thing to be judged (not assumed), which is integrity-positive. However, the repo’s “preserved” anchor is an extracted/translated summary rather than a verbatim reproduction of the source, which creates room for subtle overconfidence about what exactly is “from the source” vs. interpretive paraphrase.  
would_change_if: If the anchor were upgraded into a more strictly separable “verbatim capture vs. paraphrase” artifact (or if a domain reviewer explicitly confirms the extraction fidelity + representativeness sufficiency for a first pass), I would move this to valid.

axis: 1 | 2 | 3 | 4  
verdict: conditional  
confidence: moderate  
reason: The packet and the formal model explicitly place teacher guidance as a first-class overlay that can contradict a published sequence without being erased, and they explicitly refuse recommendation/default-path behavior. But the surrounding “supporting truth” documents you included in the required review set still encode the older “teacher override” framing, which implicitly re-centers the published source as the norm-layer (teacher as modification). That is exactly the subtle authority inversion risk the earlier reviews were worried about; even if the packet copy is fixed, the bundle still contains language that can reintroduce the wrong hierarchy in readers’ heads (and in future edits).  
would_change_if: If all validator-facing artifacts (not just the packet) eliminate the “override” vocabulary and state the authority hierarchy in one invariant sentence (“with a teacher, teacher-path is authoritative for the student; the published source is comparative context”), I would upgrade to valid.

axis: 1 | 2 | 3 | 4  
verdict: valid  
confidence: high  
reason: The current revised materials operationalize the earlier critique well: they commit to literal preservation of the published order while using “neutral source notes” (and “extraction/ambiguity notes”) rather than judgment-loaded anomaly framing, and they explicitly forbid “fixing” or silently normalizing non-monotonic published order. This is the correct integrity posture for “container, not judge.”  
would_change_if: If any part of the validator-facing bundle reintroduces “anomaly/surprising/wrong” semantics for the Al-Hidaya ordering (or any similar case) without explicit domain confirmation, I would downgrade to conditional because that would be hidden pedagogy, not source fidelity.

axis: 1 | 2 | 3 | 4  
verdict: conditional  
confidence: moderate  
reason: The MVP boundary is narrow and explicitly authority-safe (no recommendation, no default path, no readiness scoring, no cross-curriculum synthesis), which is honest. But the current framing still mixes two different tests—(a) “would a student/teacher consult this” and (b) “does this mechanism prove the authority boundary can hold real messy curricula without inventing authority.” The preserved external reviews both treated Axis 4 as conditional in part because MVP “usefulness” is a pressure point that tends to drag systems back toward implicit recommendation/choice-support (i.e., back toward authority leakage). The packet is closer than before, but it has not fully de-risked that mis-test.  
would_change_if: If the packet makes explicit that Axis 4 is an integrity stress-test (a usefulness threshold *only insofar as* it prevents backsliding into recommendation defaults), I would upgrade to valid.

## Gate decision

overall_honest: no  
second_source_required_before_further_work: no  
ready_for_domain_facing_review: no  
blocking_concern: The authority hierarchy is repaired in the revised packet/dossier, but not sealed across the full validator-facing bundle: “teacher override” framing persists in included supporting docs, which can quietly re-establish “published source = norm, teacher = deviation” even if the packet itself avoids that wording.  
misuse_risk: A self-studying student (or an overconfident builder) treats the single displayed curriculum as *the* canonical Dars-e-Nizami “correct path,” because structured, staged presentation has inherent authority affordance that disclaimers often fail to counter in practice.  
open_note: The repo’s governance surfaces are internally consistent that the next move is “next external review against the revised packet,” and both preserved external critiques converge that a second source is not required yet; the remaining block is not “need more sources” but “finish sealing the authority-boundary framing so older vocabulary can’t leak the wrong hierarchy back in.”

## repo-grounded-summary

- The revised validation packet is materially improved: it is explicit that the system is a source-attributed container (not a judge), forbids default/recommendation behavior, and now states plainly that teacher guidance may function as the student’s primary local path while the published source remains visible for comparison.
- The current dossier largely reflects the absorbed critique: authority-loaded categorical labels are replaced by neutral editorial groupings, and “notes” are framed as source-fidelity / extraction-epistemics rather than curricular error detection.
- The integrity gap that still blocks dispatch is bundle-level coherence: ADR-012 and the modelability session still use “teacher override” framing, which is a known subtle demotion vector even when surrounding text asserts teacher supremacy.
- Source-note / non-monotonic-order handling is now neutral in the active packet/dossier: it explicitly commits to literal preservation with non-judgmental source notes rather than “fixing.”
- The MVP boundary is narrowly and explicitly authority-safe, but the packet’s “usefulness” framing is still a soft spot.
- The repo’s governed surfaces consistently state the next move as “obtain the next external validation response against the revised packet,” and the critique registry records convergence that a second source is not required yet.

## external-knowledge-notes

- none
