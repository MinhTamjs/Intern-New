import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { TaskCard } from './TaskCard';
import type { Task, TaskStatus } from '../tasks/types';
import type { Employee } from '../employees/types';

interface ColumnProps {
  status: TaskStatus;
  tasks: Task[];
  employees: Employee[];
  onTaskClick: (task: Task) => void;
  isFirst?: boolean;
  isLast?: boolean;
}

export function Column({ status, tasks, employees, onTaskClick, isFirst = false, isLast = false }: ColumnProps) {
  const { setNodeRef, isOver, active } = useDroppable({
    id: status,
  });

  // Debug logging for drag state
  const isDragActive = active !== null;
  const isCurrentColumnTarget = isOver && isDragActive;
  
  // Debug logging for first and last columns
  if (isDragActive && (isFirst || isLast)) {
    console.log(`Column ${status} (${isFirst ? 'FIRST' : isLast ? 'LAST' : 'MIDDLE'}):`, {
      isOver,
      isDragActive,
      isCurrentColumnTarget,
      isFirst,
      isLast
    });
  }

  const getStatusInfo = (status: TaskStatus) => {
    switch (status) {
      case 'pending':
        return {
          title: 'Pending',
          color: 'bg-gradient-to-br from-pink-400 to-pink-600',
          bgColor: 'bg-gradient-to-br from-pink-50 to-pink-100',
          borderColor: 'border-pink-200',
          textColor: 'text-pink-700',
          badgeColor: 'bg-pink-100 text-pink-800',
          icon: '⏳',
          description: 'Tasks not started',
          count: tasks.length
        };
      case 'in-progress':
        return {
          title: 'In Progress',
          color: 'bg-gradient-to-br from-blue-400 to-blue-600',
          bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-700',
          badgeColor: 'bg-blue-100 text-blue-800',
          icon: '🚧',
          description: 'Active work in motion',
          count: tasks.length
        };
      case 'in-review':
        return {
          title: 'In Review',
          color: 'bg-gradient-to-br from-amber-400 to-amber-600',
          bgColor: 'bg-gradient-to-br from-amber-50 to-amber-100',
          borderColor: 'border-amber-200',
          textColor: 'text-amber-700',
          badgeColor: 'bg-amber-100 text-amber-800',
          icon: '🔍',
          description: 'Needs attention',
          count: tasks.length
        };
      case 'done':
        return {
          title: 'Done',
          color: 'bg-gradient-to-br from-emerald-400 to-emerald-600',
          bgColor: 'bg-gradient-to-br from-emerald-50 to-emerald-100',
          borderColor: 'border-emerald-200',
          textColor: 'text-emerald-700',
          badgeColor: 'bg-emerald-100 text-emerald-800',
          icon: '✅',
          description: 'Successfully completed',
          count: tasks.length
        };
    }
  };

  const statusInfo = getStatusInfo(status);

  // Get visual feedback classes based on drag state
  const getDragFeedbackClasses = () => {
    if (!isDragActive) return '';
    
    if (isCurrentColumnTarget) {
      // Valid drop target - highlight with prominent success colors and borders
      let classes = 'ring-4 ring-green-500 ring-opacity-75 shadow-2xl transform scale-[1.02] border-green-400 border-2 transition-all duration-200 z-10';
      
      // Add extra emphasis for first and last columns
      if (isFirst || isLast) {
        classes += ' ring-6 ring-green-600 ring-opacity-90 shadow-2xl';
      }
      
      return classes;
    } else {
      // Invalid drop target - subtle indication with opacity
      return 'opacity-50 ring-1 ring-gray-300 ring-opacity-50';
    }
  };

  // Get additional container classes for better visual feedback
  const getContainerClasses = () => {
    if (!isDragActive) return '';
    
    if (isCurrentColumnTarget) {
      // Add extra spacing and z-index for highlighted columns
      let classes = 'relative z-10 column-drag-target';
      
      // Add specific classes for first and last columns
      if (isFirst) {
        classes += ' column-first';
      } else if (isLast) {
        classes += ' column-last';
      }
      
      return classes;
    }
    return '';
  };

  // Get additional card classes for enhanced visual feedback
  const getCardClasses = () => {
    if (!isDragActive) return '';
    
    if (isCurrentColumnTarget) {
      let classes = 'relative';
      
      // Add extra visual emphasis for edge columns
      if (isFirst || isLast) {
        classes += ' shadow-2xl';
      }
      
      return classes;
    }
    return '';
  };

  return (
    <div className={`flex-1 min-w-0 max-w-xs flex flex-col ${getContainerClasses()}`}>
      <Card 
        className={`
          flex flex-col h-full border-2 ${statusInfo.borderColor} ${statusInfo.bgColor}
          transition-all duration-200 ease-in-out
          ${getDragFeedbackClasses()}
          ${getCardClasses()}
        `}
      >
        <CardHeader className={`pb-1.5 px-2 py-2 ${statusInfo.bgColor} border-b ${statusInfo.borderColor} flex-shrink-0`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className={`w-5 h-5 rounded-lg ${statusInfo.color} flex items-center justify-center text-white text-[10px] font-semibold shadow-sm`}>
                {statusInfo.icon}
              </div>
              <div>
                <CardTitle className={`text-xs font-bold ${statusInfo.textColor} flex items-center gap-2`}>
                  {statusInfo.title}
                </CardTitle>
                <p className={`text-[9px] ${statusInfo.textColor} opacity-75 mt-0.5`}>
                  {statusInfo.description}
                </p>
              </div>
            </div>
            <Badge className={`text-[9px] font-semibold px-1 py-0.5 ${statusInfo.badgeColor} border ${statusInfo.borderColor}`}>
              {statusInfo.count}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0 px-0.5 pb-0.5 bg-white flex-1 flex flex-col min-h-0">
          <div
            ref={setNodeRef}
            className={`
              flex-1 space-y-0.5 
              ${isDragActive ? 'overflow-y-auto' : 'overflow-x-hidden'}
              ${isCurrentColumnTarget ? 'bg-green-50 bg-opacity-50 rounded-lg p-0.5 border-2 border-green-300 border-dashed' : ''}
              transition-all duration-200
              min-h-[60px]
            `}
          >
            <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
              {tasks.map((task) => {
                const assignee = employees.find(emp => emp.id === task.assigneeId);
                return (
                  <TaskCard
                    key={task.id}
                    task={task}
                    assignee={assignee}
                    onClick={() => onTaskClick(task)}
                  />
                );
              })}
            </SortableContext>
            
            {/* Drop zone indicator when column is empty */}
            {tasks.length === 0 && isCurrentColumnTarget && (
              <div className="flex items-center justify-center h-16 border-2 border-dashed border-green-400 rounded-lg bg-green-50 bg-opacity-30">
                <div className="text-center">
                  <div className="text-lg mb-0.5">📋</div>
                  <p className="text-[10px] text-green-700 font-medium">Drop task here</p>
                </div>
              </div>
            )}
            
            {/* Additional drop zone padding when column is full */}
            {isCurrentColumnTarget && tasks.length > 0 && (
              <div className="h-1 flex-shrink-0"></div>
            )}
            
            {/* Fallback drop zone for full columns */}
            {isDragActive && (
              <div className="h-0.5 flex-shrink-0 opacity-0 pointer-events-none"></div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}