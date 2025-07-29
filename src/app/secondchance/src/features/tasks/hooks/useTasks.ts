import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../lib/api';
import { generateTimestamp } from '../../../lib/utils';
import type { Task, CreateTaskData, UpdateTaskData } from '../types';

export function useTasks() {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: api.tasks.getAll,
    retry: (failureCount, error) => {
      // Retry up to 3 times for network errors
      if (failureCount < 3 && error instanceof Error && error.message.includes('network')) {
        return true;
      }
      return false;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateTaskData) => {
      // Ensure default values are set
      const taskData = {
        ...data,
        status: data.status || 'pending',
        createdAt: data.createdAt || generateTimestamp(),
        updatedAt: data.updatedAt || generateTimestamp(),
      };
      return api.tasks.create(taskData);
    },
    onSuccess: (newTask) => {
      // Optimistically update the cache
      queryClient.setQueryData(['tasks'], (oldTasks: Task[] = []) => {
        return [...oldTasks, newTask];
      });
    },
    onError: (error) => {
      console.error('Failed to create task:', error);
      // Invalidate and refetch on error
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskData }) => {
      // Ensure updatedAt is set
      const updateData = {
        ...data,
        updatedAt: data.updatedAt || generateTimestamp(),
      };
      return api.tasks.update(id, updateData);
    },
    onSuccess: (updatedTask) => {
      // Optimistically update the cache
      queryClient.setQueryData(['tasks'], (oldTasks: Task[] = []) => {
        return oldTasks.map(task => task.id === updatedTask.id ? updatedTask : task);
      });
    },
    onError: (error) => {
      console.error('Failed to update task:', error);
      // Invalidate and refetch on error
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.tasks.delete,
    onSuccess: (_, deletedTaskId) => {
      // Optimistically remove from cache
      queryClient.setQueryData(['tasks'], (oldTasks: Task[] = []) => {
        return oldTasks.filter(task => task.id !== deletedTaskId);
      });
    },
    onError: (error) => {
      console.error('Failed to delete task:', error);
      // Invalidate and refetch on error
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
} 