import { useQuery } from '@tanstack/react-query';
import { api } from '../../../lib/api';

/**
 * Hook to fetch tasks assigned to a specific employee
 * Provides caching and error handling for employee-specific task data
 * @param assigneeId - The employee ID to fetch tasks for
 * @returns Query result with assigned tasks, loading state, and error information
 */
export function useEmployeeTasks(assigneeId: string) {
  return useQuery({
    queryKey: ['tasks', 'assignee', assigneeId], // Cache key for employee's tasks
    queryFn: () => api.tasks.getByAssignee(assigneeId), // Function to fetch tasks by assignee
    enabled: !!assigneeId, // Only run query if assignee ID is provided
    staleTime: 1000 * 60 * 2, // Consider data fresh for 2 minutes
  });
} 