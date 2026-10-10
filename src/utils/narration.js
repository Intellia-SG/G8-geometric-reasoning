// src/utils/narration.js
/**
 * Narration Script Builder for ReasonQuest (Grade 8 Geometric Reasoning)
 * Enforces PRD §11 & TRD §8:
 * - Vertex labels spoken letter by letter (A, B, C)
 * - Symbols spoken in words (angle, is parallel to, is congruent to, degrees, therefore)
 * - Every reason narrated as "because" plus the full-words wording
 * - Conditions explicitly stated for angle facts
 */

export const say       = (text) => ({ text, style: 'statement' });
export const ask       = (text) => ({ text, style: 'question' });
export const cheer     = (text) => ({ text, style: 'celebration' });
export const emphasize = (text) => ({ text, style: 'emphasis' });
export const think     = (text) => ({ text, style: 'thinking' });
export const instruct  = (text) => ({ text, style: 'instruction' });
export const encourage = (text) => ({ text, style: 'encouragement' });

export function wonderNarration() {
  return [
    say("Welcome to ReasonQuest and the Geometry Court!"),
    say("Two sketches show the same case. In one, two lines are parallel; in the other, they are slightly off."),
    ask("The claim is: these two angles are equal. When is a judge allowed to accept it?"),
    cheer("Let us discover the evidence: a ruling is only valid when the rulebook condition is met!"),
  ];
}

export function storyNarration(panel) {
  const scripts = [
    [
      say("In the school mock-trial courtroom, Priyanka stepped up to the lectern with supreme confidence."),
      think("Angle x is clearly 70 degrees because it looks identical to angle y!"),
      emphasize("Judge Tally struck the wooden gavel: Objection sustained! Looking like it is not evidence. A diagram is merely a sketch artist drawing."),
      cheer("No reason, no ruling!"),
    ],
    [
      instruct("Judge Tally unfurled the court rulebook. Every geometric fact carries a strict condition, an only if."),
      say("Look at the Z-shape, F-shape, and C-shape between two lines."),
      emphasize("Alternate angles are equal only if the lines are marked parallel with arrows!"),
      instruct("A rule applied without its condition is an error, not a shortcut."),
    ],
    [
      say("Syafiq took the marker and began building an argument chain on the whiteboard."),
      instruct("Mark the given evidence first! Syafiq drew a dashed helper line through the middle vertex."),
      say("Now we have two pairs of alternate angles that add together!"),
      emphasize("We deduce every step logically from the rulebook, without measuring the drawing."),
    ],
    [
      say("Armed with solid evidence, Priyanka and Syafiq delivered their final closing argument."),
      say("When an opposing advocate claimed side-side-angle was a criterion, Priyanka objected with a clear counterexample."),
      cheer("Judge Tally struck the gavel: Verdict granted! Proof upheld beyond mathematical doubt!"),
    ],
  ];

  return scripts[panel] || scripts[0];
}

export function simStationIntro(stationIdx) {
  const intros = [
    [
      instruct("Welcome to Station A — The Evidence Board!"),
      instruct("Rotate the transversal and tilt the line rails to discover how alternate, corresponding, and co-interior angles behave. Notice when the rulebook facts hold and when they switch off!"),
    ],
    [
      instruct("Welcome to Station B — Prove It Parallel!"),
      instruct("A claim is on the table: line A B is parallel to line C D. Adjust the angle stepper until the evidence satisfies a converse rule to establish parallel lines!"),
    ],
    [
      instruct("Welcome to Station C — The Full Hearing!"),
      instruct("Review the given marks, add a helper line if needed, put the scrambled docket steps into logical order, and assign the correct reason to each!"),
    ],
    [
      instruct("Welcome to Station D — Objection Station!"),
      instruct("A fellow advocate has submitted an argument containing one seeded logical flaw. Find the flawed step, hit Objection, and provide the correct ruling!"),
    ],
  ];

  return intros[stationIdx] || intros[0];
}

export function reflectNarration() {
  return [
    say("Welcome to the Reflect Phase of ReasonQuest!"),
    say("Let us review the key principles of proof, angle conditions, and congruence criteria."),
    ask("Which rule did you almost use without checking its condition first?"),
    cheer("You have reasoned with precision and earned your place on the court!"),
  ];
}

export function playQuestionNarration(questionText) {
  return [
    ask(questionText)
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
    think("Objection overruled — check the rulebook conditions, review the hints, and rule again! 💡")
  ];
}

export function playHint1Narration() {
  return [
    encourage("Here is your first clue! Look at what is explicitly marked on the diagram exhibit.")
  ];
}

export function playHint2Narration() {
  return [
    encourage("Here is your final clue! Match the geometry condition to the rulebook closed list.")
  ];
}

export function districtCompleteNarration() {
  return [
    cheer("Case Won! Outstanding advocacy on this court docket! 🌟")
  ];
}

export function bossStartNarration() {
  return [
    emphasize("The Boss Battle begins! Defend your verdict with valid geometric reasons to claim your badge!")
  ];
}

export function bossWinNarration() {
  return [
    cheer("Verdict Delivered! You defeated the court boss and claimed the World Badge! 🏅")
  ];
}

export function reflectCompleteNarration() {
  return [
    cheer("Outstanding! You have mastered angle conditions, deductive chains, and triangle congruence! Chief Advocate Badge earned! 🏆")
  ];
}

export function bossBattleIntro(boss) {
  return [
    say(`The Boss Battle begins! You face ${boss?.name || 'The Court Boss'} in courtroom cross-examination!`),
    say("Answer correctly to sustain your rulings. Three lives — defend your verdict!"),
  ];
}

export function bossBattleVictory(boss) {
  return [
    cheer(`Objection sustained! You have defeated ${boss?.name || 'the Boss'} and earned the ${boss?.reward || 'Badge'}!`),
  ];
}

export function badgeEarned(badge) {
  return [
    cheer(`Court Order! You unlocked the ${badge?.label || 'New Badge'}! ${badge?.description || ''}`),
  ];
}

