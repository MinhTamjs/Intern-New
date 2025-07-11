import { Todo } from '../types/Todo';

// Service để quản lý việc lưu trữ dữ liệu vào localStorage
export class TodoStorageService {
  private static readonly STORAGE_KEY = 'todos';

  /**
   * Lưu danh sách todos vào localStorage
   * @param todos - Danh sách todos cần lưu
   */
  static saveTodos(todos: Todo[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(todos));
    } catch (error) {
      console.error('Lỗi khi lưu vào localStorage:', error);
    }
  }

  /**
   * Đọc danh sách todos từ localStorage
   * @returns Danh sách todos hoặc mảng rỗng nếu không có dữ liệu
   */
  static loadTodos(): Todo[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const todos = JSON.parse(stored);
        // Chuyển đổi string dates thành Date objects
        return todos.map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt),
          updatedAt: new Date(todo.updatedAt)
        }));
      }
    } catch (error) {
      console.error('Lỗi khi đọc từ localStorage:', error);
    }
    return [];
  }

  /**
   * Xóa tất cả dữ liệu todos khỏi localStorage
   */
  static clearTodos(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Lỗi khi xóa dữ liệu từ localStorage:', error);
    }
  }

  /**
   * Kiểm tra xem localStorage có khả dụng không
   * @returns true nếu localStorage khả dụng
   */
  static isAvailable(): boolean {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }
} 