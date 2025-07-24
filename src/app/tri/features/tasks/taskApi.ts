// Module gọi API sử dụng crudcrud cho Task
import { Task } from './taskTypes'; // Import kiểu dữ liệu Task

// Địa chỉ endpoint API (thay bằng endpoint của bạn trên crudcrud)
const BASE_URL = 'https://687f0404efe65e52008822d9.mockapi.io/TskTest';

// Lấy toàn bộ danh sách Task từ API
export async function getTasks(): Promise<Task[]> {
  const res = await fetch(BASE_URL); // Gửi request GET
  if (!res.ok) throw new Error('Failed to fetch tasks');
  const data = await res.json();
  // Parse lại labels/projects nếu là string
  return data.map((task: any) => ({
    ...task,
    labels: Array.isArray(task.labels) ? task.labels : JSON.parse(task.labels || "[]"),
    projects: Array.isArray(task.projects) ? task.projects : JSON.parse(task.projects || "[]"),
  }));
}

// Lấy chi tiết một Task theo id
export async function getTask(id: string): Promise<Task> {
  const res = await fetch(`${BASE_URL}/${id}`); // Gửi request GET theo id
  if (!res.ok) throw new Error('Failed to fetch task');
  const task = await res.json();
  return {
    ...task,
    labels: Array.isArray(task.labels) ? task.labels : JSON.parse(task.labels || "[]"),
    projects: Array.isArray(task.projects) ? task.projects : JSON.parse(task.projects || "[]"),
  };
}

// Tạo mới một Task (không cần truyền id)
export async function createTask(task: Omit<Task, 'id'>): Promise<Task> {
  // Serialize labels/projects thành chuỗi JSON
  const payload = {
    ...task,
    labels: JSON.stringify(task.labels ?? []),
    projects: JSON.stringify(task.projects ?? []),
  };
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create task');
  const created = await res.json();
  // Parse lại khi trả về
  return {
    ...created,
    labels: Array.isArray(created.labels) ? created.labels : JSON.parse(created.labels || "[]"),
    projects: Array.isArray(created.projects) ? created.projects : JSON.parse(created.projects || "[]"),
  };
}

// Cập nhật một Task theo id
export async function updateTask(id: string, task: Partial<Task>): Promise<Task> {
  // Serialize labels/projects thành chuỗi JSON
  const payload = {
    ...task,
    labels: JSON.stringify(task.labels ?? []),
    projects: JSON.stringify(task.projects ?? []),
  };
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to update task');
  const updated = await res.json();
  // Parse lại khi trả về
  return {
    ...updated,
    labels: Array.isArray(updated.labels) ? updated.labels : JSON.parse(updated.labels || "[]"),
    projects: Array.isArray(updated.projects) ? updated.projects : JSON.parse(updated.projects || "[]"),
  };
}

// Xóa một Task theo id
export async function deleteTask(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete task');
} 