// src/components/quiz/QuestionRenderer.jsx
import React, { useState, useEffect } from 'react';
import './QuestionRenderer.css';
import ReasoningVisual from '../shared/ReasoningVisual.jsx';

export default function QuestionRenderer({
  question,
  onAnswer,
  hintsShown,
  showHint,
  onHint,
  isLocked,
  onPrev,
  onNext,
  canPrev,
}) {
  const [orderedSteps, setOrderedSteps] = useState([]);

  const categoryTag = question?.category || 'GEOMETRIC REASONING';
  const isOrderingQuestion = categoryTag.includes('ORDER') && question?.visualData?.steps;

  useEffect(() => {
    if (isOrderingQuestion && question?.visualData?.steps) {
      setOrderedSteps([...question.visualData.steps]);
    }
  }, [question?.id, isOrderingQuestion, question?.visualData?.steps]);

  if (!question) return null;

  const { questionText, options, visual, visualData, hint1, hint2 } = question;

  function moveStep(idx, direction) {
    if (isLocked) return;
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= orderedSteps.length) return;
    const updated = [...orderedSteps];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    setOrderedSteps(updated);
  }

  function submitOrderedSteps() {
    if (isLocked) return;
    // Form sequence e.g. "A → B → C → D"
    const seq = orderedSteps.map((s) => s.key).join(' → ');
    onAnswer(seq);
  }

  return (
    <div className="qr-wrap glass-card anim-slide-up">
      {/* Top category badge tag */}
      <div className="qr-category-badge">
        <span className="cat-icon">⚖️</span> {categoryTag}
      </div>

      {/* Question text */}
      <p className="qr-question">{questionText}</p>

      {/* Visual exhibit / figure if available */}
      {visual && visualData && (
        <div className="qr-visual">
          <ReasoningVisual type={visual} data={visualData} compact={true} />
        </div>
      )}

      {/* Interactive Step Ordering Mode */}
      {isOrderingQuestion ? (
        <div className="qr-interactive-ordering">
          <div className="qr-order-list" role="list" aria-label="Orderable argument steps">
            {orderedSteps.map((step, idx) => (
              <div key={step.key || idx} className="qr-order-item" role="listitem">
                <span className="qr-order-num">{idx + 1}</span>
                <span className="qr-order-text">{step.text}</span>
                <div className="qr-order-controls">
                  <button
                    type="button"
                    className="qr-order-btn"
                    onClick={() => moveStep(idx, -1)}
                    disabled={isLocked || idx === 0}
                    aria-label={`Move step ${idx + 1} up`}
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    className="qr-order-btn"
                    onClick={() => moveStep(idx, 1)}
                    disabled={isLocked || idx === orderedSteps.length - 1}
                    aria-label={`Move step ${idx + 1} down`}
                  >
                    ▼
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="btn btn-primary qr-submit-order-btn"
            onClick={submitOrderedSteps}
            disabled={isLocked}
          >
            Submit Argument Order ⚖️
          </button>

          {/* Quick select options fallback for keyboard accessibility */}
          <div className="qr-order-options-fallback">
            <span className="qr-options-label">Or choose proposed docket sequence:</span>
            <div className="options-grid">
              {options?.map((opt, i) => (
                <button
                  key={i}
                  className="option-btn"
                  onClick={() => !isLocked && onAnswer(opt)}
                  disabled={isLocked}
                  aria-label={`Option: ${opt}`}
                >
                  <span>{opt}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Standard / Reason Selection / Sufficiency Options Grid */
        <div className="options-grid">
          {options?.map((opt, i) => (
            <button
              key={i}
              className="option-btn"
              onClick={() => !isLocked && onAnswer(opt)}
              disabled={isLocked}
              aria-label={`Option: ${opt}`}
            >
              <span>{opt}</span>
            </button>
          ))}
        </div>
      )}

      {/* Hint display */}
      {showHint === 1 && hint1 && (
        <div className="qr-hint anim-slide-up">
          <span className="hint-icon">💡</span>
          <span>{hint1}</span>
        </div>
      )}
      {showHint === 2 && hint2 && (
        <div className="qr-hint anim-slide-up">
          <span className="hint-icon">🔑</span>
          <span>{hint2}</span>
        </div>
      )}

      {/* Bottom Action Row: Hint Button + Prev + Next in one sleek bar */}
      <div className="qr-actions-row">
        {hintsShown < 2 && onHint ? (
          <button className="btn btn-outline btn-sm hint-btn" onClick={onHint} aria-label="Show hint">
            💡 Hint {hintsShown + 1}
          </button>
        ) : <div />}

        <div className="qr-nav-btns">
          {onPrev && (
            <button
              className="btn btn-outline btn-sm qr-nav-btn"
              onClick={onPrev}
              disabled={!canPrev}
              aria-label="Previous question"
            >
              ← Prev Question
            </button>
          )}
          {onNext && (
            <button
              className="btn btn-primary btn-sm qr-nav-btn"
              onClick={onNext}
              aria-label="Next question"
            >
              Next Question →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
