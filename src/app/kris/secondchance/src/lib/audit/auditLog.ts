// Audit log helper functions
// Manages audit trail for important actions in the application

interface AuditLogEntry {
  id: string;
  action: string;
  user: string;
  userRole: string;
  timestamp: string;
  entity: string;
  entityType: 'task' | 'employee' | 'system';
  details: string;
}

// Get current user from localStorage
const getCurrentUser = () => {
  try {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      const user = JSON.parse(userData);
      return {
        name: user.name || 'Unknown User',
        role: user.role || 'employee'
      };
    }
  } catch (error) {
    console.error('Error parsing current user:', error);
  }
  return { name: 'Unknown User', role: 'employee' };
};

// Generate unique ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Add log entry to localStorage
const addLogEntry = (entry: Omit<AuditLogEntry, 'id' | 'timestamp' | 'user' | 'userRole'>) => {
  try {
    const user = getCurrentUser();
    const logEntry: AuditLogEntry = {
      ...entry,
      id: generateId(),
      timestamp: new Date().toISOString(),
      user: user.name,
      userRole: user.role
    };

    // Get existing logs
    const existingLogs = localStorage.getItem('auditLogs');
    const logs: AuditLogEntry[] = existingLogs ? JSON.parse(existingLogs) : [];

    // Add new log
    logs.unshift(logEntry); // Add to beginning

    // Keep only last 1000 logs to prevent localStorage overflow
    const trimmedLogs = logs.slice(0, 1000);

    // Save back to localStorage
    localStorage.setItem('auditLogs', JSON.stringify(trimmedLogs));
  } catch (error) {
    console.error('Error adding audit log entry:', error);
  }
};

export const auditLogHelpers = {
  // Task-related logs
  taskCreated: (taskTitle: string) => {
    addLogEntry({
      action: 'Task created',
      entity: taskTitle,
      entityType: 'task',
      details: `Task "${taskTitle}" was created`
    });
  },

  taskUpdated: (taskTitle: string, details: string) => {
    addLogEntry({
      action: 'Task updated',
      entity: taskTitle,
      entityType: 'task',
      details: `Task "${taskTitle}" was updated: ${details}`
    });
  },

  taskDeleted: (taskTitle: string) => {
    addLogEntry({
      action: 'Task deleted',
      entity: taskTitle,
      entityType: 'task',
      details: `Task "${taskTitle}" was deleted`
    });
  },

  taskStatusChanged: (taskTitle: string, oldStatus: string, newStatus: string) => {
    addLogEntry({
      action: 'Task status changed',
      entity: taskTitle,
      entityType: 'task',
      details: `Task "${taskTitle}" status changed from ${oldStatus} to ${newStatus}`
    });
  },

  taskMoved: (taskTitle: string, fromColumn: string, toColumn: string) => {
    addLogEntry({
      action: 'Task moved',
      entity: taskTitle,
      entityType: 'task',
      details: `Task "${taskTitle}" was moved from ${fromColumn} to ${toColumn}`
    });
  },

  // Employee-related logs
  employeeCreated: (employeeName: string) => {
    addLogEntry({
      action: 'Employee created',
      entity: employeeName,
      entityType: 'employee',
      details: `Employee "${employeeName}" was created`
    });
  },

  employeeUpdated: (employeeName: string, details: string) => {
    addLogEntry({
      action: 'Employee updated',
      entity: employeeName,
      entityType: 'employee',
      details: `Employee "${employeeName}" was updated: ${details}`
    });
  },

  employeeDeleted: (employeeName: string) => {
    addLogEntry({
      action: 'Employee deleted',
      entity: employeeName,
      entityType: 'employee',
      details: `Employee "${employeeName}" was deleted`
    });
  },

  // System-related logs
  userLoggedIn: (userName: string, userRole: string) => {
    addLogEntry({
      action: 'User logged in',
      entity: userName,
      entityType: 'system',
      details: `User "${userName}" (${userRole}) logged into the system`
    });
  },

  userLoggedOut: (userName: string, userRole: string) => {
    addLogEntry({
      action: 'User logged out',
      entity: userName,
      entityType: 'system',
      details: `User "${userName}" (${userRole}) logged out of the system`
    });
  },

  roleChanged: (oldRole: string, newRole: string) => {
    const user = getCurrentUser();
    addLogEntry({
      action: 'Role changed',
      entity: user.name,
      entityType: 'system',
      details: `User role changed from ${oldRole} to ${newRole}`
    });
  },

  // Custom log entry
  customLog: (action: string, entity: string, entityType: 'task' | 'employee' | 'system', details: string) => {
    addLogEntry({
      action,
      entity,
      entityType,
      details
    });
  }
}; 