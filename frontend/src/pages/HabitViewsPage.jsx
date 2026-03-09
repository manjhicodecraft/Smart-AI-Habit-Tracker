import React, { useMemo, useState } from 'react';
import './HabitViewsPage.css';

const VIEW_MODES = {
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
};

// Temporary sample data – can be replaced with real habit data later
const SAMPLE_HABITS = [
  { id: 1, name: 'Morning Run' },
  { id: 2, name: 'Reading (30 mins)' },
  { id: 3, name: 'Meditation' },
  { id: 4, name: 'Coding Practice' },
];

const WeeklyLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const generateProgressMatrix = (length) => {
  // 0 = missed, 1 = partial, 2 = full
  const pattern = [2, 1, 0, 2, 2, 1, 0];
  const cells = [];
  for (let i = 0; i < length; i += 1) {
    cells.push(pattern[i % pattern.length]);
  }
  return cells;
};

const getStatusLabel = (status) => {
  if (status === 2) return 'Completed';
  if (status === 1) return 'Partially completed';
  return 'Missed';
};

const HabitViewsPage = () => {
  const [viewMode, setViewMode] = useState(VIEW_MODES.WEEKLY);

  const gridConfig = useMemo(() => {
    switch (viewMode) {
      case VIEW_MODES.MONTHLY:
        return { title: 'Monthly View', columns: 7, total: 35 };
      case VIEW_MODES.YEARLY:
        return { title: 'Yearly View', columns: 12, total: 48 };
      case VIEW_MODES.WEEKLY:
      default:
        return { title: 'Weekly View', columns: 7, total: 7 };
    }
  }, [viewMode]);

  const habitsWithProgress = useMemo(
    () =>
      SAMPLE_HABITS.map((habit, index) => ({
        ...habit,
        progress: generateProgressMatrix(gridConfig.total).map((status, cellIndex) => ({
          status,
          key: `${habit.id}-${gridConfig.title}-${cellIndex}`,
        })),
        intensity: (index + 1) / SAMPLE_HABITS.length,
      })),
    [gridConfig.total, gridConfig.title],
  );

  return (
    <div className="habit-views-page">
      <div className="views-header">
        <div>
          <h2 className="views-title">Habit Views</h2>
          <p className="views-subtitle">
            Visualize your habit performance over different time ranges using clean, color‑coded
            heatmaps.
          </p>
        </div>
        <div className="view-toggle" aria-label="Select habit view range">
          <button
            type="button"
            className={`view-toggle-button ${
              viewMode === VIEW_MODES.WEEKLY ? 'active' : ''
            }`}
            onClick={() => setViewMode(VIEW_MODES.WEEKLY)}
          >
            Weekly
          </button>
          <button
            type="button"
            className={`view-toggle-button ${
              viewMode === VIEW_MODES.MONTHLY ? 'active' : ''
            }`}
            onClick={() => setViewMode(VIEW_MODES.MONTHLY)}
          >
            Monthly
          </button>
          <button
            type="button"
            className={`view-toggle-button ${
              viewMode === VIEW_MODES.YEARLY ? 'active' : ''
            }`}
            onClick={() => setViewMode(VIEW_MODES.YEARLY)}
          >
            Yearly
          </button>
        </div>
      </div>

      <div className="views-legend">
        <span className="legend-label">Color indicators:</span>
        <span className="legend-item">
          <span className="legend-dot legend-dot-full" />
          Dark green – fully completed
        </span>
        <span className="legend-item">
          <span className="legend-dot legend-dot-partial" />
          Light green / yellow – partially completed
        </span>
        <span className="legend-item">
          <span className="legend-dot legend-dot-missed" />
          Red – missed
        </span>
      </div>

      <div className="habit-views-grid">
        {habitsWithProgress.map((habit) => (
          <section key={habit.id} className="habit-view-card">
            <header className="habit-view-card-header">
              <div>
                <h3 className="habit-view-name">{habit.name}</h3>
                <p className="habit-view-meta">
                  {gridConfig.title} • Lightweight, color‑coded progress overview
                </p>
              </div>
            </header>
            <div
              className="habit-view-heatmap"
              style={{ gridTemplateColumns: `repeat(${gridConfig.columns}, minmax(0, 1fr))` }}
            >
              {habit.progress.map((cell, index) => {
                const label =
                  viewMode === VIEW_MODES.WEEKLY
                    ? WeeklyLabels[index] || `Day ${index + 1}`
                    : `Day ${index + 1}`;
                const statusLabel = getStatusLabel(cell.status);
                const cellClass =
                  cell.status === 2
                    ? 'heatmap-cell-full'
                    : cell.status === 1
                    ? 'heatmap-cell-partial'
                    : 'heatmap-cell-missed';

                return (
                  <div
                    key={cell.key}
                    className={`heatmap-cell ${cellClass}`}
                    aria-label={`${habit.name} • ${label} • ${statusLabel}`}
                    title={`${label} – ${statusLabel}`}
                  />
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default HabitViewsPage;

