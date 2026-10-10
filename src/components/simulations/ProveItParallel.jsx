// src/components/simulations/ProveItParallel.jsx
import React, { useState } from 'react';
import './Stations.css';

/**
 * Station B: Prove It Parallel (Build-to-Target Challenge)
 * TRD §6:
 * Claim: "AB is parallel to CD"
 * Adjust marked angle (keyboard +/- steppers).
 * Live indicator shows "claim established" via converse rule only when condition met.
 * Completion gate: Claim established on at least two different cases.
 */
export default function ProveItParallel({ onComplete }) {
  const CASES = [
    {
      id: 0,
      relation: 'alternate',
      name: 'Case 1: Alternate Angles (Z-Shape)',
      givenAngle: 68,
      prompt: 'Given angle ∠1 = 68°. Adjust angle ∠2 until the converse of alternate angles proves AB ∥ CD.',
      targetAngle: 68,
      converseReason: 'Converse of alternate angles: If alternate angles are equal, then lines are parallel.',
    },
    {
      id: 1,
      relation: 'co-interior',
      name: 'Case 2: Co-Interior Angles (C-Shape)',
      givenAngle: 115,
      prompt: 'Given angle ∠1 = 115°. Adjust interior angle ∠2 until the converse of co-interior angles proves AB ∥ CD.',
      targetAngle: 65, // 180 - 115 = 65
      converseReason: 'Converse of co-interior angles: If co-interior angles sum to 180°, then lines are parallel.',
    },
  ];

  const [currentCaseIdx, setCurrentCaseIdx] = useState(0);
  const [adjustedAngle, setAdjustedAngle] = useState(50);
  const [casesSolved, setCasesSolved] = useState(new Set());

  const currentCase = CASES[currentCaseIdx];
  const isEstablished = Math.abs(adjustedAngle - currentCase.targetAngle) === 0;

  function stepAngle(delta) {
    setAdjustedAngle((prev) => Math.min(150, Math.max(30, prev + delta)));
  }

  function handleClaimLock() {
    if (isEstablished) {
      const updated = new Set(casesSolved);
      updated.add(currentCaseIdx);
      setCasesSolved(updated);

      if (updated.size >= 2) {
        // Ready to complete
      } else {
        // Move to next case
        setCurrentCaseIdx(1);
        setAdjustedAngle(50);
      }
    }
  }

  return (
    <div className="station-wrap">
      <div className="station-header">
        <h3 className="station-title">
          <span className="station-icon">🎯</span> Station B: Prove It Parallel
        </h3>
        <p className="station-desc">
          The court claim is: <strong>AB is parallel to CD</strong>. Adjust the marked angle until the evidence satisfies a converse rule from the rulebook!
        </p>
      </div>

      <div className="station-grid">
        {/* Left: Workbench with adjustable angle */}
        <div className="station-workbench glass-card">
          <div className="rv-badge-row">
            <span className="rv-evidence-badge">{currentCase.name}</span>
            <span className={`station-status-pill ${isEstablished ? 'status-valid' : 'status-invalid'}`}>
              {isEstablished ? 'CLAIM ESTABLISHED ✓ (Converse Satisfied)' : 'CLAIM NOT ESTABLISHED ✗'}
            </span>
          </div>

          <p className="station-case-prompt">{currentCase.prompt}</p>

          <div className="station-canvas-container">
            <svg viewBox="0 0 380 200" className="station-svg">
              {/* Lines AB and CD */}
              <line x1="30" y1="50" x2="350" y2="50" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
              <text x="18" y="55" fill="#f8fafc" fontSize="13" fontWeight="bold">A</text>
              <text x="356" y="55" fill="#f8fafc" fontSize="13" fontWeight="bold">B</text>

              <line x1="30" y1="150" x2="350" y2="150" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
              <text x="18" y="155" fill="#f8fafc" fontSize="13" fontWeight="bold">C</text>
              <text x="356" y="155" fill="#f8fafc" fontSize="13" fontWeight="bold">D</text>

              {/* Transversal */}
              <line x1="80" y1="20" x2="280" y2="180" stroke="#38bdf8" strokeWidth="2.5" />

              {/* Given Angle */}
              <circle cx="120" cy="50" r="4" fill="#fbbf24" />
              <text x="95" y="42" fill="#fbbf24" fontSize="14" fontWeight="bold">∠1 = {currentCase.givenAngle}°</text>

              {/* Adjustable Angle */}
              <circle cx="240" cy="150" r="4" fill={isEstablished ? '#22c55e' : '#f59e0b'} />
              <text x="215" y="175" fill={isEstablished ? '#22c55e' : '#f59e0b'} fontSize="14" fontWeight="bold">
                ∠2 = {adjustedAngle}°
              </text>
            </svg>
          </div>

          {/* Stepper Controls */}
          <div className="station-controls-bar">
            <div className="control-group">
              <label className="control-label" htmlFor="angle-stepper">Adjust Angle ∠2: {adjustedAngle}°</label>
              <div className="stepper-row">
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => stepAngle(-5)}
                  aria-label="Decrease angle by 5 degrees"
                >
                  −5°
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => stepAngle(-1)}
                  aria-label="Decrease angle by 1 degree"
                >
                  −1°
                </button>
                <span className="stepper-current-val">{adjustedAngle}°</span>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => stepAngle(1)}
                  aria-label="Increase angle by 1 degree"
                >
                  +1°
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => stepAngle(5)}
                  aria-label="Increase angle by 5 degrees"
                >
                  +5°
                </button>
              </div>
            </div>

            <button
              type="button"
              className={`btn ${isEstablished ? 'btn-primary' : 'btn-outline'}`}
              onClick={handleClaimLock}
              disabled={!isEstablished}
            >
              {casesSolved.has(currentCaseIdx) ? 'Case Proven ✓' : 'Submit Case Evidence 🔨'}
            </button>
          </div>
        </div>

        {/* Right: Court Ruling Panel */}
        <div className="station-sidebar glass-card">
          <h4 className="sidebar-title">📜 Docket Evidence Log</h4>
          <div className="docket-status-list">
            <div className={`docket-entry ${casesSolved.has(0) ? 'done' : ''}`}>
              <span className="docket-icon">{casesSolved.has(0) ? '✅' : '⏳'}</span>
              <div>
                <strong>Case 1: Alternate Converse</strong>
                <p>Target: ∠2 = 68° (equal alternate angles)</p>
              </div>
            </div>

            <div className={`docket-entry ${casesSolved.has(1) ? 'done' : ''}`}>
              <span className="docket-icon">{casesSolved.has(1) ? '✅' : '⏳'}</span>
              <div>
                <strong>Case 2: Co-Interior Converse</strong>
                <p>Target: ∠2 = 65° (sum = 180°)</p>
              </div>
            </div>
          </div>

          <div className="rulebook-explainer">
            <h5 className="explainer-heading">Converse Rule:</h5>
            <p className="explainer-body">{currentCase.converseReason}</p>
          </div>

          {casesSolved.size >= 2 && (
            <div className="station-success anim-slide-up">
              <div className="success-icon">⚖️</div>
              <h4 className="success-title">Both Cases Proven Parallel!</h4>
              <p className="success-desc">
                You successfully applied the true geometric converses to rule that lines are parallel!
              </p>
              <button
                type="button"
                className="btn btn-primary btn-lg"
                onClick={onComplete}
              >
                Complete Station ✓
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
