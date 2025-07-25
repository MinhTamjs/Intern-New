// Đã xóa import thừa Task, Employee vì không dùng trong file này

/**
 * Hàm tiện ích trả về base URL cho một collection (ví dụ: 'tasks' -> '/api/tasks')
 * @param collectionName Tên collection (ví dụ: 'tasks', 'users', ...)
 * @returns Đường dẫn base URL cho collection
 */
export function getBaseURL(collectionName: string): string {
  return `/api/${collectionName}`;
}
