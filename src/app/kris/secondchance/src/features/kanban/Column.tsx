import type { Task, TaskStatus } from '../tasks/types';
import type { Employee } from '../../features/employees/types';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { TaskCard } from './TaskCard';

const STATUS_STYLES: Record<TaskStatus, string> = {
  pending: 'border-red-300 bg-red-50 dark:bg-red-900/20',
  'in-progress': 'border-blue-300 bg-blue-50 dark:bg-blue-900/20',
  'in-review': 'border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20',
  done: 'border-green-300 bg-green-50 dark:bg-green-900/20',
};

interface ColumnProps {
  status: TaskStatus;
  tasks: Task[];
  employees: Employee[];
  currentUserRole: 'admin' | 'manager' | 'employee';
  onTaskClick: (task: Task) => void;
  onAssignUsers: (taskId: string, userIds: string[]) => void;
  onColorChange?: (taskId: string, color: string) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onMove?: (taskId: string, newStatus: string) => void;
}

export const Column = ({
  status,
  tasks,
  employees,
  currentUserRole,
  onTaskClick,
  onAssignUsers,
  onColorChange,
  onEdit,
  onDelete,
  onMove,
}: ColumnProps) => {
  const { setNodeRef } = useDroppable({ id: status });

  return (
    <div
      ref={setNodeRef}
      className={`flex-shrink-0 w-[320px] max-w-[320px] flex flex-col border-2 shadow-sm rounded-none ${STATUS_STYLES[status]}`}
      style={{ minHeight: 600 }}
    >
      <div className="pb-1.5 px-2 py-2 border-b flex-shrink-0 rounded-none font-semibold uppercase text-xs tracking-wide">
        {status.replace('-', ' ')}
      </div>
      <div className="flex-1 p-2 overflow-y-auto min-h-[200px] max-h-[600px] flex flex-col">
        <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                employees={employees}
                currentUserRole={currentUserRole}
                onTaskClick={onTaskClick}
                onAssignUsers={onAssignUsers}
                onColorChange={onColorChange}
                onEdit={onEdit}
                onDelete={onDelete}
                onMove={onMove}
              />
            ))}
            {/* Reserve space for one more card */}
            <div className="h-16" />
          </div>
        </SortableContext>
      </div>
    </div>
  );
};