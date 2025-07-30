import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ColorPicker } from './ColorPicker';
import { useTheme } from '../lib/useTheme';
import { 
  DEFAULT_STATUS_COLORS, 
  getStatusInfo, 
  isAccessibleContrast,
  type StatusColors 
} from '../lib/themeUtils';
import { Settings, Palette, Eye, EyeOff } from 'lucide-react';

// Props interface for the KanbanSettings component
interface KanbanSettingsProps {
  customColors?: Record<string, StatusColors>; // Current custom color configuration
  onColorsChange: (colors: Record<string, StatusColors>) => void; // Callback when colors are updated
  disabled?: boolean; // Whether the settings panel is disabled
}

/**
 * KanbanSettings component provides admin interface for customizing board colors
 * Features live preview, accessibility validation, and comprehensive color management
 * Allows admins to customize colors for each status in both light and dark modes
 */
export function KanbanSettings({ customColors, onColorsChange, disabled = false }: KanbanSettingsProps) {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false); // Controls dialog visibility
  const [localColors, setLocalColors] = useState<Record<string, StatusColors>>(customColors || {}); // Local state for unsaved changes
  const [previewMode, setPreviewMode] = useState<'light' | 'dark'>('light'); // Current preview mode

  // Update local colors when prop changes (sync with parent state)
  useEffect(() => {
    setLocalColors(customColors || {});
  }, [customColors]);

  /**
   * Handles color changes for a specific status, mode, and field
   * Updates the local state with new color values
   * @param status - Task status ('pending', 'in-progress', etc.)
   * @param mode - Theme mode ('light' or 'dark')
   * @param field - Color field to update ('background', 'border', 'text', 'badge')
   * @param value - New hex color value
   */
  const handleColorChange = (status: string, mode: 'light' | 'dark', field: keyof StatusColors['light'], value: string) => {
    const updatedColors = {
      ...localColors,
      [status]: {
        ...localColors[status],
        [mode]: {
          ...localColors[status]?.[mode],
          [field]: value
        }
      }
    };
    setLocalColors(updatedColors);
  };

  /**
   * Saves the current color configuration and closes the dialog
   * Triggers the parent callback to persist changes
   */
  const handleSave = () => {
    onColorsChange(localColors);
    setIsOpen(false);
  };

  /**
   * Resets all custom colors to default values
   * Clears the local state and notifies parent
   */
  const handleReset = () => {
    setLocalColors({});
    onColorsChange({});
  };

  /**
   * Resets colors for a specific status to default values
   * Removes custom colors for that status only
   * @param status - Task status to reset
   */
  const handleResetStatus = (status: string) => {
    const updatedColors = { ...localColors };
    delete updatedColors[status];
    setLocalColors(updatedColors);
    onColorsChange(updatedColors);
  };

  // Define the available task statuses for color customization
  const statuses = ['pending', 'in-progress', 'in-review', 'done'];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          disabled={disabled}
          className="gap-2"
        >
          <Settings className="w-4 h-4" />
          Kanban Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Kanban Board Color Settings
          </DialogTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Customize column colors for each status. Colors will automatically reset to defaults when switching between light and dark themes.
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Preview Mode Toggle - allows switching between light and dark mode preview */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Preview Mode</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Switch between light and dark mode to preview your color changes
              </p>
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                ⚠️ Custom colors will reset when switching themes in the main app
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={previewMode === 'light' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPreviewMode('light')}
                className="gap-2"
              >
                <Eye className="w-4 h-4" />
                Light
              </Button>
              <Button
                variant={previewMode === 'dark' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPreviewMode('dark')}
                className="gap-2"
              >
                <EyeOff className="w-4 h-4" />
                Dark
              </Button>
            </div>
          </div>

          {/* Color Settings for Each Status - grid layout for status customization */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {statuses.map((status) => {
              // Get status information and colors for current preview mode
              const statusInfo = getStatusInfo(status, previewMode, localColors);
              const defaultColors = DEFAULT_STATUS_COLORS[status][previewMode];
              const currentColors = localColors[status]?.[previewMode] || defaultColors;
              
              return (
                <div key={status} className="border rounded-lg p-4 space-y-4">
                  {/* Status Header - shows status info and reset button */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-semibold"
                        style={{ backgroundColor: currentColors.background }}
                      >
                        {statusInfo.icon}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {statusInfo.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {statusInfo.description}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleResetStatus(status)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      Reset
                    </Button>
                  </div>

                  {/* Live Preview - shows how the column will look with current colors */}
                  <div 
                    className="p-3 rounded border-2"
                    style={{ 
                      backgroundColor: currentColors.background,
                      borderColor: currentColors.border
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 
                        className="font-medium text-sm"
                        style={{ color: currentColors.text }}
                      >
                        {statusInfo.title}
                      </h4>
                      <Badge 
                        className="text-xs"
                        style={{ 
                          backgroundColor: currentColors.badge,
                          color: currentColors.text
                        }}
                      >
                        3
                      </Badge>
                    </div>
                    <div 
                      className="p-2 rounded border"
                      style={{ 
                        backgroundColor: previewMode === 'dark' ? '#1f2937' : '#ffffff',
                        borderColor: currentColors.border
                      }}
                    >
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Sample task card
                      </div>
                    </div>
                  </div>

                  {/* Color Controls - individual color pickers for each element */}
                  <div className="space-y-3">
                    {/* Background Color Control */}
                    <div>
                      <Label className="text-sm font-medium">Background Color</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <ColorPicker
                          color={currentColors.background}
                          onColorChange={(color) => handleColorChange(status, previewMode, 'background', color)}
                          disabled={disabled}
                        />
                        <Input
                          value={currentColors.background}
                          onChange={(e) => handleColorChange(status, previewMode, 'background', e.target.value)}
                          className="flex-1"
                          placeholder="#ffffff"
                        />
                      </div>
                    </div>

                    {/* Border Color Control */}
                    <div>
                      <Label className="text-sm font-medium">Border Color</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <ColorPicker
                          color={currentColors.border}
                          onColorChange={(color) => handleColorChange(status, previewMode, 'border', color)}
                          disabled={disabled}
                        />
                        <Input
                          value={currentColors.border}
                          onChange={(e) => handleColorChange(status, previewMode, 'border', e.target.value)}
                          className="flex-1"
                          placeholder="#e5e7eb"
                        />
                      </div>
                    </div>

                    {/* Text Color Control */}
                    <div>
                      <Label className="text-sm font-medium">Text Color</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <ColorPicker
                          color={currentColors.text}
                          onColorChange={(color) => handleColorChange(status, previewMode, 'text', color)}
                          disabled={disabled}
                        />
                        <Input
                          value={currentColors.text}
                          onChange={(e) => handleColorChange(status, previewMode, 'text', e.target.value)}
                          className="flex-1"
                          placeholder="#374151"
                        />
                      </div>
                    </div>

                    {/* Badge Color Control */}
                    <div>
                      <Label className="text-sm font-medium">Badge Color</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <ColorPicker
                          color={currentColors.badge}
                          onColorChange={(color) => handleColorChange(status, previewMode, 'badge', color)}
                          disabled={disabled}
                        />
                        <Input
                          value={currentColors.badge}
                          onChange={(e) => handleColorChange(status, previewMode, 'badge', e.target.value)}
                          className="flex-1"
                          placeholder="#f3f4f6"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Accessibility Warning - shows when contrast is insufficient */}
                  {!isAccessibleContrast(currentColors.background, currentColors.text) && (
                    <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded text-xs text-yellow-800 dark:text-yellow-200">
                      ⚠️ Low contrast detected. Consider adjusting colors for better accessibility.
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action Buttons - save, cancel, and reset options */}
          <div className="flex items-center justify-between pt-4 border-t">
            <Button variant="outline" onClick={handleReset}>
              Reset All to Default
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 