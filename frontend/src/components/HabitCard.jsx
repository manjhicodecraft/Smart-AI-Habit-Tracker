import React from 'react';
import { formatDateTime, isToday } from '../utils/dateUtils';
import './HabitCard.css';

const HabitCard = ({ habit, onMarkComplete, onEdit, onDelete, stats }) => {
  const { 
    id, 
    name, 
    description, 
    category, 
    frequency, 
    createdAt 
  } = habit;

  const {
    totalCompletions = 0,
    currentStreak = 0,
    longestStreak = 0,
    completionRate = 0
  } = stats || {};

  const handleMarkComplete = () => {
    if (onMarkComplete) {
      onMarkComplete(id);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(habit);
    }
  };

  const handleDelete = () => {
    if (onDelete && window.confirm('Are you sure you want to delete this habit?')) {
      onDelete(id);
    }
  };

  return (
    <div className="habit-card">
      <div className="habit-header">
        <div className="habit-info">
          <h3 className="habit-name">{name}</h3>
          {description && <p className="habit-description">{description}</p>}
          <div className="habit-meta">
            {category && <span className="habit-category">{category}</span>}
            <span className="habit-frequency">{frequency}</span>
            <span className="habit-created">Created: {formatDateTime(createdAt)}</span>
          </div>
        </div>
        <div className="habit-actions">
          <button 
            className="btn btn-primary"
            onClick={handleMarkComplete}
          >
            Mark Complete
          </button>
          <button 
            className="btn btn-secondary"
            onClick={handleEdit}
          >
            Edit
          </button>
          <button 
            className="btn btn-danger"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>
      
      <div className="habit-stats">
        <div className="stat-item">
          <span className="stat-label">Total Completions</span>
          <span className="stat-value">{totalCompletions}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Current Streak</span>
          <span className="stat-value streak-current">{currentStreak}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Longest Streak</span>
          <span className="stat-value streak-longest">{longestStreak}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Completion Rate</span>
          <span className="stat-value">{completionRate.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
};

export default HabitCard;