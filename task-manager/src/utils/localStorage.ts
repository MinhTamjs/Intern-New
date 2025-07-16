// src/utils/localStorage.ts

// src/utils/localStorage.ts
import type { Task } from '../store'; // Import Task interface nếu cần cho type checking
 // Import Task interface nếu cần cho type checking

export const loadState = (): Task[] => {
  try {
    const serializedState = localStorage.getItem('tasks');
    if (serializedState === null) {
      return []; // Trả về mảng rỗng nếu không có dữ liệu
    }
    return JSON.parse(serializedState);
  } catch (error) {
    console.error("Lỗi khi tải state từ localStorage:", error);
    return []; // Trả về mảng rỗng trong trường hợp lỗi
  }
};

export const saveState = (tasks: Task[]): void => {
  try {
    const serializedState = JSON.stringify(tasks);
    localStorage.setItem('tasks', serializedState);
  } catch (error) {
    console.error("Lỗi khi lưu state vào localStorage:", error);
    // Có thể thêm logic xử lý lỗi khác ở đây, ví dụ: thông báo cho người dùng
  }
};