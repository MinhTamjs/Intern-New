import { Todo, AddTodoPayload, UpdateTodoPayload, TodoFilter } from '../types/Todo';
import { TodoStorageService } from './TodoStorageService';

// Manager để quản lý tất cả logic nghiệp vụ của ứng dụng Todo
export class TodoManager {
  private todos: Todo[] = [];
  private listeners: ((todos: Todo[]) => void)[] = [];

  constructor() {
    // Khởi tạo dữ liệu từ localStorage khi tạo instance
    this.loadTodos();
  }

  /**
   * Thêm listener để lắng nghe thay đổi trong danh sách todos
   * @param listener - Callback function được gọi khi có thay đổi
   */
  subscribe(listener: (todos: Todo[]) => void): () => void {
    this.listeners.push(listener);
    // Trả về function để unsubscribe
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Thông báo cho tất cả listeners về thay đổi
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener([...this.todos]));
  }

  /**
   * Tạo ID duy nhất cho todo mới
   * @returns ID duy nhất
   */
  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Lưu todos vào localStorage và thông báo listeners
   */
  private saveAndNotify(): void {
    TodoStorageService.saveTodos(this.todos);
    this.notifyListeners();
  }

  /**
   * Load todos từ localStorage
   */
  private loadTodos(): void {
    this.todos = TodoStorageService.loadTodos();
  }

  /**
   * Thêm todo mới
   * @param payload - Dữ liệu todo mới
   * @returns Todo đã được tạo
   */
  addTodo(payload: AddTodoPayload): Todo {
    const newTodo: Todo = {
      id: this.generateId(),
      title: payload.title.trim(),
      description: payload.description?.trim(),
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.todos.push(newTodo);
    this.saveAndNotify();
    return newTodo;
  }

  /**
   * Cập nhật trạng thái hoàn thành của todo
   * @param id - ID của todo cần cập nhật
   * @returns true nếu cập nhật thành công
   */
  toggleTodo(id: string): boolean {
    const todo = this.todos.find(t => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      todo.updatedAt = new Date();
      this.saveAndNotify();
      return true;
    }
    return false;
  }

  /**
   * Cập nhật thông tin todo
   * @param payload - Dữ liệu cập nhật
   * @returns true nếu cập nhật thành công
   */
  updateTodo(payload: UpdateTodoPayload): boolean {
    const todo = this.todos.find(t => t.id === payload.id);
    if (todo) {
      Object.assign(todo, payload.updates);
      todo.updatedAt = new Date();
      this.saveAndNotify();
      return true;
    }
    return false;
  }

  /**
   * Xóa todo
   * @param id - ID của todo cần xóa
   * @returns true nếu xóa thành công
   */
  deleteTodo(id: string): boolean {
    const initialLength = this.todos.length;
    this.todos = this.todos.filter(todo => todo.id !== id);
    
    if (this.todos.length !== initialLength) {
      this.saveAndNotify();
      return true;
    }
    return false;
  }

  /**
   * Lấy danh sách todos theo filter
   * @param filter - Loại filter
   * @returns Danh sách todos đã được lọc
   */
  getTodos(filter: TodoFilter = 'all'): Todo[] {
    switch (filter) {
      case 'completed':
        return this.todos.filter(todo => todo.completed);
      case 'active':
        return this.todos.filter(todo => !todo.completed);
      default:
        return [...this.todos];
    }
  }

  /**
   * Lấy tất cả todos
   * @returns Danh sách tất cả todos
   */
  getAllTodos(): Todo[] {
    return [...this.todos];
  }

  /**
   * Đánh dấu tất cả todos là hoàn thành
   * @returns Số lượng todos đã được cập nhật
   */
  markAllCompleted(): number {
    let updatedCount = 0;
    this.todos.forEach(todo => {
      if (!todo.completed) {
        todo.completed = true;
        todo.updatedAt = new Date();
        updatedCount++;
      }
    });

    if (updatedCount > 0) {
      this.saveAndNotify();
    }
    return updatedCount;
  }

  /**
   * Xóa tất cả todos đã hoàn thành
   * @returns Số lượng todos đã được xóa
   */
  clearCompleted(): number {
    const initialLength = this.todos.length;
    this.todos = this.todos.filter(todo => !todo.completed);
    const deletedCount = initialLength - this.todos.length;

    if (deletedCount > 0) {
      this.saveAndNotify();
    }
    return deletedCount;
  }

  /**
   * Lấy thống kê
   * @returns Object chứa thống kê
   */
  getStats(): { total: number; completed: number; active: number } {
    const total = this.todos.length;
    const completed = this.todos.filter(todo => todo.completed).length;
    const active = total - completed;

    return { total, completed, active };
  }

  /**
   * Xóa tất cả todos
   */
  clearAll(): void {
    this.todos = [];
    this.saveAndNotify();
  }
} 