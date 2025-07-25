import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { API_BASE_URL } from '../../../lib/api';
import { Employee } from '../types';

export function useCreateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<Employee, 'id'>) => {
      const res = await axios.post(`${API_BASE_URL}/employees`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['employees']);
    },
  });
}