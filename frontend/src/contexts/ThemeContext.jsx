import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react';

const ThemeContext = createContext();

const THEMES = {
  light: {
    name: 'light',
    colors: {
      primary: '#3B82F6',
      secondary: '#6B7280',
      accent: '#10B981',
      background: '#FFFFFF',
      surface: '#F9FAFB',
      text: '#111827',
      textSecondary: '#6B7280',
      border: '#E5E7EB',
      error: '#EF4444',
      warning: '#F59E0B',
      success: '#10B981',
      info: '#3B82F6'
    },
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
    }
  },
  dark: {
    name: 'dark',
    colors: {
      primary: '#60A5FA',
      secondary: '#9CA3AF',
      accent: '#34D399',
      background: '#111827',
      surface: '#1F2937',
      text: '#F9FAFB',
      textSecondary: '#9CA3AF',
      border: '#374151',
      error: '#F87171',
      warning: '#FBBF24',
      success: '#34D399',
      info: '#60A5FA'
    },
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.4)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.4)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.4)'
    }
  },
  blue: {
    name: 'blue',
    colors: {
      primary: '#0369A1',
      secondary: '#0C4A6E',
      accent: '#06B6D4',
      background: '#F0F9FF',
      surface: '#E0F2FE',
      text: '#082F49',
      textSecondary: '#0C4A6E',
      border: '#BAE6FD',
      error: '#DC2626',
      warning: '#F59E0B',
      success: '#10B981',
      info: '#0369A1'
    },
    shadows: {
      sm: '0 1px 2px 0 rgba(3, 105, 161, 0.05)',
      md: '0 4px 6px -1px rgba(3, 105, 161, 0.1)',
      lg: '0 10px 15px -3px rgba(3, 105, 161, 0.1)',
      xl: '0 20px 25px -5px rgba(3, 105, 161, 0.1)'
    }
  },
  green: {
    name: 'green',
    colors: {
      primary: '#15803D',
      secondary: '#166534',
      accent: '#059669',
      background: '#F0FDF4',
      surface: '#DCFCE7',
      text: '#14532D',
      textSecondary: '#166534',
      border: '#86EFAC',
      error: '#DC2626',
      warning: '#F59E0B',
      success: '#15803D',
      info: '#059669'
    },
    shadows: {
      sm: '0 1px 2px 0 rgba(21, 128, 61, 0.05)',
      md: '0 4px 6px -1px rgba(21, 128, 61, 0.1)',
      lg: '0 10px 15px -3px rgba(21, 128, 61, 0.1)',
      xl: '0 20px 25px -5px rgba(21, 128, 61, 0.1)'
    }
  },
  purple: {
    name: 'purple',
    colors: {
      primary: '#7C3AED',
      secondary: '#6D28D9',
      accent: '#A855F7',
      background: '#FAF5FF',
      surface: '#F3E8FF',
      text: '#4C1D95',
      textSecondary: '#6D28D9',
      border: '#D8B4FE',
      error: '#DC2626',
      warning: '#F59E0B',
      success: '#10B981',
      info: '#7C3AED'
    },
    shadows: {
      sm: '0 1px 2px 0 rgba(124, 58, 237, 0.05)',
      md: '0 4px 6px -1px rgba(124, 58, 237, 0.1)',
      lg: '0 10px 15px -3px rgba(124, 58, 237, 0.1)',
      xl: '0 20px 25px -5px rgba(124, 58, 237, 0.1)'
    }
  },
  coral: {
    name: 'coral',
    colors: {
      primary: '#EA580C',
      secondary: '#C2410C',
      accent: '#F97316',
      background: '#FFF7ED',
      surface: '#FFEDD5',
      text: '#5A2E0F',
      textSecondary: '#7C2D12',
      border: '#FDBA74',
      error: '#DC2626',
      warning: '#F59E0B',
      success: '#10B981',
      info: '#EA580C'
    },
    shadows: {
      sm: '0 1px 2px 0 rgba(234, 88, 12, 0.05)',
      md: '0 4px 6px -1px rgba(234, 88, 12, 0.1)',
      lg: '0 10px 15px -3px rgba(234, 88, 12, 0.1)',
      xl: '0 20px 25px -5px rgba(234, 88, 12, 0.1)'
    }
  },
  system: {
    name: 'system',
    followsSystem: true
  }
};

const FONT_SIZES = {
  xs: '0.75rem',
  sm: '0.875rem',
  base: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  '3xl': '1.875rem',
  '4xl': '2.25rem'
};

const SPACING = {
  0: '0',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
  20: '5rem',
  24: '6rem'
};

const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
};

const initialState = {
  currentTheme: 'system',
  resolvedTheme: 'light',
  customTheme: null,
  fontSize: 'base',
  fontFamily: 'Inter, system-ui, sans-serif',
  borderRadius: 'md',
  animations: true,
  reducedMotion: false,
  highContrast: false,
  colorBlindMode: 'none',
  compactMode: false,
  sidebarCollapsed: false,
  preferences: {
    autoSave: true,
    syncAcrossDevices: true,
    rememberLayout: true
  },
  customColors: {},
  layout: {
    headerHeight: '64px',
    sidebarWidth: '256px',
    sidebarCollapsedWidth: '64px',
    contentPadding: '24px'
  },
  loading: false,
  error: null
};

const themeReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'SET_THEME':
      const newResolvedTheme = action.payload === 'system' 
        ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        : action.payload;
      if (state.currentTheme === action.payload && state.resolvedTheme === newResolvedTheme) {
        return state;
      }
      return { 
        ...state, 
        currentTheme: action.payload,
        resolvedTheme: newResolvedTheme
      };
    
    case 'SET_RESOLVED_THEME':
      if (state.resolvedTheme === action.payload) {
        return state;
      }
      return { ...state, resolvedTheme: action.payload };
    
    case 'SET_CUSTOM_THEME':
      return { ...state, customTheme: action.payload };
    
    case 'SET_FONT_SIZE':
      return { ...state, fontSize: action.payload };
    
    case 'SET_FONT_FAMILY':
      return { ...state, fontFamily: action.payload };
    
    case 'SET_BORDER_RADIUS':
      return { ...state, borderRadius: action.payload };
    
    case 'TOGGLE_ANIMATIONS':
      return { ...state, animations: action.payload };
    
    case 'SET_REDUCED_MOTION':
      return { ...state, reducedMotion: action.payload };
    
    case 'TOGGLE_HIGH_CONTRAST':
      return { ...state, highContrast: action.payload };
    
    case 'SET_COLOR_BLIND_MODE':
      return { ...state, colorBlindMode: action.payload };
    
    case 'TOGGLE_COMPACT_MODE':
      return { ...state, compactMode: action.payload };
    
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarCollapsed: action.payload };
    
    case 'UPDATE_PREFERENCES':
      return { 
        ...state, 
        preferences: { ...state.preferences, ...action.payload }
      };
    
    case 'SET_CUSTOM_COLORS':
      return { ...state, customColors: action.payload };
    
    case 'UPDATE_LAYOUT':
      return { 
        ...state, 
        layout: { ...state.layout, ...action.payload }
      };
    
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    
    default:
      return state;
  }
};

export const ThemeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(themeReducer, initialState);

  const setTheme = useCallback((theme) => {
    dispatch({ type: 'SET_THEME', payload: theme });
    localStorage.setItem('theme', theme);
    applyThemeToDocument(theme);
  }, []);

  const setCustomTheme = useCallback((customTheme) => {
    dispatch({ type: 'SET_CUSTOM_THEME', payload: customTheme });
    localStorage.setItem('customTheme', JSON.stringify(customTheme));
    applyCustomThemeToDocument(customTheme);
  }, []);

  const applyThemeToDocument = useCallback((themeName) => {
    const theme = THEMES[themeName] || THEMES.light;
    const root = document.documentElement;
    let resolvedThemeName = themeName;
    
    if (theme.followsSystem) {
      resolvedThemeName = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    const themeToApply = THEMES[resolvedThemeName] || THEMES.light;
    
    Object.entries(themeToApply.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
    
    Object.entries(themeToApply.shadows).forEach(([key, value]) => {
      root.style.setProperty(`--shadow-${key}`, value);
    });
    
    root.className = root.className.replace(/theme-\w+/g, '');
    root.classList.add(`theme-${themeToApply.name}`);
    root.style.colorScheme = themeToApply.name;
    
    dispatch({ type: 'SET_RESOLVED_THEME', payload: resolvedThemeName });
  }, []);

  const applyCustomThemeToDocument = useCallback((customTheme) => {
    if (!customTheme) return;
    
    const root = document.documentElement;
    
    Object.entries(customTheme.colors || {}).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
    
    if (customTheme.borderRadius) {
      root.style.setProperty('--border-radius', customTheme.borderRadius);
    }
    
    if (customTheme.fontFamily) {
      root.style.setProperty('--font-family', customTheme.fontFamily);
    }
  }, []);

  const setFontSize = useCallback((size) => {
    dispatch({ type: 'SET_FONT_SIZE', payload: size });
    
    const root = document.documentElement;
    root.style.setProperty('--font-size-base', FONT_SIZES[size] || FONT_SIZES.base);
    
    localStorage.setItem('fontSize', size);
  }, []);

  const setFontFamily = useCallback((family) => {
    dispatch({ type: 'SET_FONT_FAMILY', payload: family });
    
    const root = document.documentElement;
    root.style.setProperty('--font-family', family);
    
    localStorage.setItem('fontFamily', family);
  }, []);

  const setBorderRadius = useCallback((radius) => {
    dispatch({ type: 'SET_BORDER_RADIUS', payload: radius });
    
    const radiusValues = {
      none: '0',
      sm: '0.125rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      full: '9999px'
    };
    
    const root = document.documentElement;
    root.style.setProperty('--border-radius', radiusValues[radius] || radiusValues.md);
    
    localStorage.setItem('borderRadius', radius);
  }, []);

  const toggleAnimations = useCallback((enabled) => {
    dispatch({ type: 'TOGGLE_ANIMATIONS', payload: enabled });
    
    const root = document.documentElement;
    if (enabled) {
      root.classList.remove('no-animations');
    } else {
      root.classList.add('no-animations');
    }
    
    localStorage.setItem('animations', enabled.toString());
  }, []);

  const setReducedMotion = useCallback((enabled) => {
    dispatch({ type: 'SET_REDUCED_MOTION', payload: enabled });
    
    const root = document.documentElement;
    if (enabled) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }
    
    localStorage.setItem('reducedMotion', enabled.toString());
  }, []);

  const toggleHighContrast = useCallback((enabled) => {
    dispatch({ type: 'TOGGLE_HIGH_CONTRAST', payload: enabled });
    
    const root = document.documentElement;
    if (enabled) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    localStorage.setItem('highContrast', enabled.toString());
  }, []);

  const setColorBlindMode = useCallback((mode) => {
    dispatch({ type: 'SET_COLOR_BLIND_MODE', payload: mode });
    
    const root = document.documentElement;
    root.className = root.className.replace(/colorblind-\w+/g, '');
    
    if (mode !== 'none') {
      root.classList.add(`colorblind-${mode}`);
    }
    
    localStorage.setItem('colorBlindMode', mode);
  }, []);

  const toggleCompactMode = useCallback((enabled) => {
    dispatch({ type: 'TOGGLE_COMPACT_MODE', payload: enabled });
    
    const root = document.documentElement;
    if (enabled) {
      root.classList.add('compact-mode');
    } else {
      root.classList.remove('compact-mode');
    }
    
    localStorage.setItem('compactMode', enabled.toString());
  }, []);

  const toggleSidebar = useCallback((collapsed) => {
    dispatch({ type: 'TOGGLE_SIDEBAR', payload: collapsed });
    localStorage.setItem('sidebarCollapsed', collapsed.toString());
  }, []);

  const updatePreferences = useCallback((newPreferences) => {
    dispatch({ type: 'UPDATE_PREFERENCES', payload: newPreferences });
    localStorage.setItem('themePreferences', JSON.stringify({
      ...state.preferences,
      ...newPreferences
    }));
  }, [state.preferences]);

  const setCustomColors = useCallback((colors) => {
    dispatch({ type: 'SET_CUSTOM_COLORS', payload: colors });
    
    const root = document.documentElement;
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-custom-${key}`, value);
    });
    
    localStorage.setItem('customColors', JSON.stringify(colors));
  }, []);

  const updateLayout = useCallback((layoutUpdates) => {
    dispatch({ type: 'UPDATE_LAYOUT', payload: layoutUpdates });
    
    const root = document.documentElement;
    Object.entries(layoutUpdates).forEach(([key, value]) => {
      root.style.setProperty(`--layout-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`, value);
    });
    
    localStorage.setItem('layout', JSON.stringify({
      ...state.layout,
      ...layoutUpdates
    }));
  }, [state.layout]);

  const resetTheme = useCallback(() => {
    localStorage.removeItem('theme');
    localStorage.removeItem('customTheme');
    localStorage.removeItem('fontSize');
    localStorage.removeItem('fontFamily');
    localStorage.removeItem('borderRadius');
    localStorage.removeItem('animations');
    localStorage.removeItem('reducedMotion');
    localStorage.removeItem('highContrast');
    localStorage.removeItem('colorBlindMode');
    localStorage.removeItem('compactMode');
    localStorage.removeItem('customColors');
    localStorage.removeItem('layout');
    
    setTheme('system');
    setFontSize('base');
    setFontFamily('Inter, system-ui, sans-serif');
    setBorderRadius('md');
    toggleAnimations(true);
    setReducedMotion(false);
    toggleHighContrast(false);
    setColorBlindMode('none');
    toggleCompactMode(false);
    setCustomColors({});
    updateLayout(initialState.layout);
  }, [setTheme, setFontSize, setFontFamily, setBorderRadius, toggleAnimations, setReducedMotion, toggleHighContrast, setColorBlindMode, toggleCompactMode, setCustomColors, updateLayout]);

  const exportTheme = useCallback(() => {
    return {
      theme: state.currentTheme,
      customTheme: state.customTheme,
      fontSize: state.fontSize,
      fontFamily: state.fontFamily,
      borderRadius: state.borderRadius,
      animations: state.animations,
      reducedMotion: state.reducedMotion,
      highContrast: state.highContrast,
      colorBlindMode: state.colorBlindMode,
      compactMode: state.compactMode,
      customColors: state.customColors,
      layout: state.layout,
      preferences: state.preferences
    };
  }, [state]);

  const importTheme = useCallback((themeConfig) => {
    try {
      if (themeConfig.theme) setTheme(themeConfig.theme);
      if (themeConfig.customTheme) setCustomTheme(themeConfig.customTheme);
      if (themeConfig.fontSize) setFontSize(themeConfig.fontSize);
      if (themeConfig.fontFamily) setFontFamily(themeConfig.fontFamily);
      if (themeConfig.borderRadius) setBorderRadius(themeConfig.borderRadius);
      if (typeof themeConfig.animations === 'boolean') toggleAnimations(themeConfig.animations);
      if (typeof themeConfig.reducedMotion === 'boolean') setReducedMotion(themeConfig.reducedMotion);
      if (typeof themeConfig.highContrast === 'boolean') toggleHighContrast(themeConfig.highContrast);
      if (themeConfig.colorBlindMode) setColorBlindMode(themeConfig.colorBlindMode);
      if (typeof themeConfig.compactMode === 'boolean') toggleCompactMode(themeConfig.compactMode);
      if (themeConfig.customColors) setCustomColors(themeConfig.customColors);
      if (themeConfig.layout) updateLayout(themeConfig.layout);
      if (themeConfig.preferences) updatePreferences(themeConfig.preferences);
      
      return { success: true };
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to import theme configuration' });
      return { success: false, error: err.message };
    }
  }, [setTheme, setCustomTheme, setFontSize, setFontFamily, setBorderRadius, toggleAnimations, setReducedMotion, toggleHighContrast, setColorBlindMode, toggleCompactMode, setCustomColors, updateLayout, updatePreferences]);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const currentThemeConfig = useMemo(() => {
    if (state.customTheme) {
      return state.customTheme;
    }
    return THEMES[state.resolvedTheme] || THEMES.light;
  }, [state.resolvedTheme, state.customTheme]);

  const isDarkMode = useMemo(() => {
    return state.resolvedTheme === 'dark';
  }, [state.resolvedTheme]);

  const cssVariables = useMemo(() => {
    const vars = {};
    
    if (currentThemeConfig.colors) {
      Object.entries(currentThemeConfig.colors).forEach(([key, value]) => {
        vars[`--color-${key}`] = value;
      });
    }
    
    Object.entries(state.customColors).forEach(([key, value]) => {
      vars[`--color-custom-${key}`] = value;
    });
    
    Object.entries(state.layout).forEach(([key, value]) => {
      vars[`--layout-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`] = value;
    });
    
    vars['--font-size-base'] = FONT_SIZES[state.fontSize];
    vars['--font-family'] = state.fontFamily;
    
    return vars;
  }, [currentThemeConfig, state.customColors, state.layout, state.fontSize, state.fontFamily]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'system';
    const savedCustomTheme = localStorage.getItem('customTheme');
    const savedFontSize = localStorage.getItem('fontSize') || 'base';
    const savedFontFamily = localStorage.getItem('fontFamily') || 'Inter, system-ui, sans-serif';
    const savedBorderRadius = localStorage.getItem('borderRadius') || 'md';
    const savedAnimations = localStorage.getItem('animations') !== 'false';
    const savedReducedMotion = localStorage.getItem('reducedMotion') === 'true';
    const savedHighContrast = localStorage.getItem('highContrast') === 'true';
    const savedColorBlindMode = localStorage.getItem('colorBlindMode') || 'none';
    const savedCompactMode = localStorage.getItem('compactMode') === 'true';
    const savedSidebarCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    const savedCustomColors = localStorage.getItem('customColors');
    const savedLayout = localStorage.getItem('layout');
    const savedPreferences = localStorage.getItem('themePreferences');

    setTheme(savedTheme);
    if (savedCustomTheme) setCustomTheme(JSON.parse(savedCustomTheme));
    setFontSize(savedFontSize);
    setFontFamily(savedFontFamily);
    setBorderRadius(savedBorderRadius);
    toggleAnimations(savedAnimations);
    setReducedMotion(savedReducedMotion);
    toggleHighContrast(savedHighContrast);
    setColorBlindMode(savedColorBlindMode);
    toggleCompactMode(savedCompactMode);
    toggleSidebar(savedSidebarCollapsed);
    if (savedCustomColors) setCustomColors(JSON.parse(savedCustomColors));
    if (savedLayout) updateLayout(JSON.parse(savedLayout));
    if (savedPreferences) updatePreferences(JSON.parse(savedPreferences));
  }, [setTheme, setCustomTheme, setFontSize, setFontFamily, setBorderRadius, toggleAnimations, setReducedMotion, toggleHighContrast, setColorBlindMode, toggleCompactMode, setCustomColors, updateLayout, updatePreferences]);

  useEffect(() => {
    if (state.currentTheme) {
      applyThemeToDocument(state.currentTheme);
    }
  }, [state.currentTheme, applyThemeToDocument]);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'theme') {
        const newTheme = e.newValue || 'system';
        dispatch({ type: 'SET_THEME', payload: newTheme });
        applyThemeToDocument(newTheme);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [applyThemeToDocument]);

  useEffect(() => {
    if (state.currentTheme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = (e) => {
        const newTheme = e.matches ? 'dark' : 'light';
        dispatch({ type: 'SET_RESOLVED_THEME', payload: newTheme });
        applyThemeToDocument('system');
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [state.currentTheme, applyThemeToDocument]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleChange = (e) => {
      if (e.matches && !state.reducedMotion) {
        setReducedMotion(true);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    if (mediaQuery.matches && !state.reducedMotion) {
      setReducedMotion(true);
    }
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [state.reducedMotion, setReducedMotion]);

  const value = useMemo(() => ({
    ...state,
    currentThemeConfig,
    isDarkMode,
    cssVariables,
    themes: THEMES,
    fontSizes: FONT_SIZES,
    spacing: SPACING,
    breakpoints: BREAKPOINTS,
    setTheme,
    setCustomTheme,
    setFontSize,
    setFontFamily,
    setBorderRadius,
    toggleAnimations,
    setReducedMotion,
    toggleHighContrast,
    setColorBlindMode,
    toggleCompactMode,
    toggleSidebar,
    updatePreferences,
    setCustomColors,
    updateLayout,
    resetTheme,
    exportTheme,
    importTheme,
    clearError
  }), [
    state,
    currentThemeConfig,
    isDarkMode,
    cssVariables,
    setTheme,
    setCustomTheme,
    setFontSize,
    setFontFamily,
    setBorderRadius,
    toggleAnimations,
    setReducedMotion,
    toggleHighContrast,
    setColorBlindMode,
    toggleCompactMode,
    toggleSidebar,
    updatePreferences,
    setCustomColors,
    updateLayout,
    resetTheme,
    exportTheme,
    importTheme,
    clearError
  ]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
