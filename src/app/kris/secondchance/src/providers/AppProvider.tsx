import { useState, useMemo } from 'react';
import type { ReactNode } from 'react';
import { toast } from 'sonner';
import { useTasks, useUpdateTask, useCreateTask, useDeleteTask } from '../features/tasks';
import { useEmployees } from '../features/employees';
import { getRolePermissions } from '../lib/roles/roleManager';
import { auditLogHelpers } from '../lib/audit/auditLog';
import { useAuth } from '../hooks/useAuth';
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

  // Migrate tasks to new schema structure
  const migratedTasks = useMemo(() => {
    if (!tasks || !Array.isArray(tasks)) return [];
    
    return (tasks as unknown[]).map(task => {
      if (!task) return null;
      
      const migratedTask: Partial<Task> & { label?: string } = { ...task };
      
      // Ensure all required fields exist with defaults
      if (!migratedTask.description) {
        migratedTask.description = '';
      }
      
      if (!migratedTask.assigneeIds) {
        migratedTask.assigneeIds = [];
      }
      
      if (!migratedTask.status) {
        migratedTask.status = 'pending';
      }
      
      if (!migratedTask.dueDate) {
        migratedTask.dueDate = '';
      }
      
      if (!migratedTask.labels) {
        // Handle migration from old 'label' property to new 'labels' array
        if (migratedTask.label && typeof migratedTask.label === 'string' && migratedTask.label.trim()) {
          // Convert old single label to new labels array format
          migratedTask.labels = [{
            id: `migrated-${Date.now()}`,
            name: migratedTask.label,
            color: '#3B82F6', // Default blue color
            category: 'custom',
            bgColor: '#eff6ff',
            textColor: '#3B82F6'
          }];
        } else {
          migratedTask.labels = [];
        }
        // Remove the old label property
        delete migratedTask.label;
      }
      
      if (!migratedTask.priority) {
        migratedTask.priority = 'medium';
      }
      
      if (!migratedTask.customColor) {
        migratedTask.customColor = '';
      }
      
      if (!migratedTask.updatedAt) {
        migratedTask.updatedAt = new Date().toISOString();
      }
      
      return migratedTask as Task;
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
          auditLogHelpers.taskStatusChanged(task.description, task.status, newStatus);
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
        auditLogHelpers.taskDeleted(task.description);
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
        auditLogHelpers.taskCreated((newTask as Task).description);
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
    console.log('handleTaskUpdate called with:', { taskId, updates });
    
    const task = migratedTasks.find(t => t.id === taskId);
    if (!task) {
      console.error('Task not found:', taskId);
      return;
    }

    console.log('Found task:', task);
    console.log('Permissions:', { 
      canEditTask: permissions.canEditTask, 
      canViewAllTasks: permissions.canViewAllTasks,
      currentUserId: currentUser?.id,
      taskAssigneeIds: task.assigneeIds
    });

    // Permission checks
    if (!permissions.canEditTask) {
      console.error('Permission denied: cannot edit tasks');
      toast.error('You do not have permission to edit tasks');
      return;
    }

    if (!permissions.canViewAllTasks && !task.assigneeIds.includes(currentUser?.id || '')) {
      console.error('Permission denied: cannot edit this specific task');
      toast.error('You can only edit your own tasks');
      return;
    }

    console.log('Permission checks passed, calling updateTaskMutation');
    updateTaskMutation.mutate(
      { id: taskId, data: updates },
      {
        onSuccess: () => {
          console.log('Task update successful');
          auditLogHelpers.taskUpdated(task.description, 'Task details updated');
          toast.success('Task updated successfully');
          setSelectedTask(null);
        },
        onError: (error) => {
          console.error('Task update failed:', error);
          toast.error('Failed to update task');
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
    console.log('handleTaskColorChange called:', { taskId, color });
    const task = migratedTasks.find(t => t.id === taskId);
    if (!task) {
      console.error('Task not found:', taskId);
      return;
    }

    // Permission checks for task color updates
    if (!permissions.canEditTask) {
      toast.error('You do not have permission to update tasks');
      return;
    }

    if (!permissions.canViewAllTasks && !task.assigneeIds.includes(currentUser?.id || '')) {
      toast.error('You can only update your own tasks');
      return;
    }

    console.log('Updating task color via mutation:', { taskId, color });
    updateTaskMutation.mutate(
      { id: taskId, data: { customColor: color || '' } },
      {
        onSuccess: (updatedTask) => {
          console.log('Task color update successful:', updatedTask);
          // Log the color change for audit purposes
          auditLogHelpers.taskUpdated(task.description, `Task color ${color ? 'changed' : 'reset'}`);
          toast.success(color ? 'Task color updated successfully' : 'Task color reset to default');
        },
        onError: (error) => {
          console.error('Task color update error:', error);
          toast.error('Failed to update task color');
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