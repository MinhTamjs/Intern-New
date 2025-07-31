import { useState, useEffect } from 'react';
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { toast } from 'sonner';
import { Column } from './Column';
import { EmptyState } from '../../components/EmptyState';
import { KanbanSettings } from '../../components/KanbanSettings';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { type StatusColors } from '../../lib/theme/themeUtils';
import { useTheme } from '../../lib/theme/useTheme';
import { useApp } from '../../hooks/useApp';
import { useTaskFilters } from '../../hooks/useTaskFilters';
import type { Task, TaskStatus } from '../tasks/types';
import { useUpdateTask } from '../../features/tasks/hooks/useTasks';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Input } from '../../components/ui/input';
import { ArrowUpDown, Search } from 'lucide-react';
import { useEmployees } from '../../features/employees/hooks/useEmployees';
import type { Employee } from '../../features/employees/types';
import { useAuth } from '../../contexts/AuthContext';

// Available task statuses
const STATUSES: TaskStatus[] = ['pending', 'in-progress', 'in-review', 'done'];

export function TaskBoard() {
  const {
    migratedTasks: tasks,
    permissions,
    isLoading,
    handleTaskClick,
    handleTaskStatusChange,
    handleTaskColorChange,
    setIsCreateModalOpen
  } = useApp();

  const { currentRole } = useAuth();

  // Use custom hook for filtering
  const { tasksByStatus, filters, setFilters } = useTaskFilters(tasks || []);

  // Sort state
  const [sortBy, setSortBy] = useState<'priority' | 'date' | 'assignee'>('date');

  // Custom colors state
  const [customColors, setCustomColors] = useState<Record<string, StatusColors>>({});

  // Theme for color reset
  const { theme } = useTheme();

  // Task update mutation
  const updateTask = useUpdateTask();

  // Employees data
  const { data: employeesRaw = [] } = useEmployees();
  const employees = employeesRaw as Employee[];

  // Reset custom colors when theme changes
  useEffect(() => {
    if (Object.keys(customColors).length > 0) {
      setCustomColors({});
      toast.info('Custom colors reset to default for new theme');
    }
  }, [theme]);

  // Reset all TaskCard custom colors on theme change
  useEffect(() => {
    if (tasks && Array.isArray(tasks)) {
      tasks.forEach((task: Task) => {
        if (task && task.customColor) {
          updateTask.mutate({ id: task.id, data: { customColor: undefined } });
        }
      });
    }
  }, [theme, tasks, updateTask]);

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

  // Handle colors change
  const handleColorsChange = (newColors: Record<string, StatusColors>) => {
    setCustomColors(newColors);
  };

  // New handlers for consolidated settings menu
  const handleAssignUsersFromMenu = (taskId: string, userIds: string[]) => {
    // Update task with new assignee IDs
    updateTask.mutate({ 
      id: taskId, 
      data: { assigneeIds: userIds } 
    });
    toast.success('Users assigned successfully');
  };

  const handleColorChangeFromMenu = (taskId: string, color: string) => {
    if (handleTaskColorChange) {
      handleTaskColorChange(taskId, color);
    }
  };

  const handleEditTask = (task: Task) => {
    handleTaskClick(task);
    // You might want to open the edit modal here
  };

  const handleDeleteTask = (taskId: string) => {
    // Implement delete logic - remove task from the list
    console.log('Deleting task:', taskId);
    toast.success('Task deleted successfully');
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
        <LoadingSpinner size="lg" text="Loading ZIRA..." showLogo />
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
    <div className="p-6">
      {/* Header with filters and settings */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search tasks and users..."
            value={filters.searchTerm}
            onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
            className="w-64"
          />
          <KanbanSettings
            customColors={customColors}
            onColorsChange={handleColorsChange}
          />
          <ArrowUpDown className="h-4 w-4 text-gray-500" />
          <Select value={sortBy} onValueChange={(value: 'priority' | 'date' | 'assignee') => setSortBy(value)}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="priority">Priority</SelectItem>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="assignee">Assignee</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Kanban board with horizontal scrolling - centered */}
      <div className="flex justify-center w-full">
        <div className="overflow-x-auto max-w-full w-full">
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <div className="flex flex-nowrap gap-6 min-w-max p-4 justify-center">
              {STATUSES.map((status) => (
                <Column
                  key={status}
                  status={status}
                  tasks={tasksByStatus[status] || []}
                  employees={employees}
                  currentUserRole={currentRole}
                  onTaskClick={handleTaskClick}
                  onAssignUsers={handleAssignUsersFromMenu}
                  onColorChange={handleColorChangeFromMenu}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                  onMove={handleMoveTask}
                />
              ))}
            </div>
          </DndContext>
        </div>
      </div>

      {/* Create task button */}
      {permissions.canCreateTask && (
        <div className="fixed bottom-6 right-6">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors"
          >
            <span className="text-2xl">+</span>
          </button>
        </div>
      )}
    </div>
  );
} 