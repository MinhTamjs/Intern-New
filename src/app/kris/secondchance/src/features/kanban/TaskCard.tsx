import type { Task } from '../tasks/types';
import type { Employee } from '../../features/employees/types';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../components/ui/tooltip';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TaskSettingsModal } from '../../components/ui/task-settings-modal';
import { useState } from 'react';

interface TaskCardProps {
  task: Task;
  employees: Employee[];
  currentUserRole: 'admin' | 'manager' | 'employee';
  onTaskClick: (task: Task) => void;
  onAssignUsers: (taskId: string, userIds: string[]) => void;
  onColorChange?: (taskId: string, color: string) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onMove?: (taskId: string, newStatus: string) => void;
}

export function TaskCard({
  task,
  employees,
  currentUserRole,
  onTaskClick,
  onAssignUsers,
  onColorChange,
  onEdit,
  onDelete,
  onMove,
}: TaskCardProps) {
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Map assigneeIds to Employee objects
  const assignees = (task.assigneeIds || [])
    .map(id => employees.find(emp => emp.id === id))
    .filter(Boolean) as Employee[];

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    ...(task.customColor ? { backgroundColor: task.customColor } : {}),
  };

  const handleSettingsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSettingsModalOpen(true);
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={
          `bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-none cursor-pointer transition-all duration-200 ease-in-out w-[95%] max-w-full overflow-hidden group relative mx-auto hover:shadow-md hover:scale-[1.01] mb-2 ${isDragging ? 'z-50 opacity-50' : 'z-0'}`
        }
        onClick={() => onTaskClick(task)}
      >
        <div className="p-2">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-medium text-xs truncate flex-1 mr-2">{task.title}</h4>
            <div className="flex items-center gap-1">
              {/* Avatars */}
              {assignees.slice(0, 2).map((assignee) => (
                <TooltipProvider key={assignee.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Avatar className="h-5 w-5 border border-white dark:border-gray-800">
                        <AvatarFallback className="text-xs">
                          {assignee.name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{assignee.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
              {assignees.length > 2 && (
                <div className="h-5 w-5 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-xs text-gray-600 dark:text-gray-300">+{assignees.length - 2}</span>
                </div>
              )}
              
              {/* Settings Button */}
              <div onClick={handleSettingsClick} className="ml-1">
                <button
                  type="button"
                  aria-label="Open task settings"
                  className="h-6 w-6 p-0 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors opacity-60 hover:opacity-100"
                >
                  <svg className="h-3.5 w-3.5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{task.description}</p>
        </div>
      </div>

      {/* Task Settings Modal */}
      <TaskSettingsModal
        task={task}
        employees={employees}
        currentUserRole={currentUserRole}
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onAssignUsers={onAssignUsers}
        onColorChange={onColorChange}
        onEdit={onEdit}
        onDelete={onDelete}
        onMove={onMove}
      />
    </>
  );
} 