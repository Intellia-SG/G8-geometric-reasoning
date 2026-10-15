// src/components/IntroScreen.jsx
import React, { useEffect } from 'react';
import './IntroScreen.css';
import { generateSessionQuestions } from '../utils/shuffle.js';
import questionBank from '../data/questionBank.js';
import { useAudio } from '../hooks/useAudio.js';
import { introNarration } from '../utils/narration.js';

const JOURNEY = [
  { num: '01', icon: '🔍', label: 'Wonder',   desc: 'The Courtroom Hook' },
  { num: '02', icon: '📖', label: 'Story',    desc: 'The Geometry Court' },
  { num: '03', icon: '🧪', label: 'Simulate', desc: '4 Mock-Trial Labs' },
  { num: '04', icon: '🎮', label: 'Practice', desc: '10 Worlds & Bosses' },
  { num: '05', icon: '📓', label: 'Reflect',  desc: 'Recap & Scorecard' },
];

export default function IntroScreen({ state, dispatch }) {
  const hasSaved = state?.phaseComplete && Object.values(state.phaseComplete).some(Boolean);
  const { narrate, stopAll } = useAudio(state?.audioEnabled ?? true);

  useEffect(() => {
    const timer = setTimeout(() => {
      narrate(introNarration());
    }, 400);
    return () => {
      clearTimeout(timer);
      stopAll();
    };
  }, [narrate, stopAll]);

  function startFresh() {
    stopAll();
    dispatch({ type: 'LOAD_QUESTIONS', payload: generateSessionQuestions(questionBank) });
    dispatch({ type: 'SET_PHASE', payload: 'wonder' });
  }

  function resumeSession() {
    stopAll();
    dispatch({ type: 'SET_PHASE', payload: state.savedPhase || 'wonder' });
  }

  return (
    <div className="intro-wrap">
      {/* ── Top Header Section ── */}
      <div className="intro-header-block">
        <div className="intro-top-badge">
          ⚖️ Curriculum · Geometric Reasoning Grade 8 (Secondary 2)
        </div>
        <h1 className="intro-title">
          <span className="text-gold">Reason</span> <span className="text-white">Quest</span>
        </h1>
        <h2 className="intro-subtitle">
          The Geometry Court · Master Angle Facts, Chains &amp; Congruence
        </h2>
      </div>

      {/* ── Mascot Judge Tally Card ── */}
      <div className="intro-mascot-row">
        <div className="intro-mascot-circle" title="Judge Tally the Owl">🦉</div>
        <div className="intro-speech-bubble">
          <strong>Welcome to the Geometry Court! I am Judge Tally.</strong> Remember: <em>"No reason, no ruling!"</em> Justify every step with closed rulebook reasons, verify conditions before concluding, use helper lines, and disprove false claims with counterexamples! ⚖️📐
        </div>
      </div>

      {/* ── Learning Journey in Single Sleek Horizontal Row ── */}
      <div className="journey-card">
        <div className="journey-card-title">YOUR LEARNING JOURNEY · CLICK ANY PHASE TO START</div>
        <div className="journey-steps-row">
          {JOURNEY.map((j, i) => (
            <React.Fragment key={j.num}>
              <div
                className="journey-step-item clickable-step"
                onClick={() =>
                  dispatch({
                    type: 'SET_PHASE',
                    payload: j.label.toLowerCase() === 'practice' ? 'play' : j.label.toLowerCase(),
                  })
                }
                role="button"
                tabIndex={0}
                title={`Click to open ${j.label} phase`}
              >
                <span className="journey-icon-circle">{j.icon}</span>
                <div className="journey-text-col">
                  <span className="journey-item-title">{j.label}</span>
                  <span className="journey-item-desc">{j.desc}</span>
                </div>
              </div>
              {i < JOURNEY.length - 1 && <span className="journey-arrow">→</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── Action Buttons ── */}
      <div className="intro-actions-row">
        <button className="btn btn-primary btn-lg intro-cta-main" onClick={startFresh}>
          ⚖️ Enter the Geometry Court
        </button>
        {hasSaved && (
          <button className="btn btn-outline btn-lg intro-cta-resume" onClick={resumeSession}>
            ↩ Resume Docket
          </button>
        )}
      </div>

      {/* ── Bottom Stat Chips ── */}
      <div className="intro-bottom-cards">
        <div className="bottom-card">
          <span className="bottom-card-icon">⚖️</span>
          <span className="bottom-card-text">100 Case Questions</span>
        </div>
        <div className="bottom-card">
          <span className="bottom-card-icon">📐</span>
          <span className="bottom-card-text">10 Court Worlds</span>
        </div>
        <div className="bottom-card">
          <span className="bottom-card-icon">🏆</span>
          <span className="bottom-card-text">8 Badges &amp; Trophy</span>
        </div>
      </div>
    </div>
  );
}
