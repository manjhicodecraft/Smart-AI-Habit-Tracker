import React, { useState, useEffect } from 'react';
import './HabitForm.css';

const HabitForm = ({ habit, onSubmit, onCancel, isEditing = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    frequency: 'DAILY',
    targetCount: 1,
    userId: 1 // Default user ID for now
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (habit && isEditing) {
      setFormData({
        name: habit.name || '',
        description: habit.description || '',
        category: habit.category || '',
        frequency: habit.frequency || 'DAILY',
        targetCount: habit.targetCount || 1,
        userId: habit.userId || 1
      });
    }
  }, [habit, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Habit name is required';
    }
    
    if (!formData.frequency) {
      newErrors.frequency = 'Frequency is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        ...formData,
        targetCount: parseInt(formData.targetCount)
      });
    }
  };

  const frequencies = [
    { value: 'DAILY', label: 'Daily' },
    { value: 'WEEKLY', label: 'Weekly' },
    { value: 'CUSTOM', label: 'Custom' }
  ];

  const categories = [
    'Health', 'Fitness', 'Learning', 'Productivity', 
    'Creativity', 'Relationships', 'Finance', 'Other'
  ];

  return (
    <div className="habit-form-container">
      <form className="habit-form" onSubmit={handleSubmit}>
        <div className="form-header">
          <h2>{isEditing ? 'Edit Habit' : 'Create New Habit'}</h2>
        </div>
        
        <div className="form-group">
          <label htmlFor="name">Habit Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? 'error' : ''}
            placeholder="Enter habit name"
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your habit (optional)"
            rows="3"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Select category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="frequency">Frequency *</label>
            <select
              id="frequency"
              name="frequency"
              value={formData.frequency}
              onChange={handleChange}
              className={errors.frequency ? 'error' : ''}
            >
              {frequencies.map(freq => (
                <option key={freq.value} value={freq.value}>
                  {freq.label}
                </option>
              ))}
            </select>
            {errors.frequency && <span className="error-message">{errors.frequency}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="targetCount">Target Count per Period</label>
          <input
            type="number"
            id="targetCount"
            name="targetCount"
            value={formData.targetCount}
            onChange={handleChange}
            min="1"
            max="10"
          />
          <small>How many times you want to complete this habit per {formData.frequency.toLowerCase()} period</small>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {isEditing ? 'Update Habit' : 'Create Habit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HabitForm;