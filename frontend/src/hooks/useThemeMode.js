import { useContext } from 'react';
import ThemeContext from '../contexts/ThemeContext';

export const useThemeMode = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      currentTheme: 'light',
      resolvedTheme: 'light',
      isDarkMode: false,
      setTheme: () => {},
      themes: {}
    };
  }
  return context;
};

export default useThemeMode;
