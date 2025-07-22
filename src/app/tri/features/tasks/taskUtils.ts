import { Task } from "./taskTypes";

/**
 * Hàm tiện ích trả về base URL cho một collection (ví dụ: 'tasks' -> '/api/tasks')
 * @param collectionName Tên collection (ví dụ: 'tasks', 'users', ...)
 * @returns Đường dẫn base URL cho collection
 */
export function getBaseURL(collectionName: string): string {
  return `/api/${collectionName}`;
}
