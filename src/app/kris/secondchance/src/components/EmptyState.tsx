import { Button } from './ui/button';
import { ZiraLogo } from './ZiraLogo';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: 'tasks' | 'employees' | '404';
}

export function EmptyState({ title, description, action, variant = 'tasks' }: EmptyStateProps) {
  const getIcon = () => {
    switch (variant) {
      case 'tasks':
        return '📋';
      case 'employees':
        return '👥';
      case '404':
        return '🔍';
      default:
        return '📋';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-center">
      <ZiraLogo size={48} variant="sky" />
      <div className="text-6xl mb-4">{getIcon()}</div>
      <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
      <p className="text-gray-600 max-w-md">{description}</p>
      {action && (
        <Button onClick={action.onClick} className="mt-4">
          {action.label}
        </Button>
      )}
    </div>
  );
} 