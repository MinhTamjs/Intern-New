import React, { useState, useEffect } from 'react';
import { Todo, TodoFilter } from '../types/Todo';
import { TodoManager } from '../services/TodoManager';
import TodoForm from './TodoForm';
import TodoFilterComponent from './TodoFilter';
import TodoList from './TodoList';

// Component chính của ứng dụng Todo
const TodoApp: React.FC = () => {
  // State để quản lý todos và filter
  const [todos, setTodos] = useState<Todo[]>([]);
  const [currentFilter, setCurrentFilter] = useState<TodoFilter>('all');
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);

  // Khởi tạo TodoManager
  const todoManager = new TodoManager();

  // Effect để subscribe vào thay đổi của todos
  useEffect(() => {
    const unsubscribe = todoManager.subscribe((newTodos) => {
      setTodos(newTodos);
    });

    // Cleanup function
    return unsubscribe;
  }, []);

  // Effect để lọc todos khi todos hoặc filter thay đổi
  useEffect(() => {
    const filtered = todoManager.getTodos(currentFilter);
    setFilteredTodos(filtered);
  }, [todos, currentFilter]);

  /**
   * Xử lý khi thêm todo mới
   * @param title - Tiêu đề todo
   * @param description - Mô tả todo (tùy chọn)
   */
  const handleAddTodo = (title: string, description?: string): void => {
    todoManager.addTodo({ title, description });
  };

  /**
   * Xử lý khi toggle trạng thái todo
   * @param id - ID của todo
   */
  const handleToggleTodo = (id: string): void => {
    todoManager.toggleTodo(id);
  };

  /**
   * Xử lý khi cập nhật todo
   * @param id - ID của todo
   * @param updates - Dữ liệu cập nhật
   */
  const handleUpdateTodo = (id: string, updates: Partial<Todo>): void => {
    todoManager.updateTodo({ id, updates });
  };

  /**
   * Xử lý khi xóa todo
   * @param id - ID của todo
   */
  const handleDeleteTodo = (id: string): void => {
    todoManager.deleteTodo(id);
  };

  /**
   * Xử lý khi thay đổi filter
   * @param filter - Loại filter mới
   */
  const handleFilterChange = (filter: TodoFilter): void => {
    setCurrentFilter(filter);
  };

  /**
   * Xử lý khi đánh dấu tất cả hoàn thành
   */
  const handleMarkAllCompleted = (): void => {
    const updatedCount = todoManager.markAllCompleted();
    if (updatedCount > 0) {
      alert(`Đã đánh dấu ${updatedCount} công việc là hoàn thành!`);
    }
  };

  /**
   * Xử lý khi xóa tất cả đã hoàn thành
   */
  const handleClearCompleted = (): void => {
    const deletedCount = todoManager.clearCompleted();
    if (deletedCount > 0) {
      alert(`Đã xóa ${deletedCount} công việc đã hoàn thành!`);
    }
  };

  // Lấy thống kê
  const stats = todoManager.getStats();

  return (
    <div className="todo-app">
      {/* Header */}
      <header className="app-header">
        <h1 className="app-title">📋 Quản Lý Công Việc</h1>
        <p className="app-subtitle">
          Tổ chức và theo dõi các công việc của bạn một cách hiệu quả
        </p>
      </header>

      {/* Main content */}
      <main className="app-main">
        {/* Form thêm todo */}
        <TodoForm onAddTodo={handleAddTodo} />

        {/* Filter và thống kê */}
        <TodoFilterComponent
          currentFilter={currentFilter}
          stats={stats}
          onFilterChange={handleFilterChange}
          onMarkAllCompleted={handleMarkAllCompleted}
          onClearCompleted={handleClearCompleted}
        />

        {/* Danh sách todos */}
        <TodoList
          todos={filteredTodos}
          onToggle={handleToggleTodo}
          onUpdate={handleUpdateTodo}
          onDelete={handleDeleteTodo}
        />
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p className="footer-text">
          💾 Dữ liệu được lưu tự động vào localStorage
        </p>
      </footer>
    </div>
  );
};

export default TodoApp; 