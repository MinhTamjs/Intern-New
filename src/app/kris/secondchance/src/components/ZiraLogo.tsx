import { ConditionalLogo } from './ConditionalLogo';

interface ZiraLogoProps {
  size?: number; // Height in px (default: 120)
  className?: string;
}

/**
 * ZiraLogo: Responsive logo block for Zira with theme support and horizontal alignment.
 */
export function ZiraLogo({ size = 120, className = '' }: ZiraLogoProps) {
  return (
    <div
      className={`flex flex-row items-center justify-center gap-4 mt-6 w-full ${className}`}
      style={{
        minHeight: size,
        width: '100%',
      }}
    >
      <ConditionalLogo size={size} />
    </div>
  );
} 