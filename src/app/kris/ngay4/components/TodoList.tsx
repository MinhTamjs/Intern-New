import React from 'react';
import { Todo } from '../types/Todo';
import TodoItem from './TodoItem';

// Props interface cho TodoList component
interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Todo>) => void;
  onDelete: (id: string) => void;
}

// Component hiển thị danh sách todos
const TodoList: React.FC<TodoListProps> = ({ todos, onToggle, onUpdate, onDelete }) => {
  // Nếu không có todo nào
  if (todos.length === 0) {
    return (
      <div className="todo-list-empty">
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h3 className="empty-title">Chưa có công việc nào</h3>
          <p className="empty-description">
            Hãy thêm công việc đầu tiên của bạn để bắt đầu quản lý!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="todo-list-container">
      <div className="todo-list">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={onToggle}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))}
      </div>
      
      {/* Hiển thị số lượng todo đang hiển thị */}
      <div className="todo-list-info">
        <span className="todo-count">
          Hiển thị {todos.length} công việc
        </span>
      </div>
    </div>
  );
};

export default TodoList; 