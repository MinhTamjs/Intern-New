import { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog';
import { ColorPicker } from '../../../components/ColorPicker';
import { useTheme } from '../../../lib/useTheme';
import { getContrastTextColor, isValidHexColor, normalizeHexColor } from '../../../lib/themeUtils';
import type { Task } from '../types';

interface TaskColorEditorProps {
  task: Task;
  onColorChange: (taskId: string, color: string | undefined) => void;
  disabled?: boolean;
}

/**
 * TaskColorEditor component allows admins to edit task colors
 * Provides a dialog with color picker and preview functionality
 */
export function TaskColorEditor({ task, onColorChange, disabled = false }: TaskColorEditorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempColor, setTempColor] = useState(task.customColor || '');

  const handleColorChange = (color: string | undefined) => {
    setTempColor(color || '');
  };

  const handleSave = () => {
    // Validate color if provided
    if (tempColor && !isValidHexColor(tempColor)) {
      alert('Please enter a valid hex color (e.g., #ffffff)');
      return;
    }

    // Normalize color format
    const normalizedColor = tempColor ? normalizeHexColor(tempColor) : undefined;
    
    // Update task color
    onColorChange(task.id, normalizedColor);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempColor(task.customColor || '');
    setIsOpen(false);
  };

  const handleReset = () => {
    setTempColor('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={disabled}
          className="flex items-center gap-2"
        >
          <div
            className="w-4 h-4 rounded border border-gray-300 dark:border-gray-600"
            style={{ backgroundColor: task.customColor || 'transparent' }}
          />
          <span className="hidden sm:inline">Edit Color</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Task Color</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Task Info */}
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 className="font-medium text-sm mb-1">{task.title}</h4>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Current color: {task.customColor || 'Default'}
            </p>
          </div>

          {/* Color Picker */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Task Background Color</label>
            <ColorPicker
              selectedColor={tempColor}
              onColorChange={handleColorChange}
              disabled={disabled}
            />
          </div>

          {/* Live Preview */}
          {tempColor && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Preview</label>
              <div
                className="p-4 rounded-lg border border-gray-200 dark:border-gray-600"
                style={{ backgroundColor: tempColor }}
              >
                <h4 className={`font-medium text-sm ${getContrastTextColor(tempColor) === 'text-black' ? 'text-gray-900' : 'text-white'}`}>
                  {task.title}
                </h4>
                {task.description && (
                  <p className={`text-xs mt-1 ${getContrastTextColor(tempColor) === 'text-black' ? 'text-gray-700' : 'text-gray-200'}`}>
                    {task.description}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              disabled={!tempColor}
            >
              Reset to Default
            </Button>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={tempColor === (task.customColor || '')}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 