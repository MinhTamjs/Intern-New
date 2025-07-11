import React from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { setFilter, selectFilter, selectAllTodos } from '../../store/todoSlice';
import type { TodoFilter } from '../../types/todo';

const TodoFilter: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentFilter = useAppSelector(selectFilter);
  const allTodos = useAppSelector(selectAllTodos);

  // Tính toán số lượng todos theo từng trạng thái
  const totalTodos = allTodos.length;
  const completedTodos = allTodos.filter(todo => todo.completed).length;
  const activeTodos = totalTodos - completedTodos;

  // Xử lý thay đổi filter
  const handleFilterChange = (filter: TodoFilter) => {
    dispatch(setFilter(filter));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        {/* Thống kê */}
        <div className="flex space-x-4 text-sm text-gray-600">
          <span>Tổng cộng: <strong>{totalTodos}</strong></span>
          <span>Đang làm: <strong className="text-blue-600">{activeTodos}</strong></span>
          <span>Hoàn thành: <strong className="text-green-600">{completedTodos}</strong></span>
        </div>

        {/* Các nút filter */}
        <div className="flex space-x-2">
          <button
            onClick={() => handleFilterChange('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              currentFilter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tất cả
          </button>
          
          <button
            onClick={() => handleFilterChange('active')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              currentFilter === 'active'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Đang làm
          </button>
          
          <button
            onClick={() => handleFilterChange('completed')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              currentFilter === 'completed'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Hoàn thành
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoFilter; 