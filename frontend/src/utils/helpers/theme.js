/**
 * Theme utilities for managing application themes
 */

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
};

export const getSystemTheme = () => {
  if (typeof window === 'undefined') return THEMES.LIGHT;
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches 
    ? THEMES.DARK 
    : THEMES.LIGHT;
};

export const applyTheme = (theme) => {
  if (typeof document === 'undefined') return;
  
  const root = document.documentElement;
  
  // Remove existing theme classes
  root.classList.remove('light', 'dark');
  
  // Apply new theme
  if (theme === THEMES.SYSTEM) {
    const systemTheme = getSystemTheme();
    root.classList.add(systemTheme);
  } else {
    root.classList.add(theme);
  }
  
  // Store theme preference
  localStorage.setItem('theme', theme);
};

export const getStoredTheme = () => {
  if (typeof localStorage === 'undefined') return THEMES.LIGHT;
  
  return localStorage.getItem('theme') || THEMES.SYSTEM;
};

export const initializeTheme = () => {
  const storedTheme = getStoredTheme();
  applyTheme(storedTheme);
  
  // Listen for system theme changes
  if (typeof window !== 'undefined') {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      const currentTheme = getStoredTheme();
      if (currentTheme === THEMES.SYSTEM) {
        applyTheme(THEMES.SYSTEM);
      }
    };
    
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }
  }
};

export const getThemeColors = (theme) => {
  const colors = {
    [THEMES.LIGHT]: {
      primary: '#1e40af',
      secondary: '#64748b',
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#1f2937',
      textSecondary: '#6b7280',
      border: '#e5e7eb',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6'
    },
    [THEMES.DARK]: {
      primary: '#3b82f6',
      secondary: '#94a3b8',
      background: '#0f172a',
      surface: '#1e293b',
      text: '#f1f5f9',
      textSecondary: '#94a3b8',
      border: '#334155',
      success: '#22c55e',
      warning: '#fbbf24',
      error: '#f87171',
      info: '#60a5fa'
    }
  };
  
  const resolvedTheme = theme === THEMES.SYSTEM ? getSystemTheme() : theme;
  return colors[resolvedTheme] || colors[THEMES.LIGHT];
};

export const createThemeVariables = (theme) => {
  const colors = getThemeColors(theme);
  
  return Object.entries(colors).reduce((vars, [key, value]) => {
    vars[`--color-${key}`] = value;
    return vars;
  }, {});
};

export const isDarkTheme = (theme) => {
  const resolvedTheme = theme === THEMES.SYSTEM ? getSystemTheme() : theme;
  return resolvedTheme === THEMES.DARK;
};