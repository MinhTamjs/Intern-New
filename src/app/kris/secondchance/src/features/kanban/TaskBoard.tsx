/**
 * TaskBoard Component
 * 
 * Main Kanban board interface for task management. Provides drag-and-drop functionality,
 * task filtering, sorting, and visual organization of tasks by status.
 * 
 * Features:
 * - Drag and drop task reordering
 * - Search and filter capabilities
 * - Custom color themes
 * - Role-based permissions
 * - Real-time task updates
 */

import { useState, useMemo } from 'react';
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { toast } from 'sonner';
import { Search, ArrowUpDown } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Column } from './Column';
import { useTaskFilters } from '../../hooks/useTaskFilters';
import { useApp } from '../../hooks/useApp';
import { useAuth } from '../../hooks/useAuth';
import { LabelFilter } from '../tasks/components/LabelFilter';
import { useUpdateTask, useDeleteTask } from '../tasks/hooks/useTasks';
import { useEmployees } from '../employees/hooks/useEmployees';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { EmptyState } from '../../components/EmptyState';
import type { Task, TaskStatus } from '../tasks/types';
import type { TaskLabel } from '../tasks/types';
import type { Employee } from '../employees/types';
import { auditLogHelpers } from '../../lib/audit/auditLog';

// Available task statuses for the Kanban board
const STATUSES: TaskStatus[] = ['pending', 'in-progress', 'in-review', 'done'];

/**
 * TaskBoard Component
 * 
 * Renders the main Kanban board with drag-and-drop functionality, task filtering,
 * and real-time updates. Handles task operations like editing, deleting, and moving.
 */
export function TaskBoard() {
  const {
    migratedTasks: tasks,
    permissions,
    isLoading,
    handleTaskStatusChange,
    handleTaskUpdate,
    setIsCreateModalOpen
  } = useApp();

  const { currentRole } = useAuth();

  // Use custom hook for filtering
  const { tasksByStatus, filters, setFilters, selectedLabels, setSelectedLabels } = useTaskFilters(tasks || []);

  // Sort state
  const [sortBy, setSortBy] = useState<'priority' | 'date' | 'assignee'>('date');

  // Task update mutation
  const updateTask = useUpdateTask();
  
  // Task delete mutation
  const deleteTask = useDeleteTask();

  // Employees data
  const { data: employeesRaw = [] } = useEmployees();
  const employees = employeesRaw as Employee[];

  // Apply sorting to tasksByStatus
  const sortedTasksByStatus = useMemo(() => {
    const sorted: Record<TaskStatus, Task[]> = {} as Record<TaskStatus, Task[]>;
    
    // Sort tasks based on current sortBy value
    const sortTasks = (tasks: Task[]): Task[] => {
      if (!tasks || tasks.length === 0) return tasks;

      return [...tasks].sort((a, b) => {
        switch (sortBy) {
          case 'priority': {
            const priorityOrder = { 'high': 1, 'medium': 2, 'low': 3 };
            const priorityA = priorityOrder[a.priority as keyof typeof priorityOrder] || 4;
            const priorityB = priorityOrder[b.priority as keyof typeof priorityOrder] || 4;
            return priorityA - priorityB;
          }

          case 'date': {
            // Use dueDate for sorting, fallback to task ID for consistent ordering
            const dateA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
            const dateB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
            if (dateA !== dateB) {
              return dateA - dateB; // Earliest due date first
            }
            // If same due date, sort by ID for consistency
            return a.id.localeCompare(b.id);
          }

          case 'assignee': {
            const assigneeA = a.assigneeIds && a.assigneeIds.length > 0 ? a.assigneeIds[0] : '';
            const assigneeB = b.assigneeIds && b.assigneeIds.length > 0 ? b.assigneeIds[0] : '';
            return assigneeA.localeCompare(assigneeB);
          }

          default:
            return 0;
        }
      });
    };
    
    STATUSES.forEach(status => {
      const tasksForStatus = tasksByStatus[status] || [];
      sorted[status] = sortTasks(tasksForStatus);
    });
    
    return sorted;
  }, [tasksByStatus, sortBy]);

  // Drag sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    if (tasks && Array.isArray(tasks)) {
      const task = tasks.find((t: Task) => t.id === event.active.id);
      if (task) {
        // Handle drag start if needed
      }
    }
  };

  // Handle drag over
  const handleDragOver = () => {
    // Optional: Add visual feedback during drag
  };

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const taskId = active.id as string;
      const newStatus = over.id as TaskStatus;
      
      if (STATUSES.includes(newStatus)) {
        handleTaskStatusChange(taskId, newStatus);
      }
    }
  };

  // New handlers for consolidated settings menu
  const handleAssignUsersFromMenu = (taskId: string, userIds: string[]) => {
    updateTask.mutate({ 
      id: taskId, 
      data: { assigneeIds: userIds } 
    });
    toast.success('Users assigned successfully');
  };

  const handleEditTask = (task: Task) => {
    console.log('handleEditTask called with:', task);
    
    // Use the handleTaskUpdate function from useApp
    // The task object passed here contains the edited data from the modal
    const updates = {
      description: task.description,
      assigneeIds: task.assigneeIds,
      status: task.status,
      dueDate: task.dueDate,
      labels: task.labels,
      priority: task.priority
    };
    
    console.log('Calling handleTaskUpdate with updates:', updates);
    handleTaskUpdate(task.id, updates);
    toast.success('Task updated successfully');
  };

  const handleUpdateLabels = (taskId: string, labels: TaskLabel[]) => {
    console.log('handleUpdateLabels called:', { taskId, labels });
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const updatedTask = { ...task, labels };
      console.log('Updating task with new labels:', updatedTask);
      handleEditTask(updatedTask);
    } else {
      console.error('Task not found for ID:', taskId);
    }
  };

  const handleUpdatePriority = (taskId: string, priority: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const updatedTask = { ...task, priority: priority as 'low' | 'medium' | 'high' };
      handleEditTask(updatedTask);
    }
  };

  const handleUpdateDueDate = (taskId: string, dueDate: Date | null) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const updatedTask = { ...task, dueDate: dueDate ? dueDate.toISOString() : '' };
      handleEditTask(updatedTask);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    // Find the task before deletion to get its details for audit log
    const taskToDelete = tasks?.find(task => task.id === taskId);
    
    // Use the delete mutation to actually delete the task
    deleteTask.mutate(taskId, {
      onSuccess: () => {
        // Log the deletion in audit log
        if (taskToDelete) {
          auditLogHelpers.taskDeleted(taskToDelete.description);
        }
        toast.success('Task deleted successfully');
      },
      onError: (error) => {
        console.error('Failed to delete task:', error);
        toast.error('Failed to delete task');
      }
    });
  };

  const handleMoveTask = (taskId: string, newStatus: string) => {
    if (STATUSES.includes(newStatus as TaskStatus)) {
      handleTaskStatusChange(taskId, newStatus as TaskStatus);
      toast.success(`Task moved to ${newStatus}`);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading..." showLogo />
      </div>
    );
  }

  // Empty state
  if (!tasks || tasks.length === 0) {
    return (
      <div className="p-6">
        <EmptyState
          title="No tasks yet"
          description="Get started by creating your first task"
          action={{
            label: "Create Task",
            onClick: () => setIsCreateModalOpen(true)
          }}
        />
      </div>
    );
  }

  return (
    <div className="px-6">
      {/* Search and filters - positioned under dashboard title */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search tasks and users..."
            value={filters.searchTerm}
            onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
            className="w-64"
          />
        </div>
        
        <div className="flex items-center gap-2 ml-auto">
          <LabelFilter
            selectedLabels={selectedLabels}
            onLabelsChange={setSelectedLabels}
            tasks={tasks || []}
          />
          <ArrowUpDown className="h-4 w-4 text-gray-500" />
          <Select value={sortBy} onValueChange={(value: 'priority' | 'date' | 'assignee') => setSortBy(value)}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Sort by">
                {sortBy === 'priority' && 'Priority'}
                {sortBy === 'date' && 'Due Date'}
                {sortBy === 'assignee' && 'Assignee'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="priority" className="flex items-center gap-2">
                <span>Priority</span>
                {sortBy === 'priority' && <span className="text-blue-600">✓</span>}
              </SelectItem>
              <SelectItem value="date" className="flex items-center gap-2">
                <span>Due Date</span>
                {sortBy === 'date' && <span className="text-blue-600">✓</span>}
              </SelectItem>
              <SelectItem value="assignee" className="flex items-center gap-2">
                <span>Assignee</span>
                {sortBy === 'assignee' && <span className="text-blue-600">✓</span>}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Kanban board - full width with equal columns */}
      <div className="w-full">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {STATUSES.map((status) => (
              <Column
                key={status}
                status={status}
                tasks={sortedTasksByStatus[status] || []}
                employees={employees}
                currentUserRole={currentRole}
                onAssignUsers={handleAssignUsersFromMenu}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                onMove={handleMoveTask}
                onUpdateLabels={handleUpdateLabels}
                onUpdatePriority={handleUpdatePriority}
                onUpdateDueDate={handleUpdateDueDate}
              />
            ))}
          </div>
        </DndContext>
      </div>

      {/* Create task button */}
      {permissions.canCreateTask && (
        <div className="fixed bottom-6 right-6">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="w-14 h-14 text-white shadow-lg flex items-center justify-center transition-colors rounded-full hover:opacity-80"
            style={{
              backgroundColor: '#5ce7ff'
            }}
          >
            <img
              src="/favicon.png"
              alt="Add New Task"
              className="w-8 h-8 object-contain"
            />
          </button>
        </div>
      )}
    </div>
  );
} 