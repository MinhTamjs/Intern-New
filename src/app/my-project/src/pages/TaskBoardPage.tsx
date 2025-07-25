// src/pages/TaskBoardPage.tsx
import { TaskBoard } from '../features/kanban/TaskBoard';
import { useAuth } from '../lib/auth';
import { TaskForm } from '../features/tasks/components/TaskForm'; // 🔹 import form tạo task

export default function TaskBoardPage() {
  const currentUser = useAuth();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Giao việc bằng kéo thả</h1>
      <div className="mb-6">
        <TaskForm />
      </div>
      <TaskBoard currentUser={currentUser} />
    </div>
  );
}
