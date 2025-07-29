import { useQuery } from '@tanstack/react-query';
import { useTasks } from './useTasks';
import type { Task } from '../types';

export const useTaskStats = () => {
  const { data: tasks = [] } = useTasks();

  return useQuery({
    queryKey: ['task-stats', tasks.length],
    queryFn: () => {
      const stats = {
        total: tasks.length,
        pending: tasks.filter((task: Task) => task.status === 'pending').length,
        inProgress: tasks.filter((task: Task) => task.status === 'in-progress').length,
        inReview: tasks.filter((task: Task) => task.status === 'in-review').length,
        done: tasks.filter((task: Task) => task.status === 'done').length,
      };
      return stats;
    },
    enabled: tasks.length > 0,
  });
}; 