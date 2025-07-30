import { useState } from 'react';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Palette, X } from 'lucide-react';
import { useTheme } from '../lib/useTheme';
import { getContrastTextColor } from '../lib/themeUtils';

// Predefined color options for quick selection
const PRESET_COLORS = [
  '#ffffff', // White
  '#f3f4f6', // Gray-100
  '#e5e7eb', // Gray-200
  '#fef3c7', // Amber-100
  '#fde68a', // Amber-200
  '#dbeafe', // Blue-100
  '#bfdbfe', // Blue-200
  '#d1fae5', // Emerald-100
  '#a7f3d0', // Emerald-200
  '#fce7f3', // Pink-100
  '#fbcfe8', // Pink-200
  '#f3e8ff', // Purple-100
  '#e9d5ff', // Purple-200
  '#fed7aa', // Orange-100
  '#fdba74', // Orange-200
  '#fecaca', // Red-100
  '#fca5a5', // Red-200
  '#1f2937', // Gray-800 (dark)
  '#374151', // Gray-700 (dark)
  '#4b5563', // Gray-600 (dark)
  '#6b7280', // Gray-500 (dark)
];

interface ColorPickerProps {
  selectedColor?: string;
  onColorChange: (color: string | undefined) => void;
  disabled?: boolean;
}

/**
 * ColorPicker component allows users to select custom colors for tasks
 * Provides preset colors and a custom color input with dark mode support
 */
export function ColorPicker({ selectedColor, onColorChange, disabled = false }: ColorPickerProps) {
  const [customColor, setCustomColor] = useState('#ffffff');

  const handleColorSelect = (color: string) => {
    onColorChange(color);
  };

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setCustomColor(color);
    onColorChange(color);
  };

  const clearColor = () => {
    onColorChange(undefined);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={disabled}
          className="flex items-center gap-2"
        >
          <Palette className="h-4 w-4" />
          <span className="hidden sm:inline">Color</span>
          {selectedColor && (
            <div
              className="w-4 h-4 rounded border border-gray-300 dark:border-gray-600"
              style={{ backgroundColor: selectedColor }}
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Task Color</h4>
            {selectedColor && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearColor}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
          
          {/* Preset colors grid */}
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Preset Colors</p>
            <div className="grid grid-cols-6 gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorSelect(color)}
                  className={`
                    w-8 h-8 rounded border-2 transition-all duration-200 hover:scale-110
                    ${selectedColor === color ? 'border-gray-800 dark:border-gray-200 scale-110' : 'border-gray-300 dark:border-gray-600'}
                  `}
                  style={{ backgroundColor: color }}
                  title={`Select ${color}`}
                />
              ))}
            </div>
          </div>
          
          {/* Custom color picker */}
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Custom Color</p>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={customColor}
                onChange={handleCustomColorChange}
                className="w-12 h-8 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
              />
              <input
                type="text"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                placeholder="#ffffff"
                className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
          
          {/* Preview */}
          {selectedColor && (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Preview</p>
              <div
                className="p-4 rounded border border-gray-200 dark:border-gray-600"
                style={{ backgroundColor: selectedColor }}
              >
                <p className={`text-sm font-medium ${getContrastTextColor(selectedColor) === 'text-black' ? 'text-gray-900' : 'text-white'}`}>
                  Sample Task Title
                </p>
                <p className={`text-xs opacity-75 ${getContrastTextColor(selectedColor) === 'text-black' ? 'text-gray-700' : 'text-gray-200'}`}>
                  Sample task description
                </p>
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
} 