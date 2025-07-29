import { useQuery } from '@tanstack/react-query';
import { api } from '../../../lib/api';

export function useEmployeeTasks(assigneeId: string) {
  return useQuery({
    queryKey: ['tasks', 'assignee', assigneeId],
    queryFn: () => api.tasks.getByAssignee(assigneeId),
    enabled: !!assigneeId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
} 