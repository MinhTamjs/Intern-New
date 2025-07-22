// src/App.tsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchTasksAsync,
  addTaskAsync,
  updateTaskAsync,
  deleteTaskAsync,
  type Task,
} from './slice';
import type { RootState, AppDispatch } from './store';

const defaultForm: Omit<Task, '_id'> = {
  title: '',
  completed: false,
  priority: 'medium',
  startDate: '',
  endDate: '',
  note: '',
};

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, status, error } = useSelector((state: RootState) => state.tasks);

  const [form, setForm] = useState<Omit<Task, '_id'>>(defaultForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchTasksAsync());
  }, [dispatch]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? (e.target instanceof HTMLInputElement ? e.target.checked : false)
          : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      dispatch(updateTaskAsync({ ...form, _id: editingId }));
      setEditingId(null);
    } else {
      dispatch(addTaskAsync(form));
    }
    setForm(defaultForm);
  };

  const handleEdit = (task: Task) => {
    setEditingId(task._id!);
    setForm({
      title: task.title,
      completed: task.completed,
      priority: task.priority,
      startDate: task.startDate,
      endDate: task.endDate,
      note: task.note || '',
    });
  };

  const handleDelete = (_id: string) => {
    dispatch(deleteTaskAsync(_id));
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h1>Quản lý công việc</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input
          name="title"
          placeholder="Tiêu đề"
          value={form.title}
          onChange={handleChange}
          required
        />
        <select name="priority" value={form.priority} onChange={handleChange}>
          <option value="high">Cao</option>
          <option value="medium">Trung bình</option>
          <option value="low">Thấp</option>
        </select>
        <label>
          Bắt đầu:
          <input type="date" name="startDate" value={form.startDate} onChange={handleChange} />
        </label>
        <label>
          Kết thúc:
          <input type="date" name="endDate" value={form.endDate} onChange={handleChange} />
        </label>
        <label>
          <input
            type="checkbox"
            name="completed"
            checked={form.completed}
            onChange={handleChange}
          />
          Hoàn thành
        </label>
        <textarea
          name="note"
          placeholder="Ghi chú"
          value={form.note}
          onChange={handleChange}
        />
        <button type="submit">{editingId ? 'Lưu' : 'Thêm'}</button>
        {editingId && <button onClick={() => setEditingId(null)}>Huỷ</button>}
      </form>

      {status === 'loading' && <p>Đang tải...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {tasks.map(task => (
        <div key={task._id} className={`task-card ${task.completed ? 'completed' : ''} ${task.priority}`}>


          <h3>{task.title}</h3>
          <p>Ưu tiên: {task.priority}</p>
          <p>
            Từ {task.startDate} đến {task.endDate}
          </p>
          <p>{task.note}</p>
          <label>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() =>
                dispatch(updateTaskAsync({ ...task, completed: !task.completed }))
              }
            />
            {task.completed ? '✅ Đã hoàn thành' : '❌ Chưa xong'}
          </label>

          <button onClick={() => handleEdit(task)}>Sửa</button>
          <button onClick={() => handleDelete(task._id!)}>Xoá</button>
        </div>
      ))}
    </div>
  );
}

export default App;
