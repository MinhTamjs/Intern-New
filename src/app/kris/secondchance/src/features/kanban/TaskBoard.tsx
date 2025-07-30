import { useState, useEffect } from 'react';
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

// Task board props
interface TaskBoardProps {
  tasks: Task[];
  employees: Employee[];
  onTaskClick: (task: Task) => void;
  onTaskStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onTaskColorChange?: (taskId: string, color: string | null) => void;
  canEditColors?: boolean;
  isAdmin?: boolean;
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
  isAdmin = false
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

  // Drag sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Get tasks by status
  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter(task => task.status === status);
  };

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

  return (
    <div className="h-full flex flex-col">
      {/* Admin settings */}
      {isAdmin && (
        <div className="mb-4 flex justify-end">
          <KanbanSettings
            customColors={customColors}
            onColorsChange={handleColorsChange}
          />
        </div>
      )}

      {/* Drag and drop context */}
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {/* Board columns */}
        <div className="flex gap-3 h-full overflow-x-hidden overflow-y-auto p-4">
          {STATUSES.map((status, index) => (
            <Column
              key={status}
              status={status}
              tasks={getTasksByStatus(status)}
              employees={employees}
              onTaskClick={onTaskClick}
              onTaskColorChange={onTaskColorChange}
              canEditColors={canEditColors}
              isFirst={index === 0}
              isLast={index === STATUSES.length - 1}
              customColors={customColors}
            />
          ))}

          {/* Active task overlay */}
          {activeTask && (
            <div className="absolute" style={activeTaskStyle}>
              <TaskCard
                task={activeTask}
                assignee={employees.find(emp => emp.id === activeTask.assigneeId)}
                onClick={() => {}}
                onColorChange={onTaskColorChange}
                canEditColors={canEditColors}
              />
            </div>
          )}
        </div>
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