import type { Role } from '../../features/employees/types';
import type { Task } from '../../features/tasks/types';

// Permission interface
export interface Permissions {
  canViewAllTasks: boolean;
  canViewOwnTasks: boolean;
  canCreateTask: boolean;
  canEditTask: boolean;
  canDeleteTask: boolean;
  canChangeStatus: boolean;
  canAssignTasks: boolean;
  canCreateEmployee: boolean;
  canEditEmployee: boolean;
  canDeleteEmployee: boolean;
  canViewAuditLog: boolean;
  canClearAuditLog: boolean;
  canViewTask: (task: Task) => boolean;
}

// Role permissions mapping
const ROLE_PERMISSIONS: Record<Role, Permissions> = {
  admin: {
    canViewAllTasks: true,
    canViewOwnTasks: true,
    canCreateTask: true,
    canEditTask: true,
    canDeleteTask: true,
    canChangeStatus: true,
    canAssignTasks: true,
    canCreateEmployee: true,
    canEditEmployee: true,
    canDeleteEmployee: true,
    canViewAuditLog: true,
    canClearAuditLog: true,
    canViewTask: () => true,
  },
  manager: {
    canViewAllTasks: true,
    canViewOwnTasks: true,
    canCreateTask: true,
    canEditTask: true,
    canDeleteTask: false,
    canChangeStatus: true,
    canAssignTasks: true,
    canCreateEmployee: false,
    canEditEmployee: false,
    canDeleteEmployee: false,
    canViewAuditLog: false,
    canClearAuditLog: false,
    canViewTask: () => true,
  },
  employee: {
    canViewAllTasks: false,
    canViewOwnTasks: true,
    canCreateTask: true,
    canEditTask: true,
    canDeleteTask: false,
    canChangeStatus: true,
    canAssignTasks: false,
    canCreateEmployee: false,
    canEditEmployee: false,
    canDeleteEmployee: false,
    canViewAuditLog: false,
    canClearAuditLog: false,
    canViewTask: (task: Task) => task.assigneeIds.includes('current-user-id'),
  },
};

/**
 * Get permissions for a specific role
 * @param role - User role
 * @returns Role permissions object
 */
export function getRolePermissions(role: Role): Permissions {
  return ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.employee;
}

/**
 * Create demo user for testing
 * @param role - User role
 * @returns Demo user object
 */
export function createDemoUser(role: Role) {
  return {
    id: '1',
    name: `Demo ${role.charAt(0).toUpperCase() + role.slice(1)}`,
    email: `demo.${role}@company.com`,
    role,
  };
} 