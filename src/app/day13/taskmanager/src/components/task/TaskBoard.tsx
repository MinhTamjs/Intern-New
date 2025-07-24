import { Badge } from '../ui/badge';

export type Task = {
  id: string;
  name: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  description?: string;
  status: 'planning' | 'in progress' | 'done' | 'failed';
  assignTo: string;
  createdBy: string;
};

interface TaskBoardProps {
  tasks: Task[];
}

export function TaskBoard({ tasks }: TaskBoardProps) {
  const sections = [
    { title: 'Planning', status: 'planning' },
    { title: 'In Progress', status: 'in progress' },
    { title: 'Done', status: 'done' },
    { title: 'Failed', status: 'failed' },
  ] as const;

  return (
    <div className="grid grid-cols-4 gap-4">
      {sections.map((section) => (
        <div key={section.status}>
          <h2 className="text-lg font-semibold mb-2">{section.title}</h2>
          <div className="space-y-2">
            {tasks
              .filter((task) => task.status === section.status)
              .map((task) => (
                <div key={task.id} className="bg-white p-4 rounded-lg shadow-md">
                  <h3 className="font-semibold">{task.name}</h3>
                  {task.description && <p className="text-sm text-gray-600">{task.description}</p>}
                  <Badge variant="secondary">{task.priority}</Badge>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
