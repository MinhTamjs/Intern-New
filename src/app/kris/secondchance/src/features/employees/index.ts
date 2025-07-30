// Export employee types for TypeScript support
export type { Employee, CreateEmployeeData, Role } from './types';

// Export employee data management hooks
export { 
  useEmployees, 
  useCreateEmployee, 
  useUpdateEmployee, 
  useDeleteEmployee 
} from './hooks/useEmployees';

// Export employee-specific hooks
export { useEmployeeById } from './hooks/useEmployeeById';
export { useEmployeeTasks } from './hooks/useEmployeeTasks';

// Export employee components for external use
export { EmployeeFormDialog } from './components/EmployeeFormDialog'; 