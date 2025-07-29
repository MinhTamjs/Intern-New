import { useQuery } from '@tanstack/react-query';
import { api } from '../../../lib/api';
import type { Employee } from '../types';

export function useEmployeeById(id: string) {
  return useQuery({
    queryKey: ['employees', id],
    queryFn: async (): Promise<Employee | undefined> => {
      const employees = await api.employees.getAll();
      return employees.find((emp: Employee) => emp.id === id);
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
} 