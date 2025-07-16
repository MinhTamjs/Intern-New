export type TaskStatus = 'completed' | 'incomplete';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
}
