import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { API_BASE_URL } from '../../../lib/api';

export function useDeleteEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`${API_BASE_URL}/employees/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['employees']);
    },
  });
}