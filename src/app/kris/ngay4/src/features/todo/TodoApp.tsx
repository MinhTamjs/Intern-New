import React from 'react';
import TodoForm from './TodoForm';
import TodoList from './TodoList';
import TodoFilter from '../filter/TodoFilter';

/**
 * Component tổng hợp: bao gồm form nhập, filter và danh sách công việc.
 */
const TodoApp: React.FC = () => {
  return (
    <div style={{ maxWidth: 480, margin: '40px auto', padding: 24, border: '1px solid #ddd', borderRadius: 8, background: '#fff' }}>
      <h2 style={{ textAlign: 'center' }}>Quản lý công việc</h2>
      {/* Form thêm công việc mới */}
      <TodoForm />
      {/* Bộ lọc trạng thái công việc */}
      <TodoFilter />
      {/* Danh sách công việc */}
      <TodoList />
    </div>
  );
};

export default TodoApp; 