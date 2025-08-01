import type { Task, TaskStatus } from '../../features/tasks/types';
import { auditLogHelpers } from '../audit/auditLog';

// Audit log entry interface
interface AuditLogEntry {
  action: string;
  entityType: string;
  [key: string]: unknown;
}

/**
 * Updates a task's status and persists the change to localStorage
 * Also creates an audit log entry for the status change
 * @param taskId - ID of the task to update
 * @param newStatus - New status for the task
 * @returns Updated task or null if task not found
 */
export function updateTaskStatus(taskId: string, newStatus: TaskStatus): Task | null {
  try {
    // Get current tasks from localStorage
    const tasksJson = localStorage.getItem('tasks');
    if (!tasksJson) {
      console.error('No tasks found in localStorage');
      return null;
    }

    const tasks: Task[] = JSON.parse(tasksJson);
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex === -1) {
      console.error(`Task with ID ${taskId} not found`);
      return null;
    }

    const task = tasks[taskIndex];
    const previousStatus = task.status;

    // Update the task status
    const updatedTask: Task = {
      ...task,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    };

    // Update the task in the array
    tasks[taskIndex] = updatedTask;

    // Save back to localStorage
    localStorage.setItem('tasks', JSON.stringify(tasks));

    // Create audit log entry for the status change
    auditLogHelpers.taskStatusChanged(task.description, previousStatus, newStatus);

    console.log(`Task ${taskId} status updated from ${previousStatus} to ${newStatus}`);
    return updatedTask;
  } catch (error) {
    console.error('Error updating task status:', error);
    return null;
  }
}

/**
 * Gets a task by ID from localStorage
 * @param taskId - ID of the task to retrieve
 * @returns Task object or null if not found
 */
export function getTaskById(taskId: string): Task | null {
  try {
    const tasksJson = localStorage.getItem('tasks');
    if (!tasksJson) {
      return null;
    }

    const tasks: Task[] = JSON.parse(tasksJson);
    return tasks.find(task => task.id === taskId) || null;
  } catch (error) {
    console.error('Error getting task by ID:', error);
    return null;
  }
}

/**
 * Checks if a task status change can be restored
 * Only status changes (not creations or deletions) can be restored
 * @param log - Audit log entry to check
 * @returns True if the log entry can be restored
 */
export function canRestoreStatusChange(log: AuditLogEntry): boolean {
  return log.action === 'Task status changed' && 
         log.entityType === 'task';
} 