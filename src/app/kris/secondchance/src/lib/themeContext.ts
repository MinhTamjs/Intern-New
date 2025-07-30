import { createContext } from 'react';

// Define theme types
export type Theme = 'light' | 'dark';

// Theme context interface
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

// Create theme context
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined); 