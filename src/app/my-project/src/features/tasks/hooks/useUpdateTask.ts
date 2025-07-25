import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { API_BASE_URL } from '../../../lib/api';

interface UpdateTaskInput {
  id: string;
  title?: string;
  description?: string;
  assigneeId?: string;
  status?: 'pending' | 'in-progress' | 'done';
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateTaskInput) => {
      const res = await axios.patch(`${API_BASE_URL}/tasks/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['tasks'] });

    },
    onError: (error) => {
      console.error('❌ Lỗi khi cập nhật task:', error);
    },
  });
}

