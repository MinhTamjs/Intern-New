import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { Toaster, toast } from 'sonner';
import { Button } from './components/ui/button';
import { Avatar, AvatarFallback } from './components/ui/avatar';
import { Badge } from './components/ui/badge';
import { TaskBoard } from './features/kanban';
import { TaskModal, CreateTaskModal } from './features/tasks';
import { EmployeeFormDialog } from './features/employees';
import { useEmployees, useCreateEmployee } from './features/employees';
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from './features/tasks';
import { RoleSwitcher } from './components/RoleSwitcher';
import { AuditLog } from './components/AuditLog';
import { EmployeeManagement } from './pages/EmployeeManagement';
import { ZiraLogo } from './components/ZiraLogo';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ThemeProvider } from './lib/theme';
import { ThemeToggle } from './components/ThemeToggle';
import { createDemoUser, getRolePermissions } from './lib/roleManager';
import { auditLogService, auditLogHelpers } from './lib/auditLog';
import type { Task, TaskStatus, UpdateTaskData, CreateTaskData } from './features/tasks';
import type { CreateEmployeeData, Role } from './features/employees';

// Configure React Query client with caching and retry strategies
// This provides data fetching, caching, and error handling for the entire app
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Cache data for 5 minutes before considering it stale
      retry: 2, // Retry failed requests up to 2 times
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff with max 30s
    },
    mutations: {
      retry: 1, // Retry mutations once on failure
    },
  },
});

// Props interface for the main Dashboard component
interface DashboardProps {
  currentRole: Role; // Current user role (admin, manager, employee)
  onRoleChange: (role: Role) => void; // Callback to update user role
}

/**
 * Main Dashboard component that renders the Kanban board and manages application state
 * Handles task management, employee management, and role-based access control
 */
function Dashboard({ currentRole, onRoleChange }: DashboardProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Modal state management - controls visibility of different modals
  const [selectedTask, setSelectedTask] = useState<Task | null>(null); // Currently selected task for editing
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false); // Controls task edit modal visibility
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false); // Controls employee creation modal
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false); // Controls task creation modal
  const [showAuditLog, setShowAuditLog] = useState(false); // Controls audit log visibility

  // Create demo user and get role-based permissions
  const currentUser = createDemoUser(currentRole);
  const permissions = getRolePermissions(currentRole);

  // Data fetching hooks with error handling - these manage API calls and cache data
  const { data: employees = [], isLoading: employeesLoading, error: employeesError } = useEmployees();
  const { data: allTasks = [], isLoading: tasksLoading, error: tasksError } = useTasks();

  // Mutation hooks for CRUD operations - these handle data modifications
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();
  const createEmployeeMutation = useCreateEmployee();

  // Debug logging to help identify data issues and filtering problems
  // This helps troubleshoot issues with task filtering and data consistency
  useEffect(() => {
    console.log('=== Dashboard Debug Information ===');
    console.log('Current role:', currentRole);
    console.log('Current user:', currentUser);
    console.log('Permissions:', permissions);
    console.log('All tasks from API:', allTasks);
    console.log('Employees from API:', employees);
    
    // Check for tasks that might be filtered out due to data inconsistencies
    if (allTasks.length > 0) {
      const tasksWithIssues = allTasks.filter(task => {
        const hasInvalidStatus = !['pending', 'in-progress', 'in-review', 'done'].includes(task.status);
        const hasNoAssignee = !task.assigneeId;
        const hasInvalidAssignee = task.assigneeId && !employees.find(emp => emp.id === task.assigneeId);
        
        return hasInvalidStatus || hasNoAssignee || hasInvalidAssignee;
      });
      
      if (tasksWithIssues.length > 0) {
        console.log('Tasks with potential issues:', tasksWithIssues);
      }
    }
    
    console.log('=== End Dashboard Debug ===');
  }, [currentRole, currentUser.id, permissions, allTasks.length, employees.length]);

  // Filter tasks based on user role and permissions
  // Admins and managers see all tasks, employees only see their assigned tasks
  const tasks = allTasks.filter(task => {
    if (permissions.canViewAllTasks) {
      return true; // Admins and managers can see all tasks
    }
    return task.assigneeId === currentUser.id; // Employees only see their assigned tasks
  });

  // Loading state - shows loading spinner while data is being fetched
  if (employeesLoading || tasksLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#121212]">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
          <div className="flex justify-center mb-6">
            <ZiraLogo size={48} />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Loading ZIRA...
          </h1>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please wait while we load your workspace.
          </p>
          
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  // Error state - shows error message with retry option
  if (employeesError || tasksError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#121212]">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
          <div className="flex justify-center mb-6">
            <ZiraLogo size={48} />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Connection Error
          </h1>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Unable to load data from the server. Please check your connection and try again.
          </p>
          
          <div className="space-y-3">
            <Button 
              onClick={() => window.location.reload()} 
              className="w-full"
            >
              Retry
            </Button>
          </div>
          
          {/* Collapsible error details for debugging */}
          {(employeesError || tasksError) && (
            <details className="mt-6 text-left">
              <summary className="cursor-pointer text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                Error Details
              </summary>
              <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono text-red-600 dark:text-red-400">
                {employeesError && (
                  <div className="mb-2">
                    <strong>Employees Error:</strong> {employeesError.message}
                  </div>
                )}
                {tasksError && (
                  <div>
                    <strong>Tasks Error:</strong> {tasksError.message}
                  </div>
                )}
              </div>
            </details>
          )}
        </div>
      </div>
    );
  }

  // Event handlers for task management
  /**
   * Handles clicking on a task card to open the edit modal
   * @param task - The task that was clicked
   */
  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  /**
   * Handles drag end to update task status when a task is moved between columns
   * @param taskId - ID of the task being moved
   * @param newStatus - New status for the task
   */
  const handleTaskStatusChange = (taskId: string, newStatus: TaskStatus) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    // Only allow status changes if user has permission
    if (!permissions.canChangeStatus) {
      toast.error('You do not have permission to update task status');
      return;
    }

    // Check if user can update this specific task
    if (!permissions.canViewAllTasks && task.assigneeId !== currentUser.id) {
      toast.error('You can only update your own tasks');
      return;
    }

    updateTaskMutation.mutate(
      { id: taskId, data: { status: newStatus } },
      {
        onSuccess: (updatedTask) => {
          // Log the status change for audit purposes
          auditLogHelpers.taskStatusChanged(
            taskId, 
            task.title, 
            task.status, 
            newStatus, 
            currentRole
          );
          toast.success(`Task moved to ${newStatus.replace('-', ' ')}`);
        },
        onError: (error) => {
          toast.error('Failed to update task status');
          console.error('Task status update error:', error);
        },
      }
    );
  };

  /**
   * Handles saving task changes from the edit modal
   * @param taskId - ID of the task being updated
   * @param data - Updated task data
   */
  const handleTaskSave = (taskId: string, data: UpdateTaskData) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    // Permission checks for task updates
    if (!permissions.canEditTask) {
      toast.error('You do not have permission to update tasks');
      return;
    }

    if (!permissions.canViewAllTasks && task.assigneeId !== currentUser.id) {
      toast.error('You can only update your own tasks');
      return;
    }

    // Check for assignee changes and log them
    if (data.assigneeId && data.assigneeId !== task.assigneeId) {
      const newAssignee = employees.find(emp => emp.id === data.assigneeId);
      if (newAssignee) {
        auditLogHelpers.taskReassigned(
          taskId, 
          task.title, 
          task.assigneeId ? employees.find(emp => emp.id === task.assigneeId)?.name || 'Unassigned' : 'Unassigned',
          newAssignee.name,
          currentRole
        );
      }
    }

    updateTaskMutation.mutate(
      { id: taskId, data },
      {
        onSuccess: (updatedTask) => {
          // Log the update for audit purposes
          auditLogHelpers.taskUpdated(taskId, task.title, currentRole);
          toast.success('Task updated successfully');
          setIsTaskModalOpen(false);
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
   * Handles deleting a task
   * @param taskId - ID of the task to delete
   */
  const handleTaskDelete = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    // Permission checks for task deletion
    if (!permissions.canDeleteTask) {
      toast.error('You do not have permission to delete tasks');
      return;
    }

    if (!permissions.canViewAllTasks && task.assigneeId !== currentUser.id) {
      toast.error('You can only delete your own tasks');
      return;
    }

    deleteTaskMutation.mutate(taskId, {
      onSuccess: () => {
        // Log the deletion for audit purposes
        auditLogHelpers.taskDeleted(taskId, task.title, currentRole);
        toast.success('Task deleted successfully');
        setIsTaskModalOpen(false);
        setSelectedTask(null);
      },
      onError: (error) => {
        toast.error('Failed to delete task');
        console.error('Task deletion error:', error);
      },
    });
  };

  /**
   * Handles creating a new task
   * @param data - New task data
   */
  const handleCreateTask = (data: CreateTaskData) => {
    if (!permissions.canCreateTask) {
      toast.error('You do not have permission to create tasks');
      return;
    }

    createTaskMutation.mutate(data, {
      onSuccess: (newTask) => {
        // Log the task creation for audit purposes
        auditLogHelpers.taskCreated(newTask.id, newTask.title, currentRole);
        toast.success('Task created successfully');
        setIsCreateTaskModalOpen(false);
      },
      onError: (error) => {
        toast.error('Failed to create task');
        console.error('Task creation error:', error);
      },
    });
  };

  /**
   * Handles creating a new employee
   * @param data - New employee data
   */
  const handleCreateEmployee = (data: CreateEmployeeData) => {
    if (!permissions.canCreateEmployee) {
      toast.error('You do not have permission to create employees');
      return;
    }

    createEmployeeMutation.mutate(data, {
      onSuccess: (newEmployee) => {
        // Log the employee creation for audit purposes
        auditLogHelpers.employeeCreated(newEmployee.id, newEmployee.name, currentRole);
        toast.success('Employee added successfully');
        setIsEmployeeModalOpen(false);
      },
      onError: (error) => {
        toast.error('Failed to add employee');
        console.error('Employee creation error:', error);
      },
    });
  };

  /**
   * Handles role changes from the role switcher
   * @param newRole - New role to switch to
   */
  const handleRoleChange = (newRole: Role) => {
    onRoleChange(newRole);
    // Log the role change for audit purposes
    auditLogHelpers.roleChanged(currentUser.id, currentUser.name, currentRole, newRole);
  };

  /**
   * Handles task color changes from individual task cards
   * @param taskId - ID of the task to update
   * @param color - New color value or null to reset to default
   */
  const handleTaskColorChange = (taskId: string, color: string | null) => {
    const task = tasks.find(t => t.id === taskId);
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
      { id: taskId, data: { customColor: color } },
      {
        onSuccess: (updatedTask) => {
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#121212]">
      {/* Application Header with navigation and user info */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and brand */}
            <div className="flex items-center gap-3">
              <ZiraLogo size={32} variant="sky" showText={false} />
              <span className="text-xl font-bold text-gray-900 dark:text-white">ZIRA</span>
            </div>
            
            {/* Header actions and user profile */}
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <RoleSwitcher currentRole={currentRole} onRoleChange={handleRoleChange} />
              {/* Show employee management button only for users with permission */}
              {permissions.canCreateEmployee && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate('/employees')}
                >
                  Manage Employees
                </Button>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowAuditLog(!showAuditLog)}
              >
                {showAuditLog ? 'Hide' : 'Show'} Audit Log
              </Button>
              {/* User profile display */}
              <div className="flex items-center space-x-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback>
                    {currentUser.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <p className="font-medium text-gray-900 dark:text-white">{currentUser.name}</p>
                  <Badge variant="secondary" className="text-xs">
                    {currentUser.role}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main application content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header with title and action buttons */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">ZIRA Kanban Board</h2>
            <p className="text-gray-600 dark:text-gray-400">
              {permissions.canViewAllTasks 
                ? currentRole === 'employee' 
                  ? 'View all tasks and collaborate on the board'
                  : 'Manage all tasks and team members'
                : 'Your assigned tasks'
            }
            </p>
          </div>
          
          {/* Action buttons based on user permissions */}
          <div className="flex space-x-3">
            {permissions.canCreateTask && (
              <Button onClick={() => setIsCreateTaskModalOpen(true)}>
                Create Task
              </Button>
            )}
            {permissions.canCreateEmployee && (
              <Button variant="outline" onClick={() => setIsEmployeeModalOpen(true)}>
                Add Employee
              </Button>
            )}
          </div>
        </div>

        {/* Audit log section - conditionally shown */}
        {showAuditLog && (
          <div className="mb-6">
            <AuditLog 
              logs={auditLogService.getLogs()} 
              currentUserRole={currentRole}
              onTaskUpdate={() => {
                // Refresh tasks data when a task is restored
                queryClient.invalidateQueries({ queryKey: ['tasks'] });
              }}
            />
          </div>
        )}

        {/* Kanban board with scrollable container */}
        <div 
          className="h-[calc(100vh-200px)] 
                     overflow-x-hidden 
                     overflow-y-auto"
        >
          <TaskBoard
            tasks={tasks}
            employees={employees}
            onTaskClick={handleTaskClick}
            onTaskStatusChange={handleTaskStatusChange}
            onTaskColorChange={handleTaskColorChange}
            canEditColors={permissions.canEditTask}
            isAdmin={currentRole === 'admin'}
          />
        </div>
      </main>

      {/* Modal components for task and employee management */}
      <TaskModal
        task={selectedTask}
        employees={employees}
        currentUserRole={currentUser.role}
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleTaskSave}
        onDelete={handleTaskDelete}
      />

      <EmployeeFormDialog
        isOpen={isEmployeeModalOpen}
        onClose={() => setIsEmployeeModalOpen(false)}
        onSubmit={handleCreateEmployee}
        isLoading={createEmployeeMutation.isPending}
      />

      <CreateTaskModal
        isOpen={isCreateTaskModalOpen}
        onClose={() => setIsCreateTaskModalOpen(false)}
        onSubmit={handleCreateTask}
        employees={employees}
        isLoading={createTaskMutation.isPending}
        currentRole={currentRole}
      />

      <Toaster />
    </div>
  );
}

/**
 * AppContent component handles routing between different pages
 * Provides navigation between the main dashboard and employee management
 */
function AppContent() {
  const [currentRole, setCurrentRole] = useState<Role>('admin');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard currentRole={currentRole} onRoleChange={setCurrentRole} />} />
        <Route path="/employees" element={<EmployeeManagement currentRole={currentRole} />} />
      </Routes>
    </Router>
  );
}

/**
 * Main App component that wraps the entire application
 * Provides theme context and error boundary protection
 */
export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
