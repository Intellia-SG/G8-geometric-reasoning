// src/utils/geoReasons.js
/**
 * ReasonQuest Rulebook & Reason Vocabulary
 * Standardised closed list of geometric reasons per PRD §15.1 and TRD §4.4.
 * Every fact carries a strict condition under which it applies.
 */

export const REASONS = [
  // Angle facts on intersecting lines
  'angles-on-straight-line',
  'angles-at-a-point',
  'vertically-opposite-angles',

  // Parallel line angle facts (REQUIRES lines marked parallel)
  'corresponding-angles-parallel',
  'alternate-angles-parallel',
  'co-interior-angles-parallel',

  // Triangle angle facts
  'angle-sum-triangle',
  'exterior-angle-triangle',
  'base-angles-isosceles',
  'angles-equilateral-triangle',

  // Given and structural relations
  'given',
  'common-side',
  'common-angle',

  // Converses (prove lines are parallel)
  'converse-corresponding-angles',
  'converse-alternate-angles',
  'converse-co-interior-angles',

  // Triangle congruence criteria
  'sss',
  'sas',
  'asa',
  'aas',
  'rhs',
  'corresponding-parts-congruent-triangles',
];

export const REASON_DISPLAY = {
  'angles-on-straight-line': {
    full: 'angles on a straight line',
    abbrev: 'adj. ∠s on a str. line',
    condition: 'Points must form a continuous straight line (180°)',
    narration: 'because adjacent angles on a straight line sum to 180 degrees',
    category: 'lines',
  },
  'angles-at-a-point': {
    full: 'angles at a point',
    abbrev: '∠s at a pt.',
    condition: 'Angles complete a full turn around a single vertex (360°)',
    narration: 'because angles around a point sum to 360 degrees',
    category: 'lines',
  },
  'vertically-opposite-angles': {
    full: 'vertically opposite angles',
    abbrev: 'vert. opp. ∠s',
    condition: 'Formed by two intersecting straight lines across vertex',
    narration: 'because vertically opposite angles are equal',
    category: 'lines',
  },
  'corresponding-angles-parallel': {
    full: 'corresponding angles (parallel lines)',
    abbrev: 'corr. ∠s, // lines',
    condition: 'Lines MUST be marked parallel (F-shape)',
    narration: 'because corresponding angles are equal, when lines are parallel',
    category: 'parallel',
  },
  'alternate-angles-parallel': {
    full: 'alternate angles (parallel lines)',
    abbrev: 'alt. ∠s, // lines',
    condition: 'Lines MUST be marked parallel (Z-shape)',
    narration: 'because alternate angles are equal, when lines are parallel',
    category: 'parallel',
  },
  'co-interior-angles-parallel': {
    full: 'co-interior angles (parallel lines)',
    abbrev: 'int. ∠s, // lines',
    condition: 'Lines MUST be marked parallel; sum to 180° (C-shape)',
    narration: 'because co-interior angles sum to 180 degrees, when lines are parallel',
    category: 'parallel',
  },
  'angle-sum-triangle': {
    full: 'angle sum of a triangle',
    abbrev: '∠ sum of Δ',
    condition: 'Three interior angles of any triangle (sum to 180°)',
    narration: 'because the angle sum of a triangle is 180 degrees',
    category: 'triangles',
  },
  'exterior-angle-triangle': {
    full: 'exterior angle of a triangle',
    abbrev: 'ext. ∠ of Δ',
    condition: 'Exterior angle formed by extending one side equals sum of two opposite interior angles',
    narration: 'because the exterior angle of a triangle equals the sum of interior opposite angles',
    category: 'triangles',
  },
  'base-angles-isosceles': {
    full: 'base angles of an isosceles triangle',
    abbrev: 'base ∠s of isos. Δ',
    condition: 'Two sides marked equal; angles opposite equal sides are equal',
    narration: 'because the base angles of an isosceles triangle opposite equal sides are equal',
    category: 'triangles',
  },
  'angles-equilateral-triangle': {
    full: 'angles of an equilateral triangle',
    abbrev: '∠s of equil. Δ',
    condition: 'All three sides equal; all angles are 60°',
    narration: 'because all interior angles of an equilateral triangle are 60 degrees',
    category: 'triangles',
  },
  'given': {
    full: 'given information',
    abbrev: 'given',
    condition: 'Explicitly marked or stated in the problem specification',
    narration: 'because it is given in the problem statement',
    category: 'givens',
  },
  'common-side': {
    full: 'common side',
    abbrev: 'common side',
    condition: 'Shared line segment between adjacent figures or triangles',
    narration: 'because both triangles share the same common side',
    category: 'congruence',
  },
  'common-angle': {
    full: 'common angle',
    abbrev: 'common angle',
    condition: 'Shared angle vertex and arms',
    narration: 'because both triangles share the same common angle',
    category: 'congruence',
  },
  'converse-corresponding-angles': {
    full: 'converse of corresponding angles',
    abbrev: 'corr. ∠s equal ⇒ // lines',
    condition: 'Corresponding angles are equal ⇒ lines are parallel',
    narration: 'because corresponding angles are equal, the lines must be parallel',
    category: 'converse',
  },
  'converse-alternate-angles': {
    full: 'converse of alternate angles',
    abbrev: 'alt. ∠s equal ⇒ // lines',
    condition: 'Alternate angles are equal ⇒ lines are parallel',
    narration: 'because alternate angles are equal, the lines must be parallel',
    category: 'converse',
  },
  'converse-co-interior-angles': {
    full: 'converse of co-interior angles',
    abbrev: 'int. ∠s supp. ⇒ // lines',
    condition: 'Co-interior angles sum to 180° ⇒ lines are parallel',
    narration: 'because co-interior angles sum to 180 degrees, the lines must be parallel',
    category: 'converse',
  },
  'sss': {
    full: 'side, side, side criterion',
    abbrev: 'SSS',
    condition: 'Three pairs of corresponding sides are equal',
    narration: 'because of the side, side, side congruence criterion',
    category: 'congruence',
  },
  'sas': {
    full: 'side, angle, side criterion',
    abbrev: 'SAS',
    condition: 'Two pairs of sides and the INCLUDED angle are equal',
    narration: 'because of the side, angle, side congruence criterion',
    category: 'congruence',
  },
  'asa': {
    full: 'angle, side, angle criterion',
    abbrev: 'ASA',
    condition: 'Two pairs of angles and the INCLUDED side are equal',
    narration: 'because of the angle, side, angle congruence criterion',
    category: 'congruence',
  },
  'aas': {
    full: 'angle, angle, side criterion',
    abbrev: 'AAS',
    condition: 'Two pairs of angles and a non-included corresponding side are equal',
    narration: 'because of the angle, angle, side congruence criterion',
    category: 'congruence',
  },
  'rhs': {
    full: 'right angle, hypotenuse, side criterion',
    abbrev: 'RHS',
    condition: 'Both triangles have 90°, equal hypotenuses, and one pair of equal legs',
    narration: 'because of the right angle, hypotenuse, side congruence criterion',
    category: 'congruence',
  },
  'corresponding-parts-congruent-triangles': {
    full: 'corresponding parts of congruent triangles',
    abbrev: 'corr. parts of ≅ Δs',
    condition: 'Triangles have already been proven congruent',
    narration: 'because corresponding parts of congruent triangles are equal',
    category: 'congruence',
  },
};

/**
 * Formal rules with preconditions and conclusions
 */
export const RULES = {
  'angles-on-straight-line': {
    name: 'Angles on a straight line',
    checkCondition: (premises) => premises.collinear === true,
    calculate: (angles) => 180 - angles.reduce((sum, a) => sum + a, 0),
    verify: (angles, target) => {
      const sum = angles.reduce((s, a) => s + a, 0) + target;
      return Math.abs(sum - 180) < 0.01;
    },
  },
  'angles-at-a-point': {
    name: 'Angles at a point',
    checkCondition: (premises) => premises.aroundPoint === true,
    calculate: (angles) => 360 - angles.reduce((sum, a) => sum + a, 0),
    verify: (angles, target) => {
      const sum = angles.reduce((s, a) => s + a, 0) + target;
      return Math.abs(sum - 360) < 0.01;
    },
  },
  'vertically-opposite-angles': {
    name: 'Vertically opposite angles',
    checkCondition: (premises) => premises.intersectingLines === true,
    calculate: (angles) => angles[0],
    verify: (angles, target) => Math.abs(angles[0] - target) < 0.01,
  },
  'corresponding-angles-parallel': {
    name: 'Corresponding angles on parallel lines',
    checkCondition: (premises) => premises.isParallel === true,
    calculate: (angles) => angles[0],
    verify: (angles, target) => Math.abs(angles[0] - target) < 0.01,
  },
  'alternate-angles-parallel': {
    name: 'Alternate angles on parallel lines',
    checkCondition: (premises) => premises.isParallel === true,
    calculate: (angles) => angles[0],
    verify: (angles, target) => Math.abs(angles[0] - target) < 0.01,
  },
  'co-interior-angles-parallel': {
    name: 'Co-interior angles on parallel lines',
    checkCondition: (premises) => premises.isParallel === true,
    calculate: (angles) => 180 - angles[0],
    verify: (angles, target) => Math.abs(angles[0] + target - 180) < 0.01,
  },
  'angle-sum-triangle': {
    name: 'Angle sum of triangle',
    checkCondition: (premises) => premises.isTriangle === true,
    calculate: (angles) => 180 - angles[0] - angles[1],
    verify: (angles, target) => Math.abs(angles[0] + angles[1] + target - 180) < 0.01,
  },
  'exterior-angle-triangle': {
    name: 'Exterior angle of triangle',
    checkCondition: (premises) => premises.isTriangle === true && premises.isExterior === true,
    calculate: (angles) => angles[0] + angles[1],
    verify: (angles, target) => Math.abs(angles[0] + angles[1] - target) < 0.01,
  },
  'base-angles-isosceles': {
    name: 'Base angles of isosceles triangle',
    checkCondition: (premises) => premises.isIsosceles === true,
    calculate: (knownAngle, isApex) => isApex ? (180 - knownAngle) / 2 : knownAngle,
    verify: (knownAngle, target, isApex) => {
      if (isApex) return Math.abs((180 - knownAngle) / 2 - target) < 0.01;
      return Math.abs(knownAngle - target) < 0.01;
    },
  },
  'angles-equilateral-triangle': {
    name: 'Angles of equilateral triangle',
    checkCondition: (premises) => premises.isEquilateral === true,
    calculate: () => 60,
    verify: (_, target) => Math.abs(target - 60) < 0.01,
  },
  'converse-corresponding-angles': {
    name: 'Converse of corresponding angles',
    checkCondition: (angles) => Math.abs(angles[0] - angles[1]) < 0.01,
    conclusion: 'Lines are parallel',
  },
  'converse-alternate-angles': {
    name: 'Converse of alternate angles',
    checkCondition: (angles) => Math.abs(angles[0] - angles[1]) < 0.01,
    conclusion: 'Lines are parallel',
  },
  'converse-co-interior-angles': {
    name: 'Converse of co-interior angles',
    checkCondition: (angles) => Math.abs(angles[0] + angles[1] - 180) < 0.01,
    conclusion: 'Lines are parallel',
  },
};
