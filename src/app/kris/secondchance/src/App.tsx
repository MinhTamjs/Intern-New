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
import { createDemoUser, getRolePermissions } from './lib/roleManager';
import { auditLogService, auditLogHelpers } from './lib/auditLog';
import type { Task, TaskStatus, UpdateTaskData, CreateTaskData } from './features/tasks';
import type { CreateEmployeeData, Role } from './features/employees';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: 1,
    },
  },
});

interface DashboardProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
}

function Dashboard({ currentRole, onRoleChange }: DashboardProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [showAuditLog, setShowAuditLog] = useState(false);

  const currentUser = createDemoUser(currentRole);
  const permissions = getRolePermissions(currentRole);

  const { data: employees = [], isLoading: employeesLoading, error: employeesError } = useEmployees();
  const { data: allTasks = [], isLoading: tasksLoading, error: tasksError } = useTasks();

  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();
  const createEmployeeMutation = useCreateEmployee();

  // Debug logging for API data
  useEffect(() => {
    console.log('=== Dashboard Debug Information ===');
    console.log('Current role:', currentRole);
    console.log('Current user:', currentUser);
    console.log('Permissions:', permissions);
    console.log('All tasks from API:', allTasks);
    console.log('Employees from API:', employees);
    
    // Check for tasks that might be filtered out
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

  // Filter tasks based on user role
  const tasks = permissions.canViewAllTasks 
    ? allTasks 
    : allTasks.filter(task => task.assigneeId === currentUser.id);

  // Debug logging for filtered tasks
  useEffect(() => {
    console.log('=== Task Filtering Debug ===');
    console.log('All tasks count:', allTasks.length);
    console.log('Filtered tasks count:', tasks.length);
    console.log('Can view all tasks:', permissions.canViewAllTasks);
    console.log('Current user ID:', currentUser.id);
    
    if (!permissions.canViewAllTasks) {
      const userTasks = allTasks.filter(task => task.assigneeId === currentUser.id);
      console.log('Tasks assigned to current user:', userTasks);
    }
    
    console.log('=== End Task Filtering Debug ===');
  }, [allTasks.length, tasks.length, permissions.canViewAllTasks, currentUser.id]);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  const handleTaskStatusChange = (taskId: string, newStatus: TaskStatus) => {
    const task = allTasks.find(t => t.id === taskId);
    if (!task) {
      console.error('Task not found for status change:', taskId);
      toast.error('Task not found');
      return;
    }

    // Prevent unnecessary updates
    if (task.status === newStatus) {
      console.log('Task status unchanged:', taskId, newStatus);
      return;
    }

    const previousStatus = task.status;
    
    updateTaskMutation.mutate(
      { 
        id: taskId, 
        data: { 
          status: newStatus,
          updatedAt: new Date().toISOString()
        } 
      },
      {
        onSuccess: () => {
          auditLogHelpers.taskMoved(taskId, task.title, previousStatus, newStatus, currentRole);
          toast.success(`Task moved to ${newStatus.replace('-', ' ')}`);
        },
        onError: (error) => {
          toast.error('Failed to update task status');
          console.error('Task status update error:', error);
        },
      }
    );
  };

  const handleTaskSave = (taskId: string, data: UpdateTaskData) => {
    const task = allTasks.find(t => t.id === taskId);
    if (!task) return;

    // Only include fields that have actually changed
    const changedFields: UpdateTaskData = {};
    
    if (data.title !== undefined && data.title !== task.title) {
      changedFields.title = data.title;
    }
    
    if (data.description !== undefined && data.description !== task.description) {
      changedFields.description = data.description;
    }
    
    if (data.assigneeId !== undefined && data.assigneeId !== task.assigneeId) {
      changedFields.assigneeId = data.assigneeId;
    }
    
    if (data.status !== undefined && data.status !== task.status) {
      changedFields.status = data.status;
    }

    // Always include updatedAt timestamp for any change
    changedFields.updatedAt = new Date().toISOString();

    // Log assignee changes
    if (changedFields.assigneeId) {
      const previousAssignee = employees.find(emp => emp.id === task.assigneeId)?.name || 'Unassigned';
      const newAssignee = employees.find(emp => emp.id === changedFields.assigneeId!)?.name || 'Unassigned';
      auditLogHelpers.taskAssigneeUpdated(taskId, task.title, previousAssignee, newAssignee, currentRole);
    }

    // Always update if there are any changes (including just updatedAt)
    if (Object.keys(changedFields).length === 0) {
      toast.info('No changes detected');
      setIsTaskModalOpen(false);
      return;
    }

    updateTaskMutation.mutate(
      { id: taskId, data: changedFields },
      {
        onSuccess: () => {
          auditLogHelpers.taskUpdated(taskId, task.title, currentRole, 'Task details updated');
          toast.success('Task updated successfully');
          
          // Optimistically update the cache with the new task data
          queryClient.setQueryData(['tasks'], (oldTasks: Task[] = []) => {
            return oldTasks.map(t => t.id === taskId ? { ...t, ...changedFields } : t);
          });
          
          setIsTaskModalOpen(false);
        },
        onError: (error) => {
          toast.error('Failed to update task');
          console.error('Task update error:', error);
        },
      }
    );
  };

  const handleTaskDelete = (taskId: string) => {
    const task = allTasks.find(t => t.id === taskId);
    if (!task) return;

    deleteTaskMutation.mutate(taskId, {
      onSuccess: () => {
        auditLogHelpers.taskDeleted(taskId, task.title, currentRole);
        toast.success('Task deleted successfully');
        setIsTaskModalOpen(false);
      },
      onError: (error) => {
        toast.error('Failed to delete task');
        console.error('Task delete error:', error);
      },
    });
  };

  const handleCreateTask = (data: CreateTaskData) => {
    createTaskMutation.mutate(data, {
      onSuccess: (newTask) => {
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

  const handleCreateEmployee = (data: CreateEmployeeData) => {
    createEmployeeMutation.mutate(data, {
      onSuccess: (newEmployee) => {
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

  const handleRoleChange = (newRole: Role) => {
    onRoleChange(newRole);
    toast.success(`Switched to ${newRole} role`);
  };

  // Show loading state
  if (employeesLoading || tasksLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <ZiraLogo size={48} />
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading ZIRA...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (employeesError || tasksError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="flex justify-center mb-6">
            <ZiraLogo size={48} />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Connection Error
          </h1>
          
          <p className="text-gray-600 mb-6">
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
          
          {(employeesError || tasksError) && (
            <details className="mt-6 text-left">
              <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                Error Details
              </summary>
              <div className="mt-2 p-3 bg-gray-100 rounded text-xs font-mono text-red-600">
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <ZiraLogo size={32} variant="sky" showText={false} />
              <span className="text-xl font-bold text-gray-900">ZIRA</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <RoleSwitcher currentRole={currentRole} onRoleChange={handleRoleChange} />
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
              <div className="flex items-center space-x-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback>
                    {currentUser.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{currentUser.name}</p>
                  <Badge variant="secondary" className="text-xs">
                    {currentUser.role}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Action Buttons */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">ZIRA Kanban Board</h2>
            <p className="text-gray-600">
              {permissions.canViewAllTasks 
                ? currentRole === 'employee' 
                  ? 'View all tasks and collaborate on the board'
                  : 'Manage all tasks and team members'
                : 'Your assigned tasks'
            }
            </p>
          </div>
          
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

        {/* Audit Log */}
        {showAuditLog && (
          <div className="mb-6">
            <AuditLog 
              logs={auditLogService.getLogs()} 
            />
          </div>
        )}

        {/* Kanban Board */}
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
          />
        </div>
      </main>

      {/* Modals */}
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

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isCreateTaskModalOpen}
        onClose={() => setIsCreateTaskModalOpen(false)}
        onSubmit={handleCreateTask}
        employees={employees}
        isLoading={createTaskMutation.isPending}
      />

      <Toaster />
    </div>
  );
}

function AppContent() {
  const [currentRole, setCurrentRole] = useState<Role>('admin');

  return (
    <Routes>
      <Route path="/" element={<Dashboard currentRole={currentRole} onRoleChange={setCurrentRole} />} />
      <Route path="/employees" element={<EmployeeManagement currentRole={currentRole} />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <AppContent />
        </Router>
        <Toaster position="top-right" />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
