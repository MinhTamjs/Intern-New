import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';

import { isAdmin } from '../../lib/auth';
import type { User } from '../../lib/auth';
import { TASK_STATUSES, type TaskStatus } from '../../lib/constants';
import { useAssignTask } from '../tasks/hooks/useAssignTask';
import { useTasks } from '../tasks/hooks/useTasks';
import type { Task } from '../tasks/types';
import { Column } from './Column';
import { TaskFilter } from '../tasks/components/TaskFilter';

interface TaskBoardProps {
  currentUser: User;
}

// Mock data for testing
const mockTasks: Task[] = [
  { id: '1', title: 'Implement user authentication', description: 'Add login and registration functionality', assignedTo: null, status: 'pending' },
  { id: '2', title: 'Design database schema', description: 'Create ERD for the application', assignedTo: null, status: 'in-progress' },
  { id: '3', title: 'Setup CI/CD pipeline', description: 'Configure GitHub Actions for deployment', assignedTo: null, status: 'in-review' },
  { id: '4', title: 'Write API documentation', description: 'Create comprehensive API docs', assignedTo: null, status: 'done' },
  { id: '5', title: 'Fix responsive design issues', description: 'Ensure mobile compatibility', assignedTo: null, status: 'pending' },
  { id: '6', title: 'Add unit tests', description: 'Write tests for core functionality', assignedTo: null, status: 'in-progress' },
];

export function TaskBoard({ currentUser }: TaskBoardProps) {
  const sensors = useSensors(useSensor(PointerSensor));
  const assignTask = useAssignTask();
  const { data: apiTasks = [], isLoading } = useTasks();

  // Use mock data if API is not working
  const tasks = apiTasks.length > 0 ? apiTasks : mockTasks;

  const [filters, setFilters] = useState({
    status: '',
    assigneeId: '',
    keyword: '',
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    if (!isAdmin(currentUser)) return;

    const taskId = active.id.toString();
    const newStatus = over.id.toString() as TaskStatus;

    assignTask.mutate({ id: taskId, status: newStatus });
  };

  const filteredTasks = tasks.filter((task: Task) => {
    return (
      (!filters.status || task.status === filters.status) &&
      (!filters.assigneeId || task.assignedTo === filters.assigneeId) &&
      (!filters.keyword || task.title.toLowerCase().includes(filters.keyword.toLowerCase()))
    );
  });

  if (isLoading && apiTasks.length === 0) return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span className="ml-3 text-gray-600">Loading tasks...</span>
    </div>
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="p-6">
        {/* DEBUG: TaskBoard is rendering */}
        <div className="mb-4 p-4 bg-orange-500 text-white rounded-lg">
          <h3 className="font-bold">DEBUG: TaskBoard is rendering!</h3>
          <p>Tasks count: {tasks.length}</p>
          <p>Filtered tasks: {filteredTasks.length}</p>
        </div>

        <TaskFilter onFilterChange={setFilters} />

        {/* DEBUG: Removed ScrollArea temporarily */}
        <div className="flex gap-6 overflow-x-auto">
          {TASK_STATUSES.map((status) => (
            <Column
              key={status.id}
              column={{
                key: status.id,
                status: status,
                tasks: filteredTasks.filter((task: Task) => task.status === status.id),
              }}
              isAdmin={isAdmin(currentUser)}
            />
          ))}
        </div>
      </div>
    </DndContext>
  );
}
