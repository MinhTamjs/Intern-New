import { TaskBoard } from '../features/kanban/TaskBoard';
import { TaskModal } from '../features/tasks/components/TaskModal';
import { CreateTaskModal } from '../features/tasks/components/CreateTaskModal';
import { useApp } from '../hooks/useApp';
import { useAuth } from '../contexts/AuthContext';
import { useEmployees } from '../features/employees';
import type { Employee } from '../features/employees/types';

export function Dashboard() {
  const { currentRole } = useAuth();
  const {
    selectedTask,
    isCreateModalOpen,
    openTaskModalInEditMode,
    setSelectedTask,
    setIsCreateModalOpen,
    handleTaskCreate,
    handleTaskUpdate,
    handleTaskDelete
  } = useApp();

  const { data: employees = [] } = useEmployees();

  return (
    <>
      <TaskBoard />
      
      {/* Task Modal */}
      {selectedTask && (
        <TaskModal
          task={selectedTask}
          employees={employees as Employee[]}
          currentUserRole={currentRole}
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          onSave={handleTaskUpdate}
          onDelete={handleTaskDelete}
          openInEditMode={openTaskModalInEditMode}
        />
      )}

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleTaskCreate}
        employees={employees as Employee[]}
      />
    </>
  );
} 