// src/components/simulations/ObjectionStation.jsx
import React, { useState } from 'react';
import './Stations.css';

/**
 * Station D: Objection Station (Error-Detective)
 * TRD §6:
 * Advocate presents an argument containing one seeded flaw.
 * Student clicks "Objection!" on the flawed step, then supplies the valid correction.
 * Completion gate: correctly identifying the flawed step and supplying the fix.
 */
export default function ObjectionStation({ onComplete }) {
  const CASES = [
    {
      id: 0,
      title: 'Case: The Co-Interior Trap',
      advocate: 'Advocate Ramesh',
      summary: 'Given AB ∥ CD and ∠1 = 65°. Find co-interior angle ∠2.',
      steps: [
        {
          num: 1,
          claim: 'Lines AB and CD are marked parallel (AB ∥ CD)',
          reason: 'given',
          isFlawed: false,
        },
        {
          num: 2,
          claim: 'Therefore, co-interior angle ∠2 = 65°',
          reason: 'co-interior angles, AB ∥ CD',
          isFlawed: true,
          flawExplanation:
            'Co-interior angles are NOT equal! They are supplementary and sum to 180°: ∠2 = 180° − 65° = 115°.',
          correctionOptions: [
            'Objection Sustained! Co-interior angles sum to 180°, so ∠2 = 180° − 65° = 115°',
            'Objection Overruled! Co-interior angles are always equal to 65°',
            'Objection Sustained! ∠2 must be measured with a protractor',
          ],
        },
        {
          num: 3,
          claim: 'Verdict: ∠2 is acute (65°)',
          reason: 'follows from step 2',
          isFlawed: false,
        },
      ],
    },
  ];

  const currentCase = CASES[0];
  const [selectedStep, setSelectedStep] = useState(null);
  const [objectionRaised, setObjectionRaised] = useState(false);
  const [selectedCorrection, setSelectedCorrection] = useState(null);
  const [isResolved, setIsResolved] = useState(false);

  function handleSelectStep(num) {
    if (isResolved) return;
    setSelectedStep(num);
    setObjectionRaised(false);
    setSelectedCorrection(null);
  }

  function handleRaiseObjection() {
    if (selectedStep === 2) {
      setObjectionRaised(true);
    } else {
      alert('Judge Tally: "Objection Overruled! Step ' + selectedStep + ' is legally sound. Check the other steps for a geometric fallacy!"');
    }
  }

  function handleSelectCorrection(idx) {
    setSelectedCorrection(idx);
    if (idx === 0) {
      setIsResolved(true);
    }
  }

  return (
    <div className="station-wrap">
      <div className="station-header">
        <h3 className="station-title">
          <span className="station-icon">🔨</span> Station D: Objection Station!
        </h3>
        <p className="station-desc">
          Advocate Ramesh has submitted an argument with one seeded logical flaw. Identify the flawed step, hit <strong>Objection!</strong>, and issue the correct ruling!
        </p>
      </div>

      <div className="station-grid">
        {/* Left: Advocate Argument Docket */}
        <div className="station-workbench glass-card">
          <div className="rv-badge-row">
            <span className="rv-evidence-badge">{currentCase.title}</span>
            <span className="rv-pair-letter-badge">Presented by {currentCase.advocate}</span>
          </div>

          <p className="station-case-prompt">{currentCase.summary}</p>

          <div className="objection-steps-list">
            {currentCase.steps.map((st) => (
              <div
                key={st.num}
                className={`objection-step-card ${selectedStep === st.num ? 'step-selected' : ''} ${isResolved && st.isFlawed ? 'step-flawed-fixed' : ''}`}
                onClick={() => handleSelectStep(st.num)}
                role="button"
                tabIndex={0}
              >
                <div className="objection-step-left">
                  <span className="step-num-circle">{st.num}</span>
                  <div>
                    <div className="objection-claim">{st.claim}</div>
                    <div className="objection-reason"><em>Reason:</em> {st.reason}</div>
                  </div>
                </div>

                <button
                  type="button"
                  className={`btn btn-sm ${selectedStep === st.num ? 'btn-danger' : 'btn-outline'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectStep(st.num);
                    if (st.num === 2) {
                      setObjectionRaised(true);
                    } else {
                      alert('Judge Tally: "Objection Overruled! Step ' + st.num + ' is legally sound."');
                    }
                  }}
                >
                  Objection! 🔨
                </button>
              </div>
            ))}
          </div>

          {selectedStep && !objectionRaised && (
            <div className="objection-action-bar">
              <button
                type="button"
                className="btn btn-danger btn-lg"
                onClick={handleRaiseObjection}
              >
                Raise Objection on Step {selectedStep}! 🔨
              </button>
            </div>
          )}
        </div>

        {/* Right: Judge Bench & Correction Panel */}
        <div className="station-sidebar glass-card">
          <h4 className="sidebar-title">⚖️ Judge Tally's Bench Ruling</h4>

          {!objectionRaised && !isResolved && (
            <div className="sidebar-instruction-card">
              <span className="info-icon">💡</span>
              <p>
                Carefully inspect each advocate step and its claimed rulebook reason. When you spot a condition violation or calculation error, click <strong>Objection!</strong> on that exact step.
              </p>
            </div>
          )}

          {objectionRaised && !isResolved && (
            <div className="objection-ruling-panel anim-slide-up">
              <span className="gavel-icon">🔨</span>
              <h5 className="objection-ruling-title">Objection Sustained!</h5>
              <p className="objection-flaw-summary">
                You caught the flaw at Step 2! Why is this step mathematically invalid? Select the correct legal ruling:
              </p>

              <div className="correction-options-list">
                {currentCase.steps[1].correctionOptions.map((opt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`correction-opt-btn ${selectedCorrection === idx ? (idx === 0 ? 'opt-correct' : 'opt-wrong') : ''}`}
                    onClick={() => handleSelectCorrection(idx)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {isResolved && (
            <div className="station-success anim-slide-up">
              <div className="success-icon">🏅</div>
              <h4 className="success-title">Objection Sustained &amp; Corrected!</h4>
              <p className="success-desc">
                {currentCase.steps[1].flawExplanation}
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
