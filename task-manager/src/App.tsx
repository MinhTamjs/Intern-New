import React, { useState, useMemo, type ChangeEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from './store';
import { update, remove, toggle, addTaskAsync } from './store'; // Sửa import ở đây
import './App.css';

type Priority = 'high' | 'medium' | 'low';
type Status = 'all' | 'completed' | 'incomplete';
type Filter = 'all' | Priority;

const defaultForm = {
  title: '',
  priority: 'medium' as Priority,
  startDate: '',
  endDate: '',
  note: '',
};

const App: React.FC = () => {
  // Lấy cả tasks, status và error từ store
  const { tasks, status, error } = useSelector((s: RootState) => s.tasks);
  const dispatch = useDispatch<AppDispatch>();

  const [form, setForm] = useState(defaultForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<Filter>('all');
  const [statusFilter, setStatusFilter] = useState<Status>('all');
  const [search, setSearch] = useState('');

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Đổi hàm saveTask thành async
  const saveTask = async () => {
    const { title, startDate, endDate } = form;
    if (!title || !startDate || !endDate) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    if (editingId) {
      // Đối với việc cập nhật, vẫn dùng action update thông thường
      dispatch(update({ id: editingId, completed: false, ...form }));
    } else {
      // Dòng này đã được sửa để dispatch addTaskAsync
      await dispatch(addTaskAsync(form));
    }

    setForm(defaultForm);
    setEditingId(null);
  };

  const editTask = (id: string) => {
    const t = tasks.find(x => x.id === id);
    if (!t) return;
    setForm({ ...t, note: t.note ?? '' });
    setEditingId(id);
  };

  const filteredTasks = useMemo(
    () =>
      tasks.filter(
        t =>
          (priorityFilter === 'all' || t.priority === priorityFilter) &&
          (statusFilter === 'all' ||
            (statusFilter === 'completed' && t.completed) ||
            (statusFilter === 'incomplete' && !t.completed)) &&
          t.title.toLowerCase().includes(search.toLowerCase()),
      ),
    [tasks, priorityFilter, statusFilter, search],
  );

  return (
    <div className="app-wrapper">
      <div className="container">
        <h2>Quản Lý Công Việc</h2>

        {/* Form */}
        <div className="task-form">
          <input name="title" value={form.title} onChange={onChange} placeholder="Tên công việc" />
          <select name="priority" value={form.priority} onChange={onChange}>
            {(['high', 'medium', 'low'] as Priority[]).map(p => (
              <option key={p} value={p}>
                {p === 'high' ? 'Cao' : p === 'medium' ? 'Trung bình' : 'Thấp'}
              </option>
            ))}
          </select>
          <input type="date" name="startDate" value={form.startDate} onChange={onChange} />
          <input type="date" name="endDate" value={form.endDate} onChange={onChange} />
          <textarea name="note" value={form.note} onChange={onChange} placeholder="Ghi chú" />
          <button onClick={saveTask} disabled={status === 'loading'}>
            {status === 'loading' ? 'Đang thêm...' : (editingId ? 'Lưu' : 'Thêm công việc')}
          </button>
          {status === 'failed' && <p style={{ color: 'red' }}>Lỗi: {error}</p>}
        </div>

        {/* Filters */}
        <div className="task-filter">
          <label>Lọc theo độ ưu tiên: </label>
          <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value as Filter)}>
            <option value="all">Tất cả</option>
            <option value="high">Cao</option>
            <option value="medium">Trung bình</option>
            <option value="low">Thấp</option>
          </select>
        </div>

        <div className="task-filter">
          <label>Lọc theo trạng thái: </label>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as Status)}>
            <option value="all">Tất cả</option>
            <option value="completed">Đã hoàn thành</option>
            <option value="incomplete">Chưa hoàn thành</option>
          </select>
        </div>

        <input
          placeholder="Tìm kiếm theo tên..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', marginBottom: '1rem', padding: 8 }}
        />

        {/* Task list */}
        <ul className="task-list">
          {filteredTasks.map(t => (
            <li key={t.id} className={`task-item ${t.priority}`}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input type="checkbox" checked={!!t.completed} onChange={() => dispatch(toggle(t.id))} />
                <strong style={{ textDecoration: t.completed ? 'line-through' : 'none' }}>{t.title}</strong>
              </label>
              <em> ({t.priority})</em>
              <div>Bắt đầu: {t.startDate}</div>
              <div>Kết thúc: {t.endDate}</div>
              <div>Ghi chú: {t.note || 'Không có'}</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button onClick={() => editTask(t.id)}>Sửa</button>
                <button onClick={() => dispatch(remove(t.id))}>Xoá</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
