import type { Task, TaskStatus, TaskLabel } from '../tasks/types';
import type { Employee } from '../../features/employees/types';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { TaskCard } from './TaskCard';
import { useEffect, useState } from 'react';

interface ColumnProps {
  status: TaskStatus;
  tasks: Task[];
  employees: Employee[];
  currentUserRole: 'admin' | 'manager' | 'employee';
  onAssignUsers: (taskId: string, userIds: string[]) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onMove?: (taskId: string, newStatus: string) => void;
  onUpdateLabels?: (taskId: string, labels: TaskLabel[]) => void;
  onUpdatePriority?: (taskId: string, priority: string) => void;
  onUpdateDueDate?: (taskId: string, dueDate: Date | null) => void;
}

export const Column = ({
  status,
  tasks,
  employees,
  currentUserRole,
  onAssignUsers,
  onEdit,
  onDelete,
  onMove,
  onUpdateLabels,
  onUpdatePriority,
  onUpdateDueDate,
}: ColumnProps) => {
  const { setNodeRef } = useDroppable({ id: status });
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
    };
    
    checkDarkMode();
    
    // Listen for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={setNodeRef}
      className="w-full flex flex-col border-2 shadow-sm"
      style={{ 
        minHeight: 600,
        backgroundColor: isDarkMode ? '#1a1a1a' : '#f9fafb',
        borderColor: isDarkMode ? '#fc099f' : '#5ce7ff'
      }}
    >
      <div 
        className="pb-1.5 px-4 py-3 border-b flex-shrink-0 font-semibold uppercase text-sm tracking-wide"
        style={{
          borderColor: isDarkMode ? '#fc099f' : '#5ce7ff',
          color: isDarkMode ? 'white' : '#5ce7ff'
        }}
      >
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
                onAssignUsers={onAssignUsers}
                onEdit={onEdit}
                onDelete={onDelete}
                onMove={onMove}
                onUpdateLabels={onUpdateLabels}
                onUpdatePriority={onUpdatePriority}
                onUpdateDueDate={onUpdateDueDate}
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