# I-002 Curriculum Architect — First Published Curriculum Anchor

## Purpose

Satisfy step 1 of the ADR-012 re-entry path by preserving one specific published curriculum sequence as durable repo truth.

The goal here is not to prove that this sequence is universal.
The goal is to stop speaking abstractly about "published curricula" and anchor I-002 in one real institution-bound source that software could honestly consume.

## Selected Source

- institution: Jamia Binoria Aalamia
- page: `Dars e Nizami`
- url: <https://www.binoria.edu.pk/darsEnizami>
- accessed: 2026-03-31
- why this qualifies:
  - it is the institution's own published page
  - it explicitly states that the Dars-e-Nizami course takes 8 years
  - it publishes an ordered "Scheme of Study for National Students"
  - it names yearly stages, subjects, and assigned texts

## Epistemic Status

### Verified from the source

- Jamia Binoria publishes an 8-year Dars-e-Nizami sequence.
- The sequence is ordered across eight named stages:
  - Aamma Part 1
  - Aamma Part 2
  - Khassa Part 1
  - Khassa Part 2
  - Aalia Part 1
  - Aalia Part 2
  - Aalamia Part 1
  - Aalamia Part 2
- The page provides year-by-year subject rows with named texts.

### Not claimed here

- that this sequence represents all Dars-e-Nizami variants
- that the source's ordering is normatively correct outside this institution
- that every listed text-to-text relationship should be promoted into a universal prerequisite claim

## Extracted Ordered Sequence

| Year | Official stage label | Sequence anchor extracted from the published page |
|---|---|---|
| 1 | Aamma Part 1 | Foundation year centered on sarf and nahw, with `Al Arabiyya Baina Yadaik` part 1, `Al Arba'un Al Nawawiyya`, tajwid, and introductory fiqh via `Irshad al-Fiqh`. |
| 2 | Aamma Part 2 | Adds Qur'an translation for part 30, `Fawa'id e Makkiyya`, hadith memorization texts, `Al Arabiyya Baina Yadaik` part 2, `Muallim al-Insha`, `Al-Mukhtasar al-Quduri` parts 1 and 2, `Hidayat al-Nahw`, `Taisir al-Mantiq` / `Isa Ghoji`, and `Shaza al-'Urf`. |
| 3 | Khassa Part 1 | Moves into tafsir of Juz 21-29, `Al-Bayquniyya`, selected hadith, `Tazkirat al-Usul` and `Usul al-Shashi`, sira, fiqh via `Al-Ikhtiyar` or `Kanz al-Daqa'iq`, advanced nahw via `Sharh Ibn Aqil` or `Al-Kafiya`, plus `Mirqat` and Arabic literature. |
| 4 | Khassa Part 2 | Continues tafsir with Juz 11-20, introduces `Riyadh al-Salihin`, moves fiqh to `Al-Hidaya` part 1, adds usul via `Ifadhat al-Anwar`, and continues nahw, adab, balagha, and mantiq. |
| 5 | Aalia Part 1 | Covers tafsir of Juz 1-10, `Aathar al-Sunan`, kalam/philosophy, fiqh via `Al-Hidaya` part 2, usul plus `Adab al-Ikhtilaf`, Islamic history, and higher Arabic adab and balagha. |
| 6 | Aalia Part 2 | Moves to selected tafsir texts (`Tafsir al-Jalalayn`, `Tafsir al-Nasafi`, abridged Ibn Kathir), `Musnad Imam Abi Hanifa`, `Al-Aqida al-Tahawiyya`, `Sharh al-Aqa'id al-Nasafiyya`, fiqh via `Al-Hidaya` part 4, usul via `Al-Tawdih` / `Al-Tanqih`, maqasid, mawarith, `Al-Fawz al-Kabir`, falak, and adab. |
| 7 | Aalamia Part 1 | Advances to analytical tafsir (`Al-Baydawi`, `Mafatih al-Ghayb`, `Ahkam al-Qur'an`), `Mishkat al-Masabih`, hadith principles, fiqh via `Al-Hidaya` part 3, and institution-specific contemporary lanes in finance, politics, and suluk/tasawwuf. |
| 8 | Aalamia Part 2 | Dora Hadith year built around `Sahih al-Bukhari`, `Sahih Muslim`, `Sunan Abi Dawud`, `Jami' al-Tirmidhi`, `Muwatta`, `Sharh Ma'ani al-Athar`, `Sunan al-Nasa'i`, `Sunan Ibn Maja`, with a small research-methods component. |

## What This Source Proves For I-002

- A real institution publishes a full multi-year sequence that software could ingest without inventing its own order.
- The useful granularity is not only "science before science." The page also assigns concrete texts inside each stage.
- The authority boundary can be expressed honestly as:
  - "according to Jamia Binoria Aalamia's published Dars-e-Nizami sequence"
  - not "the correct Dars-e-Nizami order"

## Data-Model Constraints Surfaced By The Source

1. `curriculum_source` must be first-class.
The label `Dars-e-Nizami` is too broad on its own. This source is one institution-bound variant and must not be flattened into a generic canonical track.

2. `curriculum_stage` needs both literal label and ordinal.
The source uses named stages (`Aamma`, `Khassa`, `Aalia`, `Aalamia`) and software must preserve those labels while also retaining machine-usable order.

3. `stage_unit` must support multiple texts under one subject row.
Several rows bundle more than one text into one published line item.

4. `text_assignment` must support explicit alternatives.
The source sometimes publishes `or` choices inside the same year. Those are not parser noise; they are part of the source's structure.

5. `curriculum_edge` must preserve literal published order even when it looks surprising.
One visible example is the `Al-Hidaya` ordering: part 4 appears in year 6 while part 3 appears in year 7. The system must store that as a source fact plus a note, not auto-correct it into a cleaner sequence.

6. `lane_tagging` is necessary.
The page mixes core Dars-e-Nizami content with Urdu, English, Pakistan studies, optional groups, and institution-specific contemporary subjects. The model must distinguish:
- core curriculum sequence
- attached co-curriculum
- optional or parallel institutional additions

7. `teacher_override` must be an overlay, not a mutation.
If a student's teacher gives a different path, the system should preserve the Jamia Binoria source unchanged and add a separate teacher-attributed path.

## Initial Authority-Boundary Sketch

The smallest honest structure implied by this source is:

- `CurriculumSource`
  - institution name
  - source title
  - source URL
  - accessed date
  - tradition label optional
  - notes on scope and representativeness
- `CurriculumStage`
  - source ID
  - literal stage label
  - ordinal
  - year number
  - stage notes
- `StageUnit`
  - stage ID
  - subject label
  - lane tag (`core`, `co_curricular`, `optional`)
  - display order
  - notes
- `TextAssignment`
  - unit ID
  - text label as published
  - assignment mode (`required`, `alternative`, `selection`, `memorization`)
  - display order
  - notes
- `CurriculumObservation`
  - source ID or unit ID
  - observation type (`anomaly`, `ambiguity`, `translation_note`)
  - description
- `TeacherSpecifiedPath`
  - student context ID
  - teacher attribution
  - affected stage or unit
  - override description
  - coexistence rule linking it to the published source rather than replacing it

## Judgment

Step 1 of the I-002 re-entry path is now complete.

Follow-up note:
the later dossier formalization separated teacher guidance into a dedicated `TeacherSpecifiedPath` overlay rather than treating it as a `lane tag`.
This note remains the step-1 sourcing artifact; the dossier now carries the more mature model.

This does **not** promote I-002 to frontier and it does **not** validate the source as universally representative.
It does remove the weaker form of ambiguity that previously remained in the repo:
the factory no longer has to talk about "a published curriculum sequence" as a hypothetical category.

The active next move no longer lives in this note.
Steps 2 and 3 now live in `ideas/curriculum-architect/DOSSIER.md`, and the current repo move is to obtain the first external validation response against the resulting packet.
