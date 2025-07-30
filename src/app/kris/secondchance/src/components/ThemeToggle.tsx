import { Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';
import { useTheme } from '../lib/useTheme';

/**
 * Theme toggle button component
 * Switches between light and dark themes
 */
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="h-9 w-9"
    >
      {theme === 'light' ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
} 