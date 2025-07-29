import type { Role } from '../features/employees/types';

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export function createDemoUser(role: Role): DemoUser {
  return {
    id: '1',
    name: `Demo ${role.charAt(0).toUpperCase() + role.slice(1)}`,
    email: `demo.${role}@company.com`,
    role,
  };
}

export function getRolePermissions(role: Role) {
  switch (role) {
    case 'admin':
      return {
        canCreateTask: true,
        canEditTask: true,
        canDeleteTask: true,
        canAssignTask: true,
        canChangeStatus: true,
        canCreateEmployee: true,
        canEditEmployee: true,
        canDeleteEmployee: true,
        canViewAllTasks: true,
      };
    case 'manager':
      return {
        canCreateTask: true,
        canEditTask: true,
        canDeleteTask: true,
        canAssignTask: true,
        canChangeStatus: true,
        canCreateEmployee: false,
        canEditEmployee: false,
        canDeleteEmployee: false,
        canViewAllTasks: true,
      };
    case 'employee':
      return {
        canCreateTask: false,
        canEditTask: false,
        canDeleteTask: false,
        canAssignTask: false,
        canChangeStatus: true, // Can drag and drop any task
        canCreateEmployee: false,
        canEditEmployee: false,
        canDeleteEmployee: false,
        canViewAllTasks: true, // Can see all tasks for context
      };
    default:
      return {
        canCreateTask: false,
        canEditTask: false,
        canDeleteTask: false,
        canAssignTask: false,
        canChangeStatus: false,
        canCreateEmployee: false,
        canEditEmployee: false,
        canDeleteEmployee: false,
        canViewAllTasks: false,
      };
  }
} 