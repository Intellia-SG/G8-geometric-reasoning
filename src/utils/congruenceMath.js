// src/utils/congruenceMath.js
/**
 * ReasonQuest Triangle Congruence Engine
 * TRD §4.4: classifyMarks, findCounterexample, congruenceStatement, correspondingParts.
 * Enforces valid criteria (SSS, SAS, ASA, AAS, RHS) vs invalid non-criteria (SSA, AAA).
 */

/**
 * Classifies a set of marked elements on two triangles
 * marks: {
 *   equalSidesCount: number, // 0..3
 *   equalAnglesCount: number, // 0..3
 *   includedAngle: boolean,  // for 2 sides + 1 angle
 *   includedSide: boolean,   // for 2 angles + 1 side
 *   hasRightAngle: boolean,  // for RHS
 *   hasHypotenuse: boolean,  // for RHS
 *   hasLeg: boolean,         // for RHS
 * }
 */
export function classifyMarks(marks = {}) {
  const {
    equalSidesCount = 0,
    equalAnglesCount = 0,
    includedAngle = false,
    includedSide = false,
    hasRightAngle = false,
    hasHypotenuse = false,
    hasLeg = false,
  } = marks;

  // 1. RHS: Right angle + Hypotenuse + Side
  if (hasRightAngle && hasHypotenuse && hasLeg) {
    return 'rhs';
  }

  // 2. SSS: Three pairs of sides equal
  if (equalSidesCount === 3) {
    return 'sss';
  }

  // 3. SAS vs SSA: Two sides + One angle
  if (equalSidesCount === 2 && equalAnglesCount === 1) {
    if (includedAngle) {
      return 'sas';
    } else {
      // Headline misconception: SSA / ASS is NOT a valid congruence criterion
      return 'ssa-not-a-criterion';
    }
  }

  // 4. ASA vs AAS: Two angles + One side
  if (equalAnglesCount === 2 && equalSidesCount === 1) {
    if (includedSide) {
      return 'asa';
    } else {
      return 'aas';
    }
  }

  // 5. AAA: Three angles equal (proves similarity, NOT congruence!)
  if (equalAnglesCount === 3 && equalSidesCount === 0) {
    return 'aaa-not-a-criterion';
  }

  return 'insufficient';
}

/**
 * Generates computed counterexamples for false criteria (SSA, AAA)
 * PRD §14: Every 'not a criterion' case (SSA, AAA) is accompanied by a real pair
 * of non-congruent triangles satisfying the same marks.
 */
export function findCounterexample(criterionType) {
  if (criterionType === 'ssa-not-a-criterion' || criterionType === 'ssa') {
    // Classic SSA ambiguous case:
    // Triangle 1: side a = 7, side c = 10, angle A = 30°
    // sin(C) = c * sin(A) / a = 10 * 0.5 / 7 = 5/7 ≈ 0.7143
    // Angle C can be acute: C1 ≈ 45.6° -> Angle B1 = 180 - 30 - 45.6 = 104.4° -> side b1 ≈ 13.56
    // Angle C can be obtuse: C2 = 180 - 45.6 = 134.4° -> Angle B2 = 180 - 30 - 134.4 = 15.6° -> side b2 ≈ 3.76
    return {
      type: 'ssa-counterexample',
      name: 'Ambiguous Case of SSA',
      sharedMarks: {
        sideA: 7,
        sideC: 10,
        angleA: 30,
      },
      triangle1: {
        name: 'Acute/Obtuse Triangle 1',
        angles: { A: 30, B: 104.4, C: 45.6 },
        sides: { a: 7, b: 13.56, c: 10 },
      },
      triangle2: {
        name: 'Obtuse Triangle 2',
        angles: { A: 30, B: 15.6, C: 134.4 },
        sides: { a: 7, b: 3.76, c: 10 },
      },
      explanation:
        'Both triangles have side lengths 10 and 7, and a 30° non-included angle. However, the third side can be either 13.6 or 3.8! They are completely different shapes and NOT congruent.',
    };
  }

  if (criterionType === 'aaa-not-a-criterion' || criterionType === 'aaa') {
    // AAA counterexample: Equilateral or 30-60-90 triangles of different sizes
    return {
      type: 'aaa-counterexample',
      name: 'Similar but Dilated Triangles',
      sharedMarks: {
        angles: { A: 60, B: 60, C: 60 },
      },
      triangle1: {
        name: 'Small Equilateral Triangle',
        angles: { A: 60, B: 60, C: 60 },
        sideLength: 5,
      },
      triangle2: {
        name: 'Large Equilateral Triangle',
        angles: { A: 60, B: 60, C: 60 },
        sideLength: 10,
      },
      explanation:
        'Both triangles have matching 60° angles, but one has side length 5 and the other has side length 10. Matching angles prove similarity (same shape), but NOT congruence (same size).',
    };
  }

  return null;
}

/**
 * Builds a formatted congruence statement with corresponding vertices in exact order
 * e.g. "ΔABC ≅ ΔDEF"
 */
export function congruenceStatement(tri1 = 'ABC', tri2 = 'DEF') {
  return `Δ${tri1} ≅ Δ${tri2}`;
}

/**
 * Produces a mismatched vertex order distractor
 * PRD §14: Congruence statement with mismatched vertices
 */
export function vertexOrderMismatch(tri1 = 'ABC', correctTri2 = 'DEF') {
  // Scramble the order of tri2 so corresponding vertices no longer match
  const letters = correctTri2.split('');
  // e.g. DEF -> DFE or EDF
  const scrambled = `${letters[0]}${letters[2]}${letters[1]}`;
  return `Δ${tri1} ≅ Δ${scrambled}`;
}

/**
 * Returns the pairs of equal corresponding parts implied by a valid congruence statement
 * e.g. "ΔABC ≅ ΔDEF" => AB=DE, BC=EF, AC=DF, ∠A=∠D, ∠B=∠E, ∠C=∠F
 */
export function correspondingParts(tri1 = 'ABC', tri2 = 'DEF') {
  const [a, b, c] = tri1.split('');
  const [d, e, f] = tri2.split('');

  return {
    sides: [
      { side1: `${a}${b}`, side2: `${d}${e}` },
      { side1: `${b}${c}`, side2: `${e}${f}` },
      { side1: `${a}${c}`, side2: `${d}${f}` },
    ],
    angles: [
      { angle1: `∠${a}`, angle2: `∠${d}` },
      { angle1: `∠${b}`, angle2: `∠${e}` },
      { angle1: `∠${c}`, angle2: `∠${f}` },
    ],
  };
}
