import { cn } from '../lib/utils';

interface ZiraLogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
  variant?: 'sky' | 'violet' | 'emerald';
}

export function ZiraLogo({ 
  size = 32, 
  showText = true, 
  className,
  variant = 'sky'
}: ZiraLogoProps) {
  const variantColors = {
    sky: 'bg-sky-600',
    violet: 'bg-violet-600',
    emerald: 'bg-emerald-600'
  };

  // Determine text size based on logo size
  const getTextSize = (logoSize: number) => {
    if (logoSize <= 24) return 'text-xs';
    if (logoSize <= 32) return 'text-sm';
    if (logoSize <= 48) return 'text-base';
    if (logoSize <= 64) return 'text-lg';
    return 'text-xl';
  };

  const logoTextSize = getTextSize(size);

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div
        className={cn(
          'flex items-center justify-center rounded-full text-white font-bold shadow-md',
          variantColors[variant]
        )}
        style={{ 
          width: size, 
          height: size, 
          fontSize: Math.max(size * 0.4, 12) // Minimum font size of 12px
        }}
      >
        Z
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={cn('font-bold text-gray-900', logoTextSize)}>
            ZIRA
          </span>
          <span className={cn('text-gray-500', size <= 32 ? 'text-xs' : 'text-sm')}>
            Task Manager
          </span>
        </div>
      )}
    </div>
  );
} 