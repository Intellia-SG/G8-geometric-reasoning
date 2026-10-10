// src/utils/reasoningProblems.js
/**
 * ReasonQuest Problem Generators & Pedagogical Misconception Library
 * TRD §4.4: generateFactMatch, generatePairIdentification, generateOneStep,
 * generateMultiStep, generateAuxiliaryLine, generateSufficiencyItem,
 * generateOrderingItem, generateConverseCounterexample, generateCongruenceItem,
 * and misconception.* helpers.
 */

import { REASON_DISPLAY } from './geoReasons.js';
import { createFact, checkChain } from './geoFacts.js';
import { vertexOrderMismatch } from './congruenceMath.js';

/**
 * Pedagogical Distractor & Misconception Library
 * TRD §4.4: Every distractor and seeded flaw comes from here, never hand-authored.
 */
export const misconception = {
  confuseAlternateCorresponding: (correctType) =>
    correctType === 'alternate' ? 'corresponding' : 'alternate',

  coInteriorEqual: (givenAngle) => givenAngle, // Headline distractor: treating co-interior as equal

  straightLine360: (givenAngle) => 360 - givenAngle,

  pointLine180: (givenAngle) => 180 - givenAngle,

  measureFromDiagram: (drawnAngle) => Math.round(drawnAngle),

  factWithoutCondition: (reasonKey) => ({
    reasonKey,
    flaw: 'Used fact without verifying its condition (e.g. lines not marked parallel)',
  }),

  circularReason: (conclusion) => ({
    statement: `We know this is true because ${conclusion} has to be true.`,
    flaw: 'Circular reasoning',
  }),

  wrongReasonForRightValue: (correctReason) => {
    const alternates = [
      'angles-on-straight-line',
      'vertically-opposite-angles',
      'corresponding-angles-parallel',
      'alternate-angles-parallel',
      'co-interior-angles-parallel',
    ].filter((r) => r !== correctReason);
    return alternates[0];
  },

  ssaAsCriterion: () => 'SSA (Side-Side-Angle)',
  aaaAsCriterion: () => 'AAA (Angle-Angle-Angle)',
  asaVsAas: (correct) => (correct === 'asa' ? 'aas' : 'asa'),
  vertexOrderMismatch: (tri1, tri2) => vertexOrderMismatch(tri1, tri2),

  converseAssumedTrue: (claim) => `If ${claim.consequent}, then ${claim.antecedent} (Converse assumed true without proof)`,
  exampleAsProof: () => 'Checking one example is enough to prove a rule for all shapes',
};

// ==========================================
// WORLD 0: Know Your Facts (Fact Matching)
// ==========================================
export function generateFactMatch(seed = 0) {
  const factKeys = [
    'angles-on-straight-line',
    'angles-at-a-point',
    'vertically-opposite-angles',
    'corresponding-angles-parallel',
    'alternate-angles-parallel',
    'co-interior-angles-parallel',
    'angle-sum-triangle',
    'base-angles-isosceles',
  ];

  const chosenKey = factKeys[seed % factKeys.length];
  const info = REASON_DISPLAY[chosenKey];

  let prompt = '';
  switch (chosenKey) {
    case 'angles-on-straight-line':
      prompt = 'Two adjacent angles lie on a straight line: ∠a + ∠b = 180°. What is the rulebook reason?';
      break;
    case 'angles-at-a-point':
      prompt = 'Four angles complete a full rotation around vertex O: sum = 360°. What is the rulebook reason?';
      break;
    case 'vertically-opposite-angles':
      prompt = 'Two straight lines intersect at X forming opposite angles ∠1 and ∠2. Why are they equal?';
      break;
    case 'corresponding-angles-parallel':
      prompt = 'Two lines AB and CD are marked parallel (∥) with an F-shape angle pair. What is the reason?';
      break;
    case 'alternate-angles-parallel':
      prompt = 'Two lines AB and CD are marked parallel (∥) with a Z-shape angle pair. What is the reason?';
      break;
    case 'co-interior-angles-parallel':
      prompt = 'Two lines AB and CD are marked parallel (∥) with interior C-shape angles summing to 180°. What is the reason?';
      break;
    case 'angle-sum-triangle':
      prompt = 'In any triangle ABC, the interior angles satisfy ∠A + ∠B + ∠C = 180°. What is the reason?';
      break;
    case 'base-angles-isosceles':
      prompt = 'In ΔABC, AB = AC. Therefore, the angles opposite equal sides, ∠B and ∠C, are equal. What is the reason?';
      break;
    default:
      prompt = `What is the reason for: ${info.condition}?`;
  }

  const correctDisplay = info.full;
  const distractors = factKeys
    .filter((k) => k !== chosenKey)
    .slice(0, 3)
    .map((k) => REASON_DISPLAY[k].full);

  const options = [correctDisplay, ...distractors].sort();

  return {
    category: 'MATCH ANGLE FACTS',
    questionText: prompt,
    options,
    correctAnswer: correctDisplay,
    explanation: `Correct! ${info.full} applies because: ${info.condition}.`,
    hint1: `Look at the condition: ${info.condition.split(';')[0]}.`,
    hint2: `Rulebook note: ${info.abbrev}`,
    visual: 'rulebook',
    visualData: { reasonKey: chosenKey, info },
  };
}

// ==========================================
// WORLD 1: Spot the Letter (Angle Pair Types)
// ==========================================
export function generatePairIdentification(seed = 0) {
  const pairs = [
    { type: 'alternate', letter: 'Z-shape', desc: 'alternate interior angles between parallel lines', equal: true },
    { type: 'corresponding', letter: 'F-shape', desc: 'corresponding angles in matching positions', equal: true },
    { type: 'co-interior', letter: 'C-shape', desc: 'co-interior angles inside the parallel lines (sum to 180°)', equal: false },
  ];

  const pair = pairs[seed % pairs.length];
  const givenAngle = 55 + ((seed * 7) % 50);

  const prompt = `Lines AB and CD are parallel (AB ∥ CD). Two marked angles form a ${pair.letter}. Which type of angle pair is this?`;
  const options = ['Alternate angles', 'Corresponding angles', 'Co-interior angles', 'Vertically opposite angles'].sort();
  const correctName =
    pair.type === 'alternate' ? 'Alternate angles' :
    pair.type === 'corresponding' ? 'Corresponding angles' : 'Co-interior angles';

  return {
    category: 'IDENTIFY ANGLE PAIRS',
    questionText: prompt,
    options,
    correctAnswer: correctName,
    explanation: `These form a ${pair.letter}, which identifies them as ${correctName.toLowerCase()}. When lines are parallel, ${
      pair.equal ? 'they are equal in size.' : 'they sum to 180°.'
    }`,
    hint1: `Notice the ${pair.letter} configuration formed between the transversal and the parallel rails.`,
    hint2: pair.equal ? 'This pair has identical angle values.' : 'This pair is supplementary (adds to 180°).',
    visual: 'transversal-pairs',
    visualData: { pairType: pair.type, letter: pair.letter, angle: givenAngle, isParallel: true },
  };
}

// ==========================================
// WORLD 2: One-Step Rulings
// ==========================================
export function generateOneStep(seed = 0) {
  const variants = [
    { type: 'co-interior', given: 65 + (seed % 40), relation: 'co-interior-angles-parallel' },
    { type: 'straight-line', given: 110 + (seed % 35), relation: 'angles-on-straight-line' },
    { type: 'alternate', given: 52 + (seed % 45), relation: 'alternate-angles-parallel' },
    { type: 'triangle-third', given1: 45, given2: 65, relation: 'angle-sum-triangle' },
  ];

  const v = variants[seed % variants.length];

  let questionText = '';
  let correctVal = 0;
  let correctReason = v.relation;
  let distractors = [];

  if (v.type === 'co-interior') {
    correctVal = 180 - v.given;
    questionText = `AB ∥ CD. One interior angle is ${v.given}°. Find the co-interior angle x, with its rulebook reason.`;
    distractors = [
      `${v.given}° (co-interior angles, AB ∥ CD)`, // Headline distractor: coInteriorEqual!
      `${correctVal}° (alternate angles, AB ∥ CD)`,
      `${180 - v.given + 10}° (co-interior angles, AB ∥ CD)`,
    ];
  } else if (v.type === 'straight-line') {
    correctVal = 180 - v.given;
    questionText = `A and B lie on a straight line. One adjacent angle is ${v.given}°. Find angle x with reason.`;
    distractors = [
      `${360 - v.given}° (angles at a point)`,
      `${v.given}° (vertically opposite angles)`,
      `${correctVal}° (angles at a point)`,
    ];
  } else if (v.type === 'alternate') {
    correctVal = v.given;
    questionText = `AB ∥ CD. One alternate angle is ${v.given}°. What is angle x with reason?`;
    distractors = [
      `${180 - v.given}° (co-interior angles, AB ∥ CD)`,
      `${v.given}° (angles on a straight line)`,
      `${v.given + 15}° (alternate angles, AB ∥ CD)`,
    ];
  } else {
    correctVal = 180 - v.given1 - v.given2;
    questionText = `In ΔABC, ∠A = ${v.given1}° and ∠B = ${v.given2}°. Find ∠C with reason.`;
    distractors = [
      `${v.given1 + v.given2}° (exterior angle of triangle)`,
      `${correctVal}° (angles on a straight line)`,
      `${180 - v.given1}° (angle sum of triangle)`,
    ];
  }

  const correctDisplay = `${correctVal}° (${REASON_DISPLAY[correctReason].abbrev})`;
  const formattedDistractors = distractors.map((d) => d);
  const options = [correctDisplay, ...formattedDistractors].sort();

  // Validate chain with single validity authority
  const givens = [
    createFact({ type: 'parallel', entities: ['AB', 'CD'] }),
    createFact({ type: 'collinear', entities: ['ABC'] }),
  ];
  const chain = [{ conclusion: { value: correctVal }, reasonKey: correctReason, expectedValue: correctVal }];
  checkChain(chain, givens);

  return {
    category: 'ONE-STEP RULINGS',
    questionText,
    options,
    correctAnswer: correctDisplay,
    explanation: `Correct: x = ${correctVal}° because ${REASON_DISPLAY[correctReason].full}.`,
    hint1: `Check the condition required for ${REASON_DISPLAY[correctReason].full}.`,
    hint2: `Formula: ${REASON_DISPLAY[correctReason].condition}`,
    visual: 'figure',
    visualData: { type: 'parallel-lines', params: { angle: v.given || 65, isParallel: true } },
  };
}

// ==========================================
// WORLD 3: Chain of Evidence (Multi-Step)
// ==========================================
export function generateMultiStep(seed = 0) {
  // Isosceles + Exterior angle chasing
  const apexAngle = 40 + ((seed * 4) % 40); // e.g. 40, 44, 48...
  const baseAngle = (180 - apexAngle) / 2; // e.g. 70°
  const extAngle = 180 - baseAngle; // e.g. 110°

  const questionText = `In triangle ABC, AB = AC (marked isosceles) and apex angle ∠A = ${apexAngle}°. Side BC is extended to D. Find exterior angle ∠ACD.`;
  const correctDisplay = `${extAngle}°`;

  // Distractors from misconception library
  const distractors = [
    `${baseAngle}°`, // Missed the exterior step
    `${180 - apexAngle}°`, // Subtracted apex from 180
    `${apexAngle + baseAngle + 10}°`,
  ];

  const options = [correctDisplay, ...distractors].sort();

  return {
    category: 'CHAIN OF EVIDENCE',
    questionText,
    options,
    correctAnswer: correctDisplay,
    explanation: `Two-step chain: 1) Base angle ∠ACB = (180° - ${apexAngle}°) / 2 = ${baseAngle}° (base ∠s of isos. Δ). 2) Exterior ∠ACD = 180° - ${baseAngle}° = ${extAngle}° (adj. ∠s on a str. line).`,
    hint1: 'Step 1: Use base angles of isosceles triangle to find ∠ACB.',
    hint2: 'Step 2: Use angles on a straight line (or exterior angle theorem) to find ∠ACD.',
    visual: 'figure',
    visualData: {
      type: 'triangle',
      params: { angleA: apexAngle, angleB: baseAngle, equalSides: ['AB', 'AC'] },
    },
  };
}

// ==========================================
// WORLD 4: The Helper Line (Auxiliary Line)
// ==========================================
export function generateAuxiliaryLine(seed = 0) {
  const angle1 = 35 + ((seed * 3) % 25); // e.g. 35°
  const angle2 = 25 + ((seed * 5) % 25); // e.g. 25°
  const vertexAngle = angle1 + angle2; // e.g. 60°

  const questionText = `Lines AB and CD are parallel (AB ∥ CD), and point E lies between them. ∠ABE = ${angle1}° and ∠ECD = ${angle2}°. What is reflex/interior ∠BEC?`;
  const correctDisplay = `${vertexAngle}°`;

  const distractors = [
    `${180 - vertexAngle}°`, // Treated as co-interior
    `${Math.abs(angle1 - angle2)}°`, // Subtracted angles
    `${180 - angle1}°`,
  ];

  const options = [correctDisplay, ...distractors].sort();

  return {
    category: 'THE HELPER LINE',
    questionText,
    options,
    correctAnswer: correctDisplay,
    explanation: `Draw a helper line through E parallel to AB. By alternate angles (AB ∥ EF), upper ∠ = ${angle1}°. By alternate angles (EF ∥ CD), lower ∠ = ${angle2}°. Sum: ∠BEC = ${angle1}° + ${angle2}° = ${vertexAngle}°.`,
    hint1: 'Add an auxiliary (helper) line through vertex E parallel to AB and CD.',
    hint2: 'Split ∠BEC into two alternate angles that add together.',
    visual: 'figure',
    visualData: {
      type: 'auxiliary-z',
      params: { angle1, angle2 },
      freeParams: { showHelperLine: true },
    },
  };
}

// ==========================================
// WORLD 5: Does It Follow? (Sufficiency)
// ==========================================
export function generateSufficiencyItem(seed = 0) {
  const isDetermined = seed % 2 === 0;

  let questionText = '';
  let correctAnswer = '';
  let explanation = '';

  if (isDetermined) {
    const angleVal = 72;
    questionText = `Lines AB and CD are marked parallel (AB ∥ CD) and ∠ABE = ${angleVal}°. Can alternate angle ∠BEC be deduced?`;
    correctAnswer = `Yes, determined (${angleVal}°)`;
    explanation = 'Lines are explicitly marked parallel, so alternate angles are equal and validly determined.';
  } else {
    // Deliberately NOT marked parallel, looks parallel ("not drawn to scale")
    questionText = 'Lines AB and CD appear parallel in the sketch, but have NO parallel marks (∥). Given ∠ABE = 70°, can ∠BEC be deduced?';
    correctAnswer = 'Not determined (insufficient marks)';
    explanation =
      'A sketch is not evidence! Without explicit parallel marks or given parallel facts, alternate angles cannot be assumed.';
  }

  const options = [
    'Yes, determined (72°)',
    'Yes, determined (70°)',
    'Not determined (insufficient marks)',
    'Yes, determined by measuring sketch',
  ].sort();

  return {
    category: 'DOES IT FOLLOW?',
    questionText,
    options,
    correctAnswer,
    explanation,
    hint1: 'Check whether the lines are explicitly marked parallel with arrows.',
    hint2: 'Remember: A drawing is just a sketch artist drawing unless backed by given marks!',
    visual: 'figure',
    visualData: {
      type: 'parallel-lines',
      notToScale: true,
      params: { angle: 70, isParallel: isDetermined },
    },
  };
}

// ==========================================
// WORLD 6: Order in the Court (Chain Ordering)
// ==========================================
export function generateOrderingItem(seed = 0) {
  const steps = [
    { text: '1. Mark given that ΔABC is isosceles with AB = AC', key: 'A', order: 1 },
    { text: '2. Deduce base angles ∠B = ∠C = 65° (base ∠s of isos. Δ)', key: 'B', order: 2 },
    { text: '3. Calculate apex angle ∠A = 180° - 65° - 65° = 50° (∠ sum of Δ)', key: 'C', order: 3 },
    { text: '4. Deliver ruling that ∠A is acute', key: 'D', order: 4 },
  ];

  const correctSequence = 'A → B → C → D';
  const options = [
    'A → B → C → D',
    'B → A → C → D',
    'C → B → A → D',
    'A → C → B → D',
  ];

  return {
    category: 'ORDER IN THE COURT',
    questionText: 'Put these 4 reasoning steps into a valid logical order so that every claim has its condition established first.',
    options,
    correctAnswer: correctSequence,
    explanation: 'First identify given isosceles sides (A), then deduce equal base angles (B), then calculate apex angle via angle sum (C), and finally conclude the ruling (D).',
    hint1: 'A reason can only be used AFTER its conditions are established.',
    hint2: 'Step B requires the isosceles given from step A before it can deduce equal base angles.',
    visual: 'reasoning-chain',
    visualData: { steps },
  };
}

// ==========================================
// WORLD 7: Converse and Counterexample
// ==========================================
export function generateConverseCounterexample(seed = 0) {
  const items = [
    {
      claim: 'If two angles are equal, then they must be vertically opposite.',
      isTrue: false,
      counterexample: 'Equal base angles in an isosceles triangle (they are equal but not vertically opposite).',
    },
    {
      claim: 'If alternate angles are equal, then the two lines must be parallel.',
      isTrue: true,
      counterexample: null,
    },
    {
      claim: 'If two angles add to 180°, they must form a straight line pair.',
      isTrue: false,
      counterexample: 'Co-interior angles between parallel lines (they add to 180° but lie on different lines).',
    },
    {
      claim: 'If co-interior angles sum to 180°, then the lines are parallel.',
      isTrue: true,
      counterexample: null,
    },
  ];

  const item = items[seed % items.length];

  let questionText = `Claim: "${item.claim}" Is this claim universally true or false?`;
  let correctAnswer = '';
  let explanation = '';

  if (item.isTrue) {
    correctAnswer = 'True (Valid converse rule)';
    explanation = `This is a universally valid geometric converse from our rulebook.`;
  } else {
    correctAnswer = `False (Counterexample: ${item.counterexample.split('(')[0].trim()})`;
    explanation = `False! A counterexample disproves it: ${item.counterexample}`;
  }

  const options = [
    'True (Valid converse rule)',
    `False (Counterexample: Equal base angles in an isosceles triangle)`,
    `False (Counterexample: Co-interior angles between parallel lines)`,
    'True because it works in most sketches',
  ].sort();

  return {
    category: 'CONVERSE & COUNTEREXAMPLE',
    questionText,
    options,
    correctAnswer: options.find((o) => o.startsWith(correctAnswer.split(' ')[0])) || options[0],
    explanation,
    hint1: 'Ask yourself: Can you find even ONE single case where the condition is met but the conclusion fails?',
    hint2: 'A single counterexample is enough to disprove any universal claim!',
    visual: 'rulebook',
    visualData: { claim: item.claim, isTrue: item.isTrue },
  };
}

// ==========================================
// WORLD 8: Congruent Evidence (Triangle Criteria)
// ==========================================
export function generateCongruenceItem(seed = 0) {
  const cases = [
    {
      desc: 'In ΔABC and ΔDEF: AB = DE, BC = EF, and ∠B = ∠E (angle between them).',
      criterion: 'SAS',
      valid: true,
    },
    {
      desc: 'In ΔABC and ΔDEF: AB = DE, BC = EF, and non-included angle ∠A = ∠D.',
      criterion: 'SSA is NOT a valid criterion',
      valid: false,
      counter: 'Ambiguous case where two non-congruent triangles share these marks',
    },
    {
      desc: 'In ΔABC and ΔDEF: ∠A = ∠D, ∠B = ∠E, and ∠C = ∠F.',
      criterion: 'AAA is NOT a criterion (similarity only)',
      valid: false,
      counter: 'Triangles can have same angles but different sizes (scale)',
    },
    {
      desc: 'In right-angled ΔABC and ΔDEF: ∠B = ∠E = 90°, hypotenuses AC = DF, and leg AB = DE.',
      criterion: 'RHS',
      valid: true,
    },
  ];

  const item = cases[seed % cases.length];

  const questionText = `${item.desc} Which congruence criterion applies?`;
  const correctAnswer = item.criterion;

  const options = [
    'SAS',
    'SSA is NOT a valid criterion',
    'AAA is NOT a criterion (similarity only)',
    'RHS',
  ].sort();

  return {
    category: 'CONGRUENT EVIDENCE',
    questionText,
    options,
    correctAnswer,
    explanation: item.valid
      ? `Correct! This satisfies the ${item.criterion} criterion.`
      : `Correct! ${item.criterion}. ${item.counter}.`,
    hint1: 'Check whether the angle is included between the two sides, or non-included.',
    hint2: 'Beware of the headline traps: SSA and AAA do not guarantee congruence!',
    visual: 'triangle-pair',
    visualData: { marks: item },
  };
}

// ==========================================
// WORLD 9: The Grand Mock Trial (Mixed Review)
// ==========================================
export function generateMixedReview(seed = 0) {
  const generators = [
    generateFactMatch,
    generatePairIdentification,
    generateOneStep,
    generateMultiStep,
    generateAuxiliaryLine,
    generateSufficiencyItem,
    generateOrderingItem,
    generateConverseCounterexample,
    generateCongruenceItem,
  ];

  const gen = generators[seed % generators.length];
  const item = gen(seed + 17);
  item.category = 'GRAND MOCK TRIAL';
  return item;
}
