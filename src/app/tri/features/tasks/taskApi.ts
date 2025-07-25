

const BASE_URL = 'https://687f0404efe65e52008822d9.mockapi.io'; // Đúng endpoint của bạn

// ===================== EMPLOYEE API =====================
// Lấy danh sách nhân viên
export async function getEmployees() {
  const res = await fetch(`${BASE_URL}/Employee`);
  if (!res.ok) throw new Error('Failed to fetch employees');
  return await res.json();
}
// Thêm mới nhân viên
export async function createEmployee(employee: any) {
  const res = await fetch(`${BASE_URL}/Employee`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(employee),
  });
  if (!res.ok) throw new Error('Failed to create employee');
  return await res.json();
}
// Sửa thông tin nhân viên
export async function updateEmployee(id: any, updates: any) {
  const res = await fetch(`${BASE_URL}/Employee/${id}`, {
    method: 'PUT', // Đổi PATCH thành PUT
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error('Failed to update employee');
  return await res.json();
}
// Xóa nhân viên
export async function deleteEmployee(id: any) {
  const res = await fetch(`${BASE_URL}/Employee/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete employee');
}
// Lấy danh sách task của nhân viên (nếu cần, nhưng MockAPI không tự join)
export async function getEmployeeTasks(employeeId: any) {
  const res = await fetch(`${BASE_URL}/TskTest?assignedTo=${employeeId}`);
  if (!res.ok) throw new Error('Failed to fetch employee tasks');
  return await res.json();
}

// ===================== TASK API =====================
// Lấy danh sách công việc
export async function getTasks() {
  const res = await fetch(`${BASE_URL}/TskTest`);
  if (!res.ok) throw new Error('Failed to fetch tasks');
  return await res.json();
}
// Thêm mới công việc
export async function createTask(task: any) {
  const res = await fetch(`${BASE_URL}/TskTest`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
  if (!res.ok) throw new Error('Failed to create task');
  return await res.json();
}
// Sửa công việc
export async function updateTask(id: any, updates: any) {
  const res = await fetch(`${BASE_URL}/TskTest/${id}`, {
    method: 'PUT', // Đổi PATCH thành PUT
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error('Failed to update task');
  return await res.json();
}
// Xóa công việc
export async function deleteTask(id: any) {
  const res = await fetch(`${BASE_URL}/TskTest/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete task');
}
// Gán lại task cho nhân viên
export async function assignTask(taskId: any, employeeId: any) {
  // Lấy task hiện tại trước khi update
  const taskRes = await fetch(`${BASE_URL}/TskTest/${taskId}`);
  if (!taskRes.ok) throw new Error('Failed to fetch task for assign');
  const task = await taskRes.json();
  // Gán lại assignedTo và update bằng PUT
  const res = await fetch(`${BASE_URL}/TskTest/${taskId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...task, assignedTo: employeeId }),
  });
  if (!res.ok) throw new Error('Failed to assign task');
  return await res.json();
} 