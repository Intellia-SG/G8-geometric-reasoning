# ReasonQuest — Module TRD
**Grade 8 · Geometric Reasoning**
*(Technical companion to `ReasonQuest_Grade8_PRD.md`, produced from `Intellia_Module_Blueprint_TRD.md`. Repo: `reason-quest-main`. Default clone source: `G2-Money-Money-main`, unless a more recent sibling — for example `quad-quest-main` or `mosaic-quest-main`, which also render SVG geometry — is designated as the actual clone source at build time.)*

---

## 1. Reference Analysis Notes — Gotcha Check

Check each fresh against whichever repo is actually cloned from, per platform blueprint §1:

1. **Dead/duplicate `src/features/*` folder.** Confirm `App.jsx`'s actual imports before copying anything.
2. **Hardcoded story-panel count.** This module uses the default **4 panels** — likely a no-op, but confirm against the actual clone source.
3. **Static vs. procedural question bank.** Build `data/questionBank.js` procedurally across the 10 concept generators in §4.1. Almost every question carries a figure, and several answer types go beyond 4-option MCQ (reason matching, step ordering, "determined / not determined"), so this module needs a small reasoning engine (§4.4), which is a larger build surface than any Grade 7 sibling.
4. **Viewport-clipping bug.** Proactively apply the `100dvh` + `ResizeObserver` header-height fix.
5. **Leftover branding strings.** Check `index.html`'s `<title>` and `README.md` for stale references from whichever module was cloned. If cloning from `quad-quest-main`, remove its wildlife-ranger copy, Gigi the Giraffe, and any `PROPERTY_TABLE`/quadrilateral-specific code that this module does not use.
6. **Multi-tab/multi-round scaffolding.** If cloning from `progression-quest-main`, strip its 5th Simulate tab and multi-round station state back to the standard 4-tab single-pass architecture.

**Module-specific risks to add:**
- **A reasoning chain is only as good as its checker.** This module's central guarantee is that every "correct" argument is valid and every seeded flaw is flawed at exactly the intended step. That guarantee depends on one component, the chain checker (`checkChain`, §4.4), being right. It is the highest-stakes code in the module.
- **Two answers for "determined," never one.** "Does it follow?" is judged by forward-chaining from the givens *and* by a perturbation test on constructions. They must agree; a disagreement is a bug in the rule library or the generator.
- **Shared reason vocabulary with QuadQuest.** The reason keys and wording must be identical in both repos. Because each module ships as an independent repo, there is no automatic cross-check (see §11).

## 2. Tech Stack

Unchanged from platform blueprint §2.1 — reuse verbatim. `vite.config.js`, `tailwind.config.js`, `postcss.config.js`, `vercel.json` — reuse as-is. No geometry or logic library is added; the engine in §4.4 is small, pure, and local, so the zip stays dependency-light.

## 3. Folder Structure

```
reason-quest-main/
├── public/assets/{audio/, story/}
├── scripts/
│   ├── generate_audio.js         # MODIFY: new `phrases` array (§8)
│   └── clean_audio.js            # reuse as-is
├── src/
│   ├── assets/story/             # story_1.png ... story_4.png
│   ├── components/
│   │   ├── IntroScreen.jsx/.css  # MODIFY: title/copy only
│   │   ├── ProgressMap.jsx/.css  # reuse as-is
│   │   ├── shared/
│   │   │   ├── Mascot.jsx/.css              # reuse as-is (default Tally the Owl; confirm no leftover mascot props, §1.5)
│   │   │   ├── FeedbackOverlay.jsx/.css     # reuse as-is
│   │   │   ├── FloatingNumbers.jsx/.css     # reuse as-is
│   │   │   └── ReasoningVisual.jsx          # NEW — §5.1
│   │   ├── gamification/
│   │   │   ├── KingdomMap.jsx/.css  # reuse as-is
│   │   │   └── StarRating.jsx       # reuse as-is
│   │   ├── quiz/
│   │   │   ├── QuestionRenderer.jsx/.css  # MODIFY: import ReasoningVisual; add three answer types (§5.2)
│   │   │   └── BossBattleModal.jsx/.css   # reuse as-is
│   │   ├── phases/
│   │   │   ├── WonderPhase.jsx/.css    # MODIFY: content only
│   │   │   ├── StoryPhase.jsx/.css     # MODIFY: content only
│   │   │   ├── SimulatePhase.jsx/.css  # MODIFY: 4 new station imports/labels (standard 4-tab architecture)
│   │   │   ├── PlayPhase.jsx/.css      # reuse as-is
│   │   │   └── ReflectPhase.jsx/.css   # MODIFY: 3 new recap questions (§6.3)
│   │   └── simulations/
│   │       ├── TheEvidenceBoard.jsx   # NEW — Concept Discovery Lab — §6
│   │       ├── ProveItParallel.jsx    # NEW — Build-to-Target Challenge — §6
│   │       ├── TheFullHearing.jsx     # NEW — Multi-Step/Composite Construction — §6
│   │       ├── ObjectionStation.jsx   # NEW — Error-Detective — §6
│   │       └── Stations.css           # MODIFY: extend with figure, transversal, ordering-list, and objection-button classes
│   ├── config/
│   │   ├── worlds.config.js       # MODIFY: 10 topic-themed worlds — §4.1
│   │   ├── characters.config.js   # MODIFY: Priyanka / Syafiq / Tally — §4.2
│   │   └── audio.config.js        # reuse as-is
│   ├── core/hooks/useViewport.js  # reuse as-is
│   ├── hooks/useAudio.js          # reuse as-is
│   ├── data/
│   │   ├── storyContent.js        # MODIFY: 4 story panels — §4.3
│   │   └── questionBank.js        # MODIFY: procedurally generated 100 Qs — §4.4
│   ├── utils/
│   │   ├── audio.js               # reuse as-is
│   │   ├── audioMap.js            # auto-generated — do not hand-edit
│   │   ├── narration.js           # MODIFY: topic-specific phase scripts — §8
│   │   ├── badgeEngine.js         # MODIFY: relabelled BADGES array only — §7
│   │   ├── scoring.js             # reuse as-is
│   │   ├── shuffle.js             # reuse as-is
│   │   ├── geoReasons.js          # NEW — closed reason list, rules, conditions — §4.4
│   │   ├── geoFacts.js            # NEW — facts, forward chaining, chain checker — §4.4
│   │   ├── geoDiagram.js          # NEW — constructions, not-to-scale, perturbation — §4.4
│   │   ├── congruenceMath.js      # NEW — criteria, counterexamples, statements — §4.4
│   │   └── reasoningProblems.js   # NEW — generators and misconception functions — §4.4
│   ├── styles/
│   │   ├── design-tokens.css      # MODIFY: 10 new --world-N accent colors — §9
│   │   └── globals.css            # reuse as-is (apply viewport fix from §1.4 proactively)
│   ├── App.jsx                    # MODIFY only if the clone source's panel-count logic differs from 4 (§1.2)
│   ├── App.css / main.jsx / index.css   # reuse as-is
├── index.html / package.json / vite.config.js / tailwind.config.js / postcss.config.js / vercel.json / .oxlintrc.json / .gitignore
└── README.md                      # MODIFY: module-specific + art-brief (PRD §13)
```

## 4. Data Layer

### 4.1 `config/worlds.config.js`
Ten entries in the fixed shape, populated from PRD §9:

```js
export const WORLDS = [
  { id: 0, name: "Know Your Facts", emoji: "🗣️", accent: "var(--world-0)",
    description: "Match each angle fact, with its condition, to its reason",
    conceptFocus: "match-angle-facts-to-reasons",
    boss: { name: "The Forgetful Witness", emoji: "🗣️", reward: "Rulebook Badge" } },
  { id: 1, name: "Spot the Letter", emoji: "🔤", accent: "var(--world-1)",
    description: "Identify corresponding, alternate, and co-interior pairs",
    conceptFocus: "identify-parallel-line-angle-pairs",
    boss: { name: "The Letter Lookalike", emoji: "🔤", reward: "Letter Spotter Badge" } },
  { id: 2, name: "One-Step Rulings", emoji: "📎", accent: "var(--world-2)",
    description: "Find an angle in one step and name the reason",
    conceptFocus: "find-angle-one-step-with-reason",
    boss: { name: "The Hasty Clerk", emoji: "📎", reward: "Ruling Badge" } },
  { id: 3, name: "Chain of Evidence", emoji: "⛓️", accent: "var(--world-3)",
    description: "Multi-step angle problems with reasons",
    conceptFocus: "multi-step-angle-chasing",
    boss: { name: "The Broken Chain", emoji: "⛓️", reward: "Chain Badge" } },
  { id: 4, name: "The Helper Line", emoji: "➖", accent: "var(--world-4)",
    description: "Use a helper line to solve an angle problem",
    conceptFocus: "auxiliary-line-angles",
    boss: { name: "The Missing Line", emoji: "➖", reward: "Helper Badge" } },
  { id: 5, name: "Does It Follow?", emoji: "🖍️", accent: "var(--world-5)",
    description: "Decide whether a conclusion follows from the marks",
    conceptFocus: "determined-or-not-determined",
    boss: { name: "The Sketchy Sketch Artist", emoji: "🖍️", reward: "Sufficiency Badge" } },
  { id: 6, name: "Order in the Court", emoji: "📚", accent: "var(--world-6)",
    description: "Order and complete a reasoning chain",
    conceptFocus: "order-and-complete-reasoning",
    boss: { name: "The Scrambled Docket", emoji: "📚", reward: "Order Badge" } },
  { id: 7, name: "Converse and Counterexample", emoji: "🔄", accent: "var(--world-7)",
    description: "Converses, and disproving a claim with a counterexample",
    conceptFocus: "converse-and-counterexample",
    boss: { name: "The Backwards Barrister", emoji: "🔄", reward: "Counterexample Badge" } },
  { id: 8, name: "Congruent Evidence", emoji: "👯", accent: "var(--world-8)",
    description: "Congruence criteria and deductions",
    conceptFocus: "triangle-congruence-reasoning",
    boss: { name: "The Twin Impostors", emoji: "👯", reward: "Congruence Badge" } },
  { id: 9, name: "The Grand Mock Trial", emoji: "⚖️", accent: "var(--world-9)",
    description: "Mixed review of every concept above",
    conceptFocus: "mixed-review",
    boss: { name: "The Chief Justice", emoji: "⚖️", reward: "Grand Verdict Trophy" } },
];
```

### 4.2 `config/characters.config.js`
```js
export const CHARACTERS = {
  priyanka: { name: "Priyanka", role: "Rules by looks", emoji: "👧🏽", colour: "var(--char-1)", mascotEmoji: "🦉" },
  syafiq:   { name: "Syafiq",   role: "No reason, no ruling", emoji: "🧑🏻", colour: "var(--char-2)", mascotEmoji: "🦉" },
  tally:    { name: "Tally the Owl", role: "Presiding judge & mentor", emoji: "🦉", colour: "var(--mascot)", mascotEmoji: "🦉" },
};
export const MASCOT = { name: "Tally the Owl", emoji: "🦉" };
```

### 4.3 `data/storyContent.js`
`STORY_PANELS` array, length 4, per PRD §8.2, fixed shape `{ panel, title, text, highlight, character, characterEmoji, imageBg, imageEmoji }`. Titles: "The First Case," "The Rulebook," "Build the Chain," "Verdict Delivered."

### 4.4 Reasoning Engine and Question Bank

Five pure modules, split so each has one job and one source of truth.

**`utils/geoReasons.js`** — the rulebook.

| Item | Purpose |
|---|---|
| `REASONS` | The **closed list** of reason keys. Angle reasons: `angles-on-straight-line`, `angles-at-a-point`, `vertically-opposite-angles`, `corresponding-angles-parallel`, `alternate-angles-parallel`, `co-interior-angles-parallel`, `angle-sum-triangle`, `exterior-angle-triangle`, `base-angles-isosceles`, `angles-equilateral-triangle`. Given and structure: `given`, `common-side`, `common-angle`. Converses: `converse-corresponding-angles`, `converse-alternate-angles`, `converse-co-interior-angles`. Congruence: `sss`, `sas`, `asa`, `aas`, `rhs`, `corresponding-parts-congruent-triangles`. **These keys and their display wording must match QuadQuest's `REASONS` for every shared entry** (§11). |
| `REASON_DISPLAY` | For each key: the full-words wording (used in narration) and the textbook abbreviation shown alongside on screen (for example "alt. ∠s, AB // CD"). The abbreviation set is confirmed per PRD §15.1. |
| `RULES` | For each reason key: its **premises** (the condition, as a pattern over facts, such as `parallel(l1, l2)` plus a transversal and the two angles' positions) and its **conclusion**. The condition is part of the data, so "a fact used without its condition" is a computable error, not a judgment call. |

**`utils/geoFacts.js`** — facts and the chain checker.

| Function | Purpose |
|---|---|
| `Fact` | A typed record: angle value or expression, parallel lines, equal sides, collinear points, triangle membership, and congruence, each with `provenance` (given, or a reason key plus the premises used). |
| `deriveClosure(givens)` | Forward-chains `RULES` over the givens until no new fact appears, returning every derivable fact with its provenance. |
| `checkChain(chain, givens)` | Validates an ordered chain of `{ conclusion, reasonKey }` steps: each step's `reasonKey` must be in `RULES`, its premises must hold in the givens or earlier steps, and its conclusion must actually follow. Returns `{ valid, failsAtStep, failureType }`, where `failureType` is one of `unknown-reason`, `condition-not-met`, `conclusion-does-not-follow`, `circular`. **This is the single validity authority** for correct answers, valid orderings, and seeded flaws. |
| `isDerivable(givens, targetFact)` | True if `deriveClosure` produces the target. |
| `validOrderings(chain)` | Computes the dependency partial order of a chain and answers whether a proposed ordering is valid. Ordering questions are graded by validity, so any order that respects the dependencies is accepted. |

**`utils/geoDiagram.js`** — constructions and not-to-scale.

| Function | Purpose |
|---|---|
| `buildConstruction(spec, freeParams)` | Produces coordinates for a figure specification (the marks that define it plus free parameters such as a transversal direction). |
| `measure(construction)` | Returns angles and lengths. |
| `distortNotToScale(spec)` | Returns a **different** valid construction satisfying the same marks, so the drawn figure cannot be measured to get the answer. Figures flagged not to scale always render this version. |
| `perturbationTest(spec, target)` | Builds several different constructions consistent with the marks and returns whether the target quantity is the same in all of them. `true` means determined by the marks; `false` means not determined. |

**`utils/congruenceMath.js`** — criteria with computed evidence.

| Function | Purpose |
|---|---|
| `classifyMarks(marks)` | Returns `sss`, `sas`, `asa`, `aas`, `rhs`, `ssa-not-a-criterion`, `aaa-not-a-criterion`, or `insufficient` from the matched sides and angles and *where* each sits in the triangle (included vs. non-included angle or side). |
| `findCounterexample(marks)` | For `ssa-not-a-criterion` and `aaa-not-a-criterion`, constructs two **non-congruent** triangles that satisfy the same marks, giving a computed counterexample for explanations and for the Error-Detective. For valid criteria, confirms by sampling that every construction is congruent. |
| `congruenceStatement(tri1, tri2, correspondence)` | Builds the statement with vertices in corresponding order; `vertexOrderMismatch` produces the wrong-order distractor. |
| `correspondingParts(statement)` | Returns the pairs of equal parts a valid congruence statement implies. |

**`utils/reasoningProblems.js`** — generators and distractors.

| Function | Purpose |
|---|---|
| `generateFactMatch()` | World 0 items; each fact is shown with its condition. |
| `generatePairIdentification()` | World 1: a transversal figure; the correct pair type is read from the construction, not authored. |
| `generateOneStep()` / `generateMultiStep()` / `generateAuxiliaryLine()` | Worlds 2–4. Each builds a chain, validates it with `checkChain`, and, where a second independent route exists, records it. Multi-step items must agree across both routes. |
| `generateSufficiencyItem()` | World 5: builds givens, then computes the answer **both** with `isDerivable` and with `perturbationTest`; discards the item if they disagree. |
| `generateOrderingItem()` | World 6: shuffles a valid chain; the key is `validOrderings`, not one fixed sequence. |
| `generateConverseCounterexample()` | World 7: draws from a **curated claim bank** (true converses and false claims). Each false claim carries a construction, verified by `geoDiagram`, that serves as its counterexample. |
| `generateCongruenceItem()` | World 8: uses `classifyMarks` and `findCounterexample`. |
| `misconception.*` | Every distractor and every seeded flaw comes from here, never hand-authored: `confuseAlternateCorresponding`, `coInteriorEqual`, `straightLine360`, `pointLine180`, `measureFromDiagram`, `factWithoutCondition`, `circularReason`, `wrongReasonForRightValue`, `ssaAsCriterion`, `aaaAsCriterion`, `asaVsAas`, `vertexOrderMismatch`, `converseAssumedTrue`, `exampleAsProof`. |

**Clean-number and clean-geometry constraints (hard requirements, not inline magic numbers):**
- Given angles are whole degrees in a safe range (for example 20° to 160°), and every derived angle is positive and valid in the figure; no figure is degenerate.
- Every figure's marks must be **sufficient** for its question, except World 5's "not determined" items, where insufficiency is the point.
- Every reason used in a chain is in `REASONS`, and each `checkChain` call uses the givens exactly as drawn on the figure.
- No item may be answerable by measuring the drawing.

**`data/questionBank.js` generation:** one or more template functions per `conceptFocus` (10 slugs from §4.1), each producing the fixed output schema (unchanged): `{ id, districtId, category, visual, questionText, options, correctAnswer, explanation, hint1, hint2, visualData }`, with `visualData` carrying the figure specification, marks, and (for chain questions) the chain. Also export `DISTRICTS` (derived from `WORLDS`) so `PlayPhase.jsx`'s existing import is unmodified.

## 5. Component Specs

### 5.1 `ReasoningVisual.jsx`
Replaces the reference's domain visual component. Takes `{ type, data, compact }`. Supported `type` values:
- `"figure"` — a labelled diagram with marks (parallel arrows, equal-side ticks, angle arcs with values). Renders the `distortNotToScale` construction when flagged and always shows the text label "not drawn to scale."
- `"transversal-pairs"` — highlights a chosen angle pair with its letter-shape hint (Z, F, C), used in World 1 and the Evidence Board.
- `"reasoning-chain"` — a numbered chain with a reason line per step, used in Worlds 2–4 and 6.
- `"triangle-pair"` — two triangles with matching marks and a correspondence overlay, used in World 8.
- `"rulebook"` — the fact list with each condition, used in Story and hints.

Every type carries a text description of its marks (PRD §12); none relies on colour alone. `compact` shrinks rendering for inline use in `QuestionRenderer.jsx`.

### 5.2 Additional answer types
`QuestionRenderer.jsx` needs three formats beyond 4-option MCQ, all still conforming to the fixed schema so `PlayPhase.jsx` scoring is unchanged:
1. **Reason selection / matching:** each step is paired with a reason chosen from `REASONS`.
2. **Step ordering:** shuffled steps with keyboard-operable "move up / move down" controls; graded with `validOrderings`.
3. **Determined / not determined** with a short justification choice.

## 6. Simulate Station Specs

All 4 follow the fixed per-station contract: `<StationComponent onComplete={fn} audioEnabled={bool} />`, self-contained internal state, live SVG visuals themed with `design-tokens.css` variables, a `station-success` panel with a "Complete Station ✓" CTA, and keyboard-operable +/− controls alongside any slider/drag interaction. Standard single-pass architecture.

| Component | Archetype | Student manipulates | Live feedback | Completion gate |
|---|---|---|---|---|
| `TheEvidenceBoard.jsx` | Concept Discovery Lab | Rotates a transversal; tilts one of two lines (parallel ↔ not parallel) | Corresponding, alternate, and co-interior pairs highlight with live values, and a rulebook panel shows which facts currently hold, computed from `geoDiagram`/`geoFacts` — each parallel-line fact switches off the moment the lines are no longer parallel | Free exploration that includes both a parallel and a non-parallel setting, **plus one confirmation question** ("why did the alternate-angle fact stop working?") per the platform's default archetype |
| `ProveItParallel.jsx` | Build-to-Target Challenge | Adjusts a marked angle (keyboard +/− steppers) | A live indicator shows "claim established" only when `isDerivable` confirms the parallel claim from the marks via a converse reason, with a text label (not colour-only) | The claim established on at least two different angle pairs; a "next case" loop offers a fresh claim |
| `TheFullHearing.jsx` | Multi-Step/Composite Construction | Marks the diagram, adds a helper line if needed, orders shuffled steps, picks a reason for each | `checkChain` runs after each action and reports the first failing step and its `failureType` in plain words | A fully valid chain with correct reasons — targets PRD LOs 4, 5, and 6 |
| `ObjectionStation.jsx` | Error-Detective | Presses "Objection!" on the flawed step of an advocate's argument, then supplies the correction | The tapped step highlights; flaws are generated from `misconception.*` and confirmed to fail `checkChain` at exactly the seeded step | Correctly identifying the flawed step and supplying a valid fix |

Wire all 4 into `SimulatePhase.jsx`'s `STATIONS` array and station-index render switch; tab bar, footer navigation, progress dots, and `COMPLETE_SIM_STATION`/`ADVANCE_SIM_STATION` gating logic are reused verbatim from the reference.

### 6.3 `ReflectPhase.jsx` Recap Questions
Replace the 3 hard-coded recap questions with 3 targeting the confusion of corresponding, alternate, and co-interior angles; using a fact without its condition or measuring a not-to-scale diagram; and treating SSA or AAA as a congruence criterion (PRD §8.5), matching the Error-Detective station's focus.

## 7. Gamification

`utils/scoring.js` (`calcXP`, `calcStars`) — reuse formulas as-is. `utils/badgeEngine.js` — reuse `checkBadges(state)` trigger logic as-is; only the `BADGES` array's display strings change, per PRD §10's rename table (First Ruling, Order in the Court, Winning Streak, Full Case File, Case Won, Objection Sustained, Seasoned Advocate, Chief Advocate Badge).

## 8. Audio Pipeline

`config/audio.config.js`, `utils/audio.js`, `hooks/useAudio.js`, `utils/audioMap.js` — reuse mechanics as-is.

Rewrite `utils/narration.js` function *bodies* (signatures unchanged, same list as earlier modules' TRDs) and `scripts/generate_audio.js`'s `phrases` array using PRD §11's rules: vertex labels spoken letter by letter; `∠`, `∥`, `≅`, `Δ`, `∴`, and `°` spoken in words; every reason narrated as "because" plus the full-words wording from `REASON_DISPLAY`; every angle fact narrated with its condition; congruence criteria spoken in words; not-to-scale figures announced. Dynamic generation covers numbers and vertex-label variations in procedurally generated questions. After content lock: `npm run generate-audio` then `npm run clean-audio`.

## 9. Design Tokens

`styles/design-tokens.css` — reuse core palette/type/radii/shadows/transitions as-is. Regenerate only the `--world-0` through `--world-9` accent block, using a courtroom palette distinct from the earlier modules' palettes:

| World | Accent (indicative) |
|---|---|
| 0 — Know Your Facts | `#6B4F3A` (oak bench) |
| 1 — Spot the Letter | `#C28F2C` (brass nameplate) |
| 2 — One-Step Rulings | `#8C2F39` (burgundy robe) |
| 3 — Chain of Evidence | `#4A5A6A` (steel chain) |
| 4 — The Helper Line | `#2F6F73` (law-library teal) |
| 5 — Does It Follow? | `#7B6D8D` (sketch-paper violet) |
| 6 — Order in the Court | `#9A7B4F` (docket parchment) |
| 7 — Converse and Counterexample | `#B85C38` (objection orange) |
| 8 — Congruent Evidence | `#3E6B48` (ledger green) |
| 9 — The Grand Mock Trial | `#1F2A44` (deep judge's-robe navy — most dramatic, for the finale) |

## 10. Build, QA, and Delivery

1. **Question bank stress test** — ≥300 randomized generations (30,000 questions) across all 10 concept categories; assert no duplicate options, no malformed/`NaN`/`undefined` fields, no degenerate figure, and every angle within the clean range in §4.4.
2. **Chain-validity audit (module-specific, highest stakes)** — run `checkChain` on every generated "correct" chain and every accepted ordering and confirm all pass; run it on every seeded flaw and confirm each fails at exactly the intended step with the intended `failureType`, and passes everywhere else.
3. **Determined-versus-not-determined agreement audit (module-specific)** — for every World 5 item, confirm `isDerivable` and `perturbationTest` agree. Any disagreement is investigated as a rule-library or generator bug and the item is discarded until fixed.
4. **Rule-versus-construction audit** — for every numeric answer, confirm the rule-chain value equals the value measured from the construction; for multi-step items with a second route, confirm both routes agree.
5. **Not-to-scale audit** — confirm every flagged figure is rendered from `distortNotToScale` and that no figure's drawn values reveal the answer.
6. **Congruence-evidence audit** — confirm each valid criterion forces congruence under sampled constructions, and that every SSA and AAA item has a computed counterexample from `findCounterexample`; confirm vertex-order distractors are genuinely mismatched.
7. **Converse/counterexample bank audit** — confirm every false claim's counterexample construction really satisfies the claim's hypothesis and violates its conclusion; confirm every true converse is backed by a rule in `RULES`.
8. **Cross-module vocabulary audit** — diff `REASONS` and `REASON_DISPLAY` against QuadQuest's copy for shared entries.
9. **Audio parity check** — every string passed to a narration helper has an exact match in `audioMap.js`, or is intentionally dynamic.
10. **Full user-journey walkthrough** — Wonder → Story (all 4 panels) → Simulate (all 4 stations completable, tab-gating correct) → Practice (World Map, all 4 modes, all 10 Boss Battles, badges, and all three extra answer types) → Reflect — zero console/page errors.
11. **Production build check** — `npm install && npm run build` succeeds from a clean extract.
12. **Accessibility spot-check** — fonts/touch targets at Secondary sizing; every figure has a text description of its marks; marks are not colour-only; ordering has keyboard controls; "Objection!" is focusable.
13. **Delivery checklist** — zip excludes `node_modules/`/`dist/`; 4 story image placeholders with art-brief README; `README.md` updated and checked for leftover branding; `.env.local.example` documents `VITE_ELEVENLABS_API_KEY` with no real key committed.

## 11. Risks

- **The chain checker is the module's foundation.** A permissive rule in `RULES` would accept a flawed argument as valid; a restrictive one would reject a correct one. Give `checkChain` and `deriveClosure` their own unit tests with hand-written valid and invalid arguments, independent of the generators.
- **Rule-library gaps cause false "not determined" results.** If a legitimate rule is missing from `RULES`, `isDerivable` says "not derivable" while `perturbationTest` says "determined." The agreement audit in §10.3 is designed to surface exactly this, so treat each disagreement as a missing-rule signal rather than discarding items indefinitely.
- **Perturbation sampling is probabilistic.** `perturbationTest` samples constructions; use enough samples and a fixed seed in tests, and treat an agreement between the two methods as the evidence, not either alone.
- **Cross-repo vocabulary drift with QuadQuest.** Reason keys and wording are duplicated across two repos with no automatic check; run the §10.8 diff whenever either changes.
- **Curated claim bank limits variety in World 7.** True converses and false claims with verified counterexamples cannot be generated freely, so variation comes from parameters and phrasing; avoid padding the bank with claims whose counterexamples are unverified.
- **Answer-type surface.** Three new answer types in `QuestionRenderer.jsx` increase the interaction and accessibility testing needed compared with a plain MCQ module.
- **Concept Discovery Lab tension, unresolved for this module** (PRD §15.4).
