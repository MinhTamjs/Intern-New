import { useContext } from 'react';
import { ThemeContext } from './themeContext';

/**
 * Hook to use theme context
 * @returns Theme context with current theme and theme management functions
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 