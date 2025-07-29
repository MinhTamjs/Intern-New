import type { Role } from '../features/employees/types';

export type AuditActionType = 
  | 'TASK_CREATED'
  | 'TASK_DELETED'
  | 'TASK_STATUS_CHANGED'
  | 'TASK_MOVED'  // New action type for column movements
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
  private readonly STORAGE_KEY = 'auditLog';
  private readonly MAX_LOGS = 1000; // Increased limit for localStorage

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.logs = JSON.parse(stored);
        console.log('Audit log loaded from localStorage:', this.logs.length, 'entries');
      }
    } catch (error) {
      console.error('Failed to load audit log from localStorage:', error);
      this.logs = [];
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.logs));
    } catch (error) {
      console.error('Failed to save audit log to localStorage:', error);
    }
  }

  addLog(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) {
    const newEntry: AuditLogEntry = {
      ...entry,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9), // Unique ID
      timestamp: new Date().toISOString(),
    };
    
    this.logs.unshift(newEntry); // Add to beginning for newest first
    
    // Keep only last MAX_LOGS entries
    if (this.logs.length > this.MAX_LOGS) {
      this.logs = this.logs.slice(0, this.MAX_LOGS);
    }

    // Save to localStorage
    this.saveToStorage();
    
    console.log('Audit log entry added:', newEntry);
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

  // Get only task movement logs
  getTaskMovementLogs(): AuditLogEntry[] {
    return this.logs.filter(log => log.actionType === 'TASK_MOVED');
  }

  // Clear logs from localStorage (for admin use)
  clearLogs() {
    this.logs = [];
    localStorage.removeItem(this.STORAGE_KEY);
    console.log('Audit log cleared from localStorage');
  }

  // Export logs for backup
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  // Import logs from backup
  importLogs(logsJson: string): boolean {
    try {
      const logs = JSON.parse(logsJson);
      if (Array.isArray(logs)) {
        this.logs = logs;
        this.saveToStorage();
        console.log('Audit log imported successfully:', logs.length, 'entries');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to import audit log:', error);
      return false;
    }
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

  taskMoved: (taskId: string, taskTitle: string, previousStatus: string, newStatus: string, userRole: Role) => {
    // Format status names for better readability
    const formatStatusName = (status: string) => {
      switch (status) {
        case 'pending': return 'Pending';
        case 'in-progress': return 'In Progress';
        case 'in-review': return 'In Review';
        case 'done': return 'Done';
        default: return status.charAt(0).toUpperCase() + status.slice(1);
      }
    };

    const fromStatus = formatStatusName(previousStatus);
    const toStatus = formatStatusName(newStatus);

    auditLogService.addLog({
      actionType: 'TASK_MOVED',
      entityType: 'task',
      entityId: taskId,
      entityName: taskTitle,
      userRole,
      details: `Task "${taskTitle}" moved from "${fromStatus}" to "${toStatus}"`,
      previousValue: fromStatus,
      newValue: toStatus,
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