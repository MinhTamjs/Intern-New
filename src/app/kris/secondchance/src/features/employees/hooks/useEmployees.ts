import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../lib/api';
import type { Employee, CreateEmployeeData } from '../types';

/**
 * Hook to fetch all employees from the API
 * Provides caching, retry logic, and error handling for employee data
 * @returns Query result with employees data, loading state, and error information
 */
export function useEmployees() {
  return useQuery({
    queryKey: ['employees'], // Cache key for employees data
    queryFn: api.employees.getAll, // Function to fetch employees
    retry: (failureCount, error) => {
      // Retry up to 3 times for network errors only
      if (failureCount < 3 && error instanceof Error && error.message.includes('network')) {
        return true;
      }
      return false;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // Exponential backoff
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    gcTime: 1000 * 60 * 15, // Keep in cache for 15 minutes (formerly cacheTime)
  });
}

/**
 * Hook to create new employees
 * Provides optimistic updates and error handling for employee creation
 * @returns Mutation object with create function and state management
 */
export function useCreateEmployee() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.employees.create, // Function to create employee
    onSuccess: (newEmployee) => {
      // Optimistically update the cache by adding the new employee
      queryClient.setQueryData(['employees'], (oldEmployees: Employee[] = []) => {
        return [...oldEmployees, newEmployee];
      });
    },
    onError: (error) => {
      console.error('Failed to create employee:', error);
      // Invalidate and refetch on error to ensure data consistency
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
}

/**
 * Hook to update existing employees
 * Provides optimistic updates and error handling for employee modifications
 * @returns Mutation object with update function and state management
 */
export function useUpdateEmployee() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateEmployeeData> }) => {
      return api.employees.update(id, data);
    },
    onSuccess: (updatedEmployee) => {
      // Optimistically update the cache by replacing the updated employee
      queryClient.setQueryData(['employees'], (oldEmployees: Employee[] = []) => {
        return oldEmployees.map(employee => employee.id === (updatedEmployee as Employee).id ? updatedEmployee as Employee : employee);
      });
    },
    onError: (error) => {
      console.error('Failed to update employee:', error);
      // Invalidate and refetch on error to ensure data consistency
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
}

/**
 * Hook to delete employees
 * Provides optimistic updates and error handling for employee deletion
 * @returns Mutation object with delete function and state management
 */
export function useDeleteEmployee() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.employees.delete, // Function to delete employee by ID
    onSuccess: (_, deletedEmployeeId) => {
      // Optimistically remove the deleted employee from cache
      queryClient.setQueryData(['employees'], (oldEmployees: Employee[] = []) => {
        return oldEmployees.filter(employee => employee.id !== deletedEmployeeId);
      });
    },
    onError: (error) => {
      console.error('Failed to delete employee:', error);
      // Invalidate and refetch on error to ensure data consistency
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
} 