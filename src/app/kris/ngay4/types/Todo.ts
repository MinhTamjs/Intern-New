// Định nghĩa kiểu dữ liệu cho một công việc
export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Định nghĩa kiểu dữ liệu cho trạng thái filter
export type TodoFilter = 'all' | 'completed' | 'active';

// Định nghĩa kiểu dữ liệu cho payload khi thêm todo mới
export interface AddTodoPayload {
  title: string;
  description?: string;
}

// Định nghĩa kiểu dữ liệu cho payload khi cập nhật todo
export interface UpdateTodoPayload {
  id: string;
  updates: Partial<Omit<Todo, 'id' | 'createdAt'>>;
}

// Định nghĩa kiểu dữ liệu cho trạng thái ứng dụng
export interface AppState {
  todos: Todo[];
  filter: TodoFilter;
  loading: boolean;
  error: string | null;
} 