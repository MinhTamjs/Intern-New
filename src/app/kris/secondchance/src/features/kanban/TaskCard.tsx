import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../components/ui/tooltip';
import { Button } from '../../components/ui/button';
import { ColorPicker } from '../../components/ColorPicker';
import { getContrastTextColor } from '../../lib/themeUtils';
import { Settings, X, Plus } from 'lucide-react';
import { useState } from 'react';
import type { Task } from '../tasks/types';
import type { Employee } from '../employees/types';

// Task card props
interface TaskCardProps {
  task: Task;
  assignees?: Employee[];
  onClick: () => void;
  onColorChange?: (taskId: string, color: string | null) => void;
  canEditColors?: boolean;
  defaultColor?: string;
  onAssignUsers?: (taskId: string) => void;
  canAssignUsers?: boolean;
}

/**
 * Task card component
 * Displays individual task information with drag-and-drop support
 */
export function TaskCard({ task, assignees = [], onClick, onColorChange, canEditColors = false, onAssignUsers, canAssignUsers = false }: TaskCardProps) {
  // Color picker state
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Sortable setup
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  // Transform styles for drag
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Handle color change
  const handleColorChange = (color: string | null) => {
    if (onColorChange) {
      onColorChange(task.id, color);
    }
    setShowColorPicker(false);
  };

  // Handle settings click
  const handleSettingsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowColorPicker(true);
  };

  // Get card classes
  const getCardClasses = () => {
    const baseClasses = 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm';
    return baseClasses;
  };

  // Get text color classes
  const getTextClasses = () => {
    if (task.customColor) {
      return getContrastTextColor(task.customColor);
    }
    return 'text-gray-900 dark:text-white';
  };

  // Get description color classes
  const getDescriptionClasses = () => {
    if (task.customColor) {
      return getContrastTextColor(task.customColor) === 'text-black' 
        ? 'text-gray-700' 
        : 'text-gray-200';
    }
    return 'text-gray-600 dark:text-gray-400';
  };

  return (
    <>
      {/* Task card */}
      <div
        ref={setNodeRef}
        style={{ ...style, ...(task.customColor && { backgroundColor: task.customColor }) }}
        {...attributes}
        {...listeners}
        className={`
          cursor-grab active:cursor-grabbing mb-0.5
          transition-all duration-200 ease-in-out
          w-full max-w-full overflow-hidden group
          ${getCardClasses()}
          ${isDragging ? 'z-50' : 'z-0'}
        `}
        onClick={onClick}
      >
        <div className="p-1">
          {/* Header row with title and action buttons */}
          <div className="flex items-start justify-between gap-2 mb-1">
            {/* Task title */}
            <div className="flex-1 min-w-0">
              <h3 className={`text-sm font-medium leading-tight text-left break-words ${getTextClasses()}`}>
                {task.title}
              </h3>
            </div>
            
            {/* Action buttons */}
            <div className="flex items-center gap-1 flex-shrink-0">
              {/* Color settings button */}
              {canEditColors && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSettingsClick}
                        className={`
                          h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity
                          hover:bg-black/10 dark:hover:bg-white/10
                          ${getTextClasses()}
                        `}
                      >
                        <Settings className="w-3 h-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p className="text-xs">Customize card color</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

              {/* Assign users button */}
              {canAssignUsers && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onAssignUsers) {
                            onAssignUsers(task.id);
                          }
                        }}
                        className={`
                          h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity
                          hover:bg-black/10 dark:hover:bg-white/10
                          ${getTextClasses()}
                        `}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p className="text-xs">Assign users</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              
              {/* Assignee avatars */}
              {assignees.length > 0 && (
                <div className="flex items-center gap-1">
                  {assignees.slice(0, 3).map((assignee) => (
                    <TooltipProvider key={assignee.id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                              {assignee.name.split(' ').map((n: string) => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p className="text-xs">Assigned to {assignee.name}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                  {assignees.length > 3 && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center text-xs text-gray-700 dark:text-gray-300 font-medium">
                            +{assignees.length - 3}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <div className="text-xs">
                            <p className="font-medium">More assignees:</p>
                            {assignees.slice(3).map(assignee => (
                              <p key={assignee.id}>{assignee.name}</p>
                            ))}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Task description */}
          {task.description && task.description.trim() !== '' && (
            <div className="pr-12">
              <p className={`text-xs leading-tight text-left break-words ${getDescriptionClasses()}`}>
                {task.description}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Color picker modal */}
      {showColorPicker && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4">
            {/* Modal header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Customize Card Color
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setShowColorPicker(false)} className="h-8 w-8 p-0">
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Color picker content */}
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Choose a custom color for this task card
              </p>
              <ColorPicker color={task.customColor || '#ffffff'} onColorChange={handleColorChange} />
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => handleColorChange(null)} className="flex-1">
                  Reset to Default
                </Button>
                <Button variant="outline" onClick={() => setShowColorPicker(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 