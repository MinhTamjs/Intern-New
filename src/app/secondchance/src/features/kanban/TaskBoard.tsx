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
import { normalizeTaskStatus } from '../../lib/utils';
import type { Task, TaskStatus } from '../tasks/types';
import type { Employee } from '../employees/types';

interface TaskBoardProps {
  tasks: Task[];
  employees: Employee[];
  onTaskClick: (task: Task) => void;
  onTaskStatusChange: (taskId: string, newStatus: TaskStatus) => void;
}

const STATUSES: TaskStatus[] = ['pending', 'in-progress', 'in-review', 'done'];

// Custom collision detection strategy that combines multiple methods
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

export function TaskBoard({ tasks, employees, onTaskClick, onTaskStatusChange }: TaskBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [originalStatus, setOriginalStatus] = useState<TaskStatus | null>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Enhanced debug logging to identify status issues
  useEffect(() => {
    console.log('=== TaskBoard Debug Information ===');
    console.log('Total tasks received:', tasks.length);
    console.log('All tasks:', tasks);
    
    // Check for status mismatches
    const statusCounts: Record<string, number> = {};
    const invalidStatusTasks: Task[] = [];
    const normalizedStatusCounts: Record<string, number> = {};
    
    tasks.forEach(task => {
      const status = task.status;
      statusCounts[status] = (statusCounts[status] || 0) + 1;
      
      // Check normalized status
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

  // Enhanced drag detection with better visual feedback
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
    }
  };

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
    
    // Reset state
    setActiveTask(null);
    setOriginalStatus(null);
  };

  const getTasksByStatus = (status: TaskStatus) => {
    // Use normalized status filtering to handle case sensitivity
    const filteredTasks = tasks.filter(task => {
      const normalizedTaskStatus = normalizeTaskStatus(task.status);
      return normalizedTaskStatus === status;
    });
    console.log(`Tasks for status "${status}" (normalized):`, filteredTasks);
    return filteredTasks;
  };

  // Get tasks with invalid statuses for debugging
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
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      collisionDetection={customCollisionDetection}
    >
      <div 
        className="flex gap-3 h-full 
                   overflow-x-hidden 
                   overflow-y-auto"
      >
        {STATUSES.map((status, index) => (
          <Column
            key={status}
            status={status}
            tasks={getTasksByStatus(status)}
            employees={employees}
            onTaskClick={onTaskClick}
            isFirst={index === 0}
            isLast={index === STATUSES.length - 1}
          />
        ))}
        
        {/* Debug column for tasks with invalid statuses */}
        {invalidStatusTasks.length > 0 && (
          <div className="flex-1 min-w-0 max-w-xs flex flex-col">
            <div className="flex flex-col h-full border-2 border-red-200 bg-red-50 rounded-lg">
              <div className="p-4 border-b border-red-200 bg-red-100 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center text-white text-sm font-semibold shadow-sm">
                      ⚠️
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-red-700">Invalid Status</h3>
                      <p className="text-xs text-red-600 opacity-75 mt-0.5">
                        Tasks with unrecognized status
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 bg-red-100 text-red-800 border border-red-200 rounded">
                    {invalidStatusTasks.length}
                  </span>
                </div>
              </div>
              <div className="p-2 bg-white flex-1 flex flex-col min-h-0">
                <div className="flex-1 space-y-0.5 overflow-y-hidden">
                  {invalidStatusTasks.map((task) => {
                    const assignee = employees.find(emp => emp.id === task.assigneeId);
                    return (
                      <div key={task.id} className="border rounded-lg p-3 mb-1.5 bg-red-50 border-red-200">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="text-sm font-medium text-red-900 truncate">
                              {task.title}
                            </div>
                            <div className="text-xs text-red-600 mt-1">
                              Status: "{task.status}" (not recognized)
                            </div>
                          </div>
                          <div className="flex-shrink-0 ml-2">
                            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600 border border-gray-300">
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
      
      <DragOverlay>
        {activeTask ? (
          <div className="w-72">
            <TaskCard
              task={activeTask}
              assignee={employees.find(emp => emp.id === activeTask.assigneeId)}
              onClick={() => {}}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
} 