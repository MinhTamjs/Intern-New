import { useDroppable } from '@dnd-kit/core';
import { TaskCard } from './TaskCard';
import { Badge } from '../../components/ui/badge';
import type { Task } from '../tasks/types';
import { Plus, MoreHorizontal } from 'lucide-react';
import { Button } from '../../components/ui/button';

interface ColumnProps {
  column: {
    key: string;
    status: {
      id: string;
      name: string;
      color: string;
    };
    tasks: Task[];
  };
  isAdmin: boolean;
}

export function Column({ column, isAdmin }: ColumnProps) {
  const { status, tasks } = column;
  const { setNodeRef, isOver } = useDroppable({ id: status.id });

  return (
    <div
      ref={setNodeRef}
      className={`min-w-[320px] bg-gray-50 rounded-lg border-2 transition-colors ${
        isOver ? 'border-blue-400 bg-blue-50' : 'border-gray-200'
      }`}
    >
      {/* DEBUG: Column is rendering */}
      <div className="p-2 bg-pink-500 text-white text-xs">
        DEBUG: Column "{status.name}" with {tasks.length} tasks
      </div>

      {/* Column Header */}
      <div className="p-4 border-b border-gray-200 bg-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-gray-900">{status.name}</h3>
            <Badge variant="secondary" className="text-xs">
              {tasks.length}
            </Badge>
          </div>
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <Plus className="w-3 h-3" />
            </Button>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <MoreHorizontal className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="p-3 space-y-3 min-h-[400px]">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskCard key={task.id} task={task} isDraggable={isAdmin} />
          ))
        ) : (
          <div className="flex items-center justify-center h-32 text-gray-500">
            <div className="text-center">
              <div className="w-8 h-8 mx-auto mb-2 bg-gray-200 rounded-full flex items-center justify-center">
                <Plus className="w-4 h-4 text-gray-400" />
              </div>
              <p className="text-sm">No issues</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
