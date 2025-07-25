import { useDraggable } from '@dnd-kit/core';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    status?: 'pending' | 'in-progress' | 'done'; // optional
  };
  isDraggable?: boolean;
}

export function TaskCard({ task, isDraggable = false }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useDraggable({
    id: task.id,
    disabled: !isDraggable,
  });

  const style = {
    transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
    transition,
    cursor: isDraggable ? 'grab' : 'default',
  };

  const taskStatus = task.status || 'pending'; // mặc định nếu thiếu

  const statusColor = {
    pending: 'bg-yellow-200 text-yellow-800',
    'in-progress': 'bg-blue-200 text-blue-800',
    done: 'bg-green-200 text-green-800',
  }[taskStatus];

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="p-3 rounded-lg border shadow-sm bg-muted"
      {...listeners}
      {...attributes}
    >
      <p className="font-medium">{task.title}</p>
      <Badge className={`mt-2 text-xs ${statusColor}`}>{taskStatus}</Badge>
    </Card>
  );
}
