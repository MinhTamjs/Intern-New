import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Badge } from '../../components/ui/badge';
import { TaskCard } from './TaskCard';
import { getStatusInfo, type StatusColors } from '../../lib/themeUtils';
import { useTheme } from '../../lib/useTheme';
import type { Task, TaskStatus } from '../tasks/types';
import type { Employee } from '../employees/types';

// Props interface for the Column component
interface ColumnProps {
  status: TaskStatus; // The status this column represents
  tasks: Task[]; // Tasks to display in this column
  employees: Employee[]; // Employee data for assignee information
  onTaskClick: (task: Task) => void; // Callback when a task is clicked
  onTaskColorChange?: (taskId: string, color: string | null) => void; // Callback when task color is changed
  canEditColors?: boolean; // Whether the user can edit task colors
  isFirst?: boolean; // Flag for first column styling
  isLast?: boolean; // Flag for last column styling
  customColors?: Record<string, StatusColors>; // Custom colors for status styling
}

/**
 * Column component represents a single status column in the Kanban board
 * Handles droppable functionality and visual feedback for drag-and-drop operations
 * Features sharp edges and full dark mode support with customizable colors
 */
export function Column({ 
  status, 
  tasks, 
  employees, 
  onTaskClick, 
  onTaskColorChange,
  canEditColors = false,
  isFirst = false, 
  isLast = false,
  customColors 
}: ColumnProps) {
  // Set up droppable area for drag-and-drop functionality
  // This allows tasks to be dropped into this column
  const { setNodeRef, isOver, active } = useDroppable({
    id: status, // Use status as the droppable ID
  });

  // Determine drag state for visual feedback
  const isDragActive = active !== null; // True when any item is being dragged
  const isCurrentColumnTarget = isOver && isDragActive; // True when this column is the drop target
  
  // Debug logging for first and last columns to help troubleshoot edge column issues
  if (isDragActive && (isFirst || isLast)) {
    console.log(`Column ${status} (${isFirst ? 'FIRST' : isLast ? 'LAST' : 'MIDDLE'}):`, {
      isOver,
      isDragActive,
      isCurrentColumnTarget,
      isFirst,
      isLast
    });
  }

  // Get status information and colors based on current theme
  const { theme } = useTheme();
  const statusInfo = getStatusInfo(status, theme, customColors);

  // Calculate the actual task count for this status
  const taskCount = tasks.length;

  /**
   * Returns CSS classes for drag state visual feedback
   * Provides different visual cues based on whether this column is a valid drop target
   * @returns CSS classes for drag feedback
   */
  const getDragFeedbackClasses = () => {
    if (!isDragActive) return '';
    
    if (isCurrentColumnTarget) {
      // Valid drop target - highlight with prominent success colors and borders
      let classes = 'ring-4 ring-green-500 ring-opacity-75 shadow-2xl transform scale-[1.02] border-green-400 border-2 transition-all duration-200 z-10';
      
      // Add extra emphasis for first and last columns to ensure they're visible
      if (isFirst || isLast) {
        classes += ' ring-6 ring-green-600 ring-opacity-90 shadow-2xl';
      }
      
      return classes;
    } else {
      // Invalid drop target - subtle indication with reduced opacity
      return 'opacity-50 ring-1 ring-gray-300 ring-opacity-50';
    }
  };

  /**
   * Returns additional container classes for enhanced visual feedback
   * Adds CSS classes for drag target highlighting and edge column emphasis
   * @returns CSS classes for container styling
   */
  const getContainerClasses = () => {
    if (!isDragActive) return '';
    
    if (isCurrentColumnTarget) {
      // Add extra spacing and z-index for highlighted columns
      let classes = 'relative z-10 column-drag-target';
      
      // Add specific classes for first and last columns for CSS targeting
      if (isFirst) {
        classes += ' column-first';
      } else if (isLast) {
        classes += ' column-last';
      }
      
      return classes;
    }
    return '';
  };

  return (
    <div className={`flex-1 min-w-0 max-w-xs flex flex-col ${getContainerClasses()}`}>
      <div 
        className={`
          flex flex-col h-full border-2 shadow-sm
          transition-all duration-200 ease-in-out
          ${getDragFeedbackClasses()}
        `}
        style={{
          backgroundColor: statusInfo.colors.background,
          borderColor: statusInfo.colors.border
        }}
      >
        {/* Column header with status info and task count */}
        <div 
          className="pb-1.5 px-2 py-2 border-b flex-shrink-0"
          style={{
            backgroundColor: statusInfo.colors.headerBg,
            borderColor: statusInfo.colors.border
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {/* Status icon with gradient background */}
              <div 
                className="w-5 h-5 flex items-center justify-center text-white text-[10px] font-semibold shadow-sm"
                style={{ backgroundColor: statusInfo.colors.background }}
              >
                {statusInfo.icon}
              </div>
              <div>
                {/* Status title and description */}
                <h3 
                  className="text-xs font-bold flex items-center gap-2"
                  style={{ color: statusInfo.colors.text }}
                >
                  {statusInfo.title}
                </h3>
                <p 
                  className="text-[9px] opacity-75 mt-0.5"
                  style={{ color: statusInfo.colors.text }}
                >
                  {statusInfo.description}
                </p>
              </div>
            </div>
            {/* Task count badge */}
            <Badge 
              className="text-[9px] font-semibold px-1 py-0.5 border"
              style={{
                backgroundColor: statusInfo.colors.badge,
                color: statusInfo.colors.text,
                borderColor: statusInfo.colors.border
              }}
            >
              {taskCount}
            </Badge>
          </div>
        </div>
        
        {/* Column content area with droppable zone */}
        <div className="pt-0 px-0.5 pb-0.5 flex-1 flex flex-col min-h-0 bg-gray-50 dark:bg-[#1a1a1a]">
          <div
            ref={setNodeRef} // Attach droppable ref to this element
            className={`
              flex-1 space-y-0.5 
              ${isDragActive ? 'overflow-y-auto' : 'overflow-x-hidden'} // Enable vertical scroll during drag
              ${isCurrentColumnTarget ? 'bg-green-50 dark:bg-green-900 bg-opacity-50 dark:bg-opacity-30 p-0.5 border-2 border-green-300 dark:border-green-600 border-dashed' : ''} // Highlight drop zone
              transition-all duration-200
              min-h-[60px] // Minimum height for drop zone
            `}
          >
            {/* Sortable context for drag-and-drop within the column */}
            <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
              {tasks.map((task) => {
                const assignee = employees.find(emp => emp.id === task.assigneeId);
                return (
                  <TaskCard
                    key={task.id}
                    task={task}
                    assignee={assignee}
                    onClick={() => onTaskClick(task)}
                    onColorChange={onTaskColorChange}
                    canEditColors={canEditColors}
                  />
                );
              })}
            </SortableContext>
            
            {/* Drop zone indicator when column is empty */}
            {tasks.length === 0 && isCurrentColumnTarget && (
              <div className="flex items-center justify-center h-16 border-2 border-dashed border-green-400 dark:border-green-500 bg-green-50 dark:bg-green-900 bg-opacity-30 dark:bg-opacity-30">
                <div className="text-center">
                  <div className="text-lg mb-0.5">📋</div>
                  <p className="text-[10px] text-green-700 dark:text-green-300 font-medium">Drop task here</p>
                </div>
              </div>
            )}
            
            {/* Additional drop zone padding when column is full */}
            {isCurrentColumnTarget && tasks.length > 0 && (
              <div className="h-1 flex-shrink-0"></div>
            )}
            
            {/* Fallback drop zone for full columns */}
            {isDragActive && (
              <div className="h-0.5 flex-shrink-0 opacity-0 pointer-events-none"></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}