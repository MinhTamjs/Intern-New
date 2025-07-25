import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { API_BASE_URL } from '../../../lib/api';
import type { Employee } from '../types';

export function useUpdateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Employee) => {
      const res = await axios.put(`${API_BASE_URL}/employees/${data.id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['employees']);
    },
  });
}