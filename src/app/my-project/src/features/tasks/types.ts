// src/features/tasks/types.ts

export interface Task {
    id: string;
    title: string;
    description?: string;
    assignedTo: string | null;
    status: 'pending' | 'in-progress' | 'done';
    dueDate?: string;
  }
  