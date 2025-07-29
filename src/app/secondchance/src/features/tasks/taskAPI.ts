import { api } from '../../lib/api';
import type { Task, CreateTaskData, UpdateTaskData } from './types';

export const taskAPI = {
  async getAll(): Promise<Task[]> {
    return api.tasks.getAll();
  },

  async getByAssignee(assigneeId: string): Promise<Task[]> {
    return api.tasks.getByAssignee(assigneeId);
  },

  async create(data: CreateTaskData): Promise<Task> {
    return api.tasks.create(data);
  },

  async update(id: string, data: UpdateTaskData): Promise<Task> {
    return api.tasks.update(id, data);
  },

  async delete(id: string): Promise<void> {
    return api.tasks.delete(id);
  }
}; 