import React, { useEffect, useState } from 'react';
import { ThemeContext } from './themeContext';
import type { Theme } from './themeContext';

// Theme provider props
interface ThemeProviderProps {
  children: React.ReactNode;
}

/**
 * Theme provider component
 * Manages theme state and localStorage persistence
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  // Theme state
  const [theme, setTheme] = useState<Theme>('light');

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
} 