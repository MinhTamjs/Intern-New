import { useDraggable } from '@dnd-kit/core';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import type { Task } from '../tasks/types';

import { Clock, MessageSquare, Paperclip, User } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  isDraggable?: boolean;
}

export function TaskCard({ task, isDraggable = false }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    disabled: !isDraggable,
  });

  const style = {
    transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
    cursor: isDraggable ? 'grab' : 'default',
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in-review':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'done':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = () => {
    // Mock priority - in real app this would come from task data
    const priorities = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500'];
    return priorities[Math.floor(Math.random() * priorities.length)];
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`p-4 rounded-lg border shadow-sm bg-white hover:shadow-md transition-shadow ${
        isDragging ? 'opacity-50 rotate-2' : ''
      }`}
      {...listeners}
      {...attributes}
    >
      {/* Issue Type and Priority */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-500 rounded-sm flex items-center justify-center">
            <span className="text-white text-xs font-bold">T</span>
          </div>
          <span className="text-xs text-gray-500">Task</span>
        </div>
        <div className={`w-3 h-3 rounded-full ${getPriorityColor()}`}></div>
      </div>

      {/* Issue Title */}
      <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">
        {task.title}
      </h4>

      {/* Issue Description */}
      {task.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Status Badge */}
      <div className="mb-3">
        <Badge className={`text-xs ${getStatusColor(task.status)}`}>
          {task.status.replace('-', ' ')}
        </Badge>
      </div>

      {/* Issue Metadata */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-3">
          {/* Assignee */}
          <div className="flex items-center space-x-1">
            <User className="w-3 h-3" />
            <span>Unassigned</span>
          </div>
          
          {/* Comments */}
          <div className="flex items-center space-x-1">
            <MessageSquare className="w-3 h-3" />
            <span>0</span>
          </div>
          
          {/* Attachments */}
          <div className="flex items-center space-x-1">
            <Paperclip className="w-3 h-3" />
            <span>0</span>
          </div>
        </div>
        
        {/* Due Date */}
        <div className="flex items-center space-x-1">
          <Clock className="w-3 h-3" />
          <span>No due date</span>
        </div>
      </div>
    </Card>
  );
}
