import { api } from '../../lib/api';
import type { Employee, CreateEmployeeData } from './types';

export const employeeAPI = {
  async getAll(): Promise<Employee[]> {
    return api.employees.getAll();
  },

  async create(data: CreateEmployeeData): Promise<Employee> {
    return api.employees.create(data);
  },

  async update(id: string, data: Partial<CreateEmployeeData>): Promise<Employee> {
    return api.employees.update(id, data);
  },

  async delete(id: string): Promise<void> {
    return api.employees.delete(id);
  }
}; 