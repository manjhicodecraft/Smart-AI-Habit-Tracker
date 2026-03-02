import React, { useState } from 'react';
import { Droplets, BookOpen, Monitor } from 'lucide-react';
import './Analytics.css';

const Analytics = () => {
  const [timeFilter, setTimeFilter] = useState('week'); // Default to week view

  // Dummy data for analytics with new color scheme
  const analyticsData = {
    habits: [
      {
        id: 'water',
        name: 'Water',
        percentage: 92,
        icon: Droplets,
        color: '#2563EB', // Smart Blue
        bgColor: 'rgba(37, 99, 235, 0.1)',
        iconColor: '#2563EB'
      },
      {
        id: 'study',
        name: 'Study',
        percentage: 78,
        icon: BookOpen,
        color: '#14B8A6', // Soft Teal
        bgColor: 'rgba(20, 184, 166, 0.1)',
        iconColor: '#14B8A6'
      },
      {
        id: 'coding',
        name: 'Coding',
        percentage: 85,
        icon: Monitor,
        color: '#8B5CF6', // Purple (Streak Highlight)
        bgColor: 'rgba(139, 92, 246, 0.1)',
        iconColor: '#8B5CF6'
      }
    ],
    // Main chart data - varies by time filter
    chartData: {
      year: [
        { month: 'Jan', value: 65 },
        { month: 'Feb', value: 72 },
        { month: 'Mar', value: 80 },
        { month: 'Apr', value: 75 },
        { month: 'May', value: 88 },
        { month: 'Jun', value: 60 },
        { month: 'Jul', value: 70 },
        { month: 'Aug', value: 75 },
        { month: 'Sep', value: 82 },
        { month: 'Oct', value: 78 },
        { month: 'Nov', value: 85 },
        { month: 'Dec', value: 90 }
      ],
      month: [
        { week: 'Week 1', value: 65 },
        { week: 'Week 2', value: 72 },
        { week: 'Week 3', value: 80 },
        { week: 'Week 4', value: 75 }
      ],
      week: [
        { day: 'Mon', value: 65 },
        { day: 'Tue', value: 72 },
        { day: 'Wed', value: 80 },
        { day: 'Thu', value: 75 },
        { day: 'Fri', value: 88 },
        { day: 'Sat', value: 60 },
        { day: 'Sun', value: 70 }
      ]
    }
  };

  const renderMainChart = () => {
    // Get data based on selected time filter
    let data = [];
    let labelKey = '';
    
    switch(timeFilter) {
      case 'year':
        data = analyticsData.chartData.year;
        labelKey = 'month';
        break;
      case 'month':
        data = analyticsData.chartData.month;
        labelKey = 'week';
        break;
      case 'week':
      default:
        data = analyticsData.chartData.week;
        labelKey = 'day';
        break;
    }

    const maxValue = Math.max(...data.map(d => d.value));
    const minValue = Math.min(...data.map(d => d.value));
    const range = maxValue - minValue;
    
    // Generate smooth curve points with better scaling
    const points = data.map((item, index) => {
      const x = (index / (data.length - 1)) * 100;
      // Scale Y values to use more of the chart area (85% instead of 80%)
      const y = 100 - ((item.value - minValue) / range) * 85;
      return `${x},${y}`;
    }).join(' ');

    return (
      <div className="main-chart-container">
        <div className="chart-header">
          <h2>Performance Trends</h2>
          <div className="time-filter-options">
            <button 
              className={`filter-btn ${timeFilter === 'week' ? 'active' : ''}`}
              onClick={() => setTimeFilter('week')}
            >
              Week
            </button>
            <button 
              className={`filter-btn ${timeFilter === 'month' ? 'active' : ''}`}
              onClick={() => setTimeFilter('month')}
            >
              Month
            </button>
            <button 
              className={`filter-btn ${timeFilter === 'year' ? 'active' : ''}`}
              onClick={() => setTimeFilter('year')}
            >
              Year
            </button>
          </div>
        </div>
        
        <div className="chart-wrapper">
          <svg viewBox="0 0 100 100" className="performance-chart" preserveAspectRatio="none">
            {/* Grid lines */}
            <line x1="0" y1="15" x2="100" y2="15" className="grid-line" />
            <line x1="0" y1="35" x2="100" y2="35" className="grid-line" />
            <line x1="0" y1="55" x2="100" y2="55" className="grid-line" />
            <line x1="0" y1="75" x2="100" y2="75" className="grid-line" />
            <line x1="0" y1="95" x2="100" y2="95" className="grid-line" />
            
            {/* Main trend line - Ultra-thin at 0.5px */}
            <polyline
              points={points}
              fill="none"
              stroke="#2563EB"
              strokeWidth="0.5"
              className="trend-line"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            
            {/* Gradient area under curve */}
            <defs>
              <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#2563EB" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#2563EB" stopOpacity="0.02" />
              </linearGradient>
            </defs>
            <polygon 
              points={`0,100 ${points} 100,100`} 
              fill="url(#chartGradient)" 
            />
            
            {/* Data points - Also 0.5px for consistency */}
            {data.map((item, index) => {
              const x = (index / (data.length - 1)) * 100;
              const y = 100 - ((item.value - minValue) / range) * 85;
              return (
                <g key={index}>
                  <circle
                    cx={x}
                    cy={y}
                    r="0.5"
                    fill="#2563EB"
                    stroke="#FFFFFF"
                    strokeWidth="0.25"
                    className="data-point"
                  />
                </g>
              );
            })}
          </svg>
          
          {/* X-axis labels */}
          <div className="chart-labels">
            {data.map((item, index) => (
              <span key={index} className="x-label">{item[labelKey]}</span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderUnifiedCircularChart = () => {
    // Calculate total percentage for proportional segments
    const totalPercentage = analyticsData.habits.reduce((sum, habit) => sum + habit.percentage, 0);
    const avgPercentage = Math.round(totalPercentage / analyticsData.habits.length);
    
    // Calculate cumulative angles for each segment
    let cumulativeAngle = 0;
    
    return (
      <div className="unified-circular-container">
        <div className="unified-circular-content">
          <svg width="160" height="160" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#E2E8F0"
              strokeWidth="6"
            />
            
            {/* Habit segments */}
            {analyticsData.habits.map((habit, index) => {
              const percentage = habit.percentage;
              const angle = (percentage / 100) * 360;
              const startAngle = cumulativeAngle;
              const endAngle = cumulativeAngle + angle;
              
              // Convert angles to radians
              const startRad = (startAngle - 90) * (Math.PI / 180);
              const endRad = (endAngle - 90) * (Math.PI / 180);
              
              // Calculate start and end points
              const x1 = 50 + 40 * Math.cos(startRad);
              const y1 = 50 + 40 * Math.sin(startRad);
              const x2 = 50 + 40 * Math.cos(endRad);
              const y2 = 50 + 40 * Math.sin(endRad);
              
              // Large arc flag (1 if angle > 180, 0 otherwise)
              const largeArcFlag = angle > 180 ? 1 : 0;
              
              const pathData = [
                `M ${x1} ${y1}`,
                `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`
              ].join(' ');
              
              cumulativeAngle += angle;
              
              return (
                <path
                  key={habit.id}
                  d={pathData}
                  fill="none"
                  stroke={habit.color}
                  strokeWidth="6"
                  strokeLinecap="round"
                />
              );
            })}
            
            {/* Center circle */}
            <circle
              cx="50"
              cy="50"
              r="22"
              fill="#FFFFFF"
            />
            
            {/* Center content */}
            <text
              x="50"
              y="48"
              textAnchor="middle"
              fill="#0F172A"
              fontSize="11"
              fontWeight="bold"
            >
              {avgPercentage}%
            </text>
            <text
              x="50"
              y="58"
              textAnchor="middle"
              fill="#64748B"
              fontSize="5"
            >
              Avg
            </text>
          </svg>
        </div>
        
        {/* Legend */}
        <div className="habit-legend">
          {analyticsData.habits.map((habit) => {
            const IconComponent = habit.icon;
            return (
              <div key={habit.id} className="legend-item">
                <div 
                  className="legend-color"
                  style={{ backgroundColor: habit.color }}
                ></div>
                <div 
                  className="legend-icon"
                  style={{ color: habit.iconColor }}
                >
                  <IconComponent size={11} />
                </div>
                <span className="legend-text">{habit.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="analytics">
      <div className="analytics-layout-improved">
        {/* Left Side - Main Chart */}
        <div className="main-chart-section-improved">
          {renderMainChart()}
        </div>
        
        {/* Right Side - Unified Circular Analytics */}
        <div className="circular-analytics-section-improved">
          <div className="circular-header">
            <h2>Habit Distribution</h2>
          </div>
          {renderUnifiedCircularChart()}
        </div>
      </div>
    </div>
  );
};

export default Analytics;