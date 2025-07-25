// src/features/employees/useEmployeeTasks.ts

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { Task } from '../../tasks/types';

const API_URL = 'https://<your-mockapi-url>/tasks'; // 🔁 thay bằng URL thực tế

export function useEmployeeTasks(employeeId: string) {
  return useQuery({
    queryKey: ['tasks', employeeId],
    queryFn: async () => {
      const { data } = await axios.get<Task[]>(API_URL, {
        params: { assignedTo: employeeId },
      });
      return data;
    },
    enabled: !!employeeId, // tránh gọi nếu chưa có id
  });
}
