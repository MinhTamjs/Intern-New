import { useQuery } from '@tanstack/react-query';
import { taskAPI } from '../../tasks/taskAPI';

export const useEmployeeTasks = (employeeId: string) => {
  return useQuery({
    queryKey: ['tasks', 'employee', employeeId],
    queryFn: () => taskAPI.getByAssignee(employeeId),
    enabled: !!employeeId,
  });
}; 