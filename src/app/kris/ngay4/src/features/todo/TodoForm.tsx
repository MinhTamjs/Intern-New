import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTodo } from './todoSlice';
import { AppDispatch } from '../../store/store';

/**
 * Form nhập liệu để thêm công việc mới vào danh sách.
 * Cho phép nhập nội dung, ngày bắt đầu, ngày kết thúc.
 */
const TodoForm: React.FC = () => {
  // State cho các trường nhập liệu
  const [text, setText] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const dispatch = useDispatch<AppDispatch>();

  // Xử lý submit form: gửi action addTodo
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && startDate && endDate) {
      dispatch(addTodo({ text, startDate, endDate }));
      setText('');
      setStartDate('');
      setEndDate('');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
      {/* Nhập nội dung công việc */}
      <input
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Thêm công việc mới..."
        style={{ flex: 2, minWidth: 120 }}
        required
      />
      {/* Nhập ngày bắt đầu */}
      <input
        type="date"
        value={startDate}
        onChange={e => setStartDate(e.target.value)}
        style={{ flex: 1, minWidth: 120 }}
        required
        title="Ngày bắt đầu"
      />
      {/* Nhập ngày kết thúc */}
      <input
        type="date"
        value={endDate}
        onChange={e => setEndDate(e.target.value)}
        style={{ flex: 1, minWidth: 120 }}
        required
        title="Ngày kết thúc"
      />
      {/* Nút thêm công việc */}
      <button type="submit" style={{ flex: 1, minWidth: 80 }}>Thêm</button>
    </form>
  );
};

export default TodoForm; 