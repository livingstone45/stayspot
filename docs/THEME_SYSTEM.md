# Global Theme System

The StaySpot dashboard now includes a comprehensive global theme system that allows users to change the entire dashboard's appearance from the Settings page.

## Features

- **Multiple Theme Options**: Light, Dark, Ocean Blue, Forest Green, Purple, and Coral
- **Global Application**: Theme changes apply instantly across the entire dashboard
- **Persistent Storage**: Theme preference is saved to localStorage
- **Dark Mode Detection**: Supports system-wide dark mode preference detection
- **Smooth Transitions**: CSS transitions for theme color changes

## Available Themes

1. **Light** - Clean and bright interface (default)
2. **Dark** - Easy on the eyes with dark backgrounds
3. **Ocean Blue** - Cool and professional blue tones
4. **Forest Green** - Natural and calm green tones
5. **Purple** - Modern and elegant purple tones
6. **Coral** - Warm and inviting coral/orange tones

## How It Works

### Theme Context
The theme system is powered by `ThemeContext.jsx` which provides:
- `currentTheme` - Currently selected theme ID
- `resolvedTheme` - The actual theme being used (light/dark)
- `setTheme(themeId)` - Function to change the theme
- Additional utilities for theme management

### Custom Hook
The `useThemeMode` hook provides convenient access to theme functionality:

```jsx
import { useThemeMode } from '../../hooks/useThemeMode';

const MyComponent = () => {
  const { isDark, getClassNames, setTheme } = useThemeMode();
  
  return (
    <div className={getClassNames.background}>
      <h1 className={getClassNames.text}>Hello</h1>
    </div>
  );
};
```

### Using Theme in Components

#### Method 1: Using `useThemeMode` hook (Recommended)
```jsx
import { useThemeMode } from '../../hooks/useThemeMode';

const Dashboard = () => {
  const { isDark, getClassNames } = useThemeMode();
  
  return (
    <div className={getClassNames.background}>
      <h1 className={getClassNames.text}>Dashboard</h1>
      <div className={getClassNames.surface}>Content</div>
    </div>
  );
};
```

#### Method 2: Using `useTheme` hook directly
```jsx
import { useTheme } from '../../contexts/ThemeContext';

const Settings = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  
  return (
    <div className={isDark ? 'bg-gray-900' : 'bg-gray-50'}>
      {/* Component JSX */}
    </div>
  );
};
```

## CSS Class Utilities

The `useThemeMode` hook provides pre-built class combinations:

```javascript
getClassNames = {
  background: 'bg-gray-900' | 'bg-gray-50',
  surface: 'bg-gray-800' | 'bg-white',
  surfaceHover: 'bg-gray-700 hover:bg-gray-600' | 'bg-gray-50 hover:bg-gray-100',
  text: 'text-white' | 'text-gray-900',
  textSecondary: 'text-gray-400' | 'text-gray-600',
  border: 'border-gray-700' | 'border-gray-200',
  input: 'bg-gray-700 text-white border-gray-600' | 'bg-white text-gray-900 border-gray-300',
  card: 'bg-gray-800 text-white' | 'bg-white text-gray-900',
}
```

## Helper Functions

### `getSurfaceClass(lightClass, darkClass)`
Returns the appropriate surface class based on theme:
```jsx
<div className={getSurfaceClass('bg-white', 'bg-gray-800')}>
```

### `getTextClass(lightClass, darkClass)`
Returns the appropriate text color class:
```jsx
<p className={getTextClass('text-gray-900', 'text-white')}>
```

### `getBorderClass(lightClass, darkClass)`
Returns the appropriate border color class:
```jsx
<div className={`border ${getBorderClass('border-gray-200', 'border-gray-700')}`}>
```

## Theme Storage

- Theme preference is automatically saved to `localStorage.theme`
- Theme preference persists across browser sessions
- The theme applies instantly when the page loads

## Adding a New Component with Theme Support

1. Import the theme hook:
```jsx
import { useThemeMode } from '../../hooks/useThemeMode';
```

2. Use it in your component:
```jsx
const MyComponent = () => {
  const { isDark, getClassNames } = useThemeMode();
  
  return (
    <div className={`min-h-screen transition-colors duration-300 ${getClassNames.background}`}>
      {/* Your content here */}
    </div>
  );
};
```

3. Use the helper functions for conditional styling:
```jsx
<h1 className={getClassNames.text}>Title</h1>
<div className={getClassNames.surface}>Content</div>
<button className={`border ${getClassNames.border}`}>Button</button>
```

## Files Modified/Created

- `src/contexts/ThemeContext.jsx` - Enhanced with blue, green, purple, and coral themes
- `src/hooks/useThemeMode.js` - New custom hook for easier theme usage
- `src/pages/tenant/Settings.jsx` - Updated to use global theme system
- `src/pages/tenant/Dashboard.jsx` - Updated to support theme changes
- `src/App.jsx` - Already configured with ThemeProvider

## Best Practices

1. Always use `useThemeMode` hook for new components
2. Use the `getClassNames` utilities instead of hardcoding color classes
3. Add `transition-colors duration-300` to containers for smooth theme transitions
4. Test components in both light and dark modes
5. Use semantic color names (background, surface, text) instead of specific colors

## Future Enhancements

- Custom color picker for advanced users
- Per-component theme overrides
- Theme synchronization across devices (with cloud sync)
- Additional predefined themes
- Animation preferences tied to theme
