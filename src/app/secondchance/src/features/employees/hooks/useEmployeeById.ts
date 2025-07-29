import { useQuery } from '@tanstack/react-query';
import { employeeAPI } from '../employeeAPI';

export const useEmployeeById = (id: string) => {
  return useQuery({
    queryKey: ['employees', id],
    queryFn: () => employeeAPI.getAll().then(employees => employees.find(emp => emp.id === id)),
    enabled: !!id,
  });
}; 