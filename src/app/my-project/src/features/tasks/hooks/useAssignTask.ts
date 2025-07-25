// src/features/tasks/useAssignTask.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { API_BASE_URL } from '../../../lib/api';
import type { TaskStatus } from '../../../lib/constants';


interface UpdateTaskStatusInput {
  id: string;
  status: TaskStatus;
}

export function useAssignTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: UpdateTaskStatusInput) => {
      console.log('🟡 Updating task', id, 'to', status);
      const res = await axios.patch(`${API_BASE_URL}/tasks/${id}`, {status,});
      console.log('🟢 Updated:', res.data);
      return res.data;
    },
    onSuccess: () => {
      // ✅ Làm mới danh sách task sau khi cập nhật
      queryClient.invalidateQueries({ queryKey: ['tasks'] });

    },
  });
}
