import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from '../../components/ui/card';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../components/ui/tooltip';
import type { Task } from '../tasks/types';
import type { Employee } from '../employees/types';

interface TaskCardProps {
  task: Task;
  assignee?: Employee;
  onClick: () => void;
}

// Helper function to get assignee initials
const getInitials = (name: string): string => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

// Helper function to get assignee color based on name
const getAssigneeColor = (name: string): string => {
  const colors = [
    'bg-blue-100 text-blue-600',
    'bg-green-100 text-green-600',
    'bg-purple-100 text-purple-600',
    'bg-orange-100 text-orange-600',
    'bg-pink-100 text-pink-600',
    'bg-indigo-100 text-indigo-600',
    'bg-teal-100 text-teal-600',
    'bg-red-100 text-red-600',
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

export function TaskCard({ task, assignee, onClick }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  // Debug logging for drag state
  console.log(`TaskCard ${task.id} (${task.title}):`, {
    isDragging,
    hasListeners: !!listeners,
    hasAttributes: !!attributes,
    transform: transform ? 'has-transform' : 'no-transform'
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Enhanced drag feedback classes
  const getDragClasses = () => {
    if (isDragging) {
      return 'shadow-xl ring-2 ring-blue-400 ring-opacity-50 transform rotate-2 scale-105 z-50';
    }
    return 'hover:bg-gray-50 hover:shadow-md hover:scale-[1.02]';
  };

  // Get all assignees for this task (for now, just the single assignee, but ready for multiple)
  const assignees = assignee ? [assignee] : [];
  const maxVisibleAvatars = 3;
  const visibleAssignees = assignees.slice(0, maxVisibleAvatars);
  const hiddenCount = Math.max(0, assignees.length - maxVisibleAvatars);

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        cursor-grab active:cursor-grabbing mb-0.5 
        transition-all duration-200 ease-in-out
        w-full max-w-full bg-white border border-gray-200 overflow-hidden
        ${getDragClasses()}
        ${isDragging ? 'z-50' : 'z-0'}
      `}
      onClick={onClick}
    >
      <CardContent className="p-0.5">
        <div className="flex items-center justify-between">
          {/* Task content - left-aligned with minimal spacing */}
          <div className="flex-1 min-w-0 pl-2">
            {/* Task title - smaller font size (previously description size) */}
            <h3 className="text-[9px] font-medium text-gray-900 leading-tight text-left break-words">
              {task.title}
            </h3>
            
            {/* Task description - larger font size (previously title size) */}
            {task.description && task.description.trim() !== '' && (
              <p className="text-[12px] text-gray-600 leading-tight text-left line-clamp-1 break-words mt-0.5">
                {task.description}
              </p>
            )}
          </div>
          
          {/* JIRA-style assignee avatar group */}
          <div className="flex-shrink-0 ml-0.5 pr-2">
            {assignees.length > 0 ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center -space-x-1">
                      {visibleAssignees.map((assignee, index) => (
                        <div
                          key={assignee.id}
                          className="relative"
                          style={{ zIndex: visibleAssignees.length - index }}
                        >
                          <Avatar className="w-3.5 h-3.5 border-2 border-white shadow-sm">
                            <AvatarFallback className={`text-[7px] ${getAssigneeColor(assignee.name)}`}>
                              {getInitials(assignee.name)}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      ))}
                      
                      {/* Show overflow indicator if there are hidden assignees */}
                      {hiddenCount > 0 && (
                        <div className="relative" style={{ zIndex: 0 }}>
                          <div className="w-3.5 h-3.5 border-2 border-white bg-gray-200 rounded-full flex items-center justify-center shadow-sm">
                            <span className="text-[6px] text-gray-600 font-semibold">
                              +{hiddenCount}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <div className="space-y-1">
                      <p className="text-xs font-medium">Assigned to:</p>
                      <div className="space-y-1">
                        {assignees.map((assignee) => (
                          <div key={assignee.id} className="flex items-center gap-2">
                            <Avatar className="w-4 h-4">
                              <AvatarFallback className={`text-[8px] ${getAssigneeColor(assignee.name)}`}>
                                {getInitials(assignee.name)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-gray-700">{assignee.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <div className="w-3.5 h-3.5 border-2 border-white rounded-full bg-gray-100 flex items-center justify-center shadow-sm">
                <span className="text-[5px] text-gray-500 font-medium">U</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 