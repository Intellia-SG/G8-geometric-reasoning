// src/data/questionBank.js
/**
 * ReasonQuest Procedurally Generated Question Bank (100 Questions)
 * TRD §4.4: 10 worlds × 10 questions = 100, procedurally generated.
 * Fixed schema: { id, districtId, category, visual, questionText, options, correctAnswer, explanation, hint1, hint2, visualData }
 * Exports questionBank and DISTRICTS for seamless integration with PlayPhase.jsx.
 */

import { WORLDS } from '../config/worlds.config.js';
import {
  generateFactMatch,
  generatePairIdentification,
  generateOneStep,
  generateMultiStep,
  generateAuxiliaryLine,
  generateSufficiencyItem,
  generateOrderingItem,
  generateConverseCounterexample,
  generateCongruenceItem,
  generateMixedReview,
} from '../utils/reasoningProblems.js';

export const DISTRICTS = WORLDS.map((w) => ({
  id: w.id,
  name: w.name,
  icon: w.emoji,
  accent: w.accent,
  description: w.description,
  conceptFocus: w.conceptFocus,
  boss: w.boss,
}));

const GENERATORS_BY_DISTRICT = {
  0: generateFactMatch,
  1: generatePairIdentification,
  2: generateOneStep,
  3: generateMultiStep,
  4: generateAuxiliaryLine,
  5: generateSufficiencyItem,
  6: generateOrderingItem,
  7: generateConverseCounterexample,
  8: generateCongruenceItem,
  9: generateMixedReview,
};

/**
 * Procedurally generates the 100 questions bank
 */
export function buildQuestionBank() {
  const bank = [];
  let globalId = 1;

  for (let d = 0; d < 10; d++) {
    const generator = GENERATORS_BY_DISTRICT[d];
    for (let q = 0; q < 10; q++) {
      const generated = generator(q);

      // Ensure options contain the correct answer and are unique
      const cleanOptions = Array.from(new Set(generated.options));
      if (!cleanOptions.includes(generated.correctAnswer)) {
        cleanOptions[0] = generated.correctAnswer;
      }

      bank.push({
        id: globalId++,
        districtId: d,
        category: generated.category || `WORLD ${d + 1}`,
        visual: generated.visual || 'figure',
        questionText: generated.questionText,
        options: cleanOptions,
        correctAnswer: generated.correctAnswer,
        explanation: generated.explanation,
        hint1: generated.hint1 || 'Review the given information on the diagram.',
        hint2: generated.hint2 || 'Check the rulebook conditions before concluding.',
        visualData: generated.visualData || {},
      });
    }
  }

  return bank;
}

const questionBank = buildQuestionBank();

export default questionBank;
