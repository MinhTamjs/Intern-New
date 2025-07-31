import { useState, useMemo } from 'react';
import type { ReactNode } from 'react';
import { toast } from 'sonner';
import { useTasks, useUpdateTask, useCreateTask, useDeleteTask } from '../features/tasks';
import { useEmployees } from '../features/employees';
import { getRolePermissions } from '../lib/roles/roleManager';
import { auditLogHelpers } from '../lib/audit/auditLog';
import { useAuth } from '../contexts/AuthContext';
import { AppContext } from '../contexts/AppContext';
import type { Task, TaskStatus } from '../features/tasks/types';
import type { Employee } from '../features/employees/types';

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const { currentRole, user } = useAuth();
  
  // State
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [openTaskModalInEditMode, setOpenTaskModalInEditMode] = useState(false);

  // Get permissions for current role
  const permissions = getRolePermissions(currentRole);

  // Data fetching
  const { data: tasks = [], isLoading: tasksLoading } = useTasks();
  const { data: employees = [], isLoading: employeesLoading } = useEmployees();

  // Task mutations
  const updateTaskMutation = useUpdateTask();
  const createTaskMutation = useCreateTask();
  const deleteTaskMutation = useDeleteTask();

  // Get current user from employees data
  const currentUser = (employees as Employee[]).find(emp => emp.id === user?.id) || (employees as Employee[])[0];

  // Migrate tasks from old assigneeId structure to new assigneeIds array structure
  const migratedTasks = useMemo(() => {
    if (!tasks || !Array.isArray(tasks)) return [];
    
    return (tasks as unknown[]).map(task => {
      if (!task) return null;
      
      // If task has old assigneeId structure, migrate it
      if ((task as any).assigneeId && !(task as any).assigneeIds) {
        return {
          ...task,
          assigneeIds: [(task as any).assigneeId],
          assigneeId: undefined
        } as unknown as Task;
      }
      // If task already has assigneeIds, ensure it's an array
      if ((task as any).assigneeIds) {
        return {
          ...task,
          assigneeIds: Array.isArray((task as any).assigneeIds) ? (task as any).assigneeIds : []
        } as unknown as Task;
      }
      // Fallback: create empty assigneeIds array
      return {
        ...task,
        assigneeIds: []
      } as unknown as Task;
    }).filter(Boolean) as Task[]; // Remove any null values
  }, [tasks]);

  // Handle task click
  const handleTaskClick = (task: Task) => {
    if (permissions.canViewTask(task)) {
      setSelectedTask(task);
      setOpenTaskModalInEditMode(false);
    }
  };

  // Handle task status change
  const handleTaskStatusChange = (taskId: string, newStatus: TaskStatus) => {
    const task = migratedTasks.find(t => t.id === taskId);
    if (!task) return;

    // Permission checks
    if (!permissions.canChangeStatus) {
      toast.error('You do not have permission to change task status');
      return;
    }

    if (!permissions.canViewAllTasks && !task.assigneeIds.includes(currentUser?.id || '')) {
      toast.error('You can only update your own tasks');
      return;
    }

    updateTaskMutation.mutate(
      { id: taskId, data: { status: newStatus } },
      {
        onSuccess: () => {
          auditLogHelpers.taskStatusChanged(task.title, task.status, newStatus);
          toast.success('Task status updated successfully');
        },
        onError: (error) => {
          toast.error('Failed to update task status');
          console.error('Task status update error:', error);
        },
      }
    );
  };

  // Handle task deletion
  const handleTaskDelete = (taskId: string) => {
    const task = migratedTasks.find(t => t.id === taskId);
    if (!task) return;

    // Permission checks
    if (!permissions.canDeleteTask) {
      toast.error('You do not have permission to delete tasks');
      return;
    }

    if (!permissions.canViewAllTasks && !task.assigneeIds.includes(currentUser?.id || '')) {
      toast.error('You can only delete your own tasks');
      return;
    }

    deleteTaskMutation.mutate(taskId, {
      onSuccess: () => {
        auditLogHelpers.taskDeleted(task.title);
        toast.success('Task deleted successfully');
        setSelectedTask(null);
      },
      onError: (error) => {
        toast.error('Failed to delete task');
        console.error('Task deletion error:', error);
      },
    });
  };

  // Handle task creation
  const handleTaskCreate = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    // Permission check
    if (!permissions.canCreateTask) {
      toast.error('You do not have permission to create tasks');
      return;
    }

    createTaskMutation.mutate(taskData, {
      onSuccess: (newTask) => {
        auditLogHelpers.taskCreated((newTask as Task).title);
        toast.success('Task created successfully');
        setIsCreateModalOpen(false);
      },
      onError: (error) => {
        toast.error('Failed to create task');
        console.error('Task creation error:', error);
      },
    });
  };

  // Handle task updates
  const handleTaskUpdate = (taskId: string, updates: Partial<Task>) => {
    const task = migratedTasks.find(t => t.id === taskId);
    if (!task) return;

    // Permission checks
    if (!permissions.canEditTask) {
      toast.error('You do not have permission to edit tasks');
      return;
    }

    if (!permissions.canViewAllTasks && !task.assigneeIds.includes(currentUser?.id || '')) {
      toast.error('You can only edit your own tasks');
      return;
    }

    updateTaskMutation.mutate(
      { id: taskId, data: updates },
      {
        onSuccess: () => {
          auditLogHelpers.taskUpdated(task.title, 'Task details updated');
          toast.success('Task updated successfully');
          setSelectedTask(null);
        },
        onError: (error) => {
          toast.error('Failed to update task');
          console.error('Task update error:', error);
        },
      }
    );
  };

  // Handle assign users
  const handleAssignUsers = (taskId: string) => {
    const task = migratedTasks.find(t => t.id === taskId);
    if (!task) return;

    // Permission checks for task assignment
    if (!permissions.canEditTask) {
      toast.error('You do not have permission to update tasks');
      return;
    }

    if (!permissions.canViewAllTasks && !task.assigneeIds.includes(currentUser?.id || '')) {
      toast.error('You can only update your own tasks');
      return;
    }

    // Open the task modal in edit mode for assignee management
    setSelectedTask(task);
    setOpenTaskModalInEditMode(true);
  };

  // Handle task color change
  const handleTaskColorChange = (taskId: string, color: string | null) => {
    const task = migratedTasks.find(t => t.id === taskId);
    if (!task) return;

    // Permission checks for task color updates
    if (!permissions.canEditTask) {
      toast.error('You do not have permission to update tasks');
      return;
    }

    if (!permissions.canViewAllTasks && !task.assigneeIds.includes(currentUser?.id || '')) {
      toast.error('You can only update your own tasks');
      return;
    }

    updateTaskMutation.mutate(
      { id: taskId, data: { customColor: color || undefined } },
      {
        onSuccess: () => {
          // Log the color change for audit purposes
          auditLogHelpers.taskUpdated(task.title, `Task color ${color ? 'changed' : 'reset'}`);
          toast.success(color ? 'Task color updated successfully' : 'Task color reset to default');
        },
        onError: (error) => {
          toast.error('Failed to update task color');
          console.error('Task color update error:', error);
        },
      }
    );
  };

  const value = {
    // State
    selectedTask,
    isCreateModalOpen,
    openTaskModalInEditMode,
    migratedTasks,
    currentUser,
    permissions,
    
    // Loading states
    isLoading: tasksLoading || employeesLoading,
    
    // Actions
    setSelectedTask,
    setIsCreateModalOpen,
    setOpenTaskModalInEditMode,
    
    // Task operations
    handleTaskClick,
    handleTaskStatusChange,
    handleTaskDelete,
    handleTaskCreate,
    handleTaskUpdate,
    handleAssignUsers,
    handleTaskColorChange,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}; 