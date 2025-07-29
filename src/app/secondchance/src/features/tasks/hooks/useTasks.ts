import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskAPI } from '../taskAPI';
import { generateTimestamp } from '../../../lib/utils';
import type { UpdateTaskData, Task, CreateTaskData } from '../types';

export const useTasks = () => {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: taskAPI.getAll,
  });
};

export const useTasksByAssignee = (assigneeId: string) => {
  return useQuery({
    queryKey: ['tasks', 'assignee', assigneeId],
    queryFn: () => taskAPI.getByAssignee(assigneeId),
    enabled: !!assigneeId,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateTaskData) => {
      // Add timestamps for task creation
      const taskWithTimestamps = {
        ...data,
        createdAt: generateTimestamp(),
        updatedAt: generateTimestamp(),
      };
      console.log('Creating task with timestamps:', taskWithTimestamps);
      return taskAPI.create(taskWithTimestamps);
    },
    onSuccess: (newTask) => {
      console.log('Task created successfully:', newTask);
      // Invalidate and refetch tasks
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      
      // Optionally, optimistically update the cache
      queryClient.setQueryData(['tasks'], (oldTasks: Task[] = []) => {
        console.log('Updating cache with new task:', newTask);
        return [...oldTasks, newTask];
      });
    },
    onError: (error) => {
      console.error('Task creation failed:', error);
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskData }) => {
      // Add updatedAt timestamp for task updates
      const updateDataWithTimestamp = {
        ...data,
        updatedAt: generateTimestamp(),
      };
      console.log('Updating task with timestamp:', { id, data: updateDataWithTimestamp });
      return taskAPI.update(id, updateDataWithTimestamp);
    },
    onSuccess: (updatedTask) => {
      console.log('Task updated successfully:', updatedTask);
      
      // Invalidate and refetch tasks
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      
      // Also optimistically update the cache with the new task data
      queryClient.setQueryData(['tasks'], (oldTasks: Task[] = []) => {
        return oldTasks.map(task => 
          task.id === updatedTask.id ? { ...task, ...updatedTask } : task
        );
      });
    },
    onError: (error) => {
      console.error('Task update failed:', error);
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: taskAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}; 