// src/features/employees/hooks/useEmployees.ts

import { useQuery } from '@tanstack/react-query';
import { API_BASE_URL } from '../../../lib/api';
import axios from 'axios';
import type { Employee } from '../types';

export function useEmployees() {
  return useQuery({
    queryKey: ['employees'],
    queryFn: async (): Promise<Employee[]> => {
      const res = await axios.get(`${API_BASE_URL}/employees`);
      return res.data;
    }, // ❗️dấu phẩy cần thiết ở đây
  });
}
