/**
 * TaskCard Component
 * 
 * Individual task card component for the Kanban board. Displays task information,
 * handles drag-and-drop functionality, and provides access to task settings.
 * 
 * Features:
 * - Drag and drop support
 * - Task description display with word wrapping
 * - Assigned user avatars
 * - Task settings modal integration
 * - Role-based permissions
 */

import { useState } from 'react';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { TaskSettingsModal } from '../../components/ui/task-settings-modal';
import type { TaskLabel } from '../tasks/types';
import type { Employee } from '../employees/types';
import type { Task } from '../tasks/types';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';
import { Badge } from '../../components/ui/badge';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Lock } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../components/ui/tooltip';

interface TaskCardProps {
  task: Task;
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

export function TaskCard({
  task,
  employees,
  currentUserRole,
  onAssignUsers,
  onEdit,
  onDelete,
  onMove,
  onUpdateLabels,
  onUpdatePriority,
  onUpdateDueDate,
}: TaskCardProps) {
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Map assigneeIds to Employee objects
  const assignees = (task.assigneeIds || [])
    .map(id => employees.find(emp => emp.id === id))
    .filter(Boolean) as Employee[];

  // Check if task is completed
  const isTaskCompleted = task.status === 'done';

  // Debug logging
  console.log('TaskCard assignees:', {
    taskId: task.id,
    assigneeIds: task.assigneeIds,
    employees: employees.length,
    assignees: assignees.length,
    assigneeNames: assignees.map(a => a.name),
    isTaskCompleted
  });

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: task.id,
    disabled: isTaskCompleted // Disable drag for completed tasks
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleSettingsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSettingsModalOpen(true);
  };

  return (
    <>
      <div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        className={`border shadow-sm cursor-pointer transition-all hover:shadow-md bg-white dark:bg-gray-800 ${isDragging ? 'z-50 opacity-50' : 'z-0'}`}
        style={{
          ...style,
          borderColor: document.documentElement.classList.contains('dark') ? '#374151' : '#5ce7ff'
        }}
        onClick={handleSettingsClick}
      >
        <div className="p-1.5 flex flex-col h-full relative">
          {/* Task Description - Full content without truncation */}
          <div className="flex items-start justify-between mb-1">
            <h4 className="font-medium text-sm flex-1 mr-2 break-words" style={{
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              whiteSpace: 'pre-wrap'
            }}>
              {task.description}
            </h4>
            
            {/* Settings Button */}
            <div onClick={handleSettingsClick} className="flex-shrink-0 ml-1 flex items-center gap-1">
              {/* Lock Icon for Completed Tasks */}
              {isTaskCompleted && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Lock className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>This task is completed and can no longer be edited.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              
              <button
                type="button"
                aria-labels="Open task settings"
                className="h-6 w-6 p-0 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors opacity-60 hover:opacity-100"
              >
                <svg className="h-3.5 w-3.5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Labels - positioned at bottom left */}
          {task.labels && Array.isArray(task.labels) && task.labels.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-auto pt-1">
              {task.labels.filter(labels => labels && typeof labels === 'object' && labels.name).map((labels, index) => (
                <span 
                  key={labels.id || index}
                  className="text-xs px-1.5 py-0.5 rounded text-xs"
                  style={{ 
                    backgroundColor: `${labels.color || '#3B82F6'}20`, 
                    color: labels.color || '#3B82F6',
                    fontSize: '0.625rem' // Even smaller than text-xs
                  }}
                >
                  {labels.name}
                </span>
              ))}
            </div>
          )}
          
          {/* Bottom right corner - Priority, Due Date, and Assignees */}
          <div className="absolute bottom-2 right-2 flex items-center gap-1">
            {/* Priority Badge */}
            {task.priority && (
              <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                task.priority === 'high' 
                  ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' 
                  : task.priority === 'medium'
                  ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                  : 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
              }`}>
                {task.priority === 'high' ? '⬆️' : task.priority === 'medium' ? '➖' : '⬇️'} {task.priority.toUpperCase()}
              </span>
            )}
            
            {/* Due Date Badge */}
            {task.dueDate && (
              <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                📅 {new Date(task.dueDate).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: '2-digit',
                  year: '2-digit'
                })}
              </span>
            )}
            
            {/* Assignees */}
            {assignees.length > 0 && (
              <>
                {/* Show first assignee with enhanced popup */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Avatar 
                      className="h-5 w-5 border-2 border-white dark:border-gray-800 cursor-pointer hover:scale-110 transition-transform"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <AvatarFallback className="text-xs font-medium" style={{ fontSize: '0.6rem' }}>
                        {assignees[0]?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-0" align="end">
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                          Assigned Users ({assignees.length})
                        </h3>
                      </div>
                      
                      <div className="space-y-3">
                        {assignees.map((assignee) => (
                          <div key={assignee.id} className="flex items-start gap-3">
                            <Avatar className="h-10 w-10 flex-shrink-0">
                              <AvatarFallback className="text-sm font-medium">
                                {assignee.name?.charAt(0) || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                  {assignee.name}
                                </h4>
                                <Badge 
                                  variant="secondary" 
                                  className="text-xs capitalize"
                                >
                                  {assignee.role}
                                </Badge>
                              </div>
                              
                              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                {assignee.email}
                              </p>
                              
                              {assignee.department && (
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {assignee.department}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                
                {/* Show count badge if more than 1 assignee */}
                {assignees.length > 1 && (
                  <div className="h-5 w-5 bg-blue-500 text-white rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium" style={{ fontSize: '0.5rem' }}>
                      {assignees.length}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
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
        onEdit={onEdit}
        onDelete={onDelete}
        onMove={onMove}
        onUpdateLabels={onUpdateLabels}
        onUpdatePriority={onUpdatePriority}
        onUpdateDueDate={onUpdateDueDate}
      />
    </>
  );
} 