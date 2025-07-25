import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import TaskBoardPage from '../pages/TaskBoardPage';
import { EmployeeList } from '../features/employees/components/EmployeeList';
import { TaskList } from '../features/tasks/TaskList';
import { Toaster } from 'sonner';

function App() {
  // Tạm hardcode user, có thể thay bằng Auth sau
  const currentUser = { id: '1', role: 'admin' };

  return (
    <main className="p-4">
      <Toaster richColors position="top-right" />

      <Tabs defaultValue="board">
        <TabsList>
          <TabsTrigger value="board">Giao việc</TabsTrigger>
          <TabsTrigger value="employees">Nhân viên</TabsTrigger>
          <TabsTrigger value="tasks">Công việc</TabsTrigger>
        </TabsList>

        <TabsContent value="board">
          <TaskBoardPage currentUser={currentUser} />
        </TabsContent>
        <TabsContent value="employees">
          <EmployeeList currentUser={currentUser} />
        </TabsContent>
        <TabsContent value="tasks">
          <TaskList currentUser={currentUser} />
        </TabsContent>
      </Tabs>
    </main>
  );
}

export default App;
