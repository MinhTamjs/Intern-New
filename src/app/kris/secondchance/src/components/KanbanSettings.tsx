import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { ColorPicker } from './ColorPicker';
import {
  DEFAULT_STATUS_COLORS,
  getStatusInfo,
  isAccessibleContrast,
  type StatusColors
} from '../lib/themeUtils';
import { Settings, Palette, Eye, EyeOff } from 'lucide-react';

// Kanban settings props
interface KanbanSettingsProps {
  customColors: Record<string, StatusColors>;
  onColorsChange: (colors: Record<string, StatusColors>) => void;
  disabled?: boolean;
}

/**
 * Kanban settings component
 * Allows admin to customize column colors with live preview
 */
export function KanbanSettings({ customColors, onColorsChange, disabled = false }: KanbanSettingsProps) {
  // Local state
  const [localColors, setLocalColors] = useState<Record<string, StatusColors>>(customColors || {});
  const [previewMode, setPreviewMode] = useState<'light' | 'dark'>('light');
  const [open, setOpen] = useState(false);

  // Update local colors when props change
  useEffect(() => {
    setLocalColors(customColors || {});
  }, [customColors]);

  // Handle color change
  const handleColorChange = (status: string, mode: 'light' | 'dark', field: keyof StatusColors['light'], value: string) => {
    setLocalColors(prev => ({
      ...prev,
      [status]: {
        ...prev[status],
        [mode]: {
          ...prev[status]?.[mode],
          [field]: value
        }
      }
    }));
  };

  // Handle save
  const handleSave = () => {
    onColorsChange(localColors);
    setOpen(false);
  };

  // Handle reset
  const handleReset = () => {
    setLocalColors({});
    onColorsChange({});
  };

  // Handle reset for specific status
  const handleResetStatus = (status: string) => {
    const newColors = { ...localColors };
    delete newColors[status];
    setLocalColors(newColors);
    onColorsChange(newColors);
  };

  // Get status colors for preview
  const getStatusColors = (status: string) => {
    return localColors[status]?.[previewMode] || DEFAULT_STATUS_COLORS[status]?.[previewMode];
  };

  // Check accessibility
  const checkAccessibility = (status: string) => {
    const colors = getStatusColors(status);
    if (!colors) return true;
    
    return isAccessibleContrast(colors.background, colors.text);
  };

  const statuses = ['pending', 'in-progress', 'in-review', 'done'];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={disabled}
          className="flex items-center gap-2"
        >
          <Settings className="w-4 h-4" />
          <span className="hidden sm:inline">Settings</span>
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
          {/* Preview mode toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-100">Live Preview Mode</h3>
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
              >
                <Eye className="w-4 h-4 mr-1" />
                Light
              </Button>
              <Button
                variant={previewMode === 'dark' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPreviewMode('dark')}
              >
                <EyeOff className="w-4 h-4 mr-1" />
                Dark
              </Button>
            </div>
          </div>

          {/* Color settings for each status */}
          {statuses.map((status) => {
            const statusInfo = getStatusInfo(status, previewMode, localColors);
            const isAccessible = checkAccessibility(status);
            const colors = getStatusColors(status);

            return (
              <div key={status} className="space-y-4 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 flex items-center justify-center text-white text-sm font-semibold"
                      style={{ backgroundColor: colors?.background || '#000' }}
                    >
                      {statusInfo.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{statusInfo.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{statusInfo.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!isAccessible && (
                      <Badge variant="destructive" className="text-xs">
                        Poor Contrast
                      </Badge>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleResetStatus(status)}
                    >
                      Reset
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Background color */}
                  <div className="space-y-2">
                    <Label>Background Color</Label>
                    <ColorPicker
                      color={colors?.background || '#ffffff'}
                      onColorChange={(color) => handleColorChange(status, previewMode, 'background', color)}
                    />
                  </div>

                  {/* Border color */}
                  <div className="space-y-2">
                    <Label>Border Color</Label>
                    <ColorPicker
                      color={colors?.border || '#000000'}
                      onColorChange={(color) => handleColorChange(status, previewMode, 'border', color)}
                    />
                  </div>

                  {/* Text color */}
                  <div className="space-y-2">
                    <Label>Text Color</Label>
                    <ColorPicker
                      color={colors?.text || '#000000'}
                      onColorChange={(color) => handleColorChange(status, previewMode, 'text', color)}
                    />
                  </div>

                  {/* Badge color */}
                  <div className="space-y-2">
                    <Label>Badge Color</Label>
                    <ColorPicker
                      color={colors?.badge || '#ffffff'}
                      onColorChange={(color) => handleColorChange(status, previewMode, 'badge', color)}
                    />
                  </div>
                </div>

                {/* Preview */}
                <div className="mt-4">
                  <Label>Preview</Label>
                  <div
                    className="p-3 border rounded"
                    style={{
                      backgroundColor: colors?.background,
                      borderColor: colors?.border
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4
                          className="font-semibold"
                          style={{ color: colors?.text }}
                        >
                          {statusInfo.title}
                        </h4>
                        <p
                          className="text-sm opacity-75"
                          style={{ color: colors?.text }}
                        >
                          {statusInfo.description}
                        </p>
                      </div>
                      <Badge
                        style={{
                          backgroundColor: colors?.badge,
                          color: colors?.text,
                          borderColor: colors?.border
                        }}
                      >
                        3
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 pt-4 border-t">
          <Button onClick={handleSave} className="flex-1">
            Save Changes
          </Button>
          <Button variant="outline" onClick={handleReset} className="flex-1">
            Reset All
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 