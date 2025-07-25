import { useTasks } from './hooks/useTasks.ts';
import { Badge } from '../../components/ui/badge';
import { Card } from '../../components/ui/card';

export function TaskList({ currentUser }) {
  const { data: tasks, isLoading } = useTasks();

  if (isLoading) return <p>Đang tải công việc...</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {tasks.map((task) => (
        <Card key={task.id} className="p-4">
          <h2 className="font-semibold mb-2">{task.title}</h2>
          <p className="text-sm mb-2">{task.description}</p>
          <Badge variant="outline" className="capitalize">
            {task.status}
          </Badge>
        </Card>
      ))}
    </div>
  );
}