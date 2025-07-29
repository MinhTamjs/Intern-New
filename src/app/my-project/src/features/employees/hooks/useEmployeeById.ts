import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_BASE_URL } from '../../../lib/api';
import type { Employee } from '../types';

export const useEmployeeById = (employeeId: string) => {
  return useQuery({
    queryKey: ['employees', employeeId],
    queryFn: async (): Promise<Employee> => {
      const res = await axios.get(`${API_BASE_URL}/employees/${employeeId}`);
      return res.data;
    },
    enabled: !!employeeId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}; 