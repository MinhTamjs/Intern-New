import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../lib/api';
import type { Employee, CreateEmployeeData } from '../types';

export function useEmployees() {
  return useQuery({
    queryKey: ['employees'],
    queryFn: api.employees.getAll,
    retry: (failureCount, error) => {
      // Retry up to 3 times for network errors
      if (failureCount < 3 && error instanceof Error && error.message.includes('network')) {
        return true;
      }
      return false;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 15, // 15 minutes (formerly cacheTime)
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.employees.create,
    onSuccess: (newEmployee) => {
      // Optimistically update the cache
      queryClient.setQueryData(['employees'], (oldEmployees: Employee[] = []) => {
        return [...oldEmployees, newEmployee];
      });
    },
    onError: (error) => {
      console.error('Failed to create employee:', error);
      // Invalidate and refetch on error
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateEmployeeData> }) => {
      return api.employees.update(id, data);
    },
    onSuccess: (updatedEmployee) => {
      // Optimistically update the cache
      queryClient.setQueryData(['employees'], (oldEmployees: Employee[] = []) => {
        return oldEmployees.map(employee => employee.id === updatedEmployee.id ? updatedEmployee : employee);
      });
    },
    onError: (error) => {
      console.error('Failed to update employee:', error);
      // Invalidate and refetch on error
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.employees.delete,
    onSuccess: (_, deletedEmployeeId) => {
      // Optimistically remove from cache
      queryClient.setQueryData(['employees'], (oldEmployees: Employee[] = []) => {
        return oldEmployees.filter(employee => employee.id !== deletedEmployeeId);
      });
    },
    onError: (error) => {
      console.error('Failed to delete employee:', error);
      // Invalidate and refetch on error
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
} 