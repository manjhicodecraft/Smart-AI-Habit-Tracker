import React from 'react';
import './StreakCounter.css';

const StreakCounter = ({ currentStreak, longestStreak, totalCompletions }) => {
  return (
    <div className="streak-counter">
      <div className="streak-item">
        <div className="streak-number current">{currentStreak || 0}</div>
        <div className="streak-label">Current Streak</div>
      </div>
      
      <div className="streak-item">
        <div className="streak-number longest">{longestStreak || 0}</div>
        <div className="streak-label">Longest Streak</div>
      </div>
      
      <div className="streak-item">
        <div className="streak-number total">{totalCompletions || 0}</div>
        <div className="streak-label">Total Completions</div>
      </div>
    </div>
  );
};

export default StreakCounter;