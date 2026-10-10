# ReasonQuest — Module PRD
**Grade 8 · Geometric Reasoning**
*(Produced from `Intellia_Module_Blueprint_PRD.md` — {{GRADE}} = Grade 8, {{TOPIC}} = Geometric Reasoning, {{SPECIAL_INSTRUCTIONS}} = none supplied, defaults assumed throughout)*

---

## 1. Overview

ReasonQuest teaches students to *justify* geometry rather than just calculate it. Students learn the standard angle facts together with the **conditions** under which each one applies, find unknown angles with a reason for every step, chain several steps together (including adding a helper line), decide whether a conclusion actually **follows** from the given information or only looks true in a sketch, put a shuffled argument back in order, test a claim with its converse and a counterexample, and use triangle congruence criteria to deduce equal sides and angles. It is framed as a school mock-trial club: every world is a case where a claim must be backed by evidence (what is marked on the diagram) and a reason from the rulebook, because "no reason, no ruling."

## 2. Background

This is the second Grade 8 (Secondary 2) module, following **QuadQuest** (Quadrilaterals). It reuses `G2-Money-Money-main`'s five-phase architecture per platform convention.

**Relationship to existing modules:**
- **QuadQuest** (Grade 8): owns the properties of the six special quadrilaterals and reasons specific to them. ReasonQuest owns the *general* reasoning layer: lines, triangles, the structure of an argument, and congruence. The two share one reason vocabulary (see the companion TRD); ReasonQuest is best played first, but nothing in either module requires the other.
- **Line Quest** (existing): parallel, perpendicular, and intersecting vocabulary is assumed.
- **RepresentQuest** (Grade 7): its habit of marking given information before solving is reused here as "mark the diagram before you rule."
- **MosaicQuest** (Grade 7): reflection and rotation are not used here.
- Equations: a few items need a one-step equation, and no equation-solving is re-taught.

## 3. Standards Alignment

**Source and honest positioning:** "geometric reasoning" is not a single named chapter in the Singapore MOE secondary syllabus; it is the *reasoning and justification* thread that runs through the Geometry and Measurement strand and the syllabus's Reasoning, Communication and Connections process. The pieces map as follows. **Secondary 1** covers angles on a line and at a point, angles between parallel lines (corresponding, alternate, co-interior) and triangle angle properties. **Secondary 2** covers congruence and similarity, including proving triangles congruent by criteria. Sources I found also note that Secondary 1 geometry is where students first "justify rather than calculate," and list the usual confusions: mixing up corresponding, alternate, and co-interior angles, and measuring a diagram that is not drawn to scale. This module therefore sits at grade level (a Grade 8 deepening of Secondary 1 facts plus Secondary 2 congruence), so **no scope-jump flag applies**.

**Boundary on proof writing (stated so the module does not sprawl):** formal, free-form proof writing is treated as a later skill in the sources I found. Here, reasoning is always **guided**: students choose reasons, order steps, fill gaps, and spot flaws. They are not asked to compose a full proof from a blank page.

**In-scope skills:**
- Recalling the angle facts *and the condition for each*: angles on a straight line (180°), angles at a point (360°), vertically opposite angles, corresponding / alternate / co-interior angles *when lines are parallel*, angle sum of a triangle, exterior angle of a triangle, base angles of an isosceles triangle, and the angles of an equilateral triangle.
- Identifying corresponding, alternate, and co-interior pairs in a diagram.
- Finding an unknown angle in one step, with the correct reason.
- Multi-step angle chasing (2 to 4 steps), choosing a sensible route, including a helper (auxiliary) line.
- Deciding whether a statement **can be deduced** from the marked information or is **not determined**.
- Ordering and completing a reasoning chain.
- Stating a converse, using a true converse to show lines are parallel, and finding a counterexample to a false claim.
- Triangle congruence: SSS, SAS, ASA, AAS, RHS; recognising that SSA and AAA are **not** criteria; writing a congruence statement with the vertices in matching order; deducing equal corresponding sides and angles.

**Adjacent skills treated as bridge only, not tested:**
- **Polygon angle sums** (interior and exterior angles of polygons) and quadrilateral-specific properties — a separate polygon topic and QuadQuest respectively.
- **Similarity** and **Pythagoras' theorem** — separate Secondary 2 topics.
- **Circle theorems and coordinate-geometry arguments** — later years.
- **Free-form proof writing** — see the boundary above.
- **Constructions** — out of scope.

**Domain conventions to encode as house style:**
- **Every fact has a condition.** "Alternate angles are equal" is only usable when the lines are marked parallel. A fact applied without its condition is an error, not a shortcut.
- **A diagram is a sketch, not evidence**, unless it says otherwise. Only marks and given values count. Many figures are deliberately labelled "not drawn to scale."
- **Every step carries a reason** chosen from a closed, standard list (wording confirmed in §15.1).
- **Mark first, rule second:** students mark the given information on the diagram before they calculate.
- A **counterexample** is a single valid case that makes a claim false; examples that agree with a claim never prove it.

## 4. Learning Objectives

By the end of this module, a student should be able to:
1. Recall each basic angle fact, state the condition under which it applies, and match it to its standard reason.
2. Identify corresponding, alternate, and co-interior angle pairs in a diagram.
3. Find an unknown angle in one step and state the correct reason.
4. Solve multi-step angle problems, including using a helper line, with a reason for every step.
5. Decide whether a conclusion can be deduced from the given marks or is not determined, without measuring the diagram.
6. Put a shuffled reasoning chain into a valid order and supply missing reasons.
7. State a converse, use a true converse to establish parallel lines, and give a counterexample to a false claim.
8. Choose the correct triangle congruence criterion (or recognise that none applies), write a congruence statement correctly, and deduce equal corresponding parts.

Ordering runs foundational → applied (facts → pairs → one step → chains → helper line → sufficiency → ordering → converse and counterexample → congruence), and drives the world sequence in §9.

## 5. Inherited Standards *(Section A of the platform blueprint — copied verbatim, unchanged)*

- **Five-phase architecture:** Wonder → Story → Simulate → Play ("Practice" in-UI) → Reflect.
- **Gamification:** XP per question, 0–3 stars per world, streak tracking, 8 fixed badge triggers (relabelled §10), 10 Boss Battles (5Q/3 lives).
- **Practice modes:** Guided (5Q, hints, untimed), Independent (10Q, no hints), Timed Challenge (8Q, 60s), Boss Battle (5Q, 3 lives).
- **Audio pipeline:** ElevenLabs Alice voice only, 6 emotional presets, pre-generated + dynamic narration, no browser TTS fallback, strict 1:1 narration/on-screen-text parity.
- **Question bank shape:** 10 worlds × 10 questions = 100, procedurally generated, ≥300-run stress test, fixed schema, World 9 (last, 0-indexed) is the mixed-review grand finale.
- **Product standards:** React/Vite/Tailwind/Framer Motion, pixel-faithful `design-tokens.css` reuse, enlarged Simulate/Practice fonts and touch targets, zip delivery with placeholder story art + art-brief README.
- **Simulate phase:** the standard 4 required, archetype-mapped stations.

## 6. Enhancement Requests / Special Instructions

None supplied. Defaults applied: 4-panel Story (justified §8.2), Singaporean-multicultural naming (§7), the **default mascot kept** (§7), and the standard 4-station Simulate design (§8.3). The Concept Discovery Lab confirmation-question tension is not re-resolved here (§15.4).

## 7. Module Identity

- **Module name:** **ReasonQuest**
- **Story theme:** a school mock-trial club, "The Geometry Court." Each world is a case. The **claim** is what must be shown, the **evidence** is what is marked on the diagram, the **rulebook** is the list of angle facts with their conditions, and the **verdict** is only valid if every step has a reason. The theme maps directly onto the skill: a counterexample is a witness who contradicts the claim, a converse is the claim turned round, and a sketch that is "not drawn to scale" is a sketch artist's drawing, not proof.
- **Named characters** (Singaporean-multicultural convention, first names only, distinct from earlier modules):
  - **Priyanka** — confident, states answers "because it looks like it" and has to be asked for a reason.
  - **Syafiq** — marks the diagram first and says "no reason, no ruling."
- **Mascot: Tally the Owl 🦉** *(platform default, unchanged)* — a wise owl is already a natural presiding judge for a mock trial, so no override is needed.

## 8. Five-Phase Journey Detail

### 8.1 Wonder
Single hook screen: *"Two sketches show the same case. In one, two lines are parallel; in the other, they are slightly off. The claim: 'these two angles are equal.' When is a judge allowed to accept it?"* (Answer to be discovered: only when the evidence says the lines are parallel.)

### 8.2 Story — 4 panels (default, not exceeded)

| # | Title | Concept delivered | Narrative beat |
|---|---|---|---|
| 1 | The First Case | Hook: an answer without a reason | Priyanka claims an angle is 70° "because it looks like it"; Judge Tally rules "no reason, no ruling." |
| 2 | The Rulebook | Angle facts, each with its condition; the Z, F, and C shapes | Tally shows that every rule has an "only if," and the rule fails when the lines are not parallel. |
| 3 | Build the Chain | Marking the diagram, chaining steps, using a helper line; a diagram is a sketch, not evidence | Syafiq solves a two-step case, adds a helper line when stuck, and refuses to measure the picture. |
| 4 | Verdict Delivered | Worked application, including a congruence argument and a counterexample | The pair delivers a fully reasoned verdict and beats a false claim with a single counterexample. |

### 8.3 Simulate — 4 stations (archetype-mapped)
Summary (full technical spec in the companion TRD):

| Station | Archetype | Premise |
|---|---|---|
| The Evidence Board | Concept Discovery Lab | Student rotates a transversal and tilts one of two lines; the board highlights corresponding, alternate, and co-interior pairs with live values, and shows which rulebook facts currently hold — and which stop holding the moment the lines are no longer parallel. |
| Prove It Parallel | Build-to-Target Challenge | A claim such as "AB is parallel to CD" is on the table. The student adjusts a marked angle until the evidence is enough to establish it (the converse of a parallel-line fact), with a live "claim established / not established" indicator and a "next case" loop. |
| The Full Hearing | Multi-Step/Composite Construction | Given a case with "Given / To show," the student marks the diagram, adds a helper line if needed, orders the shuffled steps, and picks a reason for each — combining LOs 4, 5, and 6 into one guided argument. |
| Objection! | Error-Detective | A fellow advocate's argument contains one seeded flaw (a wrong reason, a fact used without its condition, a value measured from the picture, circular reasoning, SSA or AAA used as a criterion, or a congruence statement with mismatched vertices); the student raises "Objection!" on the flawed step and corrects it. |

### 8.4 Play / Practice
Standard, unchanged mechanics (10 worlds × 10 questions, 4 modes). See world table in §9.

### 8.5 Reflect
3 new recap questions targeting the module's headline misconceptions: **mixing up corresponding, alternate, and co-interior angles (including treating co-interior angles as equal)**, **using a fact without its condition or reading a value off a not-to-scale diagram**, and **treating SSA or AAA as a congruence criterion**. Followed by the standard scorecard and a reflection prompt ("Which rule did you almost use without checking its condition?").

## 9. World & Question Bank Table

*Shape: `{ id, name, emoji, accent, description, conceptFocus, boss: { name, emoji, reward } }`. World 9 (last) is the mixed-review grand finale per platform standard.*

| id | World | conceptFocus | Description | Boss | Reward |
|---|---|---|---|---|---|
| 0 | Know Your Facts | `match-angle-facts-to-reasons` | Match each angle fact, with its condition, to its reason | The Forgetful Witness 🗣️ | Rulebook Badge |
| 1 | Spot the Letter | `identify-parallel-line-angle-pairs` | Identify corresponding, alternate, and co-interior pairs | The Letter Lookalike 🔤 | Letter Spotter Badge |
| 2 | One-Step Rulings | `find-angle-one-step-with-reason` | Find an angle in one step and name the reason | The Hasty Clerk 📎 | Ruling Badge |
| 3 | Chain of Evidence | `multi-step-angle-chasing` | Multi-step angle problems with reasons | The Broken Chain ⛓️ | Chain Badge |
| 4 | The Helper Line | `auxiliary-line-angles` | Use a helper line to solve an angle problem | The Missing Line ➖ | Helper Badge |
| 5 | Does It Follow? | `determined-or-not-determined` | Decide whether a conclusion follows from the marks | The Sketchy Sketch Artist 🖍️ | Sufficiency Badge |
| 6 | Order in the Court | `order-and-complete-reasoning` | Order and complete a reasoning chain | The Scrambled Docket 📚 | Order Badge |
| 7 | Converse and Counterexample | `converse-and-counterexample` | Converses, and disproving a claim with a counterexample | The Backwards Barrister 🔄 | Counterexample Badge |
| 8 | Congruent Evidence | `triangle-congruence-reasoning` | Congruence criteria and deductions | The Twin Impostors 👯 | Congruence Badge |
| 9 | The Grand Mock Trial | `mixed-review` | Mixed review of every concept above; hardest boss | The Chief Justice ⚖️ | Grand Verdict Trophy |

**Sample questions (illustrative, not the full 100):**

- **World 0:** *"∠a + ∠b = 180° because…"* → "angles on a straight line" ✓ (distractor: "angles at a point")
- **World 1:** *"Two parallel lines are cut by a transversal. Which pair of marked angles is *alternate*?"* → the pair forming a Z shape ✓ (distractors: the F-shape and C-shape pairs)
- **World 2:** *"AB ∥ CD, and one angle is 65°. Find the co-interior angle x, with a reason."* → `115°`, "co-interior angles, AB ∥ CD" ✓ (headline distractor `65°`, treating co-interior angles as equal)
- **World 3:** *"In triangle ABC, AB = AC and ∠A = 50°. Find the exterior angle at C, with reasons."* → `115°` ✓ (base angle 65° by isosceles base angles and angle sum; exterior angle = 180° − 65°, or 50° + 65°)
- **World 4:** *"AB ∥ CD and E lies between the lines. ∠ABE = 40° and ∠ECD = 30°. Find ∠BEC."* → `70°` ✓ (draw a line through E parallel to AB; alternate angles add) — distractor `110°`
- **World 5:** *"Not drawn to scale. Lines AB and CD look parallel but are not marked, and ∠ABE = 70°. Can ∠BEC be found?"* → "Not determined" ✓ (distractor: a numeric value read from the picture)
- **World 6:** *"Put these four steps in a valid order, then give the reason for step 3."* → a valid order ✓ (any order that respects the dependencies is accepted)
- **World 7:** *"Claim: if two angles are equal, they are vertically opposite. True or false? If false, give a counterexample."* → False; the equal base angles of an isosceles triangle ✓
- **World 8:** *"In triangles ABC and DEF, AB = DE, ∠B = ∠E, and BC = EF. Which criterion proves them congruent?"* → SAS ✓ (distractors: SSA, ASA)
- **World 9:** mixed-type item combining a "does it follow?" decision (World 5) with a congruence deduction (World 8).

## 10. Gamification — Badge Renames

| Fixed trigger | Badge name |
|---|---|
| First correct answer | First Ruling ⚖️ |
| 5-answer streak | Order in the Court 🔨 |
| 10-answer streak | Winning Streak 🔥 |
| All 4 Simulate stations complete | Full Case File 🗂️ |
| Any world scores 3 stars | Case Won ⭐⭐⭐ |
| Any Boss Battle won | Objection Sustained 🏅 |
| 20+ questions answered in Practice | Seasoned Advocate 📜 |
| Full 5-phase journey complete | Chief Advocate Badge 🏆 |

## 11. Audio & Narration Content Rules

- Vertex labels are spoken letter by letter ("A, B, C"). `∠ABC` is "angle A, B, C," `∥` is "is parallel to," `≅` is "is congruent to," `Δ` is "triangle," `∴` is "therefore," and `°` is "degrees."
- A reason is always narrated as "because" plus the full reason in words (the textbook abbreviation is never read aloud).
- Every angle-fact narration states its **condition** ("alternate angles are equal, *when the lines are parallel*").
- SSS, SAS, ASA, AAS, and RHS are spoken as "side, side, side," "side, angle, side," and so on; RHS is "right angle, hypotenuse, side."
- Not-to-scale figures are always announced as "not drawn to scale."
- "Corresponding," "alternate," and "co-interior" are never abbreviated or used loosely, and the Z, F, and C shapes are named as memory aids only.

## 12. Accessibility

Standard enlarged fonts/touch targets in Simulate and Practice, calibrated toward the platform's Secondary sizing precedent. Every figure carries a text description of its marks ("A B is parallel to C D; angle A B E is 65 degrees; not drawn to scale") so no information is carried by the drawing alone. Marks are never colour-only. Ordering and drag interactions need keyboard-operable equivalents (for example "move up" and "move down" buttons), and "Objection!" is a normal focusable button.

## 13. Assets Required

4 story images at the reference's standard placeholder dimensions, delivered as blank CSS-framed placeholders, with an art-brief README describing each panel (a lighthearted school mock-trial setting, no crime imagery):
1. A school hall set up as a mock-trial courtroom, Priyanka at the lectern and Judge Tally on the bench.
2. Tally presenting the rulebook board with the Z, F, and C shapes.
3. Syafiq at a whiteboard marking a diagram and drawing a helper line.
4. The pair delivering their final reasoned verdict.

## 14. Success Metrics / Acceptance Criteria

Standard fixed criteria (question-bank stress test, audio parity, clean build, full-journey walkthrough) plus module-specific:
- Every reasoning chain in the bank (and every "correct" ordering) passes a **chain checker** that confirms each step's reason has its condition satisfied by the givens or earlier steps.
- Every Error-Detective flaw fails that checker at exactly the seeded step and nowhere else.
- Every "determined / not determined" item is confirmed by two independent methods that must agree.
- Every numeric answer agrees across the stated rule chain and an independent consistent construction; every multi-step item with a second route gives the same answer by both routes.
- No question can be answered by measuring the drawing.
- Every congruence criterion claim is backed by computation: valid criteria force congruence, and every "not a criterion" case (SSA, AAA) is accompanied by a real pair of non-congruent triangles satisfying the same marks.
- Reasons come only from the closed list, and the wording matches the list used in QuadQuest.
- All 4 Simulate stations are genuinely interactive, not static reveal-and-answer screens.

## 15. Assumptions & Open Questions

1. **Reason wording:** Singapore schools and textbooks word reasons differently (for example "int. ∠s, AB // CD" versus "co-interior angles"). This PRD standardises on one closed list shown in full words with the abbreviation alongside. Please confirm the wording your target schools expect, and keep it identical to QuadQuest.
2. **Scope of congruence:** congruence here is limited to choosing criteria and guided deductions. A dedicated Congruence and Similarity module (similarity, scale factors, ratio of areas) is deliberately left out and would be the natural companion.
3. **Guided proofs only:** if stakeholders want free-form proof writing, that needs a separate design, since grading open-ended written proof is a different product problem.
4. **Concept Discovery Lab tension — not re-resolved here.** The Evidence Board is naturally free-play, but with no special instruction it keeps the blueprint's standard archetype (free exploration plus one light confirmation question), consistent with most earlier modules.
5. **Character names** (Priyanka, Syafiq) are proposed defaults, not yet stakeholder-approved; the mascot is the platform default.
6. **Play order with QuadQuest:** recommended ReasonQuest first, but this is a suggestion, not a platform rule.
