import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_BASE_URL } from '../../../lib/api';
import type { Task } from '../types';

export const useTaskById = (taskId: string) => {
  return useQuery({
    queryKey: ['tasks', taskId],
    queryFn: async (): Promise<Task> => {
      const res = await axios.get(`${API_BASE_URL}/tasks/${taskId}`);
      return res.data;
    },
    enabled: !!taskId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}; 