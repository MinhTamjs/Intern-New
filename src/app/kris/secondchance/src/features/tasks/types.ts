export type TaskStatus = 'pending' | 'in-progress' | 'in-review' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  assigneeId: string;
  status: TaskStatus;
  dueData?: number; // Unix timestamp from API
  createdAt?: string; // ISO string for new tasks
  updatedAt?: string; // ISO string for new tasks
}

export interface CreateTaskData {
  title: string;
  description: string;
  assigneeId: string;
  status: TaskStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  assigneeId?: string;
  status?: TaskStatus;
  updatedAt?: string;
} 