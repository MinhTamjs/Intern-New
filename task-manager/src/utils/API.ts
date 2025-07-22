const BASE_URL = 'https://crudcrud.com/api/7d36fea3390441ad8d51bde2778bed33';
const COLLECTION = 'tasks';

export interface Task {
  _id?: string;
  title: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  startDate: string;
  endDate: string;
  note?: string;
}

const getBaseURL = (collection: string) => `${BASE_URL}/${collection}`;

export async function getTasks(): Promise<Task[]> {
  const res = await fetch(getBaseURL(COLLECTION));
  if (!res.ok) throw new Error('Lỗi khi tải danh sách công việc');
  return await res.json();
}

export async function addTask(task: Omit<Task, '_id'>): Promise<Task> {
  const res = await fetch(getBaseURL(COLLECTION), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
  if (!res.ok) throw new Error('Lỗi khi thêm công việc');
  return await res.json();
}

export async function updateTask(id: string, updated: Omit<Task, '_id'>): Promise<void> {
  const res = await fetch(`${getBaseURL(COLLECTION)}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updated),
  });
  if (!res.ok) throw new Error('Lỗi khi cập nhật công việc');
}

export async function deleteTask(id: string): Promise<void> {
  const res = await fetch(`${getBaseURL(COLLECTION)}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Lỗi khi xoá công việc');
}
