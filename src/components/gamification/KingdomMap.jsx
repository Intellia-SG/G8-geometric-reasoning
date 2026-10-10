// src/components/gamification/KingdomMap.jsx
import React from 'react';
import './KingdomMap.css';
import StarRating from './StarRating.jsx';
import { calcStars } from '../../utils/scoring.js';
import { DISTRICTS } from '../../data/questionBank.js';

export default function KingdomMap({ districtScores, districtCorrect, currentDistrict, onSelectDistrict }) {
  return (
    <div className="kingdom-grid">
      {DISTRICTS.map((dist, idx) => {
        const isCurrent = idx === currentDistrict;
        const isCompleted = districtScores?.[idx] !== null && districtScores?.[idx] !== undefined;
        const isUnlocked = idx <= currentDistrict || isCompleted;
        const correct = districtCorrect?.[idx] || 0;
        const stars = isCompleted ? calcStars(districtScores[idx]) : 0;

        return (
          <div
            key={dist.id}
            className={`kingdom-district-card ${isCurrent ? 'current' : ''} ${isCompleted ? 'completed' : ''} ${!isUnlocked ? 'locked' : ''}`}
            onClick={() => isUnlocked && onSelectDistrict && onSelectDistrict(idx)}
            role="button"
            tabIndex={isUnlocked ? 0 : -1}
          >
            {/* Card Top: W badge and Q range */}
            <div className="district-card-top">
              <span className="district-w-badge">W{idx + 1}</span>
              <span className="district-q-label">Q{idx * 10 + 1}–{(idx + 1) * 10}</span>
            </div>

            {/* Center Icon */}
            <div className="district-icon-wrap">
              {isCurrent ? (
                <svg className="concentric-target-svg" width="34" height="34" viewBox="0 0 36 36" fill="none">
                  <circle cx="18" cy="18" r="14" stroke="#00e699" strokeWidth="2.5" />
                  <circle cx="18" cy="18" r="8" stroke="#00e699" strokeWidth="2.2" />
                  <circle cx="18" cy="18" r="3" fill="#00e699" />
                </svg>
              ) : isCompleted ? (
                <span className="district-icon">✅</span>
              ) : !isUnlocked ? (
                <span className="district-icon lock-icon">🔒</span>
              ) : (
                <span className="district-icon">{dist.icon}</span>
              )}
            </div>

            {/* World Name */}
            <div className="district-name" title={dist.name}>{dist.name}</div>

            {/* Bottom Status / Action */}
            <div className="district-action-row">
              {isCompleted ? (
                <span className="district-action completed">{correct}/10 ★{stars}</span>
              ) : isCurrent ? (
                <span className="district-action active">Play →</span>
              ) : !isUnlocked ? (
                <span className="district-action locked">Locked</span>
              ) : (
                <span className="district-action ready">Enter →</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
