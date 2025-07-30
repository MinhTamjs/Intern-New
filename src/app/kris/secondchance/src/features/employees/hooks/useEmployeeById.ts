import { useQuery } from '@tanstack/react-query';
import { api } from '../../../lib/api';
import type { Employee } from '../types';

/**
 * Hook to fetch a single employee by ID
 * Uses the employees cache and finds the specific employee by ID
 * @param id - The employee ID to fetch
 * @returns Query result with employee data, loading state, and error information
 */
export function useEmployeeById(id: string) {
  return useQuery({
    queryKey: ['employees', id], // Cache key specific to this employee
    queryFn: async (): Promise<Employee | undefined> => {
      // Fetch all employees and find the one with matching ID
      const employees = await api.employees.getAll();
      return employees.find((emp: Employee) => emp.id === id);
    },
    enabled: !!id, // Only run query if ID is provided
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
  });
} 