import { X } from 'lucide-react';
import type { TaskLabel } from '../types';
import { useTheme } from '../../../lib/theme/useTheme';

interface LabelProps {
  label: TaskLabel;
  onRemove?: (labelId: string) => void;
  className?: string;
  showRemoveButton?: boolean;
}

export function Label({ label, onRemove, className = '', showRemoveButton = false }: LabelProps) {
  const { theme } = useTheme();
  
  // Adjust colors for dark mode
  const bgColor = theme === 'dark' ? `${label.bgColor}20` : label.bgColor;
  const textColor = theme === 'dark' ? label.color : label.textColor;

  return (
    <div
      className={`
        inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
        transition-all duration-200 hover:shadow-sm cursor-default
        ${className}
      `}
      style={{
        backgroundColor: bgColor,
        color: textColor,
        border: `1px solid ${label.color}20`
      }}
    >
      <span className="truncate max-w-20">{label.name}</span>
      {showRemoveButton && onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(label.id);
          }}
          className="ml-1 p-0.5 rounded-full hover:bg-black/10 transition-colors"
          title="Remove label"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
} 