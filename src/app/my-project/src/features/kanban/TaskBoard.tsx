import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { ScrollArea } from '@/components/ui/scroll-area';
import { isAdmin } from '@/lib/auth';
import { TASK_STATUSES, type TaskStatus } from '@/lib/constants';
import { useAssignTask } from '../tasks/hooks/useAssignTask';
import { useTasks } from '../tasks/hooks/useTasks';
import { Column } from './Column';
import { TaskFilter } from '../tasks/components/TaskFilter';

interface TaskBoardProps {
  currentUser: User;
}

export function TaskBoard({ currentUser }: TaskBoardProps) {
  const sensors = useSensors(useSensor(PointerSensor));
  const assignTask = useAssignTask();
  const { data: tasks = [] } = useTasks();

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

  const filteredTasks = tasks.filter((task) => {
    return (
      (!filters.status || task.status === filters.status) &&
      (!filters.assigneeId || task.assigneeId === filters.assigneeId) &&
      (!filters.keyword || task.title.toLowerCase().includes(filters.keyword.toLowerCase()))
    );
  });

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="p-4 space-y-4">
        <TaskFilter onFilterChange={setFilters} />

        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-4">
            {TASK_STATUSES.map((status) => (
              <Column
                key={status.id}
                column={{
                  id: status.id,
                  name: status.name,
                  tasks: filteredTasks.filter((task) => task.status === status.id),
                }}
                isAdmin={isAdmin(currentUser)}
              />
            ))}
          </div>
        </ScrollArea>
      </div>
    </DndContext>
  );
}
