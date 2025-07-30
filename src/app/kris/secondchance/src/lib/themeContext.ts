import { createContext } from 'react';

// Theme type definition
export type Theme = 'light' | 'dark';

// Theme context interface
export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

// Create theme context
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined); 