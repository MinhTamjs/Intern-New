import { useState, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  pointerWithin,
  rectIntersection,
  closestCenter,
  type CollisionDetection,
} from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { toast } from 'sonner';
import { Column } from './Column';
import { TaskCard } from './TaskCard';
import { EmptyState } from '../../components/EmptyState';
import { KanbanSettings } from '../../components/KanbanSettings';
import { normalizeTaskStatus } from '../../lib/utils';
import { type StatusColors } from '../../lib/themeUtils';
import { useTheme } from '../../lib/useTheme';
import type { Task, TaskStatus } from '../tasks/types';
import type { Employee } from '../employees/types';

// Props interface for the TaskBoard component
interface TaskBoardProps {
  tasks: Task[]; // Array of tasks to display on the board
  employees: Employee[]; // Array of employees for assignee information
  onTaskClick: (task: Task) => void; // Callback when a task is clicked
  onTaskStatusChange: (taskId: string, newStatus: TaskStatus) => void; // Callback when task status changes
  onTaskColorChange?: (taskId: string, color: string | null) => void; // Callback when task color is changed
  canEditColors?: boolean; // Whether the user can edit task colors
  isAdmin?: boolean; // Whether the current user is an admin
}

// Define the valid task statuses for the Kanban board
// These correspond to the column headers and determine task flow
const STATUSES: TaskStatus[] = ['pending', 'in-progress', 'in-review', 'done'];

/**
 * Custom collision detection strategy that combines multiple detection methods
 * Provides robust drag-and-drop behavior by trying different approaches in order
 * This ensures reliable drop detection even in edge cases
 * @param args - Collision detection arguments from @dnd-kit
 * @returns Array of detected collisions
 */
const customCollisionDetection: CollisionDetection = (args) => {
  // First, try pointerWithin - if the user's mouse pointer is inside a droppable area
  const pointerCollisions = pointerWithin(args);
  if (pointerCollisions.length > 0) {
    console.log('🎯 Custom collision: pointerWithin detected', pointerCollisions);
    return pointerCollisions;
  }

  // Second, try rectIntersection - check if the draggable item's rectangle intersects with any droppable zone
  const rectCollisions = rectIntersection(args);
  if (rectCollisions.length > 0) {
    console.log('📦 Custom collision: rectIntersection detected', rectCollisions);
    return rectCollisions;
  }

  // Finally, fallback to closestCenter - proximity-based detection
  const closestCollisions = closestCenter(args);
  console.log('📍 Custom collision: closestCenter fallback', closestCollisions);
  return closestCollisions;
};

/**
 * TaskBoard component manages the Kanban board layout and drag-and-drop functionality
 * Renders columns for each task status and handles task movement between columns
 * Features full dark mode support and admin color customization
 */
export function TaskBoard({ 
  tasks, 
  employees, 
  onTaskClick, 
  onTaskStatusChange, 
  onTaskColorChange,
  canEditColors = false,
  isAdmin = false 
}: TaskBoardProps) {
  // State for drag-and-drop functionality
  const [activeTask, setActiveTask] = useState<Task | null>(null); // Currently dragged task
  const [originalStatus, setOriginalStatus] = useState<TaskStatus | null>(null); // Original status before drag
  
  // State for custom colors - allows admins to customize column colors
  const [customColors, setCustomColors] = useState<Record<string, StatusColors>>({});
  
  // Get current theme for theme-aware color management
  const { theme } = useTheme();
  
  // Reset custom colors when theme changes to ensure default colors are used
  useEffect(() => {
    if (Object.keys(customColors).length > 0) {
      setCustomColors({});
      toast.info('Custom colors reset to default for new theme');
    }
  }, [theme]);
  
  // Configure drag sensors with activation constraints
  // This prevents accidental drags by requiring a minimum distance before drag starts
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px movement before drag starts (prevents accidental drags)
      },
    })
  );

  // Enhanced debug logging to identify status issues and filtering problems
  // This helps troubleshoot issues with task visibility and column filtering
  useEffect(() => {
    console.log('=== TaskBoard Debug Information ===');
    console.log('Total tasks received:', tasks.length);
    console.log('All tasks:', tasks);
    
    // Analyze status distribution and identify issues
    const statusCounts: Record<string, number> = {};
    const invalidStatusTasks: Task[] = [];
    const normalizedStatusCounts: Record<string, number> = {};
    
    tasks.forEach(task => {
      const status = task.status;
      statusCounts[status] = (statusCounts[status] || 0) + 1;
      
      // Check normalized status for case sensitivity issues
      const normalizedStatus = normalizeTaskStatus(status);
      if (normalizedStatus) {
        normalizedStatusCounts[normalizedStatus] = (normalizedStatusCounts[normalizedStatus] || 0) + 1;
      }
      
      if (!STATUSES.includes(status as TaskStatus)) {
        invalidStatusTasks.push(task);
      }
    });
    
    console.log('Original status distribution:', statusCounts);
    console.log('Normalized status distribution:', normalizedStatusCounts);
    console.log('Expected statuses:', STATUSES);
    console.log('Tasks with invalid status:', invalidStatusTasks);
    
    // Check for case sensitivity issues
    const caseInsensitiveStatusCounts: Record<string, number> = {};
    tasks.forEach(task => {
      const lowerStatus = task.status.toLowerCase();
      caseInsensitiveStatusCounts[lowerStatus] = (caseInsensitiveStatusCounts[lowerStatus] || 0) + 1;
    });
    console.log('Case-insensitive status distribution:', caseInsensitiveStatusCounts);
    
    // Check for tasks that should appear in each column
    STATUSES.forEach(status => {
      const matchingTasks = tasks.filter(t => t.status === status);
      const normalizedMatchingTasks = tasks.filter(t => normalizeTaskStatus(t.status) === status);
      console.log(`Tasks matching "${status}":`, matchingTasks.length, matchingTasks);
      console.log(`Tasks with normalized status "${status}":`, normalizedMatchingTasks.length, normalizedMatchingTasks);
    });
    
    console.log('=== End TaskBoard Debug ===');
  }, [tasks]);

  /**
   * Handles the start of a drag operation
   * Sets up the active task and stores its original status for potential rollback
   * @param event - Drag start event from @dnd-kit
   */
  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find(t => t.id === event.active.id);
    if (task) {
      setActiveTask(task);
      setOriginalStatus(task.status as TaskStatus);
      console.log('✅ Drag started successfully:', { 
        taskId: task.id, 
        taskTitle: task.title,
        fromStatus: task.status,
        totalTasks: tasks.length,
        activeId: event.active.id
      });
    } else {
      console.log('❌ Task not found for drag start:', { 
        activeId: event.active.id,
        availableTaskIds: tasks.map(t => t.id)
      });
      // Reset state if task not found
      setActiveTask(null);
      setOriginalStatus(null);
    }
  };

  /**
   * Handles the end of a drag operation
   * Validates drop targets and updates task status or reverts changes
   * @param event - Drag end event from @dnd-kit
   */
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    console.log('Drag end event:', { active: active.id, over: over?.id, originalStatus });
    
    if (over && active.id !== over.id) {
      const taskId = active.id as string;
      const newStatus = over.id as TaskStatus;
      
      console.log('Drop target detected:', { taskId, newStatus, originalStatus });
      
      // Check if the drop target is a valid status column
      if (STATUSES.includes(newStatus)) {
        // Check if the task is being dropped in the same column
        if (originalStatus === newStatus) {
          toast.info('Task is already in this column. No changes made.');
        } else {
          // Valid drop - update the task status
          console.log('Updating task status:', { taskId, from: originalStatus, to: newStatus });
          onTaskStatusChange(taskId, newStatus);
          toast.success(`Task moved to ${newStatus.replace('-', ' ')}`);
        }
      } else {
        // Invalid drop target
        console.log('Invalid drop target:', newStatus);
        toast.warning('Invalid drop target. Task returned to original position.');
      }
    } else {
      // Dropped on the same item or no valid target
      console.log('No valid drop target or dropped on same item');
      if (originalStatus) {
        toast.info('Task returned to original position.');
      }
    }
    
    // Reset state after drag operation
    setActiveTask(null);
    setOriginalStatus(null);
  };

  /**
   * Filters tasks by status, handling case sensitivity issues
   * Uses normalized status comparison to ensure consistent filtering
   * @param status - The status to filter by
   * @returns Array of tasks matching the status
   */
  const getTasksByStatus = (status: TaskStatus) => {
    // Use normalized status filtering to handle case sensitivity
    const filteredTasks = tasks.filter(task => {
      const normalizedTaskStatus = normalizeTaskStatus(task.status);
      return normalizedTaskStatus === status;
    });
    console.log(`Tasks for status "${status}" (normalized):`, filteredTasks);
    return filteredTasks;
  };

  /**
   * Identifies tasks with invalid statuses for debugging purposes
   * @returns Array of tasks with unrecognized status values
   */
  const getInvalidStatusTasks = () => {
    return tasks.filter(task => {
      const normalizedStatus = normalizeTaskStatus(task.status);
      return !normalizedStatus || !STATUSES.includes(normalizedStatus);
    });
  };

  const invalidStatusTasks = getInvalidStatusTasks();

  // Show empty state if no tasks exist
  if (tasks.length === 0) {
    return (
      <EmptyState
        title="No tasks found"
        description="Get started by creating your first task. Tasks will appear here once they're added to the board."
        variant="tasks"
      />
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Admin Settings Panel - only visible to admin users */}
      {isAdmin && (
        <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Kanban Board</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Customize colors and manage board settings
            </p>
          </div>
          <KanbanSettings
            customColors={customColors}
            onColorsChange={setCustomColors}
          />
        </div>
      )}

      {/* Main Board Layout with drag-and-drop context */}
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        collisionDetection={customCollisionDetection}
      >
        {/* Main board layout with columns */}
        <div 
          className="flex gap-3 h-full 
                     overflow-x-hidden 
                     overflow-y-auto
                     p-4"
        >
          {/* Render columns for each valid status */}
          {STATUSES.map((status, index) => (
            <Column
              key={status}
              status={status}
              tasks={getTasksByStatus(status)}
              employees={employees}
              onTaskClick={onTaskClick}
              onTaskColorChange={onTaskColorChange}
              canEditColors={canEditColors}
              isFirst={index === 0} // Flag for first column styling
              isLast={index === STATUSES.length - 1} // Flag for last column styling
              customColors={customColors}
            />
          ))}
          
          {/* Debug column for tasks with invalid statuses - only shown in development */}
          {invalidStatusTasks.length > 0 && (
            <div className="flex-1 min-w-0 max-w-xs flex flex-col">
              <div className="flex flex-col h-full border-2 border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
                {/* Debug column header */}
                <div className="p-4 border-b border-red-200 dark:border-red-800 bg-red-100 dark:bg-red-900/30 flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-500 flex items-center justify-center text-white text-sm font-semibold shadow-sm">
                        ⚠️
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-red-700 dark:text-red-300">Invalid Status</h3>
                        <p className="text-xs text-red-600 dark:text-red-400 opacity-75 mt-0.5">
                          Tasks with unrecognized status
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold px-2 py-1 bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800">
                      {invalidStatusTasks.length}
                    </span>
                  </div>
                </div>
                {/* Debug column content */}
                <div className="p-2 bg-white dark:bg-gray-800 flex-1 flex flex-col min-h-0">
                  <div className="flex-1 space-y-0.5 overflow-y-hidden">
                    {invalidStatusTasks.map((task) => {
                      const assignee = employees.find(emp => emp.id === task.assigneeId);
                      return (
                        <div key={task.id} className="border border-red-200 dark:border-red-800 p-3 mb-1.5 bg-red-50 dark:bg-red-900/20">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="text-sm font-medium text-red-900 dark:text-red-300 truncate">
                                {task.title}
                              </div>
                              <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                                Status: "{task.status}" (not recognized)
                              </div>
                            </div>
                            <div className="flex-shrink-0 ml-2">
                              <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600">
                                {assignee?.name.split(' ').map(n => n[0]).join('') || 'U'}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Drag overlay - shows the dragged task above other content */}
        <DragOverlay>
          {activeTask ? (
            <div className="w-72">
              <TaskCard
                task={activeTask}
                assignee={employees.find(emp => emp.id === activeTask.assigneeId)}
                onClick={() => {}} // No-op during drag
                onColorChange={onTaskColorChange}
                canEditColors={canEditColors}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
} 