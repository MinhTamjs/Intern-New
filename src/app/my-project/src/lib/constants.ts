import { API_BASE_URL } from '../lib/api';

export const TASK_STATUSES = [
  { id: 'pending', name: 'Pending', color: 'bg-yellow-100' },
  { id: 'in-progress', name: 'In Progress', color: 'bg-blue-100' },
  { id: 'in-review', name: 'In Review', color: 'bg-purple-100' },
  { id: 'done', name: 'Done', color: 'bg-green-100' },
] as const;

export type TaskStatus = typeof TASK_STATUSES[number]['id']; // "pending" | "in-progress" | "in-review" | "done"

export const DEFAULT_EMPLOYEE_AVATAR = 'https://i.pravatar.cc/150?img=12';

export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  EMPLOYEE: 'employee',
} as const;
