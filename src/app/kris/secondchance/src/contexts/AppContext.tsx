import { createContext } from 'react';
import type { Task, TaskStatus } from '../features/tasks/types';
import type { Employee } from '../features/employees/types';
import type { Permissions } from '../lib/roles/roleManager';

interface AppContextType {
  // State
  selectedTask: Task | null;
  isCreateModalOpen: boolean;
  openTaskModalInEditMode: boolean;
  migratedTasks: Task[];
  currentUser: Employee | undefined;
  permissions: Permissions;
  
  // Loading states
  isLoading: boolean;
  
  // Actions
  setSelectedTask: (task: Task | null) => void;
  setIsCreateModalOpen: (open: boolean) => void;
  setOpenTaskModalInEditMode: (edit: boolean) => void;
  
  // Task operations
  handleTaskClick: (task: Task) => void;
  handleTaskStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  handleTaskDelete: (taskId: string) => void;
  handleTaskCreate: (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  handleTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
  handleAssignUsers: (taskId: string) => void;
  handleTaskColorChange: (taskId: string, color: string | null) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined); 