import { useTheme } from '../lib/theme/useTheme';
import { Link } from 'react-router-dom';

interface ConditionalLogoProps {
  size?: number; // Height in px (default: 40)
  className?: string;
}

/**
 * ConditionalLogo: Renders different logo images based on current theme
 * Automatically switches between lightmode.png and darkmode.png
 * Clickable logo that navigates to dashboard
 */
export function ConditionalLogo({ size = 40, className = '' }: ConditionalLogoProps) {
  const { theme } = useTheme();

  return (
    <Link 
      to="/" 
      className={`block transition-opacity duration-200 hover:opacity-80 ${className}`}
    >
      <div>
        {/* Light mode logo */}
        {theme === 'light' && (
          <img
            src="/lightmode.png"
            alt="Zira Logo Light"
            className="transition-opacity duration-300 ease-in-out"
            style={{
              height: size,
              width: 'auto',
              userSelect: 'none',
              backgroundColor: 'transparent',
            }}
          />
        )}
        
        {/* Dark mode logo */}
        {theme === 'dark' && (
          <img
            src="/darkmode.png"
            alt="Zira Logo Dark"
            className="transition-opacity duration-300 ease-in-out"
            style={{
              height: size,
              width: 'auto',
              userSelect: 'none',
              backgroundColor: 'transparent',
            }}
          />
        )}
      </div>
    </Link>
  );
} 