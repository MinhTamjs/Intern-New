import React from 'react';
import { useAppSelector } from '../../hooks/redux';
import { selectFilteredTodos } from '../../store/todoSlice';
import TodoItem from './TodoItem';

const TodoList: React.FC = () => {
  const filteredTodos = useAppSelector(selectFilteredTodos);

  // Sắp xếp todos theo priority và thời gian tạo
  const sortedTodos = [...filteredTodos].sort((a, b) => {
    // Sắp xếp theo priority trước
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
    
    if (priorityDiff !== 0) {
      return priorityDiff;
    }
    
    // Nếu cùng priority thì sắp xếp theo thời gian tạo (mới nhất trước)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  if (sortedTodos.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-600 mb-2">
          Không có công việc nào
        </h3>
        <p className="text-gray-500">
          Hãy thêm công việc mới để bắt đầu quản lý!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sortedTodos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
};

export default TodoList; 