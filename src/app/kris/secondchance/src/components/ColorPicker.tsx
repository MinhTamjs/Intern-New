import { useState, useEffect } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';

// Color picker props
interface ColorPickerProps {
  color: string;
  onColorChange: (color: string) => void;
}

// Preset color options
const PRESET_COLORS = [
  '#ffffff', '#f3f4f6', '#e5e7eb', '#d1d5db', '#9ca3af', '#6b7280', '#4b5563', '#374151', '#1f2937', '#111827',
  '#fef2f2', '#fee2e2', '#fecaca', '#fca5a5', '#f87171', '#ef4444', '#dc2626', '#b91c1c', '#991b1b', '#7f1d1d',
  '#fffbeb', '#fef3c7', '#fde68a', '#fcd34d', '#fbbf24', '#f59e0b', '#d97706', '#b45309', '#92400e', '#78350f',
  '#f0fdf4', '#dcfce7', '#bbf7d0', '#86efac', '#4ade80', '#22c55e', '#16a34a', '#15803d', '#166534', '#14532d',
  '#eff6ff', '#dbeafe', '#bfdbfe', '#93c5fd', '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8', '#1e40af', '#1e3a8a',
  '#faf5ff', '#f3e8ff', '#e9d5ff', '#d8b4fe', '#c084fc', '#a855f7', '#9333ea', '#7c3aed', '#6b21a8', '#581c87',
  '#fdf2f8', '#fce7f3', '#fbcfe8', '#f9a8d4', '#f472b6', '#ec4899', '#db2777', '#be185d', '#9d174d', '#831843'
];

/**
 * Color picker component
 * Allows selecting custom colors with preset options
 */
export function ColorPicker({ color, onColorChange }: ColorPickerProps) {
  // Local color state
  const [localColor, setLocalColor] = useState(color);

  // Update local color when prop changes
  useEffect(() => {
    setLocalColor(color);
  }, [color]);

  // Handle color input change
  const handleColorChange = (newColor: string) => {
    setLocalColor(newColor);
    onColorChange(newColor);
  };

  // Handle preset color click
  const handlePresetClick = (presetColor: string) => {
    handleColorChange(presetColor);
  };

  return (
    <div className="space-y-4">
      {/* Color input */}
      <div className="space-y-2">
        <Label htmlFor="color-input">Custom Color</Label>
        <div className="flex gap-2">
          <Input
            id="color-input"
            type="color"
            value={localColor}
            onChange={(e) => handleColorChange(e.target.value)}
            className="w-16 h-10 p-1 border rounded"
          />
          <Input
            type="text"
            value={localColor}
            onChange={(e) => handleColorChange(e.target.value)}
            placeholder="#ffffff"
            className="flex-1"
          />
        </div>
      </div>

      {/* Preset colors */}
      <div className="space-y-2">
        <Label>Preset Colors</Label>
        <div className="grid grid-cols-10 gap-1">
          {PRESET_COLORS.map((presetColor) => (
            <button
              key={presetColor}
              type="button"
              onClick={() => handlePresetClick(presetColor)}
              className={`
                w-8 h-8 rounded border-2 transition-all
                ${localColor === presetColor ? 'border-gray-900 dark:border-white scale-110' : 'border-gray-300 dark:border-gray-600 hover:scale-105'}
              `}
              style={{ backgroundColor: presetColor }}
              title={presetColor}
            />
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="space-y-2">
        <Label>Preview</Label>
        <div
          className="p-4 rounded border"
          style={{ backgroundColor: localColor }}
        >
          <p className={`text-sm ${localColor === '#ffffff' ? 'text-black' : 'text-white'}`}>
            Sample text on this background
          </p>
        </div>
      </div>
    </div>
  );
} 