import { useQuery } from '@tanstack/react-query';
import { api } from '../../../lib/api';
import type { Employee } from '../types';

/**
 * Hook to fetch the currently authenticated user
 * Provides fallback to admin user if no authentication is available
 * @returns Query result with current user data, loading state, and error information
 */
export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['currentUser'], // Cache key for current user data
    queryFn: async (): Promise<Employee> => {
      // Try to get current user from API
      const employees = await api.auth.getCurrentUser();
      
      // Return first employee or fallback to admin user
      return (employees as Employee[])[0] || {
        id: '1',
        name: 'John Admin',
        email: 'john@company.com',
        role: 'admin'
      };
    },
  });
}; 