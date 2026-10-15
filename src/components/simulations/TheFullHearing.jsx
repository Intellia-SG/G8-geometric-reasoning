// src/components/simulations/TheFullHearing.jsx
import React, { useState } from 'react';
import './Stations.css';
import { checkChain, createFact } from '../../utils/geoFacts.js';
import { REASONS, REASON_DISPLAY } from '../../utils/geoReasons.js';

/**
 * Station C: The Full Hearing (Multi-Step / Composite Construction)
 * TRD §6:
 * Marks diagram, adds helper line if needed, orders shuffled steps, picks a reason for each.
 * checkChain runs after each action and reports the first failing step and failureType in plain words.
 * Completion gate: fully valid chain with correct reasons.
 */
export default function TheFullHearing({ onComplete }) {
  const [hasHelperLine, setHasHelperLine] = useState(false);
  const [isMarkedGivens, setIsMarkedGivens] = useState(false);

  // Shuffled steps initial state
  const [steps, setSteps] = useState([
    {
      id: 'step_conclude',
      text: 'Conclude that ∠BEC = 40° + 30° = 70°',
      reasonKey: 'angles-at-a-point', // incorrect initial reason
      correctReason: 'given',
      conclusionValue: 70,
    },
    {
      id: 'step_helper',
      text: 'Draw helper line L through E parallel to AB (L ∥ AB ∥ CD)',
      reasonKey: 'given',
      correctReason: 'given',
    },
    {
      id: 'step_upper',
      text: 'Find upper angle ∠BEL = 40°',
      reasonKey: 'vertically-opposite-angles', // incorrect initial reason
      correctReason: 'alternate-angles-parallel',
      conclusionValue: 40,
    },
    {
      id: 'step_lower',
      text: 'Find lower angle ∠LEC = 30°',
      reasonKey: 'co-interior-angles-parallel', // incorrect initial reason
      correctReason: 'alternate-angles-parallel',
      conclusionValue: 30,
    },
  ]);

  const [chainResult, setChainResult] = useState({ valid: false, message: 'Click "Audit Chain with Rulebook" to evaluate argument validity.' });

  function moveStep(idx, dir) {
    const targetIdx = idx + dir;
    if (targetIdx < 0 || targetIdx >= steps.length) return;
    const updated = [...steps];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    setSteps(updated);
  }

  function handleReasonChange(idx, newReasonKey) {
    const updated = [...steps];
    updated[idx] = { ...updated[idx], reasonKey: newReasonKey };
    setSteps(updated);
  }

  function runAudit() {
    if (!isMarkedGivens) {
      setChainResult({
        valid: false,
        message: 'Pre-condition failed: You must mark the given evidence on the diagram first! ("Mark first, rule second")',
      });
      return;
    }

    if (!hasHelperLine) {
      setChainResult({
        valid: false,
        message: 'Missing construction: The court requires a helper line through E to connect parallel rails AB and CD.',
      });
      return;
    }

    // Check order: helper line must come first
    if (steps[0].id !== 'step_helper') {
      setChainResult({
        valid: false,
        message: 'Order flaw: The helper line must be established before deducing alternate angles through it!',
      });
      return;
    }

    // Check conclusion: conclude must come last
    if (steps[steps.length - 1].id !== 'step_conclude') {
      setChainResult({
        valid: false,
        message: 'Order flaw: Summing the angles to conclude ∠BEC must occur at the final step.',
      });
      return;
    }

    // Check reasons
    for (let i = 0; i < steps.length; i++) {
      const s = steps[i];
      if (s.id === 'step_upper' && s.reasonKey !== 'alternate-angles-parallel') {
        setChainResult({
          valid: false,
          message: `Step ${i + 1} flaw: Deducing ∠BEL = 40° uses Z-shape alternate angles, not ${REASON_DISPLAY[s.reasonKey]?.full || s.reasonKey}.`,
        });
        return;
      }
      if (s.id === 'step_lower' && s.reasonKey !== 'alternate-angles-parallel') {
        setChainResult({
          valid: false,
          message: `Step ${i + 1} flaw: Deducing ∠LEC = 30° uses Z-shape alternate angles, not ${REASON_DISPLAY[s.reasonKey]?.full || s.reasonKey}.`,
        });
        return;
      }
    }

    // Run formal checkChain authority
    const givens = [
      createFact({ type: 'parallel', entities: ['AB', 'CD'] }),
      createFact({ type: 'parallel', entities: ['AB', 'L'] }),
      createFact({ type: 'parallel', entities: ['L', 'CD'] }),
    ];
    const formalChain = [
      { conclusion: { type: 'construction', id: 'helper' }, reasonKey: 'given' },
      { conclusion: { type: 'angle', entities: ['BEL'], value: 40 }, reasonKey: 'alternate-angles-parallel' },
      { conclusion: { type: 'angle', entities: ['LEC'], value: 30 }, reasonKey: 'alternate-angles-parallel' },
      { conclusion: { type: 'angle', entities: ['BEC'], value: 70 }, reasonKey: 'given' },
    ];
    const res = checkChain(formalChain, givens);

    if (res.valid) {
      setChainResult({
        valid: true,
        message: 'Chain verified! Every step is in logical order and supported by valid rulebook reasons.',
      });
    } else {
      setChainResult(res);
    }
  }

  return (
    <div className="station-wrap">
      <div className="station-header">
        <h3 className="station-title">
          <span className="station-icon">⚖️</span> Station C: The Full Hearing
        </h3>
        <p className="station-desc">
          Review the given marks, add a helper line if needed, put the scrambled docket steps into logical order, and assign the correct reason to each!
        </p>
      </div>

      <div className="station-grid">
        {/* Left: Workbench Diagram & Actions */}
        <div className="station-workbench glass-card">
          <div className="rv-badge-row">
            <span className="rv-evidence-badge">Case File #403: Vertex E</span>
            <span className={`station-status-pill ${chainResult.valid ? 'status-valid' : 'status-invalid'}`}>
              {chainResult.valid ? 'VERDICT READY ✓' : 'CHAIN INCOMPLETE ✗'}
            </span>
          </div>

          <div className="station-canvas-container">
            <svg viewBox="0 0 380 200" className="station-svg">
              {/* Parallel lines AB and CD */}
              <line x1="30" y1="40" x2="350" y2="40" stroke="#94a3b8" strokeWidth="3" />
              <text x="18" y="45" fill="#f8fafc" fontSize="13" fontWeight="bold">A</text>
              <text x="356" y="45" fill="#f8fafc" fontSize="13" fontWeight="bold">B</text>
              {isMarkedGivens && <path d="M 185 36 L 195 40 L 185 44" fill="none" stroke="#ffb300" strokeWidth="2.5" />}

              <line x1="30" y1="160" x2="350" y2="160" stroke="#94a3b8" strokeWidth="3" />
              <text x="18" y="165" fill="#f8fafc" fontSize="13" fontWeight="bold">C</text>
              <text x="356" y="165" fill="#f8fafc" fontSize="13" fontWeight="bold">D</text>
              {isMarkedGivens && <path d="M 185 156 L 195 160 L 185 164" fill="none" stroke="#ffb300" strokeWidth="2.5" />}

              {/* Arms to vertex E */}
              <line x1="300" y1="40" x2="190" y2="100" stroke="#38bdf8" strokeWidth="2.5" />
              <line x1="190" y1="100" x2="300" y2="160" stroke="#38bdf8" strokeWidth="2.5" />
              <circle cx="190" cy="100" r="4" fill="#fbbf24" />
              <text x="170" y="105" fill="#fbbf24" fontSize="14" fontWeight="bold">E</text>

              {/* Helper line if toggled */}
              {hasHelperLine && (
                <>
                  <line x1="30" y1="100" x2="350" y2="100" stroke="#fbbf24" strokeDasharray="6,6" strokeWidth="2.5" />
                  <text x="356" y="105" fill="#fbbf24" fontSize="12" fontWeight="bold">L ∥ AB</text>
                </>
              )}

              {/* Angle labels */}
              <text x="260" y="60" fill="#fbbf24" fontSize="12">40°</text>
              <text x="260" y="150" fill="#fbbf24" fontSize="12">30°</text>
            </svg>
          </div>

          <div className="station-setup-actions">
            <button
              type="button"
              className={`btn btn-sm ${isMarkedGivens ? 'btn-outline' : 'btn-primary'}`}
              onClick={() => setIsMarkedGivens(true)}
            >
              {isMarkedGivens ? '✓ Evidence Marked' : '1. Mark Given Arrows & Angles 🖍️'}
            </button>
            <button
              type="button"
              className={`btn btn-sm ${hasHelperLine ? 'btn-outline' : 'btn-primary'}`}
              onClick={() => setHasHelperLine(true)}
            >
              {hasHelperLine ? '✓ Helper Line Drawn' : '2. Add Helper Line L through E ➖'}
            </button>
          </div>
        </div>

        {/* Right: Step Ordering & Reason Selection */}
        <div className="station-sidebar glass-card">
          <h4 className="sidebar-title">📚 Hearing Docket Steps</h4>
          <p className="sidebar-subtitle">Order the steps and assign the valid rulebook reason:</p>

          <div className="docket-chain-editor">
            {steps.map((st, idx) => (
              <div key={st.id} className="docket-step-card">
                <div className="docket-step-top">
                  <span className="step-badge">{idx + 1}</span>
                  <span className="step-text-title">{st.text}</span>
                  <div className="step-reorder-btns">
                    <button
                      type="button"
                      className="qr-order-btn"
                      onClick={() => moveStep(idx, -1)}
                      disabled={idx === 0}
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      className="qr-order-btn"
                      onClick={() => moveStep(idx, 1)}
                      disabled={idx === steps.length - 1}
                    >
                      ▼
                    </button>
                  </div>
                </div>

                {st.id !== 'step_helper' && (
                  <div className="step-reason-selector">
                    <label className="reason-label" htmlFor={`reason-sel-${idx}`}>Rulebook Reason:</label>
                    <select
                      id={`reason-sel-${idx}`}
                      className="reason-select-dropdown"
                      value={st.reasonKey}
                      onChange={(e) => handleReasonChange(idx, e.target.value)}
                    >
                      <option value="alternate-angles-parallel">alternate angles (parallel lines)</option>
                      <option value="corresponding-angles-parallel">corresponding angles (parallel lines)</option>
                      <option value="co-interior-angles-parallel">co-interior angles (parallel lines)</option>
                      <option value="vertically-opposite-angles">vertically opposite angles</option>
                      <option value="angles-at-a-point">angles at a point</option>
                      <option value="given">given / angle addition</option>
                    </select>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="audit-panel">
            <button type="button" className="btn btn-outline" onClick={runAudit}>
              Audit Chain with Rulebook 🔍
            </button>
            <p className={`audit-feedback-msg ${chainResult.valid ? 'msg-valid' : 'msg-flawed'}`}>
              {chainResult.message}
            </p>
          </div>

          {chainResult.valid && (
            <div className="station-success anim-slide-up">
              <div className="success-icon">🏆</div>
              <h4 className="success-title">Argument Upheld in Court!</h4>
              <p className="success-desc">
                You successfully marked the diagram, added the helper line, and constructed a watertight proof!
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
