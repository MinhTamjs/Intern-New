import { ConditionalLogo } from './ConditionalLogo';
import { ThemeToggle } from './ThemeToggle';

/**
 * Demo component to showcase the ConditionalLogo functionality
 * Shows different logo sizes and theme switching
 */
export function LogoDemo() {
  return (
    <div className="p-8 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Conditional Logo Demo</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The logo automatically switches between light and dark versions based on the current theme.
        </p>
        
        <div className="flex justify-center mb-6">
          <ThemeToggle />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Small logo */}
        <div className="text-center p-6 border rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Small Logo (30px)</h3>
          <div className="flex justify-center">
            <ConditionalLogo size={30} />
          </div>
        </div>

        {/* Medium logo */}
        <div className="text-center p-6 border rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Medium Logo (60px)</h3>
          <div className="flex justify-center">
            <ConditionalLogo size={60} />
          </div>
        </div>

        {/* Large logo */}
        <div className="text-center p-6 border rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Large Logo (100px)</h3>
          <div className="flex justify-center">
            <ConditionalLogo size={100} />
          </div>
        </div>
      </div>

      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        <p>Try switching themes using the toggle button above to see the smooth transition effect.</p>
      </div>
    </div>
  );
} 