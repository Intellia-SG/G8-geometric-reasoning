// src/components/shared/ReasoningVisual.jsx
import React from 'react';
import './ReasoningVisual.css';

/**
 * ReasoningVisual Component
 * TRD §5.1: Supports 'figure', 'transversal-pairs', 'reasoning-chain', 'triangle-pair', 'rulebook'.
 * Guaranteed high accessibility: carries text descriptions of marks; not dependent on colour alone.
 */
export default function ReasoningVisual({ type = 'figure', data = {}, compact = false }) {
  if (!data) return null;

  // 1. FIGURE: SVG Geometric Diagram with labelled marks & not-drawn-to-scale flag
  if (type === 'figure') {
    const isParallelLines = data.type === 'parallel-lines';
    const isTriangle = data.type === 'triangle';
    const isAuxiliary = data.type === 'auxiliary-z';
    const notToScale = data.notToScale || false;

    return (
      <div className={`reasoning-visual-card ${compact ? 'compact' : ''}`}>
        <div className="rv-badge-row">
          <span className="rv-evidence-badge">📜 Diagram Exhibit</span>
          {notToScale && <span className="rv-scale-badge">⚠️ Not drawn to scale</span>}
        </div>

        <div className="rv-svg-container">
          <svg
            viewBox="0 0 360 200"
            className="rv-svg"
            role="img"
            aria-label="Geometric diagram showing lines, vertices, and angle marks"
          >
            <defs>
              {/* Arrow marker for parallel lines */}
              <marker id="parallel-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 7 5 L 0 9" fill="none" stroke="#ffb300" strokeWidth="2" strokeLinecap="round" />
              </marker>
              <marker id="parallel-arrow-2" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 7 5 L 0 9" fill="none" stroke="#ffb300" strokeWidth="2" strokeLinecap="round" />
              </marker>
            </defs>

            {isParallelLines && (
              <g className="rv-parallel-lines-group">
                {/* Line 1: AB */}
                <line x1="30" y1="50" x2="330" y2="50" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
                <text x="20" y="55" fill="#f8fafc" fontSize="13" fontWeight="bold">A</text>
                <text x="338" y="55" fill="#f8fafc" fontSize="13" fontWeight="bold">B</text>
                {data.params?.isParallel !== false && (
                  <path d="M 175 46 L 185 50 L 175 54" fill="none" stroke="#ffb300" strokeWidth="2.5" strokeLinecap="round" />
                )}

                {/* Line 2: CD */}
                <line x1="30" y1="140" x2="330" y2={data.params?.isParallel !== false ? "140" : "155"} stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
                <text x="20" y="145" fill="#f8fafc" fontSize="13" fontWeight="bold">C</text>
                <text x="338" y="145" fill="#f8fafc" fontSize="13" fontWeight="bold">D</text>
                {data.params?.isParallel !== false && (
                  <path d="M 175 136 L 185 140 L 175 144" fill="none" stroke="#ffb300" strokeWidth="2.5" strokeLinecap="round" />
                )}

                {/* Transversal EF */}
                <line x1="80" y1="20" x2="280" y2="180" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
                <text x="75" y="15" fill="#38bdf8" fontSize="13" fontWeight="bold">E</text>
                <text x="285" y="190" fill="#38bdf8" fontSize="13" fontWeight="bold">F</text>

                {/* Marked angle arcs */}
                <path d="M 155 50 A 25 25 0 0 1 140 70" fill="none" stroke="#fbbf24" strokeWidth="2" />
                <text x="125" y="45" fill="#fbbf24" fontSize="12" fontWeight="600">{data.params?.angle || 65}°</text>

                <path d="M 205 140 A 25 25 0 0 1 220 120" fill="none" stroke="#38bdf8" strokeWidth="2" />
                <text x="228" y="135" fill="#38bdf8" fontSize="12" fontWeight="600">x</text>
              </g>
            )}

            {isTriangle && (
              <g className="rv-triangle-group">
                {/* Triangle ABC */}
                <polygon points="180,30 70,160 290,160" fill="rgba(56, 189, 248, 0.08)" stroke="#38bdf8" strokeWidth="3" strokeLinejoin="round" />
                <text x="175" y="22" fill="#f8fafc" fontSize="13" fontWeight="bold">A</text>
                <text x="55" y="172" fill="#f8fafc" fontSize="13" fontWeight="bold">B</text>
                <text x="298" y="172" fill="#f8fafc" fontSize="13" fontWeight="bold">C</text>

                {/* Equal side ticks for isosceles */}
                {data.params?.equalSides && (
                  <>
                    {/* Tick on AB */}
                    <line x1="120" y1="90" x2="130" y2="100" stroke="#ffb300" strokeWidth="2.5" />
                    {/* Tick on AC */}
                    <line x1="230" y1="90" x2="240" y2="100" stroke="#ffb300" strokeWidth="2.5" />
                  </>
                )}

                {/* Extended line for exterior angle */}
                <line x1="290" y1="160" x2="345" y2="160" stroke="#94a3b8" strokeDasharray="4,4" strokeWidth="2" />
                <text x="350" y="165" fill="#94a3b8" fontSize="13">D</text>

                {/* Apex angle */}
                <text x="172" y="60" fill="#fbbf24" fontSize="12" fontWeight="600">{data.params?.angleA || 40}°</text>
                {/* Exterior angle mark */}
                <path d="M 305 160 A 20 20 0 0 0 275 145" fill="none" stroke="#f43f5e" strokeWidth="2" />
                <text x="312" y="145" fill="#f43f5e" fontSize="12" fontWeight="bold">?</text>
              </g>
            )}

            {isAuxiliary && (
              <g className="rv-auxiliary-group">
                {/* AB */}
                <line x1="40" y1="40" x2="320" y2="40" stroke="#94a3b8" strokeWidth="3" />
                <text x="25" y="45" fill="#f8fafc" fontSize="13" fontWeight="bold">A</text>
                <text x="328" y="45" fill="#f8fafc" fontSize="13" fontWeight="bold">B</text>
                <path d="M 175 36 L 185 40 L 175 44" fill="none" stroke="#ffb300" strokeWidth="2" />

                {/* CD */}
                <line x1="40" y1="160" x2="320" y2="160" stroke="#94a3b8" strokeWidth="3" />
                <text x="25" y="165" fill="#f8fafc" fontSize="13" fontWeight="bold">C</text>
                <text x="328" y="165" fill="#f8fafc" fontSize="13" fontWeight="bold">D</text>
                <path d="M 175 156 L 185 160 L 175 164" fill="none" stroke="#ffb300" strokeWidth="2" />

                {/* Zigzag lines to vertex E */}
                <line x1="280" y1="40" x2="180" y2="100" stroke="#38bdf8" strokeWidth="2.5" />
                <line x1="180" y1="100" x2="280" y2="160" stroke="#38bdf8" strokeWidth="2.5" />
                <circle cx="180" cy="100" r="4" fill="#fbbf24" />
                <text x="160" y="105" fill="#fbbf24" fontSize="14" fontWeight="bold">E</text>

                {/* Helper line if toggled */}
                <line x1="40" y1="100" x2="320" y2="100" stroke="#ffb300" strokeDasharray="5,5" strokeWidth="2" />
                <text x="328" y="105" fill="#ffb300" fontSize="12" fontWeight="bold">L ∥ AB</text>

                <text x="250" y="60" fill="#fbbf24" fontSize="12">{data.params?.angle1 || 35}°</text>
                <text x="250" y="150" fill="#fbbf24" fontSize="12">{data.params?.angle2 || 25}°</text>
              </g>
            )}
          </svg>
        </div>

        {/* Text description for complete accessibility (PRD §12) */}
        <p className="rv-accessible-caption">
          {isParallelLines && `Figure description: Lines AB and CD cut by transversal EF. Marked angle = ${data.params?.angle || 65}°. ${data.params?.isParallel !== false ? 'Marked with parallel arrows (AB ∥ CD).' : 'No parallel arrows.'}`}
          {isTriangle && `Figure description: Triangle ABC with AB = AC (marked isosceles). Apex angle A = ${data.params?.angleA || 40}°. Base BC extended to D.`}
          {isAuxiliary && `Figure description: Parallel lines AB and CD with interior vertex E. Helper parallel line drawn through E.`}
        </p>
      </div>
    );
  }

  // 2. TRANSVERSAL PAIRS: Highlights Z, F, C shapes with interactive visual cues
  if (type === 'transversal-pairs') {
    const { pairType = 'alternate', letter = 'Z-shape', angle = 65, isParallel = true } = data;
    return (
      <div className={`reasoning-visual-card ${compact ? 'compact' : ''}`}>
        <div className="rv-badge-row">
          <span className="rv-pair-letter-badge">{letter}</span>
          <span className="rv-pair-type-badge">{pairType.toUpperCase()} ANGLES</span>
        </div>

        <div className="rv-letter-shape-showcase">
          <svg viewBox="0 0 320 160" className="rv-svg">
            {/* Parallel lines */}
            <line x1="40" y1="45" x2="280" y2="45" stroke="#64748b" strokeWidth="2.5" />
            <line x1="40" y1="115" x2="280" y2="115" stroke="#64748b" strokeWidth="2.5" />

            {/* Parallel arrows */}
            {isParallel && (
              <>
                <path d="M 155 41 L 165 45 L 155 49" fill="none" stroke="#ffb300" strokeWidth="2.5" />
                <path d="M 155 111 L 165 115 L 155 119" fill="none" stroke="#ffb300" strokeWidth="2.5" />
              </>
            )}

            {/* Shape highlight */}
            {pairType === 'alternate' && (
              /* Z-shape in vibrant gold */
              <path d="M 100 45 L 200 45 L 120 115 L 220 115" fill="none" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
            )}

            {pairType === 'corresponding' && (
              /* F-shape in electric blue */
              <g>
                <line x1="160" y1="20" x2="160" y2="140" stroke="#0ea5e9" strokeWidth="4" strokeLinecap="round" />
                <line x1="160" y1="45" x2="240" y2="45" stroke="#0ea5e9" strokeWidth="4" strokeLinecap="round" />
                <line x1="160" y1="115" x2="240" y2="115" stroke="#0ea5e9" strokeWidth="4" strokeLinecap="round" />
              </g>
            )}

            {pairType === 'co-interior' && (
              /* C-shape in violet */
              <path d="M 210 45 L 140 45 L 140 115 L 210 115" fill="none" stroke="#a855f7" strokeWidth="4" strokeLinecap="round" />
            )}
          </svg>
        </div>

        <p className="rv-accessible-caption">
          Memory aid: <strong>{letter}</strong> highlights {pairType} angles between the rails.
          {pairType === 'co-interior' ? ' They are supplementary (add to 180°).' : ' They are equal when lines are parallel.'}
        </p>
      </div>
    );
  }

  // 3. REASONING CHAIN: Step-by-step argument display with rulebook citations
  if (type === 'reasoning-chain') {
    const steps = data.steps || [];
    return (
      <div className={`reasoning-visual-card ${compact ? 'compact' : ''}`}>
        <div className="rv-badge-row">
          <span className="rv-evidence-badge">⚖️ Argument Docket</span>
          <span className="rv-scale-badge">{steps.length} Logical Steps</span>
        </div>
        <div className="rv-chain-list">
          {steps.map((st, idx) => (
            <div key={idx} className="rv-chain-step-card">
              <span className="rv-step-index">{idx + 1}</span>
              <span className="rv-step-text">{st.text || st}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 4. TRIANGLE PAIR: Side-by-side triangles with matching congruence marks
  if (type === 'triangle-pair') {
    const marks = data.marks || {};
    return (
      <div className={`reasoning-visual-card ${compact ? 'compact' : ''}`}>
        <div className="rv-badge-row">
          <span className="rv-evidence-badge">📐 Triangle Correspondence</span>
          <span className="rv-pair-letter-badge">{marks.criterion || 'Congruence Test'}</span>
        </div>

        <div className="rv-svg-container">
          <svg viewBox="0 0 340 140" className="rv-svg" role="img" aria-label="Two triangles with congruence markings">
            {/* Triangle 1: ΔABC */}
            <polygon points="80,25 25,120 135,120" fill="rgba(56, 189, 248, 0.1)" stroke="#38bdf8" strokeWidth="2.5" />
            <text x="75" y="18" fill="#f8fafc" fontSize="12" fontWeight="bold">A</text>
            <text x="12" y="128" fill="#f8fafc" fontSize="12" fontWeight="bold">B</text>
            <text x="142" y="128" fill="#f8fafc" fontSize="12" fontWeight="bold">C</text>

            {/* Triangle 2: ΔDEF */}
            <polygon points="260,25 205,120 315,120" fill="rgba(212, 175, 55, 0.1)" stroke="#ffb300" strokeWidth="2.5" />
            <text x="255" y="18" fill="#f8fafc" fontSize="12" fontWeight="bold">D</text>
            <text x="192" y="128" fill="#f8fafc" fontSize="12" fontWeight="bold">E</text>
            <text x="322" y="128" fill="#f8fafc" fontSize="12" fontWeight="bold">F</text>

            {/* Matching side ticks */}
            <line x1="48" y1="70" x2="57" y2="75" stroke="#38bdf8" strokeWidth="2.5" />
            <line x1="228" y1="70" x2="237" y2="75" stroke="#ffb300" strokeWidth="2.5" />

            <line x1="75" y1="120" x2="85" y2="120" stroke="#38bdf8" strokeWidth="2.5" />
            <line x1="255" y1="120" x2="265" y2="120" stroke="#ffb300" strokeWidth="2.5" />
          </svg>
        </div>

        <p className="rv-accessible-caption">
          Marks: AB = DE, BC = EF. {marks.desc || 'Compare corresponding sides and angles.'}
        </p>
      </div>
    );
  }

  // 5. RULEBOOK: Rule and Condition Display
  if (type === 'rulebook') {
    const info = data.info || {};
    return (
      <div className={`reasoning-visual-card ${compact ? 'compact' : ''}`}>
        <div className="rv-badge-row">
          <span className="rv-evidence-badge">📖 Rulebook Card</span>
          {info.abbrev && <span className="rv-scale-badge">{info.abbrev}</span>}
        </div>
        <div className="rv-rulebook-content">
          <h4 className="rv-rule-title">{info.full || data.claim || 'Geometric Rule'}</h4>
          <p className="rv-rule-condition">
            <strong>Condition:</strong> {info.condition || (data.isTrue ? 'True geometric converse' : 'Can be disproven by counterexample')}
          </p>
          {info.narration && <p className="rv-rule-narration"><em>"{info.narration}"</em></p>}
        </div>
      </div>
    );
  }

  return null;
}
