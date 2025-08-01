// Define the possible task statuses for the Kanban board workflow
export type TaskStatus = 'pending' | 'in-progress' | 'in-review' | 'done';

/**
 * Label interface for task labeling system
 */
export interface Label {
  id: string;
  name: string;
  color: string;
}

/**
 * Core Task interface representing a task in the system
 * Contains all task data including metadata and relationships
 */
export interface TaskLabel {
  id: string;
  name: string;
  color: string;
  category: 'priority' | 'type' | 'status' | 'team' | 'custom';
  bgColor: string;
  textColor: string;
}

export interface Task {
  id: string;
  description: string;
  assigneeIds: string[];
  status: TaskStatus;
  dueDate: string; // Fixed property name
  labels: TaskLabel[]; // Labels array
  priority: 'low' | 'medium' | 'high';
  customColor: string;
  updatedAt: string;
}

/**
 * Data structure for creating new tasks
 * Used when submitting task creation forms
 */
export interface CreateTaskData {
  description: string;
  assigneeIds: string[];
  status: TaskStatus;
  dueDate: string; // Fixed property name
  labels: TaskLabel[]; // Labels array
  priority: 'low' | 'medium' | 'high';
  customColor: string;
}

/**
 * Data structure for updating existing tasks
 * All fields are optional to allow partial updates
 */
export interface UpdateTaskData {
  description?: string;
  assigneeIds?: string[];
  status?: TaskStatus;
  dueDate?: string; // Fixed property name
  labels?: TaskLabel[]; // Labels array
  priority?: 'low' | 'medium' | 'high';
  customColor?: string;
} 