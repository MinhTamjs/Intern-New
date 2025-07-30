import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Badge } from '../../components/ui/badge';
import { TaskCard } from './TaskCard';
import { getStatusInfo, type StatusColors } from '../../lib/themeUtils';
import { useTheme } from '../../lib/useTheme';
import type { Task, TaskStatus } from '../tasks/types';
import type { Employee } from '../employees/types';

// Column props
interface ColumnProps {
  status: TaskStatus;
  tasks: Task[];
  employees: Employee[];
  onTaskClick: (task: Task) => void;
  onTaskColorChange?: (taskId: string, color: string | null) => void;
  canEditColors?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
  customColors?: Record<string, StatusColors>;
}

/**
 * Column component for Kanban board
 * Represents a single status column with tasks
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
  // Drop zone setup
  const { setNodeRef, isOver, active } = useDroppable({ id: status });
  const isDragActive = active !== null;
  const isCurrentColumnTarget = isOver && isDragActive;

  // Theme and status info
  const { theme } = useTheme();
  const statusInfo = getStatusInfo(status, theme, customColors);
  const taskCount = tasks.length;

  // Container classes
  const getContainerClasses = () => {
    return isFirst ? 'ml-0' : isLast ? 'mr-0' : '';
  };

  // Drag feedback classes
  const getDragFeedbackClasses = () => {
    if (isCurrentColumnTarget) {
      return 'border-green-400 dark:border-green-500 bg-green-50 dark:bg-green-900/20';
    }
    return '';
  };

  return (
    <div className={`flex-1 min-w-0 max-w-xs flex flex-col ${getContainerClasses()}`}>
      {/* Column container */}
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
        {/* Column header */}
        <div
          className="pb-1.5 px-2 py-2 border-b flex-shrink-0"
          style={{
            backgroundColor: statusInfo.colors.headerBg,
            borderColor: statusInfo.colors.border
          }}
        >
          <div className="flex items-center justify-between">
            {/* Status info */}
            <div className="flex items-center gap-1.5">
              <div
                className="w-5 h-5 flex items-center justify-center text-white text-[10px] font-semibold shadow-sm"
                style={{ backgroundColor: statusInfo.colors.background }}
              >
                {statusInfo.icon}
              </div>
              <div>
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

        {/* Column content */}
        <div className="pt-0 px-0.5 pb-0.5 flex-1 flex flex-col min-h-0 bg-gray-50 dark:bg-[#1a1a1a]">
          <div
            ref={setNodeRef}
            className={`
              flex-1 space-y-0.5
              ${isDragActive ? 'overflow-y-auto' : 'overflow-x-hidden'}
              ${isCurrentColumnTarget ? 'bg-green-50 dark:bg-green-900 bg-opacity-50 dark:bg-opacity-30 p-0.5 border-2 border-green-300 dark:border-green-600 border-dashed' : ''}
              transition-all duration-200
              min-h-[60px]
            `}
          >
            {/* Task list */}
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
            
            {/* Empty state */}
            {tasks.length === 0 && (
              <div className="flex items-center justify-center h-16 text-gray-400 dark:text-gray-600">
                <span className="text-xs">No tasks</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}