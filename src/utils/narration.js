// src/utils/narration.js
/**
 * Narration Script Builder for ReasonQuest (Grade 8 Geometric Reasoning)
 * Enforces PRD §11 & TRD §8:
 * - Vertex labels spoken letter by letter (A, B, C)
 * - Symbols spoken in words (angle, is parallel to, is congruent to, degrees, therefore)
 * - Every reason narrated as "because" plus the full-words wording
 * - Conditions explicitly stated for angle facts
 * - 1:1 strict parity with UI text shown on-screen
 */

import { REASONS } from './geoReasons.js';

// Semantic style wrappers for ElevenLabs emotional settings
export const say       = (text) => ({ text, style: 'statement' });
export const ask       = (text) => ({ text, style: 'question' });
export const cheer     = (text) => ({ text, style: 'celebration' });
export const celebrate = (text) => ({ text, style: 'celebration' });
export const emphasize = (text) => ({ text, style: 'emphasis' });
export const think     = (text) => ({ text, style: 'thinking' });
export const instruct  = (text) => ({ text, style: 'instruction' });
export const encourage = (text) => ({ text, style: 'encouragement' });

/**
 * Normalizes math and geometric symbols into natural spoken English
 * for ElevenLabs speech synthesis (PRD §11 & TRD §8).
 */
export function cleanMathTextForSpeech(text) {
  if (!text) return '';

  return text
    // Replace markdown formatting
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    // Geometric and mathematical symbols to words
    .replace(/∠\s*([A-Za-z0-9]+)/g, (_, label) => `angle ${label.split('').join(' ')}`)
    .replace(/∠/g, 'angle ')
    .replace(/△\s*([A-Za-z]+)/g, (_, label) => `triangle ${label.split('').join(' ')}`)
    .replace(/∆\s*([A-Za-z]+)/g, (_, label) => `triangle ${label.split('').join(' ')}`)
    .replace(/∥/g, ' is parallel to ')
    .replace(/∦/g, ' is not parallel to ')
    .replace(/≅/g, ' is congruent to ')
    .replace(/⊥/g, ' is perpendicular to ')
    .replace(/°/g, ' degrees ')
    .replace(/∴/g, 'therefore, ')
    .replace(/∵/g, 'because, ')
    .replace(/≠/g, ' does not equal ')
    .replace(/≈/g, ' is approximately ')
    .replace(/\+/g, ' plus ')
    .replace(/−/g, ' minus ')
    .replace(/=/g, ' equals ')
    // Vertex pairs e.g. "AB" -> "A B", "CD" -> "C D"
    .replace(/\b([A-Z]{2,3})\b/g, (match) => match.split('').join(' '))
    // Clean up excessive whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * INTRO PHASE: Judge Tally's Courtroom Welcome
 */
export function introNarration() {
  return [
    say("Welcome to the Geometry Court! I am Judge Tally."),
    emphasize("Remember: no reason, no ruling!"),
    instruct("Justify every step with closed rulebook reasons, verify conditions before concluding, use helper lines, and disprove false claims with counterexamples!"),
  ];
}

/**
 * WONDER PHASE: The Courtroom Hook
 */
export function wonderNarration() {
  return [
    say("Welcome to ReasonQuest and the Geometry Court!"),
    say("Two sketches show the exact same case. In one sketch, two lines are marked parallel. In the other, they look parallel but are slightly off without marks."),
    ask("The advocate claims: these two angles are equal! When is a judge legally allowed to accept it?"),
    cheer("Remember: in geometry court, no reason means no ruling! Let us discover the rulebook!"),
  ];
}

/**
 * STORY PHASE: 4 Courtroom Comic Panels
 */
export function storyNarration(panel) {
  const scripts = [
    // Panel 0: The First Case ⚖️
    [
      say("In the school mock-trial courtroom, Priyanka stepped up to the lectern with supreme confidence."),
      think("Looking at an angle diagram on the evidence board, she declared: Your Honor, angle x is clearly 70 degrees because it looks identical to angle y!"),
      emphasize("Judge Tally struck the wooden gavel: Objection sustained! In geometry court, looking like it is not evidence. A diagram is merely a sketch artist drawing."),
      cheer("No reason, no ruling!"),
    ],
    // Panel 1: The Rulebook 📖
    [
      instruct("Judge Tally unfurled the court rulebook. Every geometric fact carries a strict condition, an only if."),
      say("Look at the Z-shape, F-shape, and C-shape between two lines."),
      emphasize("Alternate angles are equal only if the lines are marked parallel with arrows!"),
      instruct("A rule applied without its condition is an error, not a shortcut."),
    ],
    // Panel 2: Build the Chain ⛓️
    [
      say("Syafiq took the marker and began building an argument chain on the whiteboard."),
      instruct("Mark the given evidence first! Syafiq drew a dashed helper line through the middle vertex."),
      say("Now we have two pairs of alternate angles that add together!"),
      emphasize("We deduce every step logically from the rulebook, without measuring the drawing."),
    ],
    // Panel 3: Verdict Delivered 🏆
    [
      say("Armed with solid evidence, Priyanka and Syafiq delivered their final closing argument."),
      say("When an opposing advocate claimed side-side-angle was a criterion, Priyanka objected with a clear counterexample."),
      cheer("Judge Tally struck the gavel: Verdict granted! Proof upheld beyond mathematical doubt!"),
    ],
  ];

  return scripts[panel] || scripts[0];
}

/**
 * SIMULATE PHASE: 4 Mock-Trial Stations
 */
export function simStationIntro(stationIdx) {
  const intros = [
    // Station A: The Evidence Board
    [
      instruct("Welcome to Station A — The Evidence Board!"),
      instruct("Rotate the transversal and test whether the line rails are parallel. Observe which rulebook facts hold and which break the moment lines are not parallel!"),
    ],
    // Station B: Prove It Parallel
    [
      instruct("Welcome to Station B — Prove It Parallel!"),
      instruct("A claim is on the table: line A B is parallel to line C D. Adjust the angle stepper until the evidence satisfies a converse rule to establish parallel lines!"),
    ],
    // Station C: The Full Hearing
    [
      instruct("Welcome to Station C — The Full Hearing!"),
      instruct("Review the given marks, add a helper line if needed, put the scrambled docket steps into logical order, and assign the correct reason to each!"),
    ],
    // Station D: Objection Station!
    [
      instruct("Welcome to Station D — Objection Station!"),
      instruct("Advocate Ramesh has submitted an argument with one seeded logical flaw. Identify the flawed step, hit Objection, and issue the correct ruling!"),
    ],
  ];

  return intros[stationIdx] || intros[0];
}

/**
 * REFLECT PHASE: Synthesis & Self-Assessment
 */
export function reflectNarration() {
  return [
    say("Welcome to the Reflect Phase of ReasonQuest!"),
    say("Let us review the key principles of proof, angle conditions, and congruence criteria."),
    ask("Which geometric rule did you almost use without checking its condition first?"),
    cheer("You have reasoned with precision and earned your place on the court!"),
  ];
}

export function reflectCompleteNarration() {
  return [
    cheer("Outstanding! You have mastered angle conditions, deductive chains, and triangle congruence! Chief Advocate Badge earned! 🏆"),
  ];
}

/**
 * PRACTICE / PLAY PHASE: Questions & Feedback
 */
export function playQuestionNarration(questionText) {
  const cleaned = cleanMathTextForSpeech(questionText);
  return [
    ask(cleaned)
  ];
}

export function playCorrectNarration(streak = 1) {
  if (streak >= 5) {
    return [cheer("Order in the court! Incredible winning streak! 🔥")];
  }
  if (streak >= 3) {
    return [cheer("Objection sustained! Three correct rulings in a row! ⭐")];
  }
  return [cheer("Spot on! Legally sound ruling! ⚖️")];
}

export function playWrongNarration() {
  return [
    think("Objection overruled — check the rulebook conditions, review the hints, and rule again! 💡"),
  ];
}

export function playHint1Narration() {
  return [
    encourage("Here is your first clue! Look at what is explicitly marked on the diagram exhibit."),
  ];
}

export function playHint2Narration() {
  return [
    encourage("Here is your final clue! Match the geometry condition to the rulebook closed list."),
  ];
}

export function districtCompleteNarration() {
  return [
    cheer("Case Won! Outstanding advocacy on this court docket! 🌟"),
  ];
}

export function bossStartNarration() {
  return [
    emphasize("The Boss Battle begins! Defend your verdict with valid geometric reasons to claim your badge!"),
  ];
}

export function bossWinNarration() {
  return [
    cheer("Verdict Delivered! You defeated the court boss and claimed the World Badge! 🏅"),
  ];
}

export function bossBattleIntro(boss) {
  return [
    say(`The Boss Battle begins! You face ${boss?.name || 'The Court Boss'} in courtroom cross-examination!`),
    say("Answer courtroom questions correctly to defend your verdict beyond mathematical doubt!"),
  ];
}

export function bossBattleVictory(boss) {
  return [
    cheer(`Verdict granted! You defeated ${boss?.name || 'the Boss'} and earned the ${boss?.reward || 'Badge'}!`),
  ];
}

export function badgeEarned(badge) {
  return [
    cheer(`Court Order! You unlocked the ${badge?.label || 'New Badge'}! ${badge?.description || ''}`),
  ];
}

/**
 * Spoken narration for any of the 22 rulebook reasons
 */
export function ruleReasonNarration(reasonKey) {
  const r = REASONS[reasonKey];
  if (!r?.narration) return [];
  return [instruct(r.narration)];
}
