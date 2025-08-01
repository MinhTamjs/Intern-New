import { TaskBoard } from '../features/kanban/TaskBoard';
import { CreateTaskModal } from '../features/tasks/components/CreateTaskModal';
import { useApp } from '../hooks/useApp';
import { useEmployees } from '../features/employees';
import { useAuth } from '../hooks/useAuth';
import type { Employee } from '../features/employees/types';


export function Dashboard() {
  const {
    isCreateModalOpen,
    setIsCreateModalOpen,
    handleTaskCreate
    } = useApp();

  const { currentRole } = useAuth();
  const { data: employees = [] } = useEmployees();

  return (
    <>
      {/* Header */}
      <div className="p-6 pb-0">
        <div className="mb-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        </div>
      </div>
      
      <TaskBoard />
      

      


      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleTaskCreate}
        employees={employees as Employee[]}
        currentUserRole={currentRole}
      />
    </>
  );
} 