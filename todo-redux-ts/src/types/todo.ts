// Định nghĩa kiểu dữ liệu cho một công việc
export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: string; // ISO string để dễ lưu vào localStorage
  updatedAt: string;
}

// Kiểu filter cho danh sách công việc
export type TodoFilter = 'all' | 'completed' | 'active'; 