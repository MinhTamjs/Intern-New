import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch, add, toggle, remove } from './store';

const App: React.FC = () => {
  const tasks = useSelector((state: RootState) => state.tasks);
  const dispatch = useDispatch<AppDispatch>();

  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [filter, setFilter] = useState<'all' | 'completed' | 'incomplete'>('all');

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'incomplete') return !task.completed;
    return true;
  });

  return (
    <div style={{ maxWidth: 500, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h2>📝 Quản Lý Công Việc</h2>
      <div style={{ marginBottom: '1rem' }}>
        <input
          placeholder="Tên công việc..."
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <select value={priority} onChange={e => setPriority(e.target.value as any)}>
          <option value="high">High 🔥</option>
          <option value="medium">Medium ⚖️</option>
          <option value="low">Low 🌱</option>
        </select>
        <button onClick={() => {
          if (title.trim()) {
            dispatch(add({ title, priority }));
            setTitle('');
          }
        }}>Thêm</button>
      </div>

      <select value={filter} onChange={e => setFilter(e.target.value as any)}>
        <option value="all">Tất cả</option>
        <option value="completed">Đã hoàn thành</option>
        <option value="incomplete">Chưa hoàn thành</option>
      </select>

      <ul>
        {filteredTasks.map(task => (
          <li key={task.id} style={{ margin: '0.5rem 0' }}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => dispatch(toggle(task.id))}
            />
            <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
              {task.title} ({task.priority})
            </span>
            <button onClick={() => dispatch(remove(task.id))} style={{ marginLeft: '1rem' }}>
              Xóa
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
