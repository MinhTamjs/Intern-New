// Export types
export type { Employee, CreateEmployeeData, Role } from './types';

// Export API
export { employeeAPI } from './employeeAPI';

// Export hooks
export { 
  useEmployees, 
  useCreateEmployee, 
  useUpdateEmployee, 
  useDeleteEmployee 
} from './hooks/useEmployees';
export { useEmployeeById } from './hooks/useEmployeeById';
export { useEmployeeTasks } from './hooks/useEmployeeTasks';
export { useCurrentUser } from './hooks/useAuth';

// Export components
export { EmployeeFormDialog } from './components/EmployeeFormDialog';
export { EmployeeList } from './components/EmployeeList';
export { EmployeeManager } from './components/EmployeeManager'; 