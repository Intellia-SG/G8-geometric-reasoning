// src/utils/geoFacts.js
/**
 * ReasonQuest Fact Model & Single Validity Authority (Chain Checker)
 * TRD §4.4: Fact, deriveClosure, checkChain, isDerivable, validOrderings.
 */

import { REASONS, RULES, REASON_DISPLAY } from './geoReasons.js';

/**
 * Factory for typed Fact records
 */
export function createFact({
  type, // 'angle' | 'parallel' | 'equal-sides' | 'collinear' | 'triangle' | 'congruent'
  id,
  entities = [], // e.g. ['AB', 'CD'] or ['ABC']
  value = null, // e.g. 70
  provenance = { reason: 'given', premises: [] },
}) {
  return {
    type,
    id: id || `${type}:${entities.sort().join('-')}`,
    entities,
    value,
    provenance,
  };
}

/**
 * Checks if fact A matches fact B (same type, entities, and value within tolerance)
 */
export function matchFact(factA, factB) {
  if (!factA || !factB) return false;
  if (factA.type !== factB.type) return false;

  const entA = [...factA.entities].sort().join(',');
  const entB = [...factB.entities].sort().join(',');
  if (entA !== entB) return false;

  if (factA.value !== null && factB.value !== null) {
    return Math.abs(factA.value - factB.value) < 0.05;
  }
  return true;
}

/**
 * Forward-chains RULES over givens until closure is reached
 */
export function deriveClosure(givens) {
  const knownFacts = [...givens];
  let changed = true;
  let iterations = 0;
  const maxIterations = 20;

  function hasFact(candidate) {
    return knownFacts.some((f) => matchFact(f, candidate));
  }

  function getAngleValue(entity) {
    const f = knownFacts.find((k) => k.type === 'angle' && k.entities.includes(entity));
    return f ? f.value : null;
  }

  function areLinesParallel(line1, line2) {
    return knownFacts.some(
      (k) =>
        k.type === 'parallel' &&
        k.entities.includes(line1) &&
        k.entities.includes(line2)
    );
  }

  while (changed && iterations < maxIterations) {
    changed = false;
    iterations++;

    // 1. Parallel lines angle transfers
    const parallelFacts = knownFacts.filter((f) => f.type === 'parallel');
    for (const p of parallelFacts) {
      const [l1, l2] = p.entities;
      // Find angle pairs that relate to these parallel lines
      const pairs = knownFacts.filter(
        (f) => f.type === 'angle-pair' && f.parallelLines && f.parallelLines.includes(l1) && f.parallelLines.includes(l2)
      );

      for (const pair of pairs) {
        const val1 = getAngleValue(pair.angle1);
        const val2 = getAngleValue(pair.angle2);

        if (pair.relation === 'alternate' || pair.relation === 'corresponding') {
          if (val1 !== null && val2 === null) {
            const newFact = createFact({
              type: 'angle',
              entities: [pair.angle2],
              value: val1,
              provenance: {
                reason: pair.relation === 'alternate' ? 'alternate-angles-parallel' : 'corresponding-angles-parallel',
                premises: [p.id, pair.angle1],
              },
            });
            if (!hasFact(newFact)) {
              knownFacts.push(newFact);
              changed = true;
            }
          } else if (val2 !== null && val1 === null) {
            const newFact = createFact({
              type: 'angle',
              entities: [pair.angle1],
              value: val2,
              provenance: {
                reason: pair.relation === 'alternate' ? 'alternate-angles-parallel' : 'corresponding-angles-parallel',
                premises: [p.id, pair.angle2],
              },
            });
            if (!hasFact(newFact)) {
              knownFacts.push(newFact);
              changed = true;
            }
          }
        } else if (pair.relation === 'co-interior') {
          if (val1 !== null && val2 === null) {
            const newFact = createFact({
              type: 'angle',
              entities: [pair.angle2],
              value: 180 - val1,
              provenance: {
                reason: 'co-interior-angles-parallel',
                premises: [p.id, pair.angle1],
              },
            });
            if (!hasFact(newFact)) {
              knownFacts.push(newFact);
              changed = true;
            }
          } else if (val2 !== null && val1 === null) {
            const newFact = createFact({
              type: 'angle',
              entities: [pair.angle1],
              value: 180 - val2,
              provenance: {
                reason: 'co-interior-angles-parallel',
                premises: [p.id, pair.angle2],
              },
            });
            if (!hasFact(newFact)) {
              knownFacts.push(newFact);
              changed = true;
            }
          }
        }
      }
    }

    // 2. Straight line linear pairs (collinear)
    const lineFacts = knownFacts.filter((f) => f.type === 'collinear');
    for (const line of lineFacts) {
      if (line.angles && line.angles.length === 2) {
        const [a1, a2] = line.angles;
        const v1 = getAngleValue(a1);
        const v2 = getAngleValue(a2);
        if (v1 !== null && v2 === null) {
          const newFact = createFact({
            type: 'angle',
            entities: [a2],
            value: 180 - v1,
            provenance: { reason: 'angles-on-straight-line', premises: [line.id, a1] },
          });
          if (!hasFact(newFact)) {
            knownFacts.push(newFact);
            changed = true;
          }
        } else if (v2 !== null && v1 === null) {
          const newFact = createFact({
            type: 'angle',
            entities: [a1],
            value: 180 - v2,
            provenance: { reason: 'angles-on-straight-line', premises: [line.id, a2] },
          });
          if (!hasFact(newFact)) {
            knownFacts.push(newFact);
            changed = true;
          }
        }
      }
    }

    // 3. Triangle interior angle sum
    const triangleFacts = knownFacts.filter((f) => f.type === 'triangle');
    for (const tri of triangleFacts) {
      if (tri.angles && tri.angles.length === 3) {
        const [a1, a2, a3] = tri.angles;
        const v1 = getAngleValue(a1);
        const v2 = getAngleValue(a2);
        const v3 = getAngleValue(a3);
        const vals = [v1, v2, v3];
        const knownCount = vals.filter((v) => v !== null).length;

        if (knownCount === 2) {
          const missingIdx = vals.findIndex((v) => v === null);
          const knownSum = vals.filter((v) => v !== null).reduce((s, v) => s + v, 0);
          const targetAngle = tri.angles[missingIdx];
          const newFact = createFact({
            type: 'angle',
            entities: [targetAngle],
            value: 180 - knownSum,
            provenance: {
              reason: 'angle-sum-triangle',
              premises: [tri.id, ...tri.angles.filter((_, idx) => idx !== missingIdx)],
            },
          });
          if (!hasFact(newFact)) {
            knownFacts.push(newFact);
            changed = true;
          }
        }
      }

      // Isosceles base angles
      if (tri.equalSides && tri.equalSides.length === 2) {
        const [s1, s2] = tri.equalSides;
        // e.g. AB = AC => base angles B and C are equal
        if (tri.baseAngles && tri.baseAngles.length === 2) {
          const [b1, b2] = tri.baseAngles;
          const vb1 = getAngleValue(b1);
          const vb2 = getAngleValue(b2);
          if (vb1 !== null && vb2 === null) {
            const newFact = createFact({
              type: 'angle',
              entities: [b2],
              value: vb1,
              provenance: { reason: 'base-angles-isosceles', premises: [tri.id, b1] },
            });
            if (!hasFact(newFact)) {
              knownFacts.push(newFact);
              changed = true;
            }
          } else if (vb2 !== null && vb1 === null) {
            const newFact = createFact({
              type: 'angle',
              entities: [b1],
              value: vb2,
              provenance: { reason: 'base-angles-isosceles', premises: [tri.id, b2] },
            });
            if (!hasFact(newFact)) {
              knownFacts.push(newFact);
              changed = true;
            }
          }
        }
      }
    }

    // 4. Converses (deducing parallel lines from equal or supplementary angles)
    const unprovenPairs = knownFacts.filter((f) => f.type === 'angle-pair' && f.parallelLines);
    for (const pair of unprovenPairs) {
      const [l1, l2] = pair.parallelLines;
      if (!areLinesParallel(l1, l2)) {
        const v1 = getAngleValue(pair.angle1);
        const v2 = getAngleValue(pair.angle2);
        if (v1 !== null && v2 !== null) {
          if ((pair.relation === 'alternate' || pair.relation === 'corresponding') && Math.abs(v1 - v2) < 0.05) {
            const reason = pair.relation === 'alternate' ? 'converse-alternate-angles' : 'converse-corresponding-angles';
            const newFact = createFact({
              type: 'parallel',
              entities: [l1, l2],
              provenance: { reason, premises: [pair.angle1, pair.angle2] },
            });
            if (!hasFact(newFact)) {
              knownFacts.push(newFact);
              changed = true;
            }
          } else if (pair.relation === 'co-interior' && Math.abs(v1 + v2 - 180) < 0.05) {
            const newFact = createFact({
              type: 'parallel',
              entities: [l1, l2],
              provenance: { reason: 'converse-co-interior-angles', premises: [pair.angle1, pair.angle2] },
            });
            if (!hasFact(newFact)) {
              knownFacts.push(newFact);
              changed = true;
            }
          }
        }
      }
    }
  }

  return knownFacts;
}

/**
 * Checks whether a proposed target fact is derivable from the givens
 */
export function isDerivable(givens, targetFact) {
  const closure = deriveClosure(givens);
  return closure.some((fact) => matchFact(fact, targetFact));
}

/**
 * Single Validity Authority: Validates an argument chain
 * TRD §4.4:
 * checkChain(chain, givens) -> { valid, failsAtStep, failureType, message }
 * failureType: 'unknown-reason' | 'condition-not-met' | 'conclusion-does-not-follow' | 'circular'
 */
export function checkChain(chain, givens = []) {
  if (!Array.isArray(chain) || chain.length === 0) {
    return {
      valid: false,
      failsAtStep: 0,
      failureType: 'condition-not-met',
      message: 'Chain is empty',
    };
  }

  // Active knowledge pool initialized with givens
  const knownFacts = [...givens];
  const conclusionsSeen = new Set();

  for (let i = 0; i < chain.length; i++) {
    const step = chain[i];
    const { conclusion, reasonKey, premises = [], dependencies = [] } = step;

    // 1. Check known reason key
    if (!REASONS.includes(reasonKey)) {
      return {
        valid: false,
        failsAtStep: i,
        failureType: 'unknown-reason',
        message: `Step ${i + 1}: Reason '${reasonKey}' is not in the rulebook closed list.`,
      };
    }

    // 2. Check circularity (cannot depend on itself or conclusions from current/later steps)
    if (dependencies && dependencies.length > 0) {
      for (const dep of dependencies) {
        if (dep >= i) {
          return {
            valid: false,
            failsAtStep: i,
            failureType: 'circular',
            message: `Step ${i + 1}: Circular dependency detected (depends on step ${dep + 1}).`,
          };
        }
      }
    }

    if (conclusion && conclusionsSeen.has(conclusion.id || `${conclusion.type}:${conclusion.entities?.join('-')}`)) {
      return {
        valid: false,
        failsAtStep: i,
        failureType: 'circular',
        message: `Step ${i + 1}: Circular reasoning (conclusion already assumed or established).`,
      };
    }

    // 3. Condition check: Verify premises hold in known facts
    if (reasonKey === 'corresponding-angles-parallel' ||
        reasonKey === 'alternate-angles-parallel' ||
        reasonKey === 'co-interior-angles-parallel') {
      // Must have parallel lines established
      const hasParallel = knownFacts.some((f) => f.type === 'parallel');
      if (!hasParallel) {
        return {
          valid: false,
          failsAtStep: i,
          failureType: 'condition-not-met',
          message: `Step ${i + 1}: Condition not met! ${REASON_DISPLAY[reasonKey]?.condition || 'Lines must be parallel'}.`,
        };
      }
    }

    if (reasonKey === 'base-angles-isosceles') {
      const hasIsosceles = knownFacts.some(
        (f) => f.type === 'equal-sides' || (f.type === 'triangle' && f.isIsosceles)
      );
      if (!hasIsosceles) {
        return {
          valid: false,
          failsAtStep: i,
          failureType: 'condition-not-met',
          message: `Step ${i + 1}: Condition not met! Triangle is not marked or known to be isosceles.`,
        };
      }
    }

    if (reasonKey === 'angles-on-straight-line') {
      const hasStraight = knownFacts.some((f) => f.type === 'collinear');
      if (!hasStraight && !givens.some(g => g.type === 'collinear')) {
        return {
          valid: false,
          failsAtStep: i,
          failureType: 'condition-not-met',
          message: `Step ${i + 1}: Condition not met! Points must be collinear on a straight line.`,
        };
      }
    }

    // Check specific required premises passed in step
    for (const reqPremise of premises) {
      const found = knownFacts.some((f) => matchFact(f, reqPremise));
      if (!found) {
        return {
          valid: false,
          failsAtStep: i,
          failureType: 'condition-not-met',
          message: `Step ${i + 1}: Premise '${reqPremise.type || reqPremise.id}' has not been established yet.`,
        };
      }
    }

    // 4. Conclusion check: Does the value or statement actually follow?
    if (conclusion && conclusion.value !== undefined && conclusion.value !== null) {
      if (step.expectedValue !== undefined && Math.abs(conclusion.value - step.expectedValue) > 0.1) {
        return {
          valid: false,
          failsAtStep: i,
          failureType: 'conclusion-does-not-follow',
          message: `Step ${i + 1}: Calculated value ${conclusion.value}° does not match expected result ${step.expectedValue}°.`,
        };
      }

      // Specific rule mathematics checks
      if (reasonKey === 'co-interior-angles-parallel') {
        const givenAngleVal = premises[0]?.value;
        if (givenAngleVal !== undefined) {
          const expected = 180 - givenAngleVal;
          if (Math.abs(conclusion.value - expected) > 0.05) {
            return {
              valid: false,
              failsAtStep: i,
              failureType: 'conclusion-does-not-follow',
              message: `Step ${i + 1}: Co-interior angles sum to 180°, so the angle must be 180° - ${givenAngleVal}° = ${expected}°, not ${conclusion.value}°.`,
            };
          }
        }
      }
    }

    // Step passed! Add its conclusion to known facts
    if (conclusion) {
      knownFacts.push({ ...conclusion, provenance: { reason: reasonKey, premises } });
      conclusionsSeen.add(conclusion.id || `${conclusion.type}:${conclusion.entities?.join('-')}`);
    }
  }

  return {
    valid: true,
    failsAtStep: -1,
    failureType: null,
    message: 'Chain is valid and verified by rulebook.',
  };
}

/**
 * Computes whether a proposed ordering of steps is valid.
 * Respects topological dependencies: every premise needed by step K must be supplied by a step preceding K.
 */
export function validOrderings(chain, givens = []) {
  // Check the proposed chain directly
  const res = checkChain(chain, givens);
  return res.valid;
}
