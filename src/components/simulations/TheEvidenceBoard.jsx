// src/components/simulations/TheEvidenceBoard.jsx
import React, { useState } from 'react';
import './Stations.css';

/**
 * Station A: The Evidence Board (Concept Discovery Lab)
 * TRD §6:
 * Rotates transversal; tilts one line (parallel ↔ not parallel).
 * Live values for alternate, corresponding, and co-interior pairs.
 * Live rulebook status shows which facts hold and which break.
 * Confirmation question completes the station.
 */
export default function TheEvidenceBoard({ onComplete, audioEnabled }) {
  const [transAngle, setTransAngle] = useState(60);
  const [isParallel, setIsParallel] = useState(true);
  const [tiltDivergence, setTiltDivergence] = useState(0);
  const [activePairType, setActivePairType] = useState('alternate'); // 'alternate' | 'corresponding' | 'co-interior'
  const [hasExploredNonParallel, setHasExploredNonParallel] = useState(false);
  const [confirmationAnswered, setConfirmationAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Live angle calculations
  const angle1 = transAngle;
  // If not parallel, second line is tilted by tiltDivergence (default 15° when non-parallel)
  const divergence = isParallel ? 0 : (tiltDivergence || 15);
  const angle2 = isParallel ? transAngle : transAngle + divergence;
  const coInteriorSum = angle1 + (180 - angle2);

  function toggleParallel(val) {
    setIsParallel(val);
    if (!val) {
      setHasExploredNonParallel(true);
      if (tiltDivergence === 0) setTiltDivergence(15);
    }
  }

  function handleAnswer(idx) {
    setSelectedAnswer(idx);
    if (idx === 0) {
      setConfirmationAnswered(true);
    }
  }

  return (
    <div className="station-wrap">
      <div className="station-header">
        <h3 className="station-title">
          <span className="station-icon">📋</span> Station A: The Evidence Board
        </h3>
        <p className="station-desc">
          Rotate the transversal and test whether the line rails are parallel. Observe which rulebook facts hold and which break the moment lines are not parallel!
        </p>
      </div>

      {/* Main interactive area */}
      <div className="station-grid">
        {/* Left: SVG Geometric Workbench */}
        <div className="station-workbench glass-card">
          <div className="rv-badge-row">
            <span className={`station-status-pill ${isParallel ? 'status-valid' : 'status-invalid'}`}>
              {isParallel ? 'AB ∥ CD (Lines Parallel ✓)' : 'Lines NOT Parallel ✗ (Tilted)'}
            </span>
            <span className="rv-pair-letter-badge">
              {activePairType === 'alternate' ? 'Z-Shape (Alternate)' : activePairType === 'corresponding' ? 'F-Shape (Corresponding)' : 'C-Shape (Co-interior)'}
            </span>
          </div>

          <div className="station-canvas-container">
            <svg viewBox="0 0 380 220" className="station-svg">
              <defs>
                <marker id="gold-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1 L 7 5 L 0 9" fill="none" stroke="#ffb300" strokeWidth="2" strokeLinecap="round" />
                </marker>
              </defs>

              {/* Line 1: AB (always horizontal at y=60) */}
              <line x1="30" y1="60" x2="350" y2="60" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
              <text x="18" y="65" fill="#f8fafc" fontSize="13" fontWeight="bold">A</text>
              <text x="356" y="65" fill="#f8fafc" fontSize="13" fontWeight="bold">B</text>
              {isParallel && (
                <path d="M 185 56 L 195 60 L 185 64" fill="none" stroke="#ffb300" strokeWidth="2.5" />
              )}

              {/* Line 2: CD (tilted if non-parallel) */}
              {(() => {
                const yC = 160 - Math.tan((divergence * Math.PI) / 180) * 80;
                const yD = 160 + Math.tan((divergence * Math.PI) / 180) * 80;
                return (
                  <>
                    <line x1="30" y1={yC} x2="350" y2={yD} stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
                    <text x="18" y={yC + 5} fill="#f8fafc" fontSize="13" fontWeight="bold">C</text>
                    <text x="356" y={yD + 5} fill="#f8fafc" fontSize="13" fontWeight="bold">D</text>
                    {isParallel && (
                      <path d="M 185 156 L 195 160 L 185 164" fill="none" stroke="#ffb300" strokeWidth="2.5" />
                    )}
                  </>
                );
              })()}

              {/* Transversal EF cutting through */}
              {(() => {
                const rad = (transAngle * Math.PI) / 180;
                const cx = 190;
                const cy = 110;
                const dx = Math.cos(rad) * 110;
                const dy = Math.sin(rad) * 110;
                return (
                  <>
                    <line x1={cx - dx} y1={cy - dy} x2={cx + dx} y2={cy + dy} stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
                    <text x={cx - dx - 10} y={cy - dy} fill="#38bdf8" fontSize="13" fontWeight="bold">E</text>
                    <text x={cx + dx + 5} y={cy + dy + 15} fill="#38bdf8" fontSize="13" fontWeight="bold">F</text>
                  </>
                );
              })()}

              {/* Angle Arc 1 at top intersection */}
              <circle cx="190" cy="60" r="4" fill="#fbbf24" />
              <text x="145" y="55" fill="#fbbf24" fontSize="14" fontWeight="bold">∠1 = {angle1}°</text>

              {/* Angle Arc 2 at bottom intersection */}
              <circle cx="190" cy="160" r="4" fill={isParallel ? '#22c55e' : '#ef4444'} />
              <text x="215" y="175" fill={isParallel ? '#22c55e' : '#ef4444'} fontSize="14" fontWeight="bold">
                ∠2 = {angle2}°
              </text>
            </svg>
          </div>

          {/* Workbench Controls */}
          <div className="station-controls-bar">
            <div className="control-group">
              <label className="control-label" htmlFor="trans-slider">Transversal Angle: {transAngle}°</label>
              <div className="stepper-row">
                <button
                  type="button"
                  className="btn btn-outline btn-xs"
                  onClick={() => setTransAngle((a) => Math.max(30, a - 5))}
                  aria-label="Decrease transversal angle"
                >
                  −
                </button>
                <input
                  id="trans-slider"
                  type="range"
                  min="30"
                  max="85"
                  value={transAngle}
                  onChange={(e) => setTransAngle(Number(e.target.value))}
                  className="control-slider"
                />
                <button
                  type="button"
                  className="btn btn-outline btn-xs"
                  onClick={() => setTransAngle((a) => Math.min(85, a + 5))}
                  aria-label="Increase transversal angle"
                >
                  +
                </button>
              </div>
            </div>

            <div className="control-group">
              <label className="control-label">Rail Parallelism</label>
              <div className="btn-toggle-group">
                <button
                  type="button"
                  className={`btn-toggle ${isParallel ? 'active' : ''}`}
                  onClick={() => toggleParallel(true)}
                >
                  Parallel (∥)
                </button>
                <button
                  type="button"
                  className={`btn-toggle ${!isParallel ? 'active' : ''}`}
                  onClick={() => toggleParallel(false)}
                >
                  Tilt Rail (Not ∥)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Live Rulebook Status Panel */}
        <div className="station-sidebar glass-card">
          <h4 className="sidebar-title">📖 Court Rulebook Check</h4>
          <p className="sidebar-subtitle">Facts hold ONLY IF condition is satisfied:</p>

          <div className={`rule-cards-stack ${hasExploredNonParallel && !confirmationAnswered ? 'has-confirmation' : ''}`}>
            {/* Alternate Angles */}
            <div className={`rule-card ${isParallel ? 'rule-active' : 'rule-broken'}`}>
              <div className="rule-card-header">
                <span className="rule-name">Alternate Angles (Z-Shape)</span>
                <span className="rule-status-badge">{isParallel ? 'HOLDS ✓' : 'BROKEN ✗'}</span>
              </div>
              <p className="rule-detail">
                ∠1 = {angle1}°, ∠2 = {angle2}° → {isParallel ? 'Equal (Both ' + angle1 + '°)' : `Not equal (${angle1}° ≠ ${angle2}°)`}
              </p>
              {!isParallel && <span className="rule-error-msg">⚠️ Condition violated: Rails are not parallel!</span>}
            </div>

            {/* Corresponding Angles */}
            <div className={`rule-card ${isParallel ? 'rule-active' : 'rule-broken'}`}>
              <div className="rule-card-header">
                <span className="rule-name">Corresponding Angles (F-Shape)</span>
                <span className="rule-status-badge">{isParallel ? 'HOLDS ✓' : 'BROKEN ✗'}</span>
              </div>
              <p className="rule-detail">
                Matching positions → {isParallel ? 'Equal (Both ' + angle1 + '°)' : 'Unequal'}
              </p>
            </div>

            {/* Co-interior Angles */}
            <div className={`rule-card ${isParallel ? 'rule-active' : 'rule-broken'}`}>
              <div className="rule-card-header">
                <span className="rule-name">Co-interior Angles (C-Shape)</span>
                <span className="rule-status-badge">{isParallel ? 'HOLDS ✓' : 'BROKEN ✗'}</span>
              </div>
              <p className="rule-detail">
                Interior sum → {isParallel ? '180° (Supplementary)' : `${coInteriorSum}° (≠ 180°)`}
              </p>
            </div>
          </div>

          {/* Archetype gate: Prompt confirmation question */}
          {hasExploredNonParallel && !confirmationAnswered && (
            <div className="confirmation-card anim-slide-up">
              <h5 className="confirmation-title">⚖️ Judge Tally's Bench Question:</h5>
              <p className="confirmation-q">
                Why did the alternate-angles fact stop working the moment you tilted the line?
              </p>
              <div className="confirmation-options">
                {[
                  'Because the lines are no longer parallel, violating the rulebook condition',
                  'Because the transversal line became too short to reach',
                  'Because alternate angles are never supposed to be equal in geometry',
                ].map((opt, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`confirmation-opt-btn ${selectedAnswer === i ? (i === 0 ? 'opt-correct' : 'opt-wrong') : ''}`}
                    onClick={() => handleAnswer(i)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {confirmationAnswered && (
            <div className="station-success anim-slide-up">
              <div className="success-icon">🏆</div>
              <h4 className="success-title">Rulebook Condition Mastered!</h4>
              <p className="success-desc">
                You proved that geometric facts cannot be used without their condition!
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
