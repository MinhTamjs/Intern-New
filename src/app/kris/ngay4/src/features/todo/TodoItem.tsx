import React, { useState } from 'react';
import { Todo } from '../../types/Todo';

// Props cho component TodoItem
interface TodoItemProps {
  todo: Todo; // Dữ liệu công việc
  onToggle: (id: string) => void; // Hàm toggle trạng thái hoàn thành
  onRemove: (id: string) => void; // Hàm xóa công việc
  onUpdateDate?: (id: string, startDate: string, endDate: string) => void; // Hàm cập nhật ngày
}

/**
 * Hiển thị một công việc, cho phép sửa ngày bắt đầu/kết thúc, toggle hoàn thành và xóa.
 */
const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onRemove, onUpdateDate }) => {
  // State tạm thời cho input ngày
  const [startDate, setStartDate] = useState(todo.startDate);
  const [endDate, setEndDate] = useState(todo.endDate);

  // Khi blur hoặc Enter, cập nhật ngày nếu có thay đổi
  const handleUpdate = () => {
    if (onUpdateDate && (startDate !== todo.startDate || endDate !== todo.endDate)) {
      onUpdateDate(todo.id, startDate, endDate);
    }
  };

  // Khi nhấn Enter trên input ngày, blur để trigger cập nhật
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      (e.target as HTMLInputElement).blur();
    }
  };

  return (
    <li style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', borderBottom: '1px solid #eee', padding: '8px 0' }}>
      {/* Checkbox toggle hoàn thành */}
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      {/* Nội dung công việc */}
      <span style={{ textDecoration: todo.completed ? 'line-through' : 'none', flex: 2 }}>
        {todo.text}
      </span>
      {/* Ngày bắt đầu */}
      <input
        type="date"
        value={startDate}
        onChange={e => setStartDate(e.target.value)}
        onBlur={handleUpdate}
        onKeyDown={handleKeyDown}
        style={{ fontSize: 12, color: '#888', flex: 1 }}
        title="Bắt đầu"
      />
      {/* Ngày kết thúc */}
      <input
        type="date"
        value={endDate}
        onChange={e => setEndDate(e.target.value)}
        onBlur={handleUpdate}
        onKeyDown={handleKeyDown}
        style={{ fontSize: 12, color: '#888', flex: 1 }}
        title="Kết thúc"
      />
      {/* Nút xóa công việc */}
      <button onClick={() => {
        if (window.confirm('Bạn có chắc muốn xóa công việc này?')) {
          onRemove(todo.id);
        }
      }} style={{ flex: 0 }}>Xóa</button>
    </li>
  );
};

export default TodoItem; 