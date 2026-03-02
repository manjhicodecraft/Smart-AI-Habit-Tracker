import React from 'react';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <div className="empty-state">
        <p>No data available yet</p>
        <p className="empty-state-subtext">Start by adding your first habit</p>
      </div>
    </div>
  );
};

export default Dashboard;