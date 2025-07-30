import { useQuery } from '@tanstack/react-query';
import { api } from '../../../lib/api';
import type { Employee } from '../types';

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async (): Promise<Employee> => {
      const employees = await api.auth.getCurrentUser();
      return employees[0] || {
        id: '1',
        name: 'John Admin',
        email: 'john@company.com',
        role: 'admin'
      };
    },
  });
}; 