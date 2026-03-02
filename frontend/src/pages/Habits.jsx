import React from 'react';

const Habits = () => {
  return (
    <div className="habits-page">
      <div className="habits-content">
        <div className="empty-state">
          <p>No habits created yet</p>
          <p className="empty-state-subtext">Click the + button to add your first habit</p>
        </div>
      </div>
    </div>
  );
};

export default Habits;