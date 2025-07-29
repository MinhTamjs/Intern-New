import type { Role } from '../features/employees/types';

export type AuditActionType = 
  | 'TASK_CREATED'
  | 'TASK_DELETED'
  | 'TASK_STATUS_CHANGED'
  | 'TASK_ASSIGNEE_UPDATED'
  | 'TASK_UPDATED'
  | 'EMPLOYEE_CREATED'
  | 'EMPLOYEE_ROLE_CHANGED'
  | 'EMPLOYEE_DELETED';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actionType: AuditActionType;
  entityType: 'task' | 'employee';
  entityId: string;
  entityName: string;
  userRole: Role;
  details: string;
  previousValue?: string;
  newValue?: string;
}

class AuditLogService {
  private logs: AuditLogEntry[] = [];

  addLog(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) {
    const newEntry: AuditLogEntry = {
      ...entry,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    
    this.logs.unshift(newEntry); // Add to beginning for newest first
    
    // Keep only last 100 entries for demo purposes
    if (this.logs.length > 100) {
      this.logs = this.logs.slice(0, 100);
    }
  }

  getLogs(): AuditLogEntry[] {
    return [...this.logs];
  }

  getLogsByEntityType(entityType: 'task' | 'employee'): AuditLogEntry[] {
    return this.logs.filter(log => log.entityType === entityType);
  }

  getLogsByActionType(actionType: AuditActionType): AuditLogEntry[] {
    return this.logs.filter(log => log.actionType === actionType);
  }

  clearLogs() {
    this.logs = [];
  }
}

export const auditLogService = new AuditLogService();

// Helper functions for common audit actions
export const auditLogHelpers = {
  taskCreated: (taskId: string, taskTitle: string, userRole: Role) => {
    auditLogService.addLog({
      actionType: 'TASK_CREATED',
      entityType: 'task',
      entityId: taskId,
      entityName: taskTitle,
      userRole,
      details: `Task "${taskTitle}" was created`,
    });
  },

  taskDeleted: (taskId: string, taskTitle: string, userRole: Role) => {
    auditLogService.addLog({
      actionType: 'TASK_DELETED',
      entityType: 'task',
      entityId: taskId,
      entityName: taskTitle,
      userRole,
      details: `Task "${taskTitle}" was deleted`,
    });
  },

  taskStatusChanged: (taskId: string, taskTitle: string, previousStatus: string, newStatus: string, userRole: Role) => {
    auditLogService.addLog({
      actionType: 'TASK_STATUS_CHANGED',
      entityType: 'task',
      entityId: taskId,
      entityName: taskTitle,
      userRole,
      details: `Task status changed from "${previousStatus}" to "${newStatus}"`,
      previousValue: previousStatus,
      newValue: newStatus,
    });
  },

  taskAssigneeUpdated: (taskId: string, taskTitle: string, previousAssignee: string, newAssignee: string, userRole: Role) => {
    auditLogService.addLog({
      actionType: 'TASK_ASSIGNEE_UPDATED',
      entityType: 'task',
      entityId: taskId,
      entityName: taskTitle,
      userRole,
      details: `Task assignee changed from "${previousAssignee}" to "${newAssignee}"`,
      previousValue: previousAssignee,
      newValue: newAssignee,
    });
  },

  taskUpdated: (taskId: string, taskTitle: string, userRole: Role, details: string) => {
    auditLogService.addLog({
      actionType: 'TASK_UPDATED',
      entityType: 'task',
      entityId: taskId,
      entityName: taskTitle,
      userRole,
      details,
    });
  },

  employeeCreated: (employeeId: string, employeeName: string, userRole: Role) => {
    auditLogService.addLog({
      actionType: 'EMPLOYEE_CREATED',
      entityType: 'employee',
      entityId: employeeId,
      entityName: employeeName,
      userRole,
      details: `Employee "${employeeName}" was created`,
    });
  },

  employeeRoleChanged: (employeeId: string, employeeName: string, previousRole: string, newRole: string, userRole: Role) => {
    auditLogService.addLog({
      actionType: 'EMPLOYEE_ROLE_CHANGED',
      entityType: 'employee',
      entityId: employeeId,
      entityName: employeeName,
      userRole,
      details: `Employee role changed from "${previousRole}" to "${newRole}"`,
      previousValue: previousRole,
      newValue: newRole,
    });
  },

  employeeDeleted: (employeeId: string, employeeName: string, userRole: Role) => {
    auditLogService.addLog({
      actionType: 'EMPLOYEE_DELETED',
      entityType: 'employee',
      entityId: employeeId,
      entityName: employeeName,
      userRole,
      details: `Employee "${employeeName}" was deleted`,
    });
  },
}; 