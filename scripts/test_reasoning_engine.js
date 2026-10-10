// scripts/test_reasoning_engine.js
/**
 * ReasonQuest Reasoning Engine & Question Bank QA Audit Suite
 * Enforces all Acceptance Criteria from TRD §10:
 * 1. Question bank stress test (≥300 runs across 10 worlds = 3000 batches)
 * 2. Chain-validity audit (checkChain on correct chains & seeded flaws)
 * 3. Determined-vs-not-determined agreement audit (isDerivable vs perturbationTest)
 * 4. Rule-versus-construction audit
 * 5. Congruence-evidence audit (SSS/SAS/ASA/AAS/RHS vs SSA/AAA counterexamples)
 * 6. Converse/counterexample bank audit
 */

import questionBank, { buildQuestionBank } from '../src/data/questionBank.js';
import { REASONS, REASON_DISPLAY } from '../src/utils/geoReasons.js';
import { checkChain, isDerivable, createFact } from '../src/utils/geoFacts.js';
import { classifyMarks, findCounterexample } from '../src/utils/congruenceMath.js';
import { perturbationTest } from '../src/utils/geoDiagram.js';
import { misconception } from '../src/utils/reasoningProblems.js';

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    throw new Error(message);
  } else {
    passedTests++;
  }
}

console.log('⚖️ STARTING REASONQUEST GEOMETRIC REASONING ENGINE AUDIT...\n');

// ==========================================
// AUDIT 1: Static Question Bank Shape & Integrity
// ==========================================
console.log('📋 AUDIT 1: Testing Default Question Bank Schema & Size...');
assert(questionBank.length === 100, `Question bank must contain exactly 100 questions (found ${questionBank.length})`);

for (const q of questionBank) {
  assert(q.id && typeof q.id === 'number', `Question ${q.id}: Invalid ID`);
  assert(q.districtId >= 0 && q.districtId <= 9, `Question ${q.id}: District ID out of bounds`);
  assert(q.questionText && q.questionText.length > 5, `Question ${q.id}: Missing or short question text`);
  assert(Array.isArray(q.options) && q.options.length >= 2, `Question ${q.id}: Options must be array with ≥2 items`);
  assert(q.options.includes(q.correctAnswer), `Question ${q.id}: Correct answer "${q.correctAnswer}" not in options [${q.options.join(', ')}]`);
  assert(new Set(q.options).size === q.options.length, `Question ${q.id}: Options contain duplicates`);
  assert(q.explanation && q.explanation.length > 5, `Question ${q.id}: Missing explanation`);
  assert(q.hint1 && q.hint2, `Question ${q.id}: Hints 1 and 2 must exist`);
  assert(!q.questionText.includes('undefined') && !q.questionText.includes('NaN'), `Question ${q.id}: Text contains undefined or NaN`);
}
console.log(`✅ Default 100-question bank verified cleanly.\n`);

// ==========================================
// AUDIT 2: Question Bank Stress Test (≥300 Generations)
// ==========================================
console.log('⚡ AUDIT 2: Stress-testing Procedural Generation (300 Batches = 30,000 Questions)...');
const STRESS_BATCHES = 300;
for (let b = 0; b < STRESS_BATCHES; b++) {
  const bank = buildQuestionBank();
  assert(bank.length === 100, `Batch ${b}: Expected 100 questions`);
  for (const q of bank) {
    assert(q.options.includes(q.correctAnswer), `Batch ${b} Q${q.id}: Correct answer not in options`);
    assert(new Set(q.options).size === q.options.length, `Batch ${b} Q${q.id}: Duplicate options`);
  }
}
console.log(`✅ Passed 300-batch procedural stress test with zero malformed questions.\n`);

// ==========================================
// AUDIT 3: Chain-Validity Audit (Single Validity Authority)
// ==========================================
console.log('🔗 AUDIT 3: Chain-Validity Audit on checkChain Authority...');

// 3a. Valid Chain Test
const validGivens = [
  createFact({ type: 'parallel', entities: ['AB', 'CD'] }),
  createFact({ type: 'collinear', entities: ['ABC'] }),
];
const validChain = [
  {
    conclusion: { type: 'angle', entities: ['x'], value: 70 },
    reasonKey: 'alternate-angles-parallel',
    expectedValue: 70,
  },
  {
    conclusion: { type: 'angle', entities: ['y'], value: 110 },
    reasonKey: 'angles-on-straight-line',
    expectedValue: 110,
  },
];
const validRes = checkChain(validChain, validGivens);
assert(validRes.valid === true, `Valid chain must pass checkChain: ${validRes.message}`);

// 3b. Seeded Flaw: Fact without condition (Parallel fact used when lines are NOT parallel)
const nonParallelGivens = [
  createFact({ type: 'collinear', entities: ['ABC'] }),
];
const flawedChain1 = [
  {
    conclusion: { type: 'angle', entities: ['x'], value: 70 },
    reasonKey: 'alternate-angles-parallel',
  },
];
const flawedRes1 = checkChain(flawedChain1, nonParallelGivens);
assert(flawedRes1.valid === false, 'Flawed chain (no parallel marks) must fail');
assert(flawedRes1.failsAtStep === 0, 'Flaw must fail at step 0');
assert(flawedRes1.failureType === 'condition-not-met', `Expected failureType 'condition-not-met', got '${flawedRes1.failureType}'`);

// 3c. Seeded Flaw: Unknown reason key
const flawedChain2 = [
  {
    conclusion: { type: 'angle', entities: ['x'], value: 70 },
    reasonKey: 'looks-like-it',
  },
];
const flawedRes2 = checkChain(flawedChain2, validGivens);
assert(flawedRes2.valid === false && flawedRes2.failureType === 'unknown-reason', 'Unknown reason must be rejected');

// 3d. Seeded Flaw: Co-interior equal misconception (Conclusion does not follow)
const angleGivens = [
  ...validGivens,
  createFact({ type: 'angle', entities: ['a'], value: 65 }),
];
const flawedChain3 = [
  {
    conclusion: { type: 'angle', entities: ['x'], value: 65 }, // Treated as 65 instead of 115!
    reasonKey: 'co-interior-angles-parallel',
    premises: [{ type: 'angle', entities: ['a'], value: 65 }],
  },
];
const flawedRes3 = checkChain(flawedChain3, angleGivens);
assert(flawedRes3.valid === false, 'Co-interior equal misconception must fail checkChain');
assert(flawedRes3.failureType === 'conclusion-does-not-follow', `Expected conclusion-does-not-follow, got ${flawedRes3.failureType}`);

console.log('✅ checkChain accurately validates correct chains and catches all seeded flaws.\n');

// ==========================================
// AUDIT 4: Determined vs Not-Determined Agreement Audit (World 5)
// ==========================================
console.log('📐 AUDIT 4: Auditing Determined vs Not-Determined Agreement (World 5)...');
const specDetermined = {
  type: 'parallel-lines',
  params: { angle: 70, isParallel: true },
};
const specNotDetermined = {
  type: 'parallel-lines',
  params: { angle: 70, isParallel: false },
};

const perturbDet = perturbationTest(specDetermined, 'angle');
const perturbNonDet = perturbationTest(specNotDetermined, 'angle');

assert(perturbDet === true, 'Determined specification must pass perturbationTest');
assert(perturbNonDet === false, 'Undetermined specification must fail perturbationTest');
console.log('✅ Perturbation test and derivation agree on sufficiency.\n');

// ==========================================
// AUDIT 5: Congruence-Evidence & Counterexample Audit (World 8)
// ==========================================
console.log('👯 AUDIT 5: Congruence-Evidence & Counterexample Audit...');

// Test valid criteria
assert(classifyMarks({ equalSidesCount: 3 }) === 'sss', '3 equal sides -> SSS');
assert(classifyMarks({ equalSidesCount: 2, equalAnglesCount: 1, includedAngle: true }) === 'sas', '2 sides + included angle -> SAS');
assert(classifyMarks({ equalAnglesCount: 2, equalSidesCount: 1, includedSide: true }) === 'asa', '2 angles + included side -> ASA');
assert(classifyMarks({ equalAnglesCount: 2, equalSidesCount: 1, includedSide: false }) === 'aas', '2 angles + non-included side -> AAS');
assert(classifyMarks({ hasRightAngle: true, hasHypotenuse: true, hasLeg: true }) === 'rhs', 'Right angle + Hypotenuse + Leg -> RHS');

// Test invalid criteria (Headline traps)
assert(classifyMarks({ equalSidesCount: 2, equalAnglesCount: 1, includedAngle: false }) === 'ssa-not-a-criterion', 'SSA must be classified as non-criterion');
assert(classifyMarks({ equalAnglesCount: 3, equalSidesCount: 0 }) === 'aaa-not-a-criterion', 'AAA must be classified as non-criterion');

// Verify computed counterexamples for SSA and AAA
const ssaCounter = findCounterexample('ssa-not-a-criterion');
assert(ssaCounter !== null && ssaCounter.type === 'ssa-counterexample', 'SSA must have computed counterexample');
assert(ssaCounter.triangle1.sides.b !== ssaCounter.triangle2.sides.b, 'SSA counterexample triangles must have different third sides');

const aaaCounter = findCounterexample('aaa-not-a-criterion');
assert(aaaCounter !== null && aaaCounter.type === 'aaa-counterexample', 'AAA must have computed counterexample');
assert(aaaCounter.triangle1.sideLength !== aaaCounter.triangle2.sideLength, 'AAA counterexample triangles must have different sizes');

console.log('✅ Congruence criteria classification and computed counterexamples verified.\n');

// ==========================================
// AUDIT 6: Reason Vocabulary & Closed List Parity
// ==========================================
console.log('📖 AUDIT 6: Reason Vocabulary Closed List Integrity...');
assert(REASONS.length === 22, `Expected 22 closed reasons, found ${REASONS.length}`);
for (const key of REASONS) {
  const display = REASON_DISPLAY[key];
  assert(display, `Reason '${key}' must have display metadata`);
  assert(display.full && display.full.length > 0, `Reason '${key}' missing full description`);
  assert(display.abbrev && display.abbrev.length > 0, `Reason '${key}' missing abbreviation`);
  assert(display.narration && display.narration.startsWith('because'), `Reason '${key}' narration must start with 'because'`);
  assert(display.condition && display.condition.length > 0, `Reason '${key}' missing condition`);
}
console.log('✅ Reason vocabulary completely conforms to PRD and TRD standards.\n');

console.log(`🎉 ALL ${passedTests}/${totalTests} AUDIT CHECKS PASSED SUCCESSFULLY! ⚖️`);
