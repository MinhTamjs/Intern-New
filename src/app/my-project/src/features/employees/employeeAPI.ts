// src/features/employees/employeeAPI.ts
import axios from 'axios';
import type { Employee } from './types';

import { API_BASE_URL } from '../../lib/api';

export async function getEmployees(): Promise<Employee[]> {
  const res = await axios.get(API_BASE_URL);
  return res.data;
}

export async function createEmployee(data: Omit<Employee, 'id'>): Promise<Employee> {
  const res = await axios.post(API_BASE_URL, data);
  return res.data;
}

export async function updateEmployee(data: Employee): Promise<Employee> {
  const res = await axios.put(`${API_BASE_URL}/${data.id}`, data);
  return res.data;
}

export async function deleteEmployee(id: string): Promise<void> {
  await axios.delete(`${API_BASE_URL}/${id}`);
}
