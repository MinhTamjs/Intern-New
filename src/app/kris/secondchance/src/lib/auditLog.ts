import type { Role } from '../features/employees/types';

// Define all possible audit action types for type safety
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

// Interface for audit log entries with comprehensive tracking information
export interface AuditLogEntry {
  id: string; // Unique identifier for the log entry
  timestamp: string; // ISO timestamp when the action occurred
  actionType: AuditActionType; // Type of action performed
  entityType: 'task' | 'employee'; // Type of entity affected
  entityId: string; // ID of the affected entity
  entityName: string; // Human-readable name of the entity
  userRole: Role; // Role of the user who performed the action
  details: string; // Detailed description of the action
  previousValue?: string; // Previous value (for updates)
  newValue?: string; // New value (for updates)
}

/**
 * AuditLogService manages the application's audit trail
 * Provides persistent storage using localStorage and comprehensive logging capabilities
 * Tracks all user actions for compliance and debugging purposes
 */
class AuditLogService {
  private logs: AuditLogEntry[] = []; // In-memory storage of audit logs
  private readonly STORAGE_KEY = 'auditLog'; // localStorage key for persistence
  private readonly MAX_LOGS = 1000; // Maximum number of logs to keep in storage

  constructor() {
    this.loadFromStorage(); // Load existing logs on service initialization
  }

  /**
   * Loads audit logs from localStorage on service initialization
   * Handles errors gracefully and falls back to empty array if loading fails
   */
  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.logs = JSON.parse(stored);
        console.log('Audit log loaded from localStorage:', this.logs.length, 'entries');
      }
    } catch (error) {
      console.error('Failed to load audit log from localStorage:', error);
      this.logs = []; // Fallback to empty array on error
    }
  }

  /**
   * Saves audit logs to localStorage for persistence
   * Handles errors gracefully without throwing exceptions
   */
  private saveToStorage() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.logs));
    } catch (error) {
      console.error('Failed to save audit log to localStorage:', error);
    }
  }

  /**
   * Adds a new audit log entry with automatic timestamp and ID generation
   * Maintains log order with newest entries first and enforces storage limits
   * @param entry - Audit log entry data (without id and timestamp)
   */
  addLog(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) {
    const newEntry: AuditLogEntry = {
      ...entry,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9), // Generate unique ID
      timestamp: new Date().toISOString(), // Add current timestamp
    };
    
    this.logs.unshift(newEntry); // Add to beginning for newest first ordering
    
    // Enforce storage limit by keeping only the most recent entries
    if (this.logs.length > this.MAX_LOGS) {
      this.logs = this.logs.slice(0, this.MAX_LOGS);
    }

    // Persist to localStorage
    this.saveToStorage();
    
    console.log('Audit log entry added:', newEntry);
  }

  /**
   * Returns a copy of all audit logs
   * @returns Array of all audit log entries
   */
  getLogs(): AuditLogEntry[] {
    return [...this.logs]; // Return copy to prevent external modification
  }

  /**
   * Filters logs by entity type (task or employee)
   * @param entityType - Type of entity to filter by
   * @returns Array of audit logs for the specified entity type
   */
  getLogsByEntityType(entityType: 'task' | 'employee'): AuditLogEntry[] {
    return this.logs.filter(log => log.entityType === entityType);
  }

  /**
   * Filters logs by action type
   * @param actionType - Type of action to filter by
   * @returns Array of audit logs for the specified action type
   */
  getLogsByActionType(actionType: AuditActionType): AuditLogEntry[] {
    return this.logs.filter(log => log.actionType === actionType);
  }

  /**
   * Returns only task movement logs for drag-and-drop tracking
   * @returns Array of task movement audit logs
   */
  getTaskMovementLogs(): AuditLogEntry[] {
    return this.logs.filter(log => log.actionType === 'TASK_MOVED');
  }

  /**
   * Exports all logs as JSON string for backup purposes
   * @returns JSON string representation of all audit logs
   */
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * Imports logs from a JSON string backup
   * Validates the import data and saves to localStorage
   * @param logsJson - JSON string containing audit logs
   * @returns True if import was successful, false otherwise
   */
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

// Create singleton instance of the audit log service
export const auditLogService = new AuditLogService();

/**
 * Helper functions for common audit actions
 * Provides convenient methods for logging specific types of user actions
 * Ensures consistent logging format across the application
 */
export const auditLogHelpers = {
  /**
   * Logs task creation events
   * @param taskId - ID of the created task
   * @param taskTitle - Title of the created task
   * @param userRole - Role of the user who created the task
   */
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

  /**
   * Logs task deletion events
   * @param taskId - ID of the deleted task
   * @param taskTitle - Title of the deleted task
   * @param userRole - Role of the user who deleted the task
   */
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

  /**
   * Logs task status change events
   * @param taskId - ID of the task
   * @param taskTitle - Title of the task
   * @param previousStatus - Previous status value
   * @param newStatus - New status value
   * @param userRole - Role of the user who changed the status
   */
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

  /**
   * Logs task movement events (drag-and-drop between columns)
   * Formats status names for better readability in the audit log
   * @param taskId - ID of the moved task
   * @param taskTitle - Title of the moved task
   * @param previousStatus - Previous column status
   * @param newStatus - New column status
   * @param userRole - Role of the user who moved the task
   */
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

  /**
   * Logs task assignee change events
   * @param taskId - ID of the task
   * @param taskTitle - Title of the task
   * @param previousAssignee - Previous assignee name
   * @param newAssignee - New assignee name
   * @param userRole - Role of the user who changed the assignee
   */
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

  /**
   * Logs general task update events
   * @param taskId - ID of the updated task
   * @param taskTitle - Title of the task
   * @param userRole - Role of the user who updated the task
   * @param details - Detailed description of the update
   */
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

  /**
   * Logs employee creation events
   * @param employeeId - ID of the created employee
   * @param employeeName - Name of the created employee
   * @param userRole - Role of the user who created the employee
   */
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

  /**
   * Logs employee role change events
   * @param employeeId - ID of the employee
   * @param employeeName - Name of the employee
   * @param previousRole - Previous role
   * @param newRole - New role
   * @param userRole - Role of the user who changed the employee role
   */
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

  /**
   * Logs employee deletion events
   * @param employeeId - ID of the deleted employee
   * @param employeeName - Name of the deleted employee
   * @param userRole - Role of the user who deleted the employee
   */
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