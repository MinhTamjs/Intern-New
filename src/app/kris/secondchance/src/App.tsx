import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster, toast } from 'sonner';
import { ThemeProvider } from './lib/theme';
import { ThemeToggle } from './components/ThemeToggle';
import { RoleSwitcher } from './components/RoleSwitcher';
import { TaskBoard } from './features/kanban/TaskBoard';
import { TaskModal } from './features/tasks/components/TaskModal';
import { CreateTaskModal } from './features/tasks/components/CreateTaskModal';
import { EmployeeManagement } from './pages/EmployeeManagement';
import { AuditLog } from './components/AuditLog';
import { EmptyState } from './components/EmptyState';
import { ZiraLogo } from './components/ZiraLogo';
import { useTasks, useUpdateTask, useCreateTask, useDeleteTask } from './features/tasks';
import { useEmployees } from './features/employees';
import { getRolePermissions } from './lib/roleManager';
import { auditLogHelpers } from './lib/auditLog';
import type { Task, TaskStatus } from './features/tasks/types';
import type { Role, Employee } from './features/employees/types';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

/**
 * Main App component - ZIRA task management system
 * Handles routing, theme, role management, and task operations
 */
function App() {
  // User state
  const [currentRole, setCurrentRole] = useState<Role>('admin');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Get permissions for current role
  const permissions = getRolePermissions(currentRole);

  // Data fetching
  const { data: tasks = [], isLoading: tasksLoading } = useTasks();
  const { data: employees = [], isLoading: employeesLoading } = useEmployees();

  // Task mutations
  const updateTaskMutation = useUpdateTask();
  const createTaskMutation = useCreateTask();
  const deleteTaskMutation = useDeleteTask();

  // Get current user (demo user based on role)
  const currentUser = (employees as Employee[]).find(emp => emp.role === currentRole) || (employees as Employee[])[0];

  // Handle role change
  const handleRoleChange = (newRole: Role) => {
    setCurrentRole(newRole);
    auditLogHelpers.roleChanged(currentRole, newRole);
  };

  // Handle task click
  const handleTaskClick = (task: Task) => {
    if (permissions.canViewTask(task)) {
      setSelectedTask(task);
    }
  };

  // Handle task status change
  const handleTaskStatusChange = (taskId: string, newStatus: TaskStatus) => {
    const task = (tasks as Task[]).find(t => t.id === taskId);
    if (!task) return;

    // Permission checks
    if (!permissions.canChangeStatus) {
      toast.error('You do not have permission to change task status');
      return;
    }

    if (!permissions.canViewAllTasks && task.assigneeId !== currentUser?.id) {
      toast.error('You can only update your own tasks');
      return;
    }

    updateTaskMutation.mutate(
      { id: taskId, data: { status: newStatus } },
      {
        onSuccess: () => {
          auditLogHelpers.taskStatusChanged(taskId, task.title, task.status, newStatus, currentRole);
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
    const task = (tasks as Task[]).find(t => t.id === taskId);
    if (!task) return;

    // Permission checks
    if (!permissions.canDeleteTask) {
      toast.error('You do not have permission to delete tasks');
      return;
    }

    if (!permissions.canViewAllTasks && task.assigneeId !== currentUser?.id) {
      toast.error('You can only delete your own tasks');
      return;
    }

    deleteTaskMutation.mutate(taskId, {
      onSuccess: () => {
        auditLogHelpers.taskDeleted(taskId, task.title, currentRole);
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
        auditLogHelpers.taskCreated((newTask as Task).id, (newTask as Task).title, currentRole);
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
    const task = (tasks as Task[]).find(t => t.id === taskId);
    if (!task) return;

    // Permission checks
    if (!permissions.canEditTask) {
      toast.error('You do not have permission to edit tasks');
      return;
    }

    if (!permissions.canViewAllTasks && task.assigneeId !== currentUser?.id) {
      toast.error('You can only edit your own tasks');
      return;
    }

    updateTaskMutation.mutate(
      { id: taskId, data: updates },
      {
        onSuccess: () => {
          auditLogHelpers.taskUpdated(taskId, task.title, currentRole, 'Task details updated');
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

  /**
   * Handles task color changes from individual task cards
   * @param taskId - ID of the task to update
   * @param color - New color value or null to reset to default
   */
  const handleTaskColorChange = (taskId: string, color: string | null) => {
    const task = (tasks as Task[]).find(t => t.id === taskId);
    if (!task) return;

    // Permission checks for task color updates
    if (!permissions.canEditTask) {
      toast.error('You do not have permission to update tasks');
      return;
    }

    if (!permissions.canViewAllTasks && task.assigneeId !== currentUser.id) {
      toast.error('You can only update your own tasks');
      return;
    }

    updateTaskMutation.mutate(
      { id: taskId, data: { customColor: color || undefined } },
      {
        onSuccess: () => {
          // Log the color change for audit purposes
          auditLogHelpers.taskUpdated(taskId, task.title, currentRole, `Task color ${color ? 'changed' : 'reset'}`);
          toast.success(color ? 'Task color updated successfully' : 'Task color reset to default');
        },
        onError: (error) => {
          toast.error('Failed to update task color');
          console.error('Task color update error:', error);
        },
      }
    );
  };

  // Loading state
  if (tasksLoading || employeesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#121212]">
        <div className="text-center">
          <ZiraLogo size={64} variant="sky" />
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mt-4"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading ZIRA...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-[#121212]">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                  {/* Logo and title */}
                  <div className="flex items-center gap-3">
                    <ZiraLogo size={32} variant="sky" showText={false} />
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">ZIRA</h1>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <RoleSwitcher currentRole={currentRole} onRoleChange={handleRoleChange} />
                    {permissions.canCreateEmployee && (
                      <button
                        className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                        onClick={() => window.location.href = '/employees'}
                      >
                        Manage Employees
                      </button>
                    )}
                    {permissions.canViewAuditLog && (
                      <button
                        className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                        onClick={() => window.location.href = '/audit-log'}
                      >
                        Audit Log
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </header>

            {/* Main content */}
            <main className="flex-1">
              <Routes>
                {/* Dashboard route */}
                <Route
                  path="/"
                  element={
                    <div className="p-6">
                      {/* Dashboard header */}
                      <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                          ZIRA Task Board
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                          Welcome back, {currentUser?.name || 'User'}! Manage your tasks efficiently.
                        </p>
                      </div>

                      {/* Task board */}
                      {(tasks as Task[]).length === 0 ? (
                        <EmptyState
                          title="No tasks yet"
                          description="Get started by creating your first task"
                          action={{
                            label: "Create Task",
                            onClick: () => setIsCreateModalOpen(true)
                          }}
                        />
                      ) : (
                        <TaskBoard
                          tasks={tasks as Task[]}
                          employees={employees as Employee[]}
                          onTaskClick={handleTaskClick}
                          onTaskStatusChange={handleTaskStatusChange}
                          onTaskColorChange={handleTaskColorChange}
                          canEditColors={permissions.canEditTask}
                          isAdmin={currentRole === 'admin'}
                        />
                      )}

                      {/* Create task button */}
                      {permissions.canCreateTask && (
                        <div className="fixed bottom-6 right-6">
                          <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center"
                          >
                            <span className="text-2xl">+</span>
                          </button>
                        </div>
                      )}
                    </div>
                  }
                />

                {/* Employee management route */}
                <Route
                  path="/employees"
                  element={
                    permissions.canCreateEmployee ? (
                      <EmployeeManagement currentRole={currentRole} />
                    ) : (
                      <div>Access Denied</div>
                    )
                  }
                />

                {/* Audit log route */}
                <Route
                  path="/audit-log"
                  element={
                    permissions.canViewAuditLog ? (
                      <div className="p-6">
                        <div className="mb-6">
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            ZIRA Audit Log
                          </h2>
                          <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Track all system activities and changes
                          </p>
                        </div>
                        <AuditLog logs={[]} />
                      </div>
                    ) : (
                      <div>Access Denied</div>
                    )
                  }
                />

                {/* Default redirect */}
                <Route path="*" element={<div>Page Not Found</div>} />
              </Routes>
            </main>

            {/* Task modals */}
            {selectedTask && (
              <TaskModal
                task={selectedTask}
                employees={employees as Employee[]}
                currentUserRole={currentRole}
                isOpen={true}
                onClose={() => setSelectedTask(null)}
                onSave={handleTaskUpdate}
                onDelete={handleTaskDelete}
              />
            )}

            {/* Create task modal */}
            {isCreateModalOpen && (
              <CreateTaskModal
                isOpen={isCreateModalOpen}
                employees={employees as Employee[]}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleTaskCreate}
                currentRole={currentRole}
              />
            )}
          </div>
        </Router>
        <Toaster position="top-right" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
