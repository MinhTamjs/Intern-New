import { Button } from './ui/button';
import { ZiraLogo } from './ZiraLogo';

// Props interface for the EmptyState component
interface EmptyStateProps {
  title: string; // Main heading for the empty state
  description: string; // Descriptive text explaining the empty state
  action?: { // Optional action button
    label: string; // Button text
    onClick: () => void; // Click handler for the action
  };
  variant?: 'tasks' | 'employees' | '404'; // Context variant for appropriate icon and styling
}

/**
 * EmptyState component displays a user-friendly message when no data is available
 * Provides contextual icons, branding, and optional action buttons
 * Used throughout the application for consistent empty state messaging
 */
export function EmptyState({ title, description, action, variant = 'tasks' }: EmptyStateProps) {
  /**
   * Returns appropriate emoji icon based on the context variant
   * Provides visual context for different types of empty states
   * @returns Emoji string representing the context
   */
  const getIcon = () => {
    switch (variant) {
      case 'tasks':
        return '📋'; // Clipboard for task-related empty states
      case 'employees':
        return '👥'; // People for employee-related empty states
      case '404':
        return '🔍'; // Magnifying glass for search/not found states
      default:
        return '📋'; // Default to clipboard icon
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-center">
      {/* ZIRA branding logo */}
      <ZiraLogo size={48} variant="sky" />
      
      {/* Contextual emoji icon */}
      <div className="text-6xl mb-4">{getIcon()}</div>
      
      {/* Main heading */}
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
      
      {/* Descriptive text with max width for readability */}
      <p className="text-gray-600 dark:text-gray-400 max-w-md">{description}</p>
      
      {/* Optional action button */}
      {action && (
        <Button onClick={action.onClick} className="mt-4">
          {action.label}
        </Button>
      )}
    </div>
  );
} 