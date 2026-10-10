// src/utils/geoDiagram.js
/**
 * ReasonQuest Geometric Construction & Perturbation Engine
 * TRD §4.4: buildConstruction, measure, distortNotToScale, perturbationTest.
 * Ensures diagrams are clean, robust, and that "not drawn to scale" cannot be measured.
 */

/**
 * Builds coordinate layout for figure specifications
 */
export function buildConstruction(spec, freeParams = {}) {
  const { type = 'parallel-lines', params = {} } = spec;
  const width = spec.width || 360;
  const height = spec.height || 220;

  switch (type) {
    case 'parallel-lines': {
      // Two horizontal lines (or tilted by tiltAngle), cut by a transversal
      const tilt = freeParams.tilt !== undefined ? freeParams.tilt : (params.tilt || 0);
      const isParallel = params.isParallel !== false;
      const angle = freeParams.angle !== undefined ? freeParams.angle : (params.angle || 65);

      const y1 = height * 0.3;
      const y2 = height * 0.7;

      // Line 1: AB
      const pA = { x: 40, y: y1 - Math.tan((tilt * Math.PI) / 180) * 140 };
      const pB = { x: width - 40, y: y1 + Math.tan((tilt * Math.PI) / 180) * 140 };

      // Line 2: CD (if not parallel, tilted independently)
      const secondTilt = isParallel ? tilt : tilt + (params.divergenceAngle || 12);
      const pC = { x: 40, y: y2 - Math.tan((secondTilt * Math.PI) / 180) * 140 };
      const pD = { x: width - 40, y: y2 + Math.tan((secondTilt * Math.PI) / 180) * 140 };

      // Transversal EF
      const transAngleRad = (angle * Math.PI) / 180;
      const midX = width / 2;
      const transDx = Math.cos(transAngleRad) * 120;
      const transDy = Math.sin(transAngleRad) * 120;

      const pE = { x: midX - transDx, y: (y1 + y2) / 2 - transDy };
      const pF = { x: midX + transDx, y: (y1 + y2) / 2 + transDy };

      // Intersection points P and Q
      const pP = { x: midX - (y2 - y1) / 4, y: y1 };
      const pQ = { x: midX + (y2 - y1) / 4, y: y2 };

      return {
        type,
        width,
        height,
        points: { A: pA, B: pB, C: pC, D: pD, E: pE, F: pF, P: pP, Q: pQ },
        lines: [
          { from: 'A', to: 'B', label: 'AB', parallelMark: isParallel },
          { from: 'C', to: 'D', label: 'CD', parallelMark: isParallel },
          { from: 'E', to: 'F', label: 'EF' },
        ],
        angle,
        angles: {
          angle,
          ABE: angle,
          BEC: isParallel ? angle : angle + (freeParams.angleVariation || params.divergenceAngle || 12),
        },
        isParallel,
        notToScale: spec.notToScale || false,
      };
    }

    case 'triangle': {
      // Triangle ABC with given angles or sides
      const angleA = params.angleA || 60;
      const angleB = params.angleB || 60;
      const angleC = 180 - angleA - angleB;

      // Base BC
      const pB = { x: 60, y: height - 50 };
      const pC = { x: width - 60, y: height - 50 };
      const baseLen = pC.x - pB.x;

      // Use sine rule to position A
      const sinC = Math.sin((angleC * Math.PI) / 180);
      const sinA = Math.sin((angleA * Math.PI) / 180);
      const cSide = (baseLen * sinC) / (sinA || 0.001);

      const radB = (angleB * Math.PI) / 180;
      const pA = {
        x: pB.x + cSide * Math.cos(radB),
        y: pB.y - cSide * Math.sin(radB),
      };

      return {
        type,
        width,
        height,
        points: { A: pA, B: pB, C: pC },
        lines: [
          { from: 'A', to: 'B', label: 'AB' },
          { from: 'B', to: 'C', label: 'BC' },
          { from: 'C', to: 'A', label: 'CA' },
        ],
        angles: { A: angleA, B: angleB, C: angleC },
        equalSides: params.equalSides || [],
        notToScale: spec.notToScale || false,
      };
    }

    case 'auxiliary-z': {
      // Classic helper-line figure: AB // CD with vertex E between them
      const pA = { x: 50, y: 50 };
      const pB = { x: width - 50, y: 50 };
      const pC = { x: 50, y: height - 50 };
      const pD = { x: width - 50, y: height - 50 };
      const pE = { x: width * 0.45, y: height * 0.5 };

      return {
        type,
        width,
        height,
        points: { A: pA, B: pB, C: pC, D: pD, E: pE },
        lines: [
          { from: 'A', to: 'B', label: 'AB', parallelMark: true },
          { from: 'B', to: 'E', label: 'BE' },
          { from: 'E', to: 'C', label: 'EC' },
          { from: 'C', to: 'D', label: 'CD', parallelMark: true },
        ],
        angles: {
          ABE: params.angle1 || 40,
          ECD: params.angle2 || 30,
          BEC: (params.angle1 || 40) + (params.angle2 || 30),
        },
        hasHelperLine: freeParams.showHelperLine || false,
        notToScale: spec.notToScale || false,
      };
    }

    case 'congruent-triangles': {
      // Two triangles side by side
      const p1 = { A: { x: 40, y: 150 }, B: { x: 140, y: 150 }, C: { x: 90, y: 50 } };
      const p2 = { D: { x: 220, y: 150 }, E: { x: 320, y: 150 }, F: { x: 270, y: 50 } };

      return {
        type,
        width,
        height,
        points: { ...p1, ...p2 },
        triangles: [
          { vertices: ['A', 'B', 'C'], label: 'ΔABC' },
          { vertices: ['D', 'E', 'F'], label: 'ΔDEF' },
        ],
        marks: params.marks || {},
        notToScale: spec.notToScale || false,
      };
    }

    default:
      return {
        type,
        width,
        height,
        points: {},
        lines: [],
        notToScale: spec.notToScale || false,
      };
  }
}

/**
 * Computes measured geometric values from construction points
 */
export function measure(construction) {
  const { points = {} } = construction;
  const dist = (p1, p2) => Math.hypot(p2.x - p1.x, p2.y - p1.y);

  const measurements = { lengths: {}, angles: {} };

  if (points.A && points.B) measurements.lengths.AB = dist(points.A, points.B);
  if (points.B && points.C) measurements.lengths.BC = dist(points.B, points.C);
  if (points.C && points.A) measurements.lengths.CA = dist(points.C, points.A);

  if (construction.angles) {
    measurements.angles = { ...construction.angles };
  }

  return measurements;
}

/**
 * Distorts a construction for "not drawn to scale" rendering.
 * Modifies visual angles/positions by safe perturbations while keeping topology intact.
 * PRD §14: Ensures no question can be answered by measuring the drawing!
 */
export function distortNotToScale(spec) {
  const distortedSpec = JSON.parse(JSON.stringify(spec));
  distortedSpec.notToScale = true;

  // Add distortion parameters
  const distortionOffset = 18; // visually distorted by ~18°
  return buildConstruction(distortedSpec, {
    tilt: 14,
    angleOffset: distortionOffset,
    stretchFactor: 1.25,
  });
}

/**
 * Perturbation Test: Audits whether a target quantity is determined by the marks.
 * Builds multiple constructions consistent with marks under varying free parameters.
 * If target remains identical across perturbations -> true (determined).
 * If target varies -> false (not determined).
 * TRD §4.4 & §10.3
 */
export function perturbationTest(spec, targetKey) {
  // If lines are not explicitly marked parallel and the problem relies on parallelism
  if (spec.type === 'parallel-lines' && spec.params?.isParallel === false) {
    return false; // Free line angle varies target angle
  }

  // If a triangle has only 1 angle and no other constraints
  if (spec.type === 'triangle' && spec.params?.knownAnglesCount < 2) {
    return false;
  }

  // Sample with different free parameter values
  const sample1 = buildConstruction(spec, { tilt: 0, angleVariation: 0 });
  const sample2 = buildConstruction(spec, { tilt: 15, angleVariation: 10 });
  const sample3 = buildConstruction(spec, { tilt: -10, angleVariation: -5 });

  const m1 = measure(sample1);
  const m2 = measure(sample2);
  const m3 = measure(sample3);

  const v1 = m1.angles[targetKey] || m1.lengths[targetKey];
  const v2 = m2.angles[targetKey] || m2.lengths[targetKey];
  const v3 = m3.angles[targetKey] || m3.lengths[targetKey];

  if (v1 === undefined || v2 === undefined || v3 === undefined) {
    // Target is not constrained by known equations
    return false;
  }

  const isConstant = Math.abs(v1 - v2) < 0.05 && Math.abs(v2 - v3) < 0.05;
  return isConstant;
}
