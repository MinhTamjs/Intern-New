import { useContext } from 'react';
import { ThemeContext } from './themeContext';

/**
 * Custom hook to access theme context
 * Provides theme state and toggle function
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 