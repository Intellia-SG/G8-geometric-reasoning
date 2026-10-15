// src/data/storyContent.js
/**
 * 4 Widescreen Story Panels for ReasonQuest (The Geometry Court)
 * PRD §8.2: 4 panels, Singaporean-multicultural characters (Priyanka, Syafiq, Judge Tally).
 * Synchronized with 1:1 parity to audio narration scripts.
 */

export const STORY_PANELS = [
  {
    panel: 0,
    title: "The First Case ⚖️",
    text: "In the school mock-trial courtroom, Priyanka stepped up to the lectern with supreme confidence. Looking at an angle diagram on the evidence board, she declared: Your Honor, angle x is clearly 70 degrees because it looks identical to angle y! Judge Tally struck the wooden gavel: Objection sustained! In geometry court, looking like it is not evidence. A diagram is merely a sketch artist drawing. No reason, no ruling!",
    highlight: "⚖️ Priyanka's claim: 'It looks like 70°' · Judge Tally: 'No reason, no ruling!'",
    character: "Priyanka & Judge Tally",
    characterEmoji: "👧🏽🦉",
    imageBg: "radial-gradient(circle, #6B4F3A 0%, #1F2A44 100%)",
    imageEmoji: "⚖️",
  },
  {
    panel: 1,
    title: "The Rulebook 📖",
    text: "Judge Tally unfurled the court rulebook. Every geometric fact carries a strict condition, an only if. Look at the Z-shape, F-shape, and C-shape between two lines. Alternate angles are equal only if the lines are marked parallel with arrows! A rule applied without its condition is an error, not a shortcut.",
    highlight: "📖 Z, F, and C shapes hold ONLY IF lines are marked parallel (∥)",
    character: "Judge Tally",
    characterEmoji: "🦉",
    imageBg: "radial-gradient(circle, #C28F2C 0%, #2A1B0E 100%)",
    imageEmoji: "📜",
  },
  {
    panel: 2,
    title: "Build the Chain ⛓️",
    text: "Syafiq took the marker and began building an argument chain on the whiteboard. Mark the given evidence first! Syafiq drew a dashed helper line through the middle vertex. Now we have two pairs of alternate angles that add together! We deduce every step logically from the rulebook, without measuring the drawing.",
    highlight: "⛓️ Mark givens first · Add a helper line when stuck · A sketch is not evidence",
    character: "Syafiq",
    characterEmoji: "🧑🏻",
    imageBg: "radial-gradient(circle, #2F6F73 0%, #0F172A 100%)",
    imageEmoji: "➖",
  },
  {
    panel: 3,
    title: "Verdict Delivered 🏆",
    text: "Armed with solid evidence, Priyanka and Syafiq delivered their final closing argument. When an opposing advocate claimed side-side-angle was a criterion, Priyanka objected with a clear counterexample. Judge Tally struck the gavel: Verdict granted! Proof upheld beyond mathematical doubt!",
    highlight: "🏆 Complete logical chain · Counterexample beats false claim · Verdict granted!",
    character: "Priyanka & Syafiq",
    characterEmoji: "🌟",
    imageBg: "radial-gradient(circle, #3E6B48 0%, #1F2A44 100%)",
    imageEmoji: "🏆",
  },
];
