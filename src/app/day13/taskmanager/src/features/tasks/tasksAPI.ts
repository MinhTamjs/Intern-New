export type TaskStatus = 'planning' | 'in progress' | 'done' | 'failed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  name: string;
  priority: TaskPriority;
  dueDate: string;
  description: string;
  status: TaskStatus;
  assignTo: string; // employee id
  createdBy: string; // id người tạo task
}

// Mock data
// export const tasks: Task[] = [];

const API_URL = 'https://6881dc8866a7eb81224c5612.mockapi.io/tasks';

export async function getTasks() {
  const res = await fetch(API_URL);
  return res.json();
}

export async function addTask(task: Omit<Task, 'id'>) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
  return res.json();
}

export async function updateTask(id: string, update: Partial<Omit<Task, 'id'>>) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(update),
  });
  return res.json();
}

export async function deleteTask(id: string) {
  const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  return res.json();
}

export const TaskService = {
  getTasks,
  addTask,
  updateTask,
  deleteTask,
}; 