// src/components/phases/ReflectPhase.jsx
import React, { useState, useEffect, useRef } from 'react';
import './ReflectPhase.css';
import { BADGES } from '../../utils/badgeEngine.js';
import { calcStars } from '../../utils/scoring.js';
import { useAudio } from '../../hooks/useAudio.js';
import { reflectNarration, reflectCompleteNarration } from '../../utils/narration.js';
import { generateSessionQuestions } from '../../utils/shuffle.js';
import questionBank from '../../data/questionBank.js';

const REFLECT_QUESTIONS = [
  {
    q: "Two parallel lines are cut by a transversal. If one co-interior angle is 70°, what is the other co-interior angle?",
    options: [
      "110° (co-interior angles are supplementary: sum to 180°)",
      "70° (co-interior angles are equal in size)",
      "290° (angles at a point)",
    ],
    correct: 0,
  },
  {
    q: "A diagram shows two lines that look parallel, but there are no parallel marks (∥) and it says 'not drawn to scale'. What is allowed in court?",
    options: [
      "The value is not determined — a sketch is not evidence without marks",
      "Measure the lines with a ruler or protractor to prove it",
      "Assume the lines are parallel because the sketch looks straight",
    ],
    correct: 0,
  },
  {
    q: "Which of the following is NOT a valid triangle congruence criterion?",
    options: [
      "SSA (Side-Side-Angle) and AAA (Angle-Angle-Angle)",
      "SAS (Side-Angle-Side with included angle)",
      "RHS (Right angle, Hypotenuse, Side)",
    ],
    correct: 0,
  },
];

export default function ReflectPhase({ state, dispatch }) {
  const [answers, setAnswers]     = useState({});
  const [journal, setJournal]     = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { narrate, stopAll, sounds } = useAudio(state?.audioEnabled ?? true);
  const narrated = useRef(false);

  const totalCorrect = state?.districtCorrect?.reduce((s, c) => s + (c || 0), 0) || 0;
  const totalStars   = state?.districtScores?.reduce((s, sc) => {
    if (sc === null || sc === undefined) return s;
    return s + calcStars(sc);
  }, 0) || 0;

  useEffect(() => {
    if (!narrated.current) {
      narrated.current = true;
      narrate(reflectNarration());
    }
    dispatch({ type: 'COMPLETE_PHASE', payload: 'reflect' });
    return () => stopAll();
  }, [dispatch, narrate, stopAll]);

  function handleSelectOption(qIdx, optIdx) {
    sounds.click();
    setAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  }

  function handleSubmit() {
    setSubmitted(true);
    stopAll();
    sounds.badge();
    narrate(reflectCompleteNarration());
  }

  function playAgain() {
    dispatch({ type: 'RESET_SESSION' });
    dispatch({ type: 'LOAD_QUESTIONS', payload: generateSessionQuestions(questionBank) });
    dispatch({ type: 'SET_PHASE', payload: 'intro' });
  }

  const earnedBadges = BADGES.filter(b => state?.badges?.includes(b.id));

  if (submitted) {
    return (
      <div className="reflect-wrap">
        <div className="reflect-card trophy-view anim-bounce-in">
          <div className="card-accent-bar" />

          <div className="reflect-header-row">
            <div className="reflect-title-group">
              <h2 className="reflect-title">Court Mastery Certified!</h2>
              <p className="reflect-subtitle">Geometric Reasoning, Parallel Rails &amp; Proof Chains Complete ✅</p>
            </div>
            <div className="reflect-stars-badge">
              <span className="star-icon">★</span>
              <span>{totalStars} / 30</span>
            </div>
          </div>

          <div className="trophy-hero-wrap">
            <div className="trophy-icon">🏆</div>
            <h3 className="trophy-congrats">Chief Justice of Geometric Reasoning</h3>
            <p className="trophy-desc">Every ruling held legally sound with verified mathematical warrants.</p>
          </div>

          {/* Stats Breakdown */}
          <div className="trophy-stats">
            <div className="trophy-stat-card">
              <span className="stat-value">{totalCorrect}</span>
              <span className="stat-label">/ 100 Questions</span>
            </div>
            <div className="trophy-stat-card">
              <span className="stat-value">{state?.xp || 0}</span>
              <span className="stat-label">XP Earned ⭐</span>
            </div>
            <div className="trophy-stat-card">
              <span className="stat-value">{state?.maxStreak || 0}</span>
              <span className="stat-label">Best Streak 🔥</span>
            </div>
          </div>

          {/* Badges */}
          {earnedBadges.length > 0 && (
            <div className="trophy-badges-section">
              <p className="badges-label">Court Badges Unlocked</p>
              <div className="badge-list">
                {earnedBadges.map(b => (
                  <div key={b.id} className="badge-pill">
                    <span className="badge-pill-icon">{b.icon}</span>
                    <div className="badge-pill-text">
                      <span className="badge-pill-title">{b.label}</span>
                      <span className="badge-pill-desc">{b.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="reflect-actions">
            <button type="button" className="btn-boss-battle" onClick={playAgain}>
              🔄 Play Again
            </button>
            <button type="button" className="btn-jump-reflect" onClick={() => dispatch({ type: 'SET_PHASE', payload: 'intro' })}>
              🏠 Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reflect-wrap">
      <div className="reflect-card anim-slide-up">
        {/* Top Center Neon Accent Bar */}
        <div className="card-accent-bar" />

        {/* Header Row: Title & Subtitle on left, Star score on right */}
        <div className="reflect-header-row">
          <div className="reflect-title-group">
            <h2 className="reflect-title">Geometric Court Reflection</h2>
            <p className="reflect-subtitle">Judge Tally's Benchmark Review · Need 2/3 Correct to Certify Rulings</p>
          </div>
          <div className="reflect-stars-badge">
            <span className="star-icon">★</span>
            <span>{totalStars} / 30 · ⭐ {state?.xp || 0} XP</span>
          </div>
        </div>

        {/* Self-assessment Concept Check */}
        <div className="reflect-quiz-section">
          {REFLECT_QUESTIONS.map((qObj, qIdx) => (
            <div key={qIdx} className="reflect-q-card">
              <div className="reflect-q-top">
                <span className="reflect-q-badge">Q{qIdx + 1}</span>
                <p className="reflect-q-text">{qObj.q}</p>
              </div>
              <div className="reflect-opt-row">
                {qObj.options.map((opt, oIdx) => {
                  const isSelected = answers[qIdx] === oIdx;
                  return (
                    <button
                      key={oIdx}
                      type="button"
                      className={`reflect-opt-btn ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleSelectOption(qIdx, oIdx)}
                    >
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Journal Entry Card */}
        <div className="reflect-journal-card">
          <label className="reflect-journal-label" htmlFor="journal-input">
            Which geometric rule did you almost use without checking its condition first?
          </label>
          <textarea
            id="journal-input"
            className="reflect-textarea"
            placeholder="e.g. I almost used alternate angles before checking if the lines had parallel marks!"
            value={journal}
            onChange={e => setJournal(e.target.value)}
            rows={2}
            aria-label="Learning journal entry"
          />

          <div className="quick-insert-row">
            <span className="quick-label">Quick reflection:</span>
            {[
              'Always verify lines are marked parallel before using alternate angles',
              'Co-interior angles sum to 180°, they are NOT equal',
              'A sketch is not evidence — never measure from the diagram',
            ].map(ex => (
              <button
                key={ex}
                type="button"
                onClick={() => setJournal(ex)}
                className="quick-insert-btn"
              >
                ✨ {ex}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Actions Row */}
        <div className="reflect-actions">
          <button
            type="button"
            className="btn-jump-reflect"
            onClick={() => dispatch({ type: 'SET_PHASE', payload: 'play' })}
          >
            ← Back to Practice Worlds
          </button>
          <button
            type="button"
            className="btn-submit-reflect"
            onClick={handleSubmit}
          >
            🌟 Submit Reflection &amp; View Court Scorecard →
          </button>
        </div>
      </div>
    </div>
  );
}
