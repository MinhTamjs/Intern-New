import './App.css';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  getTasks,
  addTask,
  type Task,
  type TaskStatus,
  type TaskPriority,
} from './features/tasks/tasksAPI';

import {
  getEmployees,
  addEmployee,
  deleteEmployee,
  updateEmployee,
  type Employee,
} from './features/employees/employeesAPI';

import { TaskForm } from './components/task/TaskForm';
import { TaskBoard } from './components/task/TaskBoard';
import { FilterSearch } from './components/employee/FilterSearch';
import { EmployeeManager } from './components/employee/EmployeeManager';

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from './components/ui/select';

import { Badge } from './components/ui/badge';
import {
  UserIcon,
  ShieldIcon,
  ChefHatIcon,
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  role: 'employee' | 'manager' | 'admin';
}

type FilterState = {
  status: '' | TaskStatus;
  priority: '' | TaskPriority;
  assignee: string;
  search: string;
};

const mockUsers: User[] = [
  { id: '1', name: 'Admin', role: 'admin' },
  { id: '2', name: 'Manager', role: 'manager' },
  { id: '3', name: 'Nhân viên A', role: 'employee' },
];

function App() {
  const queryClient = useQueryClient();

  const { data: employees = [] } = useQuery<Employee[]>({
    queryKey: ['employees'],
    queryFn: getEmployees,
  });

  const addEmployeeMutation = useMutation({
    mutationFn: addEmployee,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['employees'] }),
  });

  const deleteEmployeeMutation = useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['employees'] }),
  });

  const updateEmployeeMutation = useMutation({
    mutationFn: ({ id, update }: { id: string; update: Partial<Employee> }) =>
      updateEmployee(id, update),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['employees'] }),
  });

  const { data: tasks = [] } = useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: getTasks,
  });

  const addTaskMutation = useMutation({
    mutationFn: addTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });

  const [filters, setFilters] = useState<FilterState>({
    status: '',
    priority: '',
    assignee: '',
    search: '',
  });

  const filteredTasks = tasks.filter((t: Task) => {
    const matchStatus = !filters.status || t.status === filters.status;
    const matchPriority = !filters.priority || t.priority === filters.priority;
    const matchAssignee = !filters.assignee || t.assignTo === filters.assignee;
    const matchSearch =
      !filters.search ||
      t.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      t.description.toLowerCase().includes(filters.search.toLowerCase());

    return matchStatus && matchPriority && matchAssignee && matchSearch;
  });

  const [currentUser, setCurrentUser] = useState<User>(mockUsers[0]);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-screen-xl mx-auto px-4 space-y-6">
        {/* Header chọn vai trò */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold">Vai trò:</span>
            <Select
              value={currentUser.id}
              onValueChange={(id) => {
                const user = mockUsers.find((u) => u.id === id);
                if (user) setCurrentUser(user);
              }}
            >
              <SelectTrigger className="w-44" />
              <SelectContent>
                <SelectItem value="1">
                  <span className="flex items-center gap-2">
                    <ShieldIcon className="text-blue-600 w-4 h-4" />
                    Admin <Badge variant="secondary">Admin</Badge>
                  </span>
                </SelectItem>
                <SelectItem value="2">
                  <span className="flex items-center gap-2">
                    <UserIcon className="text-green-600 w-4 h-4" />
                    Manager <Badge variant="secondary">Manager</Badge>
                  </span>
                </SelectItem>
                <SelectItem value="3">
                  <span className="flex items-center gap-2">
                    <ChefHatIcon className="text-yellow-600 w-4 h-4" />
                    Nhân viên A <Badge variant="secondary">Staff</Badge>
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
            <span className="ml-4 text-sm text-gray-500">
              (Chọn để kiểm tra phân quyền)
            </span>
          </div>
        </div>

        {/* Tiêu đề */}
        <h1 className="text-2xl font-bold px-1">Quản lý công việc</h1>

        {/* Quản lý nhân viên */}
        <div className="bg-white rounded-xl shadow p-6">
          <EmployeeManager
            employees={employees}
            currentUser={currentUser}
            onAdd={(emp) => addEmployeeMutation.mutate(emp)}
            onDelete={(id) => deleteEmployeeMutation.mutate(id)}
            onEdit={(id, update) =>
              updateEmployeeMutation.mutate({ id, update })
            }
          />
        </div>

        {/* Thêm task */}
        <div className="bg-white rounded-xl shadow p-6">
          <TaskForm
            employees={employees}
            currentUser={currentUser}
            onSubmit={(task) =>
              addTaskMutation.mutate({ ...task, createdBy: currentUser.id, description: task.description || '' })
            }
          />
        </div>

        {/* Bộ lọc */}
        <div className="bg-white rounded-xl shadow p-6">
          <FilterSearch
            {...filters}
            onChange={setFilters}
            employees={employees}
          />
        </div>

        {/* Bảng công việc */}
        <div className="bg-white rounded-xl shadow p-6">
          <TaskBoard tasks={filteredTasks} />
        </div>
      </div>
    </div>
  );
}

export default App;
