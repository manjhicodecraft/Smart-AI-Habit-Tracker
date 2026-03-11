import React from 'react';

const Dashboard = () => {
  const handleNavigate = (hash) => {
    window.location.hash = `#${hash}`;
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h2 className="dashboard-title">Home</h2>
          <p className="dashboard-subtitle">
            Get a quick overview of your habits and jump into detailed views.
          </p>
        </div>
      </div>

      <div className="dashboard-grid">
        <button
          type="button"
          className="dashboard-card"
          onClick={() => handleNavigate('habit-views')}
        >
          <div className="dashboard-card-header">
            <h3 className="dashboard-card-title">Habit Views</h3>
          </div>
          <p className="dashboard-card-text">
            Weekly, Monthly, Yearly sheet view of all your habits with clear color indicators for each day.
          </p>
        </button>

        <button
          type="button"
          className="dashboard-card secondary"
          onClick={() => handleNavigate('habits')}
        >
          <div className="dashboard-card-header">
            <h3 className="dashboard-card-title">Manage Habits</h3>
          </div>
          <p className="dashboard-card-text">
            Create and organize your habits to start tracking your progress consistently.
          </p>
        </button>

        <button
          type="button"
          className="dashboard-card secondary"
          onClick={() => handleNavigate('analytics')}
        >
          <div className="dashboard-card-header">
            <h3 className="dashboard-card-title">Analytics</h3>
          </div>
          <p className="dashboard-card-text">
            Dive deeper into your streaks, completion rates, and long‑term performance trends.
          </p>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
