import { cn } from '../lib/utils';

// Props interface for the ZiraLogo component
interface ZiraLogoProps {
  size?: number; // Size of the logo in pixels (default: 32)
  showText?: boolean; // Whether to show the "ZIRA Task Manager" text (default: true)
  className?: string; // Additional CSS classes for styling
  variant?: 'sky' | 'violet' | 'emerald'; // Color variant for the logo circle
}

/**
 * ZiraLogo component displays the ZIRA brand logo with customizable styling
 * Features a circular logo with the letter "Z" and optional text branding
 * Responsive design that scales text size based on logo size
 */
export function ZiraLogo({ 
  size = 32, 
  showText = true, 
  className,
  variant = 'sky'
}: ZiraLogoProps) {
  // Color variants for the logo circle background
  const variantColors = {
    sky: 'bg-sky-600', // Blue variant
    violet: 'bg-violet-600', // Purple variant
    emerald: 'bg-emerald-600' // Green variant
  };

  /**
   * Determines appropriate text size based on logo size for responsive design
   * Ensures text remains readable and proportional to the logo
   * @param logoSize - Size of the logo in pixels
   * @returns Tailwind CSS text size class
   */
  const getTextSize = (logoSize: number) => {
    if (logoSize <= 24) return 'text-xs'; // Extra small for tiny logos
    if (logoSize <= 32) return 'text-sm'; // Small for standard logos
    if (logoSize <= 48) return 'text-base'; // Base size for medium logos
    if (logoSize <= 64) return 'text-lg'; // Large for big logos
    return 'text-xl'; // Extra large for very big logos
  };

  const logoTextSize = getTextSize(size);

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* Circular logo with the letter "Z" */}
      <div
        className={cn(
          'flex items-center justify-center rounded-full text-white font-bold shadow-md',
          variantColors[variant]
        )}
        style={{ 
          width: size, 
          height: size, 
          fontSize: Math.max(size * 0.4, 12) // Scale font size with logo size, minimum 12px
        }}
      >
        Z
      </div>
      
      {/* Optional text branding */}
      {showText && (
        <div className="flex flex-col">
          {/* Main brand name */}
          <span className={cn('font-bold text-gray-900', logoTextSize)}>
            ZIRA
          </span>
          {/* Subtitle - smaller for compact logos */}
          <span className={cn('text-gray-500', size <= 32 ? 'text-xs' : 'text-sm')}>
            Task Manager
          </span>
        </div>
      )}
    </div>
  );
} 