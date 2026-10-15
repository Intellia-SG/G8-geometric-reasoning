// src/components/phases/ReflectPhase.jsx
import React, { useState, useEffect, useRef } from 'react';
import './ReflectPhase.css';
import { BADGES } from '../../utils/badgeEngine.js';
import { calcStars } from '../../utils/scoring.js';
import { useAudio } from '../../hooks/useAudio.js';
import { reflectNarration, reflectCompleteNarration } from '../../utils/narration.js';
import { generateSessionQuestions } from '../../utils/shuffle.js';
import questionBank from '../../data/questionBank.js';
import { WORLDS } from '../../config/worlds.config.js';

const COURT_PRECEDENTS = [
  {
    id: 'condition',
    icon: '📜',
    title: 'Precedent 1: The Condition Imperative (Only If)',
    rule: 'Alternate, corresponding, and co-interior angle theorems hold ONLY IF lines are marked parallel with arrows (∥).',
    detail: 'Never apply a parallel line theorem to lines that simply "look" parallel. A rule applied without its condition is a legal error, not a shortcut!',
  },
  {
    id: 'sketch-trap',
    icon: '🖍️',
    title: 'Precedent 2: The Sketch Artist Trap',
    rule: 'Looking like it is never evidence! Geometry diagrams are not drawn to scale.',
    detail: 'Never measure a picture with a ruler or protractor. In the court of geometry, every ruling must be deduced from explicit marks and rulebook warrants.',
  },
  {
    id: 'helper-line',
    icon: '➖',
    title: 'Precedent 3: Auxiliary Construction Lines',
    rule: 'When lines bend at a vertex between parallel rails, draw a dashed helper line through the vertex parallel to both rails.',
    detail: 'This construction splits composite angles into two distinct alternate or co-interior pairs that can be solved and summed logically.',
  },
  {
    id: 'congruence',
    icon: '🔺',
    title: 'Precedent 4: Congruence Criteria & Counterexamples',
    rule: 'SSS, SAS, ASA, AAS, and RHS are valid criteria. SSA and AAA are inadmissible fallacies.',
    detail: 'SAS requires the angle to be strictly INCLUDED between the two equal sides. Two sides and a non-included angle (SSA) can form two non-congruent triangles.',
  },
];

const REFLECT_CASES = [
  {
    id: 1,
    title: 'Case 1: The Co-Interior Trap',
    tag: 'CO-INTERIOR CONDITIONS',
    q: 'Two parallel lines AB ∥ CD are cut by a transversal. If one interior angle is 70°, what is the measure of the co-interior angle on the same side?',
    svg: (
      <svg viewBox="0 0 320 130" className="reflect-case-svg" aria-label="Parallel lines with co-interior angles">
        <line x1="20" y1="35" x2="300" y2="35" stroke="#94a3b8" strokeWidth="2.5" />
        <line x1="20" y1="95" x2="300" y2="95" stroke="#94a3b8" strokeWidth="2.5" />
        {/* Parallel arrows */}
        <polygon points="150,30 162,35 150,40" fill="#38bdf8" />
        <polygon points="150,90 162,95 150,100" fill="#38bdf8" />
        {/* Transversal */}
        <line x1="60" y1="15" x2="260" y2="115" stroke="#fbbf24" strokeWidth="2.5" />
        {/* Angle 1 (70) */}
        <path d="M 125,52 A 25 25 0 0 0 100,35" fill="none" stroke="#22c55e" strokeWidth="2.5" />
        <text x="110" y="30" fill="#22c55e" fontSize="12" fontWeight="bold">70°</text>
        {/* Angle 2 (?) */}
        <path d="M 195,78 A 25 25 0 0 0 220,95" fill="none" stroke="#f43f5e" strokeWidth="2.5" />
        <text x="200" y="112" fill="#f43f5e" fontSize="13" fontWeight="bold">?</text>
        <text x="24" y="28" fill="#94a3b8" fontSize="11" fontWeight="bold">A</text>
        <text x="290" y="28" fill="#94a3b8" fontSize="11" fontWeight="bold">B</text>
        <text x="24" y="115" fill="#94a3b8" fontSize="11" fontWeight="bold">C</text>
        <text x="290" y="115" fill="#94a3b8" fontSize="11" fontWeight="bold">D</text>
      </svg>
    ),
    options: [
      {
        text: '110° — Co-interior angles are supplementary and sum to 180° (180° − 70° = 110°)',
        isCorrect: true,
        reason: 'Legally Sound! Co-interior angles between parallel lines sum to 180°. Treating them as equal (70°) is the #1 misconception on geometric trials.',
      },
      {
        text: '70° — Alternate and co-interior angles are always equal in measure',
        isCorrect: false,
        reason: 'Objection Overruled! Co-interior angles form a C-shape and sum to 180°. They are only equal if both are 90° right angles.',
      },
      {
        text: '290° — Calculated by subtracting 70° from angles around a point (360°)',
        isCorrect: false,
        reason: 'Objection Overruled! Angles around a single point sum to 360°, but these two angles sit at two separate vertices on the transversal.',
      },
    ],
  },
  {
    id: 2,
    title: 'Case 2: The Sketch Artist Fallacy',
    tag: 'EVIDENTIARY SUFFICIENCY',
    q: 'The diagram exhibit shows two lines that visually look parallel, but there are no parallel arrow marks (∥) and it is marked "not drawn to scale". What is the only legally valid ruling in court?',
    svg: (
      <svg viewBox="0 0 320 130" className="reflect-case-svg" aria-label="Lines without parallel marks marked not to scale">
        <line x1="20" y1="35" x2="300" y2="42" stroke="#94a3b8" strokeWidth="2.5" />
        <line x1="20" y1="95" x2="300" y2="88" stroke="#94a3b8" strokeWidth="2.5" />
        {/* No arrows! Transversal */}
        <line x1="80" y1="15" x2="240" y2="115" stroke="#fbbf24" strokeWidth="2.5" />
        <text x="160" y="70" fill="#f43f5e" fontSize="12" fontWeight="bold" textAnchor="middle">⚠ NOT DRAWN TO SCALE (NO ∥ MARKS)</text>
        <text x="24" y="28" fill="#94a3b8" fontSize="11" fontWeight="bold">A</text>
        <text x="290" y="32" fill="#94a3b8" fontSize="11" fontWeight="bold">B</text>
        <text x="24" y="115" fill="#94a3b8" fontSize="11" fontWeight="bold">C</text>
        <text x="290" y="110" fill="#94a3b8" fontSize="11" fontWeight="bold">D</text>
      </svg>
    ),
    options: [
      {
        text: 'The angle value is not determined — a sketch without explicit marks is not evidence in court',
        isCorrect: true,
        reason: 'Sustained! Without parallel arrows (∥), the rulebook condition is not met. Visual appearance is legally inadmissible.',
      },
      {
        text: 'Measure the lines with a ruler or protractor to verify whether they are parallel',
        isCorrect: false,
        reason: 'Objection Overruled! Diagrams are merely sketch-artist impressions. Measuring with a protractor violates fundamental proof standards.',
      },
      {
        text: 'Assume the lines are parallel because the lines look straight and roughly equidistant',
        isCorrect: false,
        reason: 'Objection Overruled! Never assume givens that are not marked. Judge Tally says: "No reason, no ruling!"',
      },
    ],
  },
  {
    id: 3,
    title: 'Case 3: Congruence Warrants vs Traps',
    tag: 'CONGRUENCE STANDARDS',
    q: 'An opposing advocate claims: "These two triangles have two pairs of equal sides and one pair of equal angles, so they must be congruent by SSA!" How does Judge Tally rule?',
    svg: (
      <svg viewBox="0 0 320 130" className="reflect-case-svg" aria-label="SSA ambiguous counterexample">
        {/* Triangle 1: acute */}
        <polygon points="30,100 130,100 80,30" fill="rgba(56, 189, 248, 0.15)" stroke="#38bdf8" strokeWidth="2" />
        {/* Triangle 2: obtuse counterexample with same side lengths and angle */}
        <polygon points="170,100 240,100 290,30" fill="rgba(244, 63, 94, 0.15)" stroke="#f43f5e" strokeWidth="2" />
        <text x="80" y="118" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">Triangle 1 (Acute)</text>
        <text x="240" y="118" fill="#f43f5e" fontSize="11" fontWeight="bold" textAnchor="middle">Triangle 2 (Obtuse)</text>
        <text x="160" y="20" fill="#f59e0b" fontSize="11" fontWeight="bold" textAnchor="middle">Same SSA marks, completely different shapes!</text>
      </svg>
    ),
    options: [
      {
        text: 'Objection Sustained! SSA is NOT a valid criterion; a counterexample shows two non-congruent triangles can share those marks',
        isCorrect: true,
        reason: 'Spot on! The angle MUST be the included angle between the two sides (SAS). Non-included angle (SSA) creates ambiguous non-congruent triangles.',
      },
      {
        text: 'Objection Overruled! Matching two sides and any angle always establishes geometric congruence',
        isCorrect: false,
        reason: 'Objection Overruled! SSA is an invalid fallacy. A counterexample disproves it beyond mathematical doubt.',
      },
      {
        text: 'Objection Overruled! SSA is mathematically identical to SAS',
        isCorrect: false,
        reason: 'Objection Overruled! In SAS, the angle is strictly trapped between the two sides. In SSA, the angle is outside, leaving the opposite side free to swing.',
      },
    ],
  },
  {
    id: 4,
    title: 'Case 4: The Auxiliary Line Precedent',
    tag: 'CONSTRUCTION WARRANTS',
    q: 'When solving a composite angle ∠BEC located at an apex between parallel rails AB ∥ CD, what is the required first geometric step?',
    svg: (
      <svg viewBox="0 0 320 130" className="reflect-case-svg" aria-label="Helper line through vertex E">
        <line x1="20" y1="25" x2="300" y2="25" stroke="#94a3b8" strokeWidth="2.5" />
        <line x1="20" y1="105" x2="300" y2="105" stroke="#94a3b8" strokeWidth="2.5" />
        {/* Chevron lines meeting at E */}
        <polyline points="70,25 160,65 70,105" fill="none" stroke="#fbbf24" strokeWidth="2.5" />
        {/* Dashed Helper Line through E */}
        <line x1="30" y1="65" x2="290" y2="65" stroke="#22c55e" strokeWidth="2" strokeDasharray="5,4" />
        <text x="175" y="62" fill="#22c55e" fontSize="12" fontWeight="bold">Helper Line L ∥ AB ∥ CD</text>
        <text x="24" y="20" fill="#94a3b8" fontSize="11" fontWeight="bold">A</text>
        <text x="290" y="20" fill="#94a3b8" fontSize="11" fontWeight="bold">B</text>
        <text x="145" y="75" fill="#fbbf24" fontSize="12" fontWeight="bold">E</text>
        <text x="24" y="120" fill="#94a3b8" fontSize="11" fontWeight="bold">C</text>
        <text x="290" y="120" fill="#94a3b8" fontSize="11" fontWeight="bold">D</text>
      </svg>
    ),
    options: [
      {
        text: 'Construct a dashed helper line through E parallel to AB and CD, splitting ∠BEC into two alternate pairs',
        isCorrect: true,
        reason: 'Sustained! The auxiliary line connects the upper and lower parallel rails, letting you deduce two separate alternate angles that sum together.',
      },
      {
        text: 'Measure ∠BEC off the monitor screen with a protractor',
        isCorrect: false,
        reason: 'Objection Overruled! Screen measurement is not deductive proof. Diagrams are not to scale.',
      },
      {
        text: 'Assume ∠BEC is always equal to the average of ∠ABE and ∠ECD',
        isCorrect: false,
        reason: 'Objection Overruled! There is no mathematical rule stating apex angles equal the average. Deduce each half with alternate angles.',
      },
    ],
  },
  {
    id: 5,
    title: 'Case 5: Converse Rule Standards',
    tag: 'CONVERSE LOGIC',
    q: 'If evidence demonstrates that a pair of alternate angles between two lines are both exactly 65°, what ruling does the court rulebook grant?',
    svg: (
      <svg viewBox="0 0 320 130" className="reflect-case-svg" aria-label="Equal alternate angles proving lines parallel">
        <line x1="20" y1="35" x2="300" y2="35" stroke="#38bdf8" strokeWidth="2.5" />
        <line x1="20" y1="95" x2="300" y2="95" stroke="#38bdf8" strokeWidth="2.5" />
        <line x1="70" y1="15" x2="250" y2="115" stroke="#fbbf24" strokeWidth="2.5" />
        {/* Equal alternate angles */}
        <path d="M 130,51 A 25 25 0 0 0 105,35" fill="none" stroke="#22c55e" strokeWidth="2.5" />
        <text x="110" y="30" fill="#22c55e" fontSize="12" fontWeight="bold">65°</text>
        <path d="M 190,79 A 25 25 0 0 0 215,95" fill="none" stroke="#22c55e" strokeWidth="2.5" />
        <text x="180" y="112" fill="#22c55e" fontSize="12" fontWeight="bold">65°</text>
        <text x="160" y="70" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">Alternate angles equal → Lines MUST be parallel!</text>
      </svg>
    ),
    options: [
      {
        text: 'The lines are legally established to be parallel (Converse of alternate angles theorem)',
        isCorrect: true,
        reason: 'Ruling Upheld! Standard angle facts state: "Parallel → Angles Equal". The Converse states: "Angles Equal → Lines Parallel". You proved them parallel!',
      },
      {
        text: 'The lines are proven to be perpendicular and intersect at 90°',
        isCorrect: false,
        reason: 'Objection Overruled! Perpendicularity requires a 90° intersection, not equal 65° alternate angles.',
      },
      {
        text: 'Nothing can be determined because arrows are not already stamped on the lines',
        isCorrect: false,
        reason: 'Objection Overruled! The whole purpose of a converse rule is to PROVE lines are parallel from angle evidence, allowing you to add the arrows!',
      },
    ],
  },
];

export default function ReflectPhase({ state, dispatch }) {
  const [answers, setAnswers]         = useState({});
  const [journal, setJournal]         = useState('');
  const [submitted, setSubmitted]     = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);
  const { narrate, stopAll, sounds }  = useAudio(state?.audioEnabled ?? true);
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

  function handleSelectOption(caseId, optIdx, isCorrect) {
    if (isCorrect) sounds.correct();
    else sounds.wrong();
    setAnswers((prev) => ({ ...prev, [caseId]: optIdx }));
  }

  function handleSubmit() {
    setSubmitted(true);
    stopAll();
    sounds.badge();
    narrate(reflectCompleteNarration());
    // Smooth scroll to top of trophy certificate
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function playAgain() {
    stopAll();
    dispatch({ type: 'RESET_SESSION' });
    dispatch({ type: 'LOAD_QUESTIONS', payload: generateSessionQuestions(questionBank) });
    dispatch({ type: 'SET_PHASE', payload: 'intro' });
  }

  const earnedBadges = BADGES.filter((b) => state?.badges?.includes(b.id));
  const answeredCount = Object.keys(answers).length;
  const canSubmit = answeredCount >= 3;

  if (submitted) {
    return (
      <div className="reflect-wrap">
        <div className="reflect-card trophy-view anim-bounce-in">
          <div className="card-accent-bar" />

          {/* Certificate Header */}
          <div className="certificate-banner">
            <span className="cert-seal">⚖️</span>
            <div className="cert-titles">
              <span className="cert-subtitle-top">SUPREME COURT OF MATHEMATICAL DEDUCTION</span>
              <h1 className="cert-main-title">Chief Advocate of Geometric Reasoning</h1>
              <p className="cert-deck">
                This certifies that the advocate has mastered angle condition warrants, auxiliary helper line constructions, multi-step deductive chains, and triangle congruence counterexamples beyond mathematical doubt.
              </p>
            </div>
            <div className="cert-grade-seal">
              <span className="seal-star">★</span>
              <span className="seal-score">{totalStars} / 30</span>
              <span className="seal-label">STARS EARNED</span>
            </div>
          </div>

          {/* Key Stat Blocks */}
          <div className="trophy-stats-grid">
            <div className="stat-pill-card">
              <span className="stat-icon-large">⚖️</span>
              <div className="stat-content">
                <span className="stat-big-num">{totalCorrect} / 100</span>
                <span className="stat-sublabel">Courtroom Questions Ruled</span>
              </div>
            </div>

            <div className="stat-pill-card">
              <span className="stat-icon-large">⭐</span>
              <div className="stat-content">
                <span className="stat-big-num">{state?.xp || 0} XP</span>
                <span className="stat-sublabel">Advocate Reputation XP</span>
              </div>
            </div>

            <div className="stat-pill-card">
              <span className="stat-icon-large">🔥</span>
              <div className="stat-content">
                <span className="stat-big-num">{state?.maxStreak || 0} In a Row</span>
                <span className="stat-sublabel">Highest Winning Streak</span>
              </div>
            </div>

            <div className="stat-pill-card">
              <span className="stat-icon-large">🏆</span>
              <div className="stat-content">
                <span className="stat-big-num">{earnedBadges.length} / 8</span>
                <span className="stat-sublabel">Judicial Badges Conquered</span>
              </div>
            </div>
          </div>

          {/* Unlocked Badges Showcase */}
          <div className="trophy-badges-section">
            <h3 className="section-title-centered">🏅 Conquered Judicial Badges &amp; Honors</h3>
            <div className="badge-gallery-grid">
              {BADGES.map((b) => {
                const isEarned = state?.badges?.includes(b.id);
                return (
                  <div key={b.id} className={`badge-card-full ${isEarned ? 'earned' : 'locked'}`}>
                    <span className="badge-card-icon">{b.icon}</span>
                    <div className="badge-card-info">
                      <span className="badge-card-title">{b.label}</span>
                      <span className="badge-card-desc">{b.description}</span>
                    </div>
                    <span className="badge-card-status">{isEarned ? 'UNLOCKED ✓' : 'LOCKED 🔒'}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Official Court Oath */}
          <div className="court-oath-card">
            <div className="oath-icon">📜</div>
            <div className="oath-text-col">
              <strong>The Geometric Advocate's Oath:</strong>
              <p>
                <em>"I hereby declare that looking like it is never evidence in court. Every ruling must cite a closed rulebook reason, every condition must be verified before concluding, and false claims shall be overturned with rigorous counterexamples. No reason, no ruling!"</em>
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="reflect-actions-row">
            <button type="button" className="btn btn-primary btn-lg" onClick={playAgain}>
              🔄 Re-enter Court (Play Again)
            </button>
            <button
              type="button"
              className="btn btn-outline btn-lg"
              onClick={() => dispatch({ type: 'SET_PHASE', payload: 'intro' })}
            >
              🏠 Return to Chambers
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

        {/* Header Row: Title & Subtitle on left, Live Stats on right */}
        <div className="reflect-header-row">
          <div className="reflect-title-group">
            <div className="court-badge-tag">⚖️ SUPREME COURT OF GEOMETRIC REASONING · GRADE 8</div>
            <h1 className="reflect-title">The Grand Courtroom Reflection</h1>
            <p className="reflect-subtitle">
              Synthesize key angle conditions, proof chain warrants, and congruence criteria with Judge Tally.
            </p>
          </div>
          <div className="reflect-header-stats">
            <div className="stat-chip gold">
              <span>★</span> {totalStars} / 30 Stars
            </div>
            <div className="stat-chip blue">
              <span>⭐</span> {state?.xp || 0} XP
            </div>
            <div className="stat-chip purple">
              <span>🔥</span> {state?.maxStreak || 0} Streak
            </div>
          </div>
        </div>

        {/* ── SECTION 1: THE 4 CORE COURT PRECEDENTS ── */}
        <div className="reflect-section">
          <div className="section-header-row">
            <span className="section-icon">📜</span>
            <h2 className="section-title">The Four Golden Precedents of Geometry Court</h2>
          </div>
          <p className="section-subtext">
            Click any legal precedent to review the bedrock principles of mathematical deduction discovered across ReasonQuest:
          </p>

          <div className="precedents-grid">
            {COURT_PRECEDENTS.map((prec) => {
              const isExpanded = expandedCard === prec.id;
              return (
                <div
                  key={prec.id}
                  className={`precedent-card ${isExpanded ? 'expanded' : ''}`}
                  onClick={() => setExpandedCard(isExpanded ? null : prec.id)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="precedent-card-header">
                    <span className="precedent-icon">{prec.icon}</span>
                    <div className="precedent-title-wrap">
                      <span className="precedent-title">{prec.title}</span>
                      <span className="precedent-rule">{prec.rule}</span>
                    </div>
                    <span className="precedent-toggle">{isExpanded ? '▲' : '▼'}</span>
                  </div>
                  {isExpanded && (
                    <div className="precedent-detail-box anim-fade-in">
                      <p>{prec.detail}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── SECTION 2: 10 COURT WORLDS DOCKET SUMMARY ── */}
        <div className="reflect-section">
          <div className="section-header-row">
            <span className="section-icon">🏛️</span>
            <h2 className="section-title">The 10 Court Worlds Docket Performance</h2>
          </div>
          <p className="section-subtext">
            Your comprehensive judicial record across all 10 specialized court districts:
          </p>

          <div className="worlds-docket-grid">
            {WORLDS.map((w, idx) => {
              const score = state?.districtScores?.[idx];
              const stars = score !== null && score !== undefined ? calcStars(score) : 0;
              const isDone = (state?.currentQuestion || 0) > (idx + 1) * 10 || state?.phaseComplete?.play;
              return (
                <div key={w.id} className={`docket-world-card ${isDone ? 'completed' : ''}`}>
                  <div className="docket-world-top">
                    <span className="docket-world-emoji">{w.emoji}</span>
                    <div className="docket-world-names">
                      <span className="docket-world-num">World {idx}</span>
                      <span className="docket-world-name">{w.name}</span>
                    </div>
                  </div>
                  <span className="docket-world-focus">{w.conceptFocus}</span>
                  <div className="docket-world-bottom">
                    <div className="docket-stars">
                      {[1, 2, 3].map((s) => (
                        <span key={s} className={`docket-star ${s <= stars ? 'active' : ''}`}>★</span>
                      ))}
                    </div>
                    <span className="docket-status-tag">{stars === 3 ? 'MASTERED ✓' : stars > 0 ? 'CLEARED' : 'PENDING'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── SECTION 3: 5 DIAGNOSTIC BENCHMARK CASES ── */}
        <div className="reflect-section">
          <div className="section-header-row">
            <span className="section-icon">⚖️</span>
            <h2 className="section-title">Benchmark Concept Review: 5 Judicial Cases</h2>
          </div>
          <p className="section-subtext">
            Test your legal warrants on these 5 diagnostic benchmark cases. Receive immediate rulebook feedback on every ruling:
          </p>

          <div className="reflect-cases-list">
            {REFLECT_CASES.map((c) => {
              const selectedOptIdx = answers[c.id];
              const hasAnswered = selectedOptIdx !== undefined;
              const chosenOption = hasAnswered ? c.options[selectedOptIdx] : null;

              return (
                <div key={c.id} className="reflect-case-item glass-card">
                  <div className="case-header-pill-row">
                    <span className="case-id-badge">CASE EXHIBIT #{c.id}</span>
                    <span className="case-tag-badge">{c.tag}</span>
                    <span className="case-title-text">{c.title}</span>
                  </div>

                  <div className="case-content-grid">
                    {/* Left: SVG Diagram Exhibit */}
                    <div className="case-svg-wrapper">
                      {c.svg}
                    </div>

                    {/* Right: Question Prompt & Options */}
                    <div className="case-interactive-col">
                      <p className="case-question-text">{c.q}</p>

                      <div className="case-options-col">
                        {c.options.map((opt, oIdx) => {
                          const isSelected = selectedOptIdx === oIdx;
                          let btnClass = 'case-option-btn';
                          if (isSelected) {
                            btnClass += opt.isCorrect ? ' option-correct' : ' option-incorrect';
                          }

                          return (
                            <button
                              key={oIdx}
                              type="button"
                              className={btnClass}
                              onClick={() => handleSelectOption(c.id, oIdx, opt.isCorrect)}
                            >
                              <span className="opt-letter">
                                {String.fromCharCode(65 + oIdx)}
                              </span>
                              <span className="opt-text">{opt.text}</span>
                              {isSelected && (
                                <span className="opt-mark">
                                  {opt.isCorrect ? '✓' : '✗'}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Immediate Rulebook Feedback */}
                      {hasAnswered && (
                        <div className={`case-feedback-banner ${chosenOption?.isCorrect ? 'feedback-correct' : 'feedback-incorrect'} anim-slide-up`}>
                          <span className="feedback-banner-icon">
                            {chosenOption?.isCorrect ? '⚖️' : '💡'}
                          </span>
                          <div className="feedback-banner-text">
                            <strong>{chosenOption?.isCorrect ? 'Ruling Legally Sound!' : 'Objection Overruled!'}</strong>
                            <p>{chosenOption?.reason}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── SECTION 4: ADVOCATE'S REFLECTION JOURNAL ── */}
        <div className="reflect-section">
          <div className="section-header-row">
            <span className="section-icon">📓</span>
            <h2 className="section-title">The Advocate's Courtroom Learning Journal</h2>
          </div>
          <p className="section-subtext">
            Reflect on how your mathematical instincts evolved from guessing pictures to constructing proof chains:
          </p>

          <div className="reflect-journal-card">
            <label className="reflect-journal-label" htmlFor="journal-input">
              Which geometric rule did you almost use without checking its condition first? What will you look for next time?
            </label>
            <textarea
              id="journal-input"
              className="reflect-textarea"
              placeholder="e.g. I almost used alternate angles on World 5 before checking if lines had arrows! Next time I will verify the givens before ruling."
              value={journal}
              onChange={(e) => setJournal(e.target.value)}
              rows={3}
              aria-label="Learning journal entry"
            />

            <div className="quick-insert-row">
              <span className="quick-label">Tap quick insights to insert:</span>
              {[
                'Always verify lines are marked parallel (∥) before using alternate angles',
                'Co-interior angles sum to 180°, they are NOT equal',
                'A sketch is not evidence — never measure from the diagram',
                'SSA is not a criterion — the angle MUST be strictly included (SAS)',
                'Add a dashed helper line when stuck on middle vertices between rails',
              ].map((ex) => (
                <button
                  key={ex}
                  type="button"
                  onClick={() => setJournal((prev) => (prev ? `${prev} · ${ex}` : ex))}
                  className="quick-insert-btn"
                >
                  ✨ {ex}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── SECTION 5: ACTIONS & SUBMISSION ── */}
        <div className="reflect-footer-actions">
          <button
            type="button"
            className="btn btn-outline btn-lg"
            onClick={() => dispatch({ type: 'SET_PHASE', payload: 'play' })}
          >
            ← Back to Practice Worlds
          </button>
          <button
            type="button"
            className="btn btn-primary btn-lg btn-submit-grand"
            onClick={handleSubmit}
            disabled={!canSubmit}
            title={canSubmit ? 'Submit reflection and claim your Chief Justice certificate' : 'Answer at least 3 benchmark cases to submit'}
          >
            🌟 Certify Rulings &amp; View Court Scorecard ({answeredCount}/5 Cases) →
          </button>
        </div>
      </div>
    </div>
  );
}
