// src/features/tasks/useTasks.ts
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_BASE_URL } from '../../../lib/api'; // đường dẫn đúng với dự án của bạn

export const useTasks = () => {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE_URL}/tasks`);
      return res.data;
    }
  });
};
