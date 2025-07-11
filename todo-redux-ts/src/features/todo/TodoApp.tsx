import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { loadTodos, selectAllTodos } from '../../store/todoSlice';
import TodoForm from './TodoForm';
import TodoFilter from './TodoFilter';
import TodoList from './TodoList';

const TodoApp: React.FC = () => {
  const dispatch = useAppDispatch();
  const todos = useAppSelector(selectAllTodos);

  // Load todos từ localStorage khi component mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      try {
        const parsedTodos = JSON.parse(savedTodos);
        dispatch(loadTodos(parsedTodos));
      } catch (error) {
        console.error('Lỗi khi load todos từ localStorage:', error);
      }
    }
  }, [dispatch]);

  // Lưu todos vào localStorage khi todos thay đổi
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Quản Lý Công Việc
        </h1>
        <p className="text-gray-600">
          Tổ chức và theo dõi công việc của bạn một cách hiệu quả
        </p>
      </div>

      {/* Form thêm todo */}
      <TodoForm />

      {/* Filter và thống kê */}
      <TodoFilter />

      {/* Danh sách todos */}
      <TodoList />
    </div>
  );
};

export default TodoApp; 