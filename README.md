# ReasonQuest · Grade 8 Geometric Reasoning

**ReasonQuest** teaches secondary students to *justify* geometry rather than just calculate it. Framed as a mock-trial club — "The Geometry Court" — every world is a case where claims must be backed by evidence (marks on diagrams) and rulebook reasons with their conditions met, because *"no reason, no ruling!"*

---

## 🏛️ Architecture & Five-Phase Journey

1. **Wonder Phase**: The Courtroom Hook — Two sketches of lines; discovering why a claim of angle equality can only be ruled valid when the rails are explicitly marked parallel.
2. **Story Phase**: 4-panel narrative introducing Priyanka (rules by looks), Syafiq (no reason, no ruling), and Judge Tally the Owl 🦉.
3. **Simulate Phase**: 4 interactive archetyped stations:
   - **Station A: The Evidence Board** (Concept Discovery Lab) — Interactive transversal and tilting rails with live rulebook status checks.
   - **Station B: Prove It Parallel** (Build-to-Target Challenge) — Adjusting angle steppers to satisfy geometric converses.
   - **Station C: The Full Hearing** (Multi-Step Construction) — Marking diagrams, drawing auxiliary helper lines, ordering steps, and selecting reasons verified live by `checkChain`.
   - **Station D: Objection Station!** (Error-Detective) — Raising objections on seeded geometric fallacies and issuing sustained rulings.
4. **Practice Phase**: 10 Court Worlds (100 procedurally generated questions) across 4 gameplay modes: Guided, Independent, Timed Challenge, and Boss Battles.
5. **Reflect Phase**: Targeting headline geometric misconceptions with scorecard and learning journal.

---

## 📐 Reasoning Engine Modules (`src/utils/`)

- `geoReasons.js`: Standardized closed list of 22 reasons with textbook abbreviations, display names, and conditions.
- `geoFacts.js`: Typed Fact records, forward-chaining closure (`deriveClosure`), and the single validity authority (`checkChain`).
- `geoDiagram.js`: Coordinate builder, not-drawn-to-scale distortion (`distortNotToScale`), and perturbation sufficiency tests (`perturbationTest`).
- `congruenceMath.js`: Triangle congruence criteria classifier (SSS, SAS, ASA, AAS, RHS vs SSA/AAA) and computed counterexamples.
- `reasoningProblems.js`: Procedural question generators for Worlds 0–9 and pedagogical misconception distractor library.

---

## 🎨 Art Brief for Story Panels (PRD §13)

1. **Panel 1 (`story_1.png`)**: A school hall converted into a mock-trial courtroom. Priyanka stands confidently at the wooden lectern, pointing at a whiteboard diagram. Presiding Judge Tally the Owl sits on the judge's bench with a wooden gavel.
2. **Panel 2 (`story_2.png`)**: Judge Tally unfurls the glowing court rulebook displaying the Z, F, and C shapes, emphasizing parallel markings on the rails.
3. **Panel 3 (`story_3.png`)**: Syafiq at the whiteboard drawing a dashed helper line through vertex E, marking angle values and declining to use a protractor.
4. **Panel 4 (`story_4.png`)**: Priyanka and Syafiq side-by-side delivering the final reasoned verdict, defeating a false claim with a counterexample, while Judge Tally awards the Chief Advocate Trophy.

---

## 🚀 Running Locally

```bash
npm install
npm run dev
```

To run the automated 61,000+ assertion QA audit suite:
```bash
npm test
```

To generate narration audio via ElevenLabs:
```bash
cp .env.local.example .env.local
# Add your VITE_ELEVENLABS_API_KEY
npm run generate-audio
```
