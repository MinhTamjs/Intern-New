import { ZiraLogo } from './ZiraLogo';

export function LogoDemo() {
  return (
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">ZIRA Logo Size Examples</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Small Logo */}
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Small (16px)</h3>
          <ZiraLogo size={16} />
        </div>

        {/* Medium Logo */}
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Medium (32px)</h3>
          <ZiraLogo size={32} />
        </div>

        {/* Large Logo */}
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Large (48px)</h3>
          <ZiraLogo size={48} />
        </div>

        {/* Extra Large Logo */}
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Extra Large (64px)</h3>
          <ZiraLogo size={64} />
        </div>

        {/* Icon Only */}
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Icon Only (24px)</h3>
          <ZiraLogo size={24} showText={false} />
        </div>

        {/* Different Variants */}
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Color Variants (32px)</h3>
          <div className="space-y-2">
            <ZiraLogo size={32} variant="sky" />
            <ZiraLogo size={32} variant="violet" />
            <ZiraLogo size={32} variant="emerald" />
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Usage Examples:</h3>
        <pre className="text-sm bg-white p-3 rounded border overflow-x-auto">
{`// Basic usage
<ZiraLogo size={32} />

// Icon only
<ZiraLogo size={24} showText={false} />

// Different colors
<ZiraLogo size={48} variant="violet" />

// Custom styling
<ZiraLogo size={40} className="my-4" />`}
        </pre>
      </div>
    </div>
  );
} 