// src/api/todosApi.js
const BASE_URL = 'https://crudcrud.com/api/342606ef9e7c46c5bef491ace522a414';

export const getBaseURL = (collection) => `${BASE_URL}/${collection}`;

export async function getTodos() {
  const res = await fetch(getBaseURL('todos'));
  if (!res.ok) throw new Error('Lỗi lấy todos');
  return res.json();
}

export async function addTodo(todo) {
  const res = await fetch(getBaseURL('todos'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(todo),
  });
  if (!res.ok) throw new Error('Lỗi thêm todo');
  return res.json();
}

export async function updateTodo(id, updatedTodo) {
  const { _id, ...data } = updatedTodo;
  const res = await fetch(`${getBaseURL('todos')}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Lỗi cập nhật todo');
}

export async function deleteTodo(id) {
  const res = await fetch(`${getBaseURL('todos')}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Lỗi xóa todo');
}