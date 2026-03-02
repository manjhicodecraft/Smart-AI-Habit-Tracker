// Page titles configuration with new color theme
export const PAGE_TITLES = {
  dashboard: 'Dashboard',
  analytics: 'Analytics',
  habits: 'Habits',
  'add-habit': 'Add Habit'
};

// Helper function to get page title
export const getPageTitle = (pageKey) => {
  return PAGE_TITLES[pageKey] || 'Dashboard';
};

// Helper function to validate page key
export const isValidPage = (pageKey) => {
  return Object.keys(PAGE_TITLES).includes(pageKey);
};

// Color theme constants
export const COLOR_THEME = {
  // Primary colors
  primary: '#2563EB',      // Smart Blue - Trust + Focus
  secondary: '#14B8A6',    // Soft Teal - Growth & Consistency
  
  // Background colors
  background: '#F8FAFC',   // Very Light Gray - Soft white feel
  card: '#FFFFFF',         // Clean White
  
  // Text colors
  heading: '#0F172A',      // Dark heading text
  text: '#334155',         // Normal text
  lightText: '#64748B',    // Light text
  
  // Status colors for habit tracking
  completed: '#22C55E',    // Green - Completed habits
  missed: '#EF4444',       // Soft Red - Missed habits
  pending: '#F59E0B',      // Amber - Pending habits
  streak: '#8B5CF6'        // Purple - Streak highlight
};