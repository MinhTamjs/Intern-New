import React, { useState } from 'react';
import { Todo } from '../types/Todo';
import { formatDate, getRelativeTime } from '../utils/dateUtils';

// Props interface cho TodoItem component
interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Todo>) => void;
  onDelete: (id: string) => void;
}

// Component hiển thị và quản lý từng todo item
const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onUpdate, onDelete }) => {
  // State để quản lý chế độ chỉnh sửa
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');

  /**
   * Xử lý khi người dùng toggle trạng thái hoàn thành
   */
  const handleToggle = (): void => {
    onToggle(todo.id);
  };

  /**
   * Xử lý khi người dùng xóa todo
   */
  const handleDelete = (): void => {
    if (confirm('Bạn có chắc chắn muốn xóa công việc này?')) {
      onDelete(todo.id);
    }
  };

  /**
   * Xử lý khi người dùng bắt đầu chỉnh sửa
   */
  const handleEdit = (): void => {
    setIsEditing(true);
  };

  /**
   * Xử lý khi người dùng lưu thay đổi
   */
  const handleSave = (): void => {
    if (editTitle.trim()) {
      onUpdate(todo.id, {
        title: editTitle.trim(),
        description: editDescription.trim() || undefined
      });
      setIsEditing(false);
    } else {
      alert('Tiêu đề không được để trống!');
    }
  };

  /**
   * Xử lý khi người dùng hủy chỉnh sửa
   */
  const handleCancel = (): void => {
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    setIsEditing(false);
  };

  // Render form chỉnh sửa
  if (isEditing) {
    return (
      <div className="todo-item-editing">
        <div className="edit-form">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Tiêu đề công việc"
            className="edit-title-input"
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="Mô tả (tùy chọn)"
            className="edit-description-input"
            rows={3}
          />
          <div className="edit-actions">
            <button onClick={handleSave} className="save-btn">
              Lưu
            </button>
            <button onClick={handleCancel} className="cancel-btn">
              Hủy
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render todo item bình thường
  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div className="todo-content">
        {/* Checkbox để toggle trạng thái */}
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggle}
          className="todo-checkbox"
        />
        
        {/* Thông tin todo */}
        <div className="todo-info">
          <h3 className={`todo-title ${todo.completed ? 'completed' : ''}`}>
            {todo.title}
          </h3>
          
          {todo.description && (
            <p className={`todo-description ${todo.completed ? 'completed' : ''}`}>
              {todo.description}
            </p>
          )}
          
          {/* Thông tin thời gian */}
          <div className="todo-timestamps">
            <span className="created-time">
              Tạo: {getRelativeTime(todo.createdAt)}
            </span>
            {todo.updatedAt.getTime() !== todo.createdAt.getTime() && (
              <span className="updated-time">
                Cập nhật: {getRelativeTime(todo.updatedAt)}
              </span>
            )}
          </div>
        </div>
        
        {/* Các nút hành động */}
        <div className="todo-actions">
          <button onClick={handleEdit} className="edit-btn" title="Chỉnh sửa">
            ✏️
          </button>
          <button onClick={handleDelete} className="delete-btn" title="Xóa">
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoItem; 