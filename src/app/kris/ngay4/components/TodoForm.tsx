import React, { useState } from 'react';

// Props interface cho TodoForm component
interface TodoFormProps {
  onAddTodo: (title: string, description?: string) => void;
}

// Component form để thêm todo mới
const TodoForm: React.FC<TodoFormProps> = ({ onAddTodo }) => {
  // State để quản lý form input
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  /**
   * Xử lý khi người dùng submit form
   * @param e - Form event
   */
  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    
    // Validate input
    if (!title.trim()) {
      alert('Vui lòng nhập tiêu đề công việc!');
      return;
    }

    // Gọi callback để thêm todo
    onAddTodo(title.trim(), description.trim() || undefined);
    
    // Reset form
    setTitle('');
    setDescription('');
  };

  /**
   * Xử lý khi người dùng nhấn Enter trong input title
   * @param e - Keyboard event
   */
  const handleTitleKeyPress = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <div className="todo-form-container">
      <h2 className="form-title">Thêm Công Việc Mới</h2>
      
      <form onSubmit={handleSubmit} className="todo-form">
        {/* Input tiêu đề */}
        <div className="form-group">
          <label htmlFor="title" className="form-label">
            Tiêu đề <span className="required">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyPress={handleTitleKeyPress}
            placeholder="Nhập tiêu đề công việc..."
            className="form-input title-input"
            required
          />
        </div>

        {/* Input mô tả */}
        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Mô tả <span className="optional">(tùy chọn)</span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Nhập mô tả chi tiết..."
            className="form-input description-input"
            rows={3}
          />
        </div>

        {/* Nút submit */}
        <button type="submit" className="submit-btn">
          ➕ Thêm Công Việc
        </button>
      </form>
    </div>
  );
};

export default TodoForm; 