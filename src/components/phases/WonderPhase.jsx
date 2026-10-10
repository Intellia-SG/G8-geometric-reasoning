// src/components/phases/WonderPhase.jsx
import React, { useEffect } from 'react';
import './WonderPhase.css';
import Mascot from '../shared/Mascot.jsx';
import ReasoningVisual from '../shared/ReasoningVisual.jsx';
import { useAudio } from '../../hooks/useAudio.js';
import { wonderNarration } from '../../utils/narration.js';

const PARTICLES = ['⚖️', '📐', '📜', '🏛️', '🦉', '🔨', '✨', '💡', '🔍', '⭐'];

export default function WonderPhase({ state, dispatch }) {
  const { narrate, stopAll } = useAudio(state?.audioEnabled ?? true);

  useEffect(() => {
    const segs = wonderNarration();
    narrate(segs);
    return () => stopAll();
  }, [narrate, stopAll]);

  function handleInvestigate() {
    stopAll();
    dispatch({ type: 'COMPLETE_PHASE', payload: 'wonder' });
    dispatch({ type: 'SET_PHASE', payload: 'story' });
  }

  return (
    <div className="wonder-wrap">
      {/* Floating particles */}
      <div className="wonder-particles" aria-hidden="true">
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className="wonder-particle"
            style={{
              left: `${5 + (i * 9.5) % 90}%`,
              top: `${5 + (i * 7.5) % 80}%`,
              animationDelay: `${i * 0.6}s`,
              fontSize: `${1.1 + (i % 3) * 0.4}rem`,
            }}
          >
            {p}
          </span>
        ))}
      </div>

      <div className="wonder-content anim-slide-up">
        {/* Main hook card */}
        <div className="wonder-card glass-card">
          {/* Header row */}
          <div className="wonder-header-row">
            <div className="wonder-stadium-icon" aria-hidden="true">⚖️</div>
            <h1 className="wonder-title headline">The Geometry Court Mystery!</h1>
          </div>

          <div className="wonder-number-display">
            <span className="number-display wonder-num">Claim: ∠x = ∠y · When does the ruling stand?</span>
          </div>

          {/* 2-column body: Left = Case text & Mascot, Right = Visual Exhibit */}
          <div className="wonder-body-grid">
            <div className="wonder-left-col">
              <div className="wonder-question-card">
                <p className="body-text wonder-q">
                  Two sketches show the exact same case. In one sketch, two lines are <strong className="wonder-em">marked parallel (∥)</strong>. In the other, they look parallel but are slightly off without marks.
                </p>
                <p className="body-text wonder-q">
                  The advocate claims: <strong className="wonder-em">"These two angles are equal!"</strong> <span className="wonder-highlight">When is a judge legally allowed to accept it?</span>
                </p>
              </div>

              {/* Mascot */}
              <div className="wonder-mascot-row">
                <Mascot mood="curious" message="Remember: in geometry court, no reason means no ruling! Let's discover the rulebook!" size="sm" />
              </div>
            </div>

            <div className="wonder-right-col">
              <div className="wonder-visual-wrap">
                <ReasoningVisual
                  type="figure"
                  data={{ type: 'parallel-lines', params: { angle: 65, isParallel: true } }}
                  compact={true}
                />
              </div>
            </div>
          </div>

          {/* CTA Action Button */}
          <button className="btn btn-primary btn-lg wonder-cta" onClick={handleInvestigate}>
            Enter the Courtroom ⚖️
          </button>
        </div>
      </div>
    </div>
  );
}
