import { ConditionalLogo } from './ConditionalLogo';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  showLogo?: boolean;
}

export const LoadingSpinner = ({ 
  size = 'md', 
  text = 'Loading...', 
  showLogo = false 
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      {showLogo && (
        <div className="mb-4">
          <ConditionalLogo size={240} />
        </div>
      )}
      <div className={`animate-spin rounded-full border-b-2 border-sky-600 ${sizeClasses[size]}`} />
      {text && (
        <p className={`mt-4 text-gray-600 dark:text-gray-400 ${textSizes[size]}`}>
          {text}
        </p>
      )}
    </div>
  );
}; 