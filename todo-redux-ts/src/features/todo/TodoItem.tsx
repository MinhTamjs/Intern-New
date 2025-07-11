import React, { useState } from 'react';
import { useAppDispatch } from '../../hooks/redux';
import { toggleTodo, deleteTodo, updateTodo } from '../../store/todoSlice';
import { Todo } from '../../types/todo';

interface TodoItemProps {
  todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');

  // Xử lý toggle trạng thái hoàn thành
  const handleToggle = () => {
    dispatch(toggleTodo(todo.id));
  };

  // Xử lý xóa todo
  const handleDelete = () => {
    dispatch(deleteTodo(todo.id));
  };

  // Xử lý bắt đầu edit
  const handleEdit = () => {
    setIsEditing(true);
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
  };

  // Xử lý lưu edit
  const handleSave = () => {
    if (editTitle.trim()) {
      dispatch(updateTodo({
        id: todo.id,
        title: editTitle.trim(),
        description: editDescription.trim() || undefined
      }));
      setIsEditing(false);
    }
  };

  // Xử lý hủy edit
  const handleCancel = () => {
    setIsEditing(false);
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
  };

  // Format ngày tạo
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isEditing) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-3 shadow-sm">
        <div className="space-y-3">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tiêu đề công việc"
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Mô tả (tùy chọn)"
            rows={2}
          />
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
              Lưu
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white border rounded-lg p-4 mb-3 shadow-sm transition-all ${
      todo.completed 
        ? 'border-green-200 bg-green-50' 
        : 'border-gray-200'
    }`}>
      <div className="flex items-start space-x-3">
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggle}
          className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        
        {/* Nội dung todo */}
        <div className="flex-1 min-w-0">
          <h3 className={`text-lg font-medium ${
            todo.completed ? 'line-through text-gray-500' : 'text-gray-900'
          }`}>
            {todo.title}
          </h3>
          
          {todo.description && (
            <p className={`mt-1 text-sm ${
              todo.completed ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {todo.description}
            </p>
          )}
          
          <p className="text-xs text-gray-400 mt-2">
            Tạo lúc: {formatDate(todo.createdAt)}
          </p>
        </div>

        {/* Các nút hành động */}
        <div className="flex space-x-2">
          <button
            onClick={handleEdit}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            title="Chỉnh sửa"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          
          <button
            onClick={handleDelete}
            className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
            title="Xóa"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoItem; 