// src/features/tasks/useCreateTask.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { API_BASE_URL } from '../../../lib/api';

interface CreateTaskInput {
  title: string;
  description: string;
  assigneeId?: string;
  status: 'pending' | 'in-progress' | 'done'; // ✅ mặc định sẽ là 'pending'
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newTask: CreateTaskInput) => {
      const res = await axios.post(`${API_BASE_URL}/tasks`, newTask);
      return res.data;
    },
    onSuccess: () => {
      // ✅ Làm mới danh sách task sau khi thêm
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}
