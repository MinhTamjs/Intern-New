import axios from 'axios';

const ENDPOINT = 'http://localhost:8080/https://crudcrud.com/api/342606ef9e7c46c5bef491ace522a414';
const getBaseURL = (collectionName) => `${ENDPOINT}/${collectionName}`;

export const getTasks = async () => {
  const response = await axios.get(getBaseURL('tasks'), {
    headers: { 'x-requested-with': 'XMLHttpRequest' }
  });
  return response.data;
};

export const addTask = async (task) => {
  const response = await axios.post(getBaseURL('tasks'), task, {
    headers: { 'x-requested-with': 'XMLHttpRequest' }
  });
  return response.data;
};

export const updateTask = async (id, updatedTask) => {
  // Loại bỏ _id khỏi object gửi lên
  const { _id, ...taskWithoutId } = updatedTask;
  const response = await axios.put(`${getBaseURL('tasks')}/${id}`, taskWithoutId, {
    headers: { 'x-requested-with': 'XMLHttpRequest' }
  });
  return response.data;
};

export const deleteTask = async (id) => {
  await axios.delete(`${getBaseURL('tasks')}/${id}`, {
    headers: { 'x-requested-with': 'XMLHttpRequest' }
  });
  return id;
};