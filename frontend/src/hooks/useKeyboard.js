import { useEffect, useCallback } from 'react';

/**
 * Hook for keyboard shortcuts
 */
export const useKeyboard = (keyMap, dependencies = []) => {
  const handleKeyDown = useCallback((event) => {
    const key = event.key.toLowerCase();
    const combo = [];
    
    if (event.ctrlKey || event.metaKey) combo.push('ctrl');
    if (event.shiftKey) combo.push('shift');
    if (event.altKey) combo.push('alt');
    combo.push(key);
    
    const keyCombo = combo.join('+');
    
    if (keyMap[keyCombo]) {
      event.preventDefault();
      keyMap[keyCombo](event);
    }
  }, dependencies);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
};

/**
 * Hook for escape key handling
 */
export const useEscapeKey = (callback, dependencies = []) => {
  const handleEscape = useCallback((event) => {
    if (event.key === 'Escape') {
      callback(event);
    }
  }, dependencies);

  useEffect(() => {
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [handleEscape]);
};

/**
 * Hook for arrow key navigation
 */
export const useArrowNavigation = (onNavigate, dependencies = []) => {
  const handleArrowKeys = useCallback((event) => {
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        onNavigate('up');
        break;
      case 'ArrowDown':
        event.preventDefault();
        onNavigate('down');
        break;
      case 'ArrowLeft':
        event.preventDefault();
        onNavigate('left');
        break;
      case 'ArrowRight':
        event.preventDefault();
        onNavigate('right');
        break;
    }
  }, dependencies);

  useEffect(() => {
    document.addEventListener('keydown', handleArrowKeys);
    return () => document.removeEventListener('keydown', handleArrowKeys);
  }, [handleArrowKeys]);
};

export default useKeyboard;