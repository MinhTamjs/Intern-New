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
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}
