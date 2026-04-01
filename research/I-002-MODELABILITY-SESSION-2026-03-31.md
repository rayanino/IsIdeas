# I-002 Curriculum Architect — Modelability Determination Session

## Research Question

Can the Curriculum Architect idea be pursued honestly, or does it require authority claims the factory cannot make?

Specifically:
1. Can software hold multiple contradictory prerequisite structures from real Islamic traditions without taking a normative position?
2. Do published Islamic curricula provide explicit prerequisite structures that software could consume, or is sequencing transmitted primarily through teacher discretion?

## Why This Research Matters

I-002 was demoted from frontier to challenge (ADR-007) because its "modelability and authority assumptions" were unvalidated. The factory has no frontier idea. This session determines whether I-002 earns a concrete path back or gets parked.

The factory's non-negotiable is "no false scholarly authority." If the only way to build a curriculum sequencing system is to invent prerequisite structures, the idea violates this non-negotiable. If published curricula already provide structures the system can consume, the idea may be honest.

## Judgment Framework

**Written before analysis to prevent retrofitting conclusions.**

### Outcome A — Returns to frontier with scholarly-input action

All three must be true:
1. The authority boundary architecture is sound (software can hold contradictory structures without choosing)
2. At least one published curriculum provides explicit, consumable prerequisite structures
3. There is a concrete next-step that doesn't require `kr` to be ready

The next-step must be specific: "Find a scholar or curriculum expert who can validate whether [specific structure] is representative, and confirm the authority boundary mechanism doesn't misrepresent their tradition."

### Outcome B — Parked

Any one of these is sufficient:
1. The authority boundary architecture can't handle real disagreement between traditions
2. No published curriculum provides consumable structures (all sequencing is teacher-transmitted)
3. The idea is structurally blocked on `kr` with no workaround

### Epistemic Bounds

What this session can determine:
- Whether a software-architecture mechanism for multi-tradition sequencing is feasible (architecture question)
- Whether published curricula exist that provide explicit sequencing (empirical question, limited by what we can access)
- Whether the `kr` dependency is blocking or deferrable (dependency analysis)

What this session CANNOT determine:
- Whether any specific prerequisite relationship in Islamic sciences is correct (scholarly judgment)
- Whether a particular curriculum's sequencing is representative of its tradition (authority claim)
- Whether the system would be useful to real students (user research, requires real users)

Any finding below labeled `uncertain` should not be treated as evidence. Only `verified` and `likely` findings inform the judgment.

### Reference Context

- **ADR-007**: "weakened more substantially by unvalidated modelability and authority assumptions" — this session tests those exact assumptions
- **I-001 lesson**: "what seems modelable in theory becomes tricky in practice" (insertion-order vs. chronological replay was a surprise)
- **Dossier open questions**: what counts as a prerequisite, how to represent multiple paths, how teacher-guided paths should relate to published sources, what is the smallest honest MVP

---

## Step 1: Authority Boundary Architecture

### The Question

Can software present prerequisite structures from multiple Islamic traditions side-by-side without the system itself taking a normative position?

### Proposed Mechanism

**Core principle:** The system is a container for curriculum structures, not a source of them. It holds what others provide. It never recommends, asserts, or defaults.

**1a. Multi-curriculum presentation.**
The system stores prerequisite structures as named, attributed data objects. Each structure belongs to a named curriculum source (e.g., "Al-Azhar Year 1-4 sequence," "Dars-e-Nizami traditional order," "Teacher X's personalized plan"). The system can display multiple structures simultaneously but never merges them into a single recommended path.

This is architecturally feasible. It is the same pattern as a map application showing multiple routes — the system presents options without choosing. No authority claim is needed because the system attributes every structure to its source.

**1b. Teacher-guided path.**
When a student has a teacher, the student enters the teacher's guidance as a `teacher_guided_path`. This path is authoritative for that student; the published curriculum's structure remains visible as comparative context, with neither framed as wrong.

This is straightforward. The system's data model treats teacher-guided entries as first-class, not as exceptions. No authority claim is needed because the teacher's word is always the highest authority in the student's context.

**1c. No default sequence.**
When a student first uses the system, there is no pre-selected curriculum. The student must either:
- Select a published curriculum to follow, or
- Enter their teacher's guidance, or
- Use the system with no curriculum loaded (showing texts and metadata only, with no system-owned prerequisite edges until a named source or teacher-guided path is entered)

The system never presents "the recommended path." It presents "the path according to [source]." This eliminates the most dangerous authority claim: the implicit default.

**1d. Visible disagreement.**
When two curriculum sources disagree about sequencing (e.g., one places usul al-fiqh before furu', another teaches them in parallel), the system shows the disagreement explicitly rather than hiding it behind a single recommendation.

This is architecturally simple (display both) but requires that the data model supports multiple conflicting edges between the same nodes, each attributed to a different source.

### Architecture Verdict

**The mechanism is sound.** Each sub-question has a concrete, implementable answer. The key design constraint is that every prerequisite edge must carry source attribution — the system is a container, not a source. The mechanism does not require the system to invent, evaluate, or recommend any sequencing. It only requires the system to hold and display what others have provided.

**The mechanism's critical dependency:** It requires external prerequisite structures to exist and be consumable. If no published curriculum provides explicit structures, the container has nothing to hold.

This leads directly to Step 2.

---

## Step 2: Existing Curricula Survey

### The Question

Do published Islamic educational institutions provide explicit, granular prerequisite structures that software could consume?

### Survey

#### Dars-e-Nizami (Deobandi tradition)

**Confidence: likely** (widely documented in secondary sources, though specific institutional variants exist)

The Dars-e-Nizami is a structured curriculum used across South Asian madrasahs (Deobandi and related traditions). It has a defined year-by-year sequence of texts (mutun) across multiple sciences: sarf (morphology), nahw (grammar), mantiq (logic), fiqh, usul al-fiqh, aqeedah, tafsir, hadith, and others.

- **Does it provide an explicit sequence?** Yes — the Dars-e-Nizami prescribes specific texts in a specific order across approximately 8 years.
- **Is the sequence granular enough for software?** Partially — it operates at the text level (which kitab comes when), not at the concept level. A system could represent "study Hidayat al-Nahw before Kafiya" but not "master topic X before starting topic Y."
- **Does it acknowledge alternatives?** No — the Dars-e-Nizami is a single canonical sequence. Different institutions modify it, but the curriculum itself does not present alternatives.

**Assessment:** Consumable at the text-level. The system could hold "Dars-e-Nizami sequence" as one named curriculum with a defined text ordering. Institutional variants could be represented as separate named sequences.

#### Al-Azhar (Egyptian tradition)

**Confidence: likely** (Al-Azhar's general structure is well-known, specific year-by-year details vary)

Al-Azhar operates a structured multi-year program with defined stages. The general pattern: Arabic language sciences and Qur'an memorization in early years, then branching into fiqh (across all four madhabs), usul, tafsir, hadith, and aqeedah.

- **Does it provide an explicit sequence?** Yes — Al-Azhar's program has year-by-year structure with defined subjects per stage.
- **Is the sequence granular enough?** At the science level, yes. At the text level, it depends on the specific department and period.
- **Does it acknowledge alternatives?** Partially — Al-Azhar teaches all four madhabs, implicitly acknowledging that fiqh sequencing differs by school.

**Assessment:** Consumable at the science-level and partially at the text level. The multi-madhab approach is a natural fit for the authority boundary mechanism (the system can present "according to the Hanafi track" vs. "according to the Shafi'i track").

#### Mauritanian Mahadra (West African tradition)

**Confidence: uncertain** (less well-documented in accessible sources; based on secondary accounts)

The Mauritanian mahadra tradition has a distinctive sequencing: heavy emphasis on Qur'an memorization first, followed by Arabic grammar (often through specific texts like the Alfiyyah), then branching into fiqh (Maliki), tafsir, hadith, etc.

- **Does it provide an explicit sequence?** The general ordering is well-known within the tradition (Qur'an → Arabic → fiqh is broadly agreed). Specific text-level sequencing varies by shaykh.
- **Is the sequence granular enough?** At the science level, yes. At the text level, it depends heavily on the specific shaykh's approach.
- **Does it acknowledge alternatives?** The tradition itself is relatively uniform in broad strokes, but teacher discretion plays a large role in specifics.

**Assessment:** Partially consumable. The broad science-level ordering is explicit. Text-level sequencing is teacher-dependent. This is a good test case for the teacher-guided-path mechanism.

#### Online Platforms

**Confidence: likely** (course catalogs are publicly observable)

Modern online Islamic education platforms (SeekersGuidance, Qalam Seminary, Al-Maghrib Institute, Bayyinah) present their courses with varying levels of explicit prerequisite structure.

- SeekersGuidance uses a "learning pathway" concept with explicitly marked prerequisites for advanced courses.
- Al-Maghrib and Bayyinah present course catalogs with levels (beginner/intermediate/advanced) but less explicit prerequisite chains.
- Qalam Seminary's Qalam curriculum has a structured multi-year sequence.

**Assessment:** Some platforms provide explicit prerequisite structures; others rely on level labels. The platforms that do provide explicit prerequisites demonstrate that at least some Islamic educators believe sequencing is modelable and worth making explicit.

#### Classical Texts on Pedagogy

**Confidence: likely** (texts are widely available and studied)

- **Ta'lim al-Muta'allim** (al-Zarnuji, 13th century): Discusses the importance of proper sequencing in learning, recommends starting with easier texts before harder ones, and emphasizes the role of the teacher in guiding the student's path. It provides general principles of sequencing but not a specific prerequisite graph.

- **Ibn Khaldun's Muqaddima** (Chapter 6, sections on education): Discusses the sciences and their relationships, notes that certain sciences serve as tools for others (Arabic for Qur'an interpretation, logic for theology), and describes a general pedagogical ordering. More descriptive than prescriptive, but provides evidence that Islamic scholars have historically recognized prerequisite structures.

**Assessment:** Classical texts provide general principles and broad sequencing guidance. They show that concern for sequencing has historical precedent in Islamic education, but they do not provide the kind of granular, machine-consumable prerequisite graphs that a software system would need. Their value is conceptual (the idea is not invented) rather than data (the structures still need to be sourced from institutions).

### Survey Synthesis

| Source | Explicit sequence? | Granularity | Alternatives acknowledged? | Consumable by software? |
|---|---|---|---|---|
| Dars-e-Nizami | Yes | Text-level | No (single canonical order) | Yes, as one named curriculum |
| Al-Azhar | Yes | Science-level, partial text | Partially (multi-madhab) | Yes, at science level |
| Mauritanian mahadra | Broad ordering yes | Science-level; text-level varies | Teacher-dependent | Partially |
| Online platforms | Some yes, some no | Course-level | Varies | Yes, where provided |
| Classical texts | General principles | Conceptual, not granular | Descriptive not prescriptive | No (principles, not data) |

**Step 2 verdict: PASS (with qualification).**

Published Islamic curricula DO provide explicit prerequisite structures at the science level and, in some cases, at the text level. The system would not need to invent prerequisite structures — it could consume and present structures that institutions already publish.

**The qualification:** The granularity varies. Science-level sequencing (Arabic before fiqh, usul before furu') is widely available. Text-level sequencing (which kitab before which kitab) is available from structured curricula like Dars-e-Nizami but is teacher-dependent in other traditions. The system would be most honest at the science level and would need to acknowledge uncertainty at the text level.

---

## Step 3: kr Dependency Assessment

### Current Status

`krDependencyStatus: blocked_for_build` with note: "A build-grade version would need a much deeper pedagogical ontology than is currently defined."

### Analysis

The `kr` dependency has two layers:

1. **Data layer:** Curriculum Architect needs to reference topics, sources, and texts from `kr`. If `kr` doesn't exist, the system has nothing to sequence. This is a hard build dependency.

2. **Ontology layer:** Curriculum Architect needs `kr` to define what a "topic" and a "source" are at a level deep enough for prerequisite relationships to attach to. If `kr` only knows "this is a book" but not "this is a book about usul al-fiqh at the intermediate level," the prerequisite structure has nothing granular to reference.

### Does this block frontier re-entry?

Frontier work for I-002 would NOT be build work (IsIdeas doesn't build). It would be:
- Deepening the dossier with the findings from this session
- Sourcing specific published curriculum structures (e.g., obtaining a specific Dars-e-Nizami text sequence)
- Designing the data model for the authority boundary mechanism
- Writing a spec and eventually a handoff packet

None of this requires `kr` to be ready. The dossier-to-spec path can proceed on the basis of published curriculum data alone. The `kr` dependency is real but deferred — it blocks build, not factory work.

### Assessment

**kr does NOT block frontier re-entry.** It blocks eventual build/handoff, but the factory has legitimate dossier-deepening and spec work to do that is independent of `kr`.

---

## Step 4: Binary Judgment

### Applying the Framework

| Criterion | Result | Evidence |
|---|---|---|
| Authority boundary architecture is sound | **PASS** | The container mechanism works: source-attributed edges, teacher-guided path, no default, visible disagreement. Each sub-question has a concrete, implementable answer. |
| At least one published curriculum provides consumable structures | **PASS (qualified)** | Dars-e-Nizami provides text-level sequencing. Al-Azhar provides science-level sequencing. Online platforms demonstrate that educators treat prerequisites as explicit and modelable. |
| Concrete next-step exists that doesn't require kr | **PASS** | Dossier-deepening, specific curriculum sourcing, data model design, and spec work can all proceed without kr. |

### Verdict: Outcome A — I-002 returns to challenge/visible with a defined re-entry path

I-002 does NOT return directly to frontier. The session validated that the idea is structurally sound, but the dossier is too thin for deep attention. The re-entry path is:

**Concrete next-steps before frontier promotion:**
1. Source at least one specific, complete published curriculum sequence (e.g., obtain a detailed Dars-e-Nizami text list with year-by-year ordering) — this turns the "likely" evidence into "verified" evidence
2. Design the data model for the authority boundary mechanism at spec-ready granularity
3. Write a concrete MVP scope: what does the smallest honest system look like?
4. Find a scholar or curriculum expert who can validate that the sourced curriculum is representative of its tradition and that the authority boundary mechanism doesn't misrepresent it

When all four are complete, I-002 can re-enter the frontier with a dossier promotion to spec_ready.

### What Argument This Decision Defeated

The strongest argument against I-002 was: "prerequisite structures cannot be modeled without claiming false scholarly authority." This session found that the argument is wrong in its strong form — published curricula already publish ordered curricular structures the system could consume — but correct in its weak form: the system must consume existing structures, not invent its own.

The authority boundary mechanism resolves the risk by making the system a container, not a source. The system never recommends; it presents what named sources provide, with the teacher-guided path as authoritative for the student.

### What Uncertainty Remains

- The "likely" evidence about specific curricula (Dars-e-Nizami, Al-Azhar) has not been verified against primary sources from within this session. The next-step requires actual sourcing.
- Whether the science-level granularity is useful enough for real students is a user-research question this session cannot answer.
- Whether the authority boundary mechanism actually prevents false authority in practice requires scholarly validation, not just architectural design.
- The I-001 lesson applies: "what seems modelable in theory becomes tricky in practice." The architectural mechanism is sound in theory; practical surprises are expected.

---

## Step 5: Epistemic Honesty

### What Claude Determined

- The authority boundary architecture is a legitimate software-architecture question. Claude's design (container, not source) is structurally sound and does not require domain expertise to evaluate.
- The existence of published curriculum structures is an empirical question. Claude's survey is based on general knowledge and should be treated as a starting point, not as verified research.
- The kr dependency analysis is a standard dependency assessment.

### What Requires Domain Expertise

- Whether any specific published curriculum accurately represents its tradition
- Whether the authority boundary mechanism is sufficient to prevent misrepresentation in practice
- Whether science-level prerequisite structures are useful enough to justify software support
- Whether the classical texts' pedagogical principles map onto modern Islamic education practice

### Confidence Levels

| Finding | Confidence | Reason |
|---|---|---|
| Authority boundary mechanism is architecturally sound | High | This is a software-architecture judgment |
| Published curricula provide explicit sequences | Medium | Based on general knowledge, not primary sources |
| System can be honest at science level | Medium | Plausible but untested against real variation |
| kr does not block frontier re-entry | High | Standard dependency analysis |

### What a Scholar Reviewing This Would Need to Validate

1. Is the characterization of Dars-e-Nizami, Al-Azhar, and mahadra sequencing accurate?
2. Does the authority boundary mechanism adequately prevent misrepresentation of their tradition?
3. Is there a meaningful pedagogical difference between science-level and text-level prerequisite modeling?
4. Are there prerequisite relationships we've missed that would break the mechanism?

---

## New Risks Noticed

- The system could become a "curriculum browser" that is technically honest but practically useless — presenting too many options without helping the student decide
- Sourcing published curricula may be harder than expected — institutions may not publish their full sequencing in accessible formats
- The authority boundary mechanism adds complexity that may discourage adoption

## New Open Questions

- What is the smallest honest MVP? (Still unanswered — deferred to dossier deepening)
- Can the system add value beyond what a student's teacher already provides?
- How would the system handle a student with no teacher (self-study)?

## Suggested Repo Updates

- Update `ideas/curriculum-architect/DOSSIER.md` — revised judgment and next move
- Update `ideas/curriculum-architect/README.md` — new current rule reflecting re-entry path
- Update `catalog/IDEA_REGISTRY.md` — I-002 next move
- Update `catalog/BOTTLENECK_MAP.md` — B-002 next move
- Write `decisions/ADR-012-I-002-MODELABILITY-DETERMINATION.md`
- `catalog/ACTIVE_FOCUS.md` and `catalog/PORTFOLIO_PRIORITY_BOARD.md` — no change (I-002 stays at challenge, not yet frontier)
