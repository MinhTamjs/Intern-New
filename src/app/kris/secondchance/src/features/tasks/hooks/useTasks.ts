import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../lib/api/api';
import { generateTimestamp } from '../../../lib/utils';
import type { Task, CreateTaskData, UpdateTaskData } from '../types';

/**
 * Hook to fetch all tasks from the API
 * Provides caching, retry logic, and error handling for task data
 * @returns Query result with tasks data, loading state, and error information
 */
export function useTasks() {
  return useQuery({
    queryKey: ['tasks'], // Cache key for tasks data
    queryFn: api.tasks.getAll, // Function to fetch tasks
    retry: (failureCount, error) => {
      // Retry up to 3 times for network errors only
      if (failureCount < 3 && error instanceof Error && error.message.includes('network')) {
        return true;
      }
      return false;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // Exponential backoff
    staleTime: 1000 * 60 * 2, // Consider data fresh for 2 minutes
    gcTime: 1000 * 60 * 10, // Keep in cache for 10 minutes (formerly cacheTime)
  });
}

/**
 * Hook to create new tasks
 * Provides optimistic updates and error handling for task creation
 * @returns Mutation object with create function and state management
 */
export function useCreateTask() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateTaskData) => {
      // Ensure default values are set for required fields
      const taskData = {
        ...data,
        status: data.status || 'pending', // Default to pending status
        createdAt: data.createdAt || generateTimestamp(), // Set creation timestamp
        updatedAt: data.updatedAt || generateTimestamp(), // Set update timestamp
      };
      return api.tasks.create(taskData);
    },
    onSuccess: (newTask) => {
      // Optimistically update the cache by adding the new task
      queryClient.setQueryData(['tasks'], (oldTasks: Task[] = []) => {
        return [...oldTasks, newTask];
      });
    },
    onError: (error) => {
      console.error('Failed to create task:', error);
      // Invalidate and refetch on error to ensure data consistency
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

/**
 * Hook to update existing tasks
 * Provides optimistic updates and error handling for task modifications
 * @returns Mutation object with update function and state management
 */
export function useUpdateTask() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskData }) => {
      // Ensure updatedAt timestamp is set for all updates
      const updateData = {
        ...data,
        updatedAt: data.updatedAt || generateTimestamp(),
      };
      return api.tasks.update(id, updateData);
    },
    onSuccess: (updatedTask) => {
      // Optimistically update the cache by replacing the updated task
      queryClient.setQueryData(['tasks'], (oldTasks: Task[] = []) => {
        return oldTasks.map(task => task.id === (updatedTask as Task).id ? updatedTask as Task : task);
      });
    },
    onError: (error) => {
      console.error('Failed to update task:', error);
      // Invalidate and refetch on error to ensure data consistency
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

/**
 * Hook to delete tasks
 * Provides optimistic updates and error handling for task deletion
 * @returns Mutation object with delete function and state management
 */
export function useDeleteTask() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.tasks.delete, // Function to delete task by ID
    onSuccess: (_, deletedTaskId) => {
      // Optimistically remove the deleted task from cache
      queryClient.setQueryData(['tasks'], (oldTasks: Task[] = []) => {
        return oldTasks.filter(task => task.id !== deletedTaskId);
      });
    },
    onError: (error) => {
      console.error('Failed to delete task:', error);
      // Invalidate and refetch on error to ensure data consistency
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
} 