import { useState, useEffect, useMemo, useCallback } from 'react';
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core';
import { toast } from 'sonner';
import { Column } from './Column';
import { TaskCard } from './TaskCard';
import { EmptyState } from '../../components/EmptyState';
import { KanbanSettings } from '../../components/KanbanSettings';
import { type StatusColors } from '../../lib/themeUtils';
import { useTheme } from '../../lib/useTheme';
import type { Task, TaskStatus } from '../tasks/types';
import type { Employee } from '../employees/types';
import { TaskBoardFilter } from './TaskBoardFilter';
import type { TaskFilters } from './TaskBoardFilter';
import { useUpdateTask } from '../../features/tasks/hooks/useTasks';

// Task board props
interface TaskBoardProps {
  tasks: Task[];
  employees: Employee[];
  onTaskClick: (task: Task) => void;
  onTaskStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onTaskColorChange?: (taskId: string, color: string | null) => void;
  canEditColors?: boolean;
  isAdmin?: boolean;
  onAssignUsers?: (taskId: string) => void;
  canAssignUsers?: boolean;
}

// Available task statuses
const STATUSES: TaskStatus[] = ['pending', 'in-progress', 'in-review', 'done'];

/**
 * Task board component
 * Manages Kanban board layout and drag-and-drop functionality
 */
export function TaskBoard({
  tasks,
  employees,
  onTaskClick,
  onTaskStatusChange,
  onTaskColorChange,
  canEditColors = false,
  isAdmin = false,
  onAssignUsers,
  canAssignUsers = false
}: TaskBoardProps) {
  // Drag state
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [originalStatus, setOriginalStatus] = useState<TaskStatus | null>(null);
  
  // Custom colors state
  const [customColors, setCustomColors] = useState<Record<string, StatusColors>>({});

  // Theme for color reset
  const { theme } = useTheme();

  // Reset custom colors when theme changes
  useEffect(() => {
    if (Object.keys(customColors).length > 0) {
      setCustomColors({});
      toast.info('Custom colors reset to default for new theme');
    }
  }, [theme]);

  // Reset all TaskCard custom colors on theme change
  useEffect(() => {
    tasks.forEach(task => {
      if (task.customColor) {
        updateTask.mutate({ id: task.id, data: { customColor: undefined } });
      }
    });
  }, [theme]);

  // Drag sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Filter state for TaskBoardFilter
  const [filters, setFilters] = useState<TaskFilters>({ searchTerm: '', selectedAssigneeIds: [] });

  // Memoize employeesById for O(1) lookup
  const employeesById = useMemo(() => {
    const map: Record<string, Employee> = {};
    employees.forEach(emp => { map[emp.id] = emp; });
    return map;
  }, [employees]);

  // Memoize filtered tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesTitle = task.title.toLowerCase().includes(filters.searchTerm.toLowerCase());
      const matchesAssignee = filters.selectedAssigneeIds.length === 0 || 
        task.assigneeIds.some(id => filters.selectedAssigneeIds.includes(id));
      return matchesTitle && matchesAssignee;
    });
  }, [tasks, filters]);

  // Memoize getTasksByStatus
  const getTasksByStatus = useCallback((status: TaskStatus) => {
    return filteredTasks.filter(task => task.status === status);
  }, [filteredTasks]);

  // Memoize event handlers
  const memoizedOnTaskClick = useCallback(onTaskClick, []);
  const memoizedOnTaskColorChange = onTaskColorChange ? useCallback(onTaskColorChange, []) : undefined;

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find(t => t.id === event.active.id);
    if (task) {
      setActiveTask(task);
      setOriginalStatus(task.status);
    }
  };

  // Handle drag over
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as TaskStatus;

    if (STATUSES.includes(newStatus)) {
      onTaskStatusChange(taskId, newStatus);
    }
  };

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { over } = event;

    if (!over) {
      // Reset to original status if dropped outside
      if (activeTask && originalStatus) {
        onTaskStatusChange(activeTask.id, originalStatus);
      }
    }

    setActiveTask(null);
    setOriginalStatus(null);
  };

  // Handle custom colors change
  const handleColorsChange = (newColors: Record<string, StatusColors>) => {
    setCustomColors(newColors);
  };

  const updateTask = useUpdateTask();

  return (
    <div className="h-full flex flex-col">
      {/* Filter bar above columns */}
      <div className="flex justify-center w-full mb-2">
        <div className="w-[1400px] max-w-full flex items-center">
          <TaskBoardFilter
            employees={employees}
            onFilterChange={setFilters}
          />
          {isAdmin && (
            <div className="ml-4">
              <KanbanSettings
                customColors={customColors}
                onColorsChange={handleColorsChange}
              />
            </div>
          )}
        </div>
      </div>
      {/* Drag and drop context */}
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {/* Board columns */}
        <div className="flex justify-center gap-6 h-full overflow-x-hidden overflow-y-auto p-4">
          <div className="flex gap-6 w-[1400px] max-w-full">
            {STATUSES.map((status, index) => (
              <Column
                key={status}
                status={status}
                tasks={getTasksByStatus(status)}
                employeesById={employeesById}
                onTaskClick={memoizedOnTaskClick}
                onTaskColorChange={memoizedOnTaskColorChange}
                canEditColors={canEditColors}
                isFirst={index === 0}
                isLast={index === STATUSES.length - 1}
                customColors={customColors}
                onAssignUsers={onAssignUsers}
                canAssignUsers={canAssignUsers}
              />
            ))}
          </div>
        </div>

        {/* Active task overlay */}
        {activeTask && (
          <div className="absolute" style={activeTaskStyle}>
            <TaskCard
              task={activeTask}
              assignees={(activeTask.assigneeIds || []).map(id => employees.find(emp => emp.id === id)).filter(Boolean) as Employee[]}
              onClick={() => {}}
              onColorChange={onTaskColorChange}
              canEditColors={canEditColors}
            />
          </div>
        )}
      </DndContext>

      {/* Empty state */}
      {tasks.length === 0 && (
        <EmptyState
          title="No tasks yet"
          description="Create your first task to get started"
        />
      )}
    </div>
  );
}

// Active task overlay styles
const activeTaskStyle = {
  transform: 'rotate(5deg)',
  zIndex: 1000,
  opacity: 0.8,
  pointerEvents: 'none',
} as const; 