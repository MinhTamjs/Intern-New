import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { toggleTodo, removeTodo, updateTodoDate } from './todoSlice';
import TodoItem from './TodoItem';
import { FilterType } from '../filter/filterSlice';

/**
 * Hiển thị danh sách công việc, lọc theo trạng thái và cho phép cập nhật/xóa từng công việc.
 * Đã loại bỏ chức năng xóa tất cả công việc hoàn thành và chọn công việc hoàn thành để xóa.
 */
const TodoList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const todos = useSelector((state: RootState) => state.todo.todos);
  const filter = useSelector((state: RootState) => state.filter.filter);

  // Lọc công việc theo trạng thái filter
  const filteredTodos = todos.filter(todo => {
    if (filter === 'all') return true;
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  // Cập nhật ngày bắt đầu/kết thúc cho một công việc
  const handleUpdateDate = (id: string, startDate: string, endDate: string) => {
    dispatch(updateTodoDate({ id, startDate, endDate }));
  };

  return (
    <div>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {filteredTodos.map(todo => (
          <li key={todo.id} style={{ display: 'flex', alignItems: 'center' }}>
            <TodoItem
              todo={todo}
              onToggle={id => dispatch(toggleTodo(id))}
              onRemove={id => dispatch(removeTodo(id))}
              onUpdateDate={handleUpdateDate}
            />
          </li>
        ))}
        {filteredTodos.length === 0 && <li>Không có công việc nào.</li>}
      </ul>
    </div>
  );
};

export default TodoList; 