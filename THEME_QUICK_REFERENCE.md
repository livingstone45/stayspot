# Theme System Quick Reference

## How to Use Theme in Your Component

### Quick Start (2 steps)

#### Step 1: Import the hook
```jsx
import { useThemeMode } from '../../hooks/useThemeMode';
```

#### Step 2: Use in your component
```jsx
const MyComponent = () => {
  const { isDark, getClassNames } = useThemeMode();
  
  return (
    <div className={`min-h-screen ${getClassNames.background}`}>
      <h1 className={getClassNames.text}>Hello World</h1>
      <div className={getClassNames.surface}>Content</div>
    </div>
  );
};
```

## Theme Color Classes

```javascript
// These are automatically set based on selected theme
getClassNames = {
  // Main background (page/container background)
  background: 'bg-gray-900' | 'bg-gray-50'
  
  // Card/component background
  surface: 'bg-gray-800' | 'bg-white'
  
  // Card background with hover effect
  surfaceHover: 'bg-gray-700 hover:bg-gray-600' | 'bg-gray-50 hover:bg-gray-100'
  
  // Primary text color
  text: 'text-white' | 'text-gray-900'
  
  // Secondary/muted text
  textSecondary: 'text-gray-400' | 'text-gray-600'
  
  // Border color
  border: 'border-gray-700' | 'border-gray-200'
  
  // Form inputs and fields
  input: 'bg-gray-700 text-white border-gray-600' | 'bg-white text-gray-900 border-gray-300'
  
  // Card wrapper
  card: 'bg-gray-800 text-white' | 'bg-white text-gray-900'
}
```

## Common Patterns

### Pattern 1: Page Container
```jsx
<div className={`min-h-screen transition-colors duration-300 ${getClassNames.background}`}>
  <div className="max-w-7xl mx-auto px-4">
    <h1 className={getClassNames.text}>Page Title</h1>
  </div>
</div>
```

### Pattern 2: Card Component
```jsx
<div className={`rounded-lg shadow p-6 ${getClassNames.surface}`}>
  <h2 className={getClassNames.text}>Card Title</h2>
  <p className={getClassNames.textSecondary}>Description</p>
</div>
```

### Pattern 3: Hover Effect
```jsx
<div className={`rounded-lg p-4 ${getClassNames.surfaceHover} transition`}>
  Hover over me!
</div>
```

### Pattern 4: Form Input
```jsx
<input 
  type="text"
  className={`rounded-lg ${getClassNames.input} px-4 py-2 focus:outline-none focus:ring-2`}
  placeholder="Enter text"
/>
```

### Pattern 5: Button with Hover
```jsx
<button className={`rounded-lg p-2 border ${getClassNames.border} ${getClassNames.surfaceHover}`}>
  Click me
</button>
```

## Helper Functions

### getSurfaceClass(lightClass, darkClass)
For custom surface styling:
```jsx
<div className={getSurfaceClass('bg-blue-50', 'bg-blue-900')}>
  Custom surface
</div>
```

### getTextClass(lightClass, darkClass)
For custom text styling:
```jsx
<h1 className={getTextClass('text-blue-900', 'text-blue-100')}>
  Custom heading
</h1>
```

### getBorderClass(lightClass, darkClass)
For custom border styling:
```jsx
<div className={`border-2 ${getBorderClass('border-blue-300', 'border-blue-700')}`}>
  Custom border
</div>
```

## Available Properties from Hook

```jsx
const {
  isDark,           // boolean: true if dark theme is active
  currentTheme,     // string: currently selected theme ID
  resolvedTheme,    // string: actual theme being used
  setTheme,         // function: (themeId) => void
  getClassNames,    // object: pre-built Tailwind classes
  getSurfaceClass,  // function: custom surface class selector
  getTextClass,     // function: custom text class selector
  getBorderClass,   // function: custom border class selector
} = useThemeMode();
```

## Theme IDs

Use these IDs with `setTheme()`:
- `'light'` - Light theme
- `'dark'` - Dark theme
- `'blue'` - Ocean Blue theme
- `'green'` - Forest Green theme
- `'purple'` - Purple theme
- `'coral'` - Coral theme

Example:
```jsx
// Change to dark theme
setTheme('dark');

// Change to blue theme
setTheme('blue');
```

## Smooth Transitions

For smooth color transitions when theme changes, add this class:
```jsx
<div className="transition-colors duration-300 {getClassNames.background}">
  Content with smooth theme transitions
</div>
```

## Testing Your Theme

1. Go to Settings page
2. Select a different theme
3. Your component should immediately reflect the change
4. Refresh the page - theme should persist

## Common Issues & Solutions

### Issue: Colors not changing
**Solution**: Make sure you're using `getClassNames` properties instead of hardcoded Tailwind classes.

### Issue: Text not visible
**Solution**: Use `getClassNames.text` for primary text and `getClassNames.textSecondary` for secondary text.

### Issue: Transitions not smooth
**Solution**: Add `transition-colors duration-300` class to your container.

### Issue: Can't access theme in component
**Solution**: Make sure your component is wrapped by `<ThemeProvider>` (already done in App.jsx).

## Performance Tips

1. Use `getClassNames` directly instead of conditionals
2. Memoize theme-dependent values with `useMemo` if needed
3. Theme is only recalculated when `resolvedTheme` changes
4. No additional API calls - all client-side

---

**Last Updated**: December 20, 2025  
**Version**: 1.0  
**Status**: Production Ready ✅
