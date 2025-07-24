import axios from 'axios';

const ENDPOINT = 'https://687df7e2c07d1a878c30aa88.mockapi.io/api/task-manager-app/taskmanager';

export const getTasks = async () => {
  const response = await axios.get(ENDPOINT);
  return response.data;
};

export const addTask = async (task) => {
  const response = await axios.post(ENDPOINT, task);
  return response.data;
};

export const updateTask = async (id, updatedTask) => {
  // mockAPI dùng id là string, không cần bỏ _id
  const response = await axios.put(`${ENDPOINT}/${id}`, updatedTask);
  return response.data;
};

export const deleteTask = async (id) => {
  const response = await axios.delete(`${ENDPOINT}/${id}`);
  return response.data; // mockAPI trả về object task đã xóa, có id
};