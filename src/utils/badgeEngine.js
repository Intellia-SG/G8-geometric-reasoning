// src/utils/badgeEngine.js
/**
 * ReasonQuest Badge Engine & Trigger Logic
 * PRD §10 and TRD §7: Gamification badge renames
 */

export const BADGES = [
  { id: 'first_ruling',        icon: '⚖️', label: 'First Ruling',        description: 'Answered your very first case question correctly!' },
  { id: 'order_in_court',      icon: '🔨', label: 'Order in the Court',  description: 'Achieved a streak of 5 correct answers!' },
  { id: 'winning_streak',      icon: '🔥', label: 'Winning Streak',      description: 'Achieved a 10-answer winning streak!' },
  { id: 'full_case_file',      icon: '🗂️', label: 'Full Case File',      description: 'Completed all 4 interactive courtroom stations!' },
  { id: 'case_won',            icon: '⭐', label: 'Case Won',            description: 'Scored 3 stars in a Practice World!' },
  { id: 'objection_sustained', icon: '🏅', label: 'Objection Sustained', description: 'Defeated a World Boss in court battle!' },
  { id: 'seasoned_advocate',   icon: '📜', label: 'Seasoned Advocate',   description: 'Answered over 20 questions in Practice!' },
  { id: 'chief_advocate',      icon: '🏆', label: 'Chief Advocate Badge',description: 'Completed the full 5-phase ReasonQuest journey!' },
];

export function checkBadges(state) {
  const unlocked = [];

  // 1. First correct answer
  const totalCorrect = state.districtCorrect?.reduce((s, c) => s + (c || 0), 0) || 0;
  if (totalCorrect >= 1) unlocked.push('first_ruling');

  // 2. Streaks
  if (state.maxStreak >= 5) unlocked.push('order_in_court');
  if (state.maxStreak >= 10) unlocked.push('winning_streak');

  // 3. All 4 simulations complete
  if (state.simStationsComplete && state.simStationsComplete.every(Boolean)) {
    unlocked.push('full_case_file');
  }

  // 4. Any world scores 3 stars (>= 9 correct in a 10-question set)
  if (state.districtScores && state.districtScores.some((score) => score !== null && score >= 9)) {
    unlocked.push('case_won');
  }

  // 5. 20+ questions answered in Practice
  if (state.currentQuestion >= 20 || totalCorrect >= 20) {
    unlocked.push('seasoned_advocate');
  }

  // 6. Any Boss Battle won
  if (state.bossDefeated) {
    unlocked.push('objection_sustained');
  }

  // 7. Full 5-phase journey complete
  if (state.phaseComplete && Object.values(state.phaseComplete).every(Boolean)) {
    unlocked.push('chief_advocate');
  }

  return unlocked;
}
