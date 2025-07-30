import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../components/ui/tooltip';
import { Button } from '../../components/ui/button';
import { ColorPicker } from '../../components/ColorPicker';
import { useTheme } from '../../lib/useTheme';
import { getContrastTextColor } from '../../lib/themeUtils';
import { Settings, X } from 'lucide-react';
import { useState } from 'react';
import type { Task } from '../tasks/types';
import type { Employee } from '../employees/types';

// Props interface for the TaskCard component
interface TaskCardProps {
  task: Task; // Task data to display
  assignee?: Employee; // Optional assignee information
  onClick: () => void; // Callback when card is clicked
  onColorChange?: (taskId: string, color: string | null) => void; // Callback when task color is changed
  canEditColors?: boolean; // Whether the user can edit task colors
}

/**
 * Extracts initials from a person's name for avatar display
 * Converts "John Doe" to "JD" for use in avatar fallbacks
 * @param name - Full name of the person
 * @returns Uppercase initials (e.g., "John Doe" -> "JD")
 */
const getInitials = (name: string): string => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

/**
 * Generates a consistent color for an assignee based on their name
 * Uses the first character's ASCII code to deterministically select a color
 * This ensures the same person always gets the same color across sessions
 * @param name - Name of the assignee
 * @returns Tailwind CSS classes for background and text color
 */
const getAssigneeColor = (name: string): string => {
  const colors = [
    'bg-blue-100 text-blue-600',
    'bg-green-100 text-green-600',
    'bg-purple-100 text-purple-600',
    'bg-orange-100 text-orange-600',
    'bg-pink-100 text-pink-600',
    'bg-indigo-100 text-indigo-600',
    'bg-teal-100 text-teal-600',
    'bg-red-100 text-red-600',
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

/**
 * TaskCard component displays individual task information in a draggable card format
 * Features JIRA-style assignee avatars, drag-and-drop functionality, and theme-aware styling
 * Sharp edges with no border-radius for a modern, clean look
 * Now includes a color customization button for admins
 */
export function TaskCard({ task, assignee, onClick, onColorChange, canEditColors = false }: TaskCardProps) {
  // Get current theme for theme-aware styling
  const { theme } = useTheme();
  
  // State for color picker modal
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  // Drag-and-drop functionality using @dnd-kit
  // This enables the card to be dragged and provides visual feedback during drag
  const {
    attributes, // Accessibility attributes for drag-and-drop
    listeners, // Event listeners for drag interactions
    setNodeRef, // Ref to attach to the draggable element
    transform, // Transform data for visual feedback during drag
    transition, // CSS transition for smooth animations
    isDragging, // Boolean indicating if this card is currently being dragged
  } = useSortable({ id: task.id });

  // Debug logging to help troubleshoot drag-and-drop issues
  console.log(`TaskCard ${task.id} (${task.title}):`, {
    isDragging,
    hasListeners: !!listeners,
    hasAttributes: !!attributes,
    transform: transform ? 'has-transform' : 'no-transform'
  });

  // Apply drag transform and visual feedback styles
  const style = {
    transform: CSS.Transform.toString(transform), // Convert transform to CSS string
    transition, // Smooth transition for drag animations
    opacity: isDragging ? 0.5 : 1, // Reduce opacity when dragging for visual feedback
  };

  /**
   * Returns CSS classes for drag state visual feedback
   * Provides different styles for dragging vs. normal state with theme awareness
   * @returns CSS classes for drag feedback
   */
  const getDragClasses = () => {
    if (isDragging) {
      // Enhanced visual feedback when dragging: shadow, ring, rotation, and scale
      return 'shadow-xl ring-2 ring-blue-400 ring-opacity-50 transform rotate-2 scale-105 z-50';
    }
    // Hover effects for normal state: theme-aware background change and shadow
    return theme === 'dark' 
      ? 'hover:bg-gray-700 hover:shadow-md hover:scale-[1.02]' 
      : 'hover:bg-gray-50 hover:shadow-md hover:scale-[1.02]';
  };

  /**
   * Returns theme-aware card styling with support for custom colors
   * Sharp edges with no border-radius for modern JIRA-style appearance
   * @returns CSS classes for card styling
   */
  const getCardClasses = () => {
    const baseClasses = 'cursor-pointer transition-all duration-200 border shadow-sm';
    
    // Check if task has custom color
    if (task.customColor) {
      return `${baseClasses} ${getDragClasses()}`;
    }
    
    // Default theme-aware styling with sharp edges
    const themeClasses = theme === 'dark' 
      ? 'bg-gray-800 border-gray-600 text-white shadow-gray-900/20' 
      : 'bg-white border-gray-200 text-gray-900 shadow-gray-200/50';
    
    return `${baseClasses} ${themeClasses} ${getDragClasses()}`;
  };

  /**
   * Returns text color classes based on custom color or theme
   * Ensures proper contrast for readability
   * @returns CSS classes for text color
   */
  const getTextClasses = () => {
    if (task.customColor) {
      // Use contrast calculation for custom colors
      const contrastClass = getContrastTextColor(task.customColor);
      return contrastClass === 'text-black' ? 'text-gray-900' : 'text-white';
    }
    
    // Default theme-aware text colors
    return theme === 'dark' ? 'text-white' : 'text-gray-900';
  };

  /**
   * Returns description text color classes
   * Provides slightly muted colors for secondary text
   * @returns CSS classes for description text color
   */
  const getDescriptionClasses = () => {
    if (task.customColor) {
      // Use contrast calculation for custom colors with reduced opacity
      const contrastClass = getContrastTextColor(task.customColor);
      return contrastClass === 'text-black' ? 'text-gray-700' : 'text-gray-200';
    }
    
    // Default theme-aware description colors
    return theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
  };

  /**
   * Handles color change from the color picker
   * @param color - New color value or null to reset to default
   */
  const handleColorChange = (color: string | null) => {
    if (onColorChange) {
      onColorChange(task.id, color);
    }
    setShowColorPicker(false);
  };

  /**
   * Handles clicking the settings button
   * Prevents event bubbling to avoid triggering the card click
   * @param e - Click event
   */
  const handleSettingsClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking settings
    setShowColorPicker(true);
  };

  // Prepare assignee data for JIRA-style avatar group display
  // Currently supports single assignee but structure is ready for multiple assignees
  const assignees = assignee ? [assignee] : [];
  const maxVisibleAvatars = 3; // Maximum number of avatars to show before overflow
  const visibleAssignees = assignees.slice(0, maxVisibleAvatars); // Show first 3 assignees
  const hiddenCount = Math.max(0, assignees.length - maxVisibleAvatars); // Count of hidden assignees

  return (
    <>
      <div
        ref={setNodeRef} // Attach drag-and-drop ref
        style={{
          ...style,
          ...(task.customColor && { backgroundColor: task.customColor })
        }} // Apply drag transform styles and custom color
        {...attributes} // Spread accessibility attributes
        {...listeners} // Spread drag event listeners
        className={`
          cursor-grab active:cursor-grabbing mb-1
          transition-all duration-200 ease-in-out
          w-full max-w-full overflow-hidden group
          ${getCardClasses()}
          ${isDragging ? 'z-50' : 'z-0'}
        `}
        onClick={onClick} // Handle click to open task details
      >
        {/* Card content with proper padding */}
        <div className="p-3">
          <div className="flex items-center justify-between">
            {/* Task content section - left side with title and description */}
            <div className="flex-1 min-w-0 pr-2">
              {/* Task title - compact display with small font size */}
              <h3 className={`text-sm font-medium leading-tight text-left break-words ${getTextClasses()}`}>
                {task.title}
              </h3>
              
              {/* Task description - only show if not empty, with larger font than title */}
              {task.description && task.description.trim() !== '' && (
                <p className={`text-xs leading-tight text-left line-clamp-1 break-words mt-1 ${getDescriptionClasses()}`}>
                  {task.description}
                </p>
              )}
            </div>
            
            {/* Right side with settings button and assignee avatars */}
            <div className="flex items-center gap-2">
              {/* Color settings button - only show if user has permission */}
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
              
              {/* JIRA-style assignee avatar group */}
              <div className="flex-shrink-0">
                {assignees.length > 0 ? (
                  // Show assignee avatars with tooltip for details
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center -space-x-1">
                          {/* Render visible assignee avatars with overlapping effect */}
                          {visibleAssignees.map((assignee, index) => (
                            <div
                              key={assignee.id}
                              className="relative"
                              style={{ zIndex: visibleAssignees.length - index }} // Stack avatars with proper z-index
                            >
                              <Avatar className="w-6 h-6 border-2 border-white shadow-sm">
                                <AvatarFallback className={`text-xs ${getAssigneeColor(assignee.name)}`}>
                                  {getInitials(assignee.name)}
                                </AvatarFallback>
                              </Avatar>
                            </div>
                          ))}
                          
                          {/* Overflow indicator for hidden assignees */}
                          {hiddenCount > 0 && (
                            <div className="relative" style={{ zIndex: 0 }}>
                              <div className="w-6 h-6 border-2 border-white bg-gray-200 flex items-center justify-center shadow-sm">
                                <span className="text-xs text-gray-600 font-semibold">
                                  +{hiddenCount}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </TooltipTrigger>
                      {/* Tooltip content showing all assignees */}
                      <TooltipContent side="top" className="max-w-xs">
                        <div className="space-y-1">
                          <p className="text-xs font-medium">Assigned to:</p>
                          <div className="space-y-1">
                            {assignees.map((assignee) => (
                              <div key={assignee.id} className="flex items-center gap-2">
                                <Avatar className="w-4 h-4">
                                  <AvatarFallback className={`text-[8px] ${getAssigneeColor(assignee.name)}`}>
                                    {getInitials(assignee.name)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-xs text-gray-700 dark:text-gray-300">{assignee.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  // Show unassigned indicator when no assignee
                  <div className="w-6 h-6 border-2 border-white bg-gray-100 dark:bg-gray-700 flex items-center justify-center shadow-sm">
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">U</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Color picker modal */}
      {showColorPicker && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Customize Card Color
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowColorPicker(false)}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Choose a custom color for this task card
              </p>
              
              <ColorPicker
                color={task.customColor || '#ffffff'}
                onColorChange={handleColorChange}
              />
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleColorChange(null)}
                  className="flex-1"
                >
                  Reset to Default
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowColorPicker(false)}
                  className="flex-1"
                >
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