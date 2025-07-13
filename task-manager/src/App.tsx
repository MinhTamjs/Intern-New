import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from './store';
import { add, update, remove, toggle } from './store';
import './App.css';

type Priority = 'high' | 'medium' | 'low';

const defaultForm = {
  title: '',
  priority: 'medium' as Priority,
  startDate: '',
  endDate: '',
  note: '',
};

const App: React.FC = () => {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const dispatch = useDispatch<AppDispatch>();

  const [form, setForm] = useState(defaultForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | Priority>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'incomplete'>('all');
  const [search, setSearch] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddOrUpdate = () => {
    if (!form.title || !form.startDate || !form.endDate) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    if (editingId) {
      dispatch(update({ id: editingId, completed: false, ...form }));
    } else {
      dispatch(add(form));
    }

    setForm(defaultForm);
    setEditingId(null);
  };

  const handleEdit = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    setForm({
      title: task.title,
      priority: task.priority,
      startDate: task.startDate,
      endDate: task.endDate,
      note: task.note ?? '',
    });

    setEditingId(id);
  };

  const filteredTasks = tasks.filter(task =>
    (filter === 'all' || task.priority === filter) &&
    (statusFilter === 'all' ||
      (statusFilter === 'completed' && task.completed) ||
      (statusFilter === 'incomplete' && !task.completed)) &&
    task.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app-wrapper">
      <div className="container">
        <h2>Quản Lý Công Việc</h2>

        <div className="task-form">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Tên công việc"
          />
          <select name="priority" value={form.priority} onChange={handleChange}>
            <option value="high">Cao</option>
            <option value="medium">Trung bình</option>
            <option value="low">Thấp</option>
          </select>
          <input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
          />
          <input
            type="date"
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
          />
          <textarea
            name="note"
            value={form.note}
            onChange={handleChange}
            placeholder="Ghi chú"
          />
          <button onClick={handleAddOrUpdate}>
            {editingId ? 'Lưu' : 'Thêm công việc'}
          </button>
        </div>

        <div className="task-filter">
          <label>Lọc theo độ ưu tiên: </label>
          <select value={filter} onChange={e => setFilter(e.target.value as Priority | 'all')}>
            <option value="all">Tất cả</option>
            <option value="high">Cao</option>
            <option value="medium">Trung bình</option>
            <option value="low">Thấp</option>
          </select>
        </div>

        <div className="task-filter">
          <label>Lọc theo trạng thái: </label>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as 'all' | 'completed' | 'incomplete')}
          >
            <option value="all">Tất cả</option>
            <option value="completed">Đã hoàn thành</option>
            <option value="incomplete">Chưa hoàn thành</option>
          </select>
        </div>

        <input
          placeholder="Tìm kiếm theo tên..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', marginBottom: '1rem', padding: '8px' }}
        />

        <ul className="task-list">
          {filteredTasks.map(task => (
            <li key={task.id} className={`task-item ${task.priority}`}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  checked={!!task.completed}
                  onChange={() => dispatch(toggle(task.id))}
                />
                <strong style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                  {task.title}
                </strong>
              </label>
              <em> ({task.priority})</em>
              <div>Bắt đầu: {task.startDate}</div>
              <div>Kết thúc: {task.endDate}</div>
              <div>Ghi chú: {task.note || 'Không có'}</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button onClick={() => handleEdit(task.id)}>Sửa</button>
                <button onClick={() => dispatch(remove(task.id))}>Xoá</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
