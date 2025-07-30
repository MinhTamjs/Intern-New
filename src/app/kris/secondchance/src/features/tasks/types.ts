// Define the possible task statuses for the Kanban board workflow
export type TaskStatus = 'pending' | 'in-progress' | 'in-review' | 'done';

/**
 * Core Task interface representing a task in the system
 * Contains all task data including metadata and relationships
 */
export interface Task {
  id: string; // Unique identifier for the task
  title: string; // Human-readable task title
  description: string; // Detailed task description
  assigneeId: string; // ID of the employee assigned to this task
  status: TaskStatus; // Current status in the workflow
  customColor?: string; // Optional custom background color for the task card
  dueData?: number; // Unix timestamp for due date (from API)
  createdAt?: string; // ISO timestamp when task was created
  updatedAt?: string; // ISO timestamp when task was last modified
}

/**
 * Data structure for creating new tasks
 * Used when submitting task creation forms
 */
export interface CreateTaskData {
  title: string; // Task title (required)
  description: string; // Task description (required)
  assigneeId: string; // ID of assigned employee (required)
  status: TaskStatus; // Initial task status (required)
  customColor?: string; // Optional custom background color
  createdAt?: string; // Optional creation timestamp
  updatedAt?: string; // Optional update timestamp
}

/**
 * Data structure for updating existing tasks
 * All fields are optional to allow partial updates
 */
export interface UpdateTaskData {
  title?: string; // New task title
  description?: string; // New task description
  assigneeId?: string; // New assignee ID
  status?: TaskStatus; // New task status
  customColor?: string; // New custom background color
  updatedAt?: string; // Timestamp of the update
} 