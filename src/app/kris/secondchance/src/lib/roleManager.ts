import type { Role } from '../features/employees/types';

// Permission interface
interface Permissions {
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
  canViewTask: (task: any) => boolean;
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
    canViewTask: (task: any) => task.assigneeId === 'current-user-id',
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