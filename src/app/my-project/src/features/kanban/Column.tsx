import { useDroppable } from '@dnd-kit/core';
import { TaskCard } from './TaskCard';
import { Badge } from '../../components/ui/badge';

interface Task {
  id: string;
  title: string;
  status: 'pending' | 'in-progress' | 'done';
}

interface ColumnProps {
  column: {
    id: string;
    name: string;
    tasks: Task[];
  };
  isAdmin: boolean;
}

export function Column({ column, isAdmin }: ColumnProps) {
  const { setNodeRef } = useDroppable({ id: column.id });

  return (
    <div
      ref={setNodeRef}
      className="min-w-[250px] bg-white rounded-2xl shadow p-3 border"
    >
      {/* Header */}
      <div className="mb-4">
        <p className="font-semibold text-sm">{column.name}</p>
        <Badge variant="secondary" className="text-xs">
          {column.tasks.length} task{column.tasks.length !== 1 && 's'}
        </Badge>
      </div>

      {/* Task List */}
      <div className="flex flex-col gap-3">
        {column.tasks.length > 0 ? (
          column.tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              isDraggable={isAdmin}
            />
          ))
        ) : (
          <p className="text-sm text-muted-foreground text-center italic">
            No tasks
          </p>
        )}
      </div>
    </div>
  );
}
