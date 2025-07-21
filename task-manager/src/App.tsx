import { useState, useEffect, useMemo, type ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './store';
import {
  fetchTasksAsync,
  addTaskAsync,
  updateTaskAsync,
  deleteTaskAsync,
  type Task,
} from './slice';
import './App.css';

type Priority = 'high' | 'medium' | 'low';
type StatusFilter = 'all' | 'completed' | 'incomplete';
type PriorityFilter = 'all' | Priority;

const PRIORITY_LABELS: Record<Priority, string> = {
  high: 'Cao',
  medium: 'Trung bình',
  low: 'Thấp',
};

const defaultForm = {
  title: '',
  priority: 'medium' as Priority,
  startDate: '',
  endDate: '',
  note: '',
  completed: false,
};

export default function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, status, error } = useSelector((state: RootState) => state.tasks);

  const [form, setForm] = useState(defaultForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchTasksAsync());
  }, [dispatch]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const resetForm = () => {
    setForm(defaultForm);
    setEditingId(null);
  };

  const handleSave = async () => {
    const { title, priority, startDate, endDate, note, completed } = form;

    if (!title || !startDate || !endDate) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    try {
      if (editingId) {
        await dispatch(
          updateTaskAsync({
            _id: editingId,
            title,
            priority,
            startDate,
            endDate,
            note,
            completed,
          })
        ).unwrap();
      } else {
        const isDuplicate = tasks.some(
          (t) => t.title.trim() === title.trim() && t.startDate === startDate
        );
        if (isDuplicate) {
          alert('Công việc đã tồn tại!');
          return;
        }

        await dispatch(
          addTaskAsync({
            title,
            priority,
            startDate,
            endDate,
            note,
            completed: false,
          })
        ).unwrap();
      }

      resetForm();
    } catch (err) {
      console.error('Lỗi khi lưu công việc:', err);
      alert('Đã xảy ra lỗi khi lưu công việc.');
    }
  };

  const handleEdit = (id: string) => {
    const task = tasks.find((t) => t._id === id);
    if (!task) return;

    setForm({
      title: task.title,
      priority: task.priority,
      startDate: task.startDate,
      endDate: task.endDate,
      note: task.note ?? '',
      completed: task.completed,
    });

    setEditingId(id);
  };

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteTaskAsync(id)).unwrap();
    } catch (err) {
      console.error('Xoá thất bại:', err);
      alert('Không thể xoá công việc.');
    }
  };

  const handleToggle = async (task: Task) => {
    try {
      await dispatch(
        updateTaskAsync({ ...task, completed: !task.completed })
      ).unwrap();
    } catch (err) {
      console.error('Cập nhật trạng thái thất bại:', err);
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter(
      (t) =>
        (priorityFilter === 'all' || t.priority === priorityFilter) &&
        (statusFilter === 'all' ||
          (statusFilter === 'completed' ? t.completed : !t.completed)) &&
        t.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [tasks, priorityFilter, statusFilter, search]);

  return (
    <div className="app-wrapper">
      <div className="container">
        <h2>Quản Lý Công Việc</h2>

        <div className="task-form">
          <input
            name="title"
            value={form.title}
            onChange={handleInputChange}
            placeholder="Tên công việc"
          />
          <select name="priority" value={form.priority} onChange={handleInputChange}>
            {Object.keys(PRIORITY_LABELS).map((p) => (
              <option key={p} value={p}>
                {PRIORITY_LABELS[p as Priority]}
              </option>
            ))}
          </select>
          <input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleInputChange}
          />
          <input
            type="date"
            name="endDate"
            value={form.endDate}
            onChange={handleInputChange}
          />
          <textarea
            name="note"
            value={form.note}
            onChange={handleInputChange}
            placeholder="Ghi chú"
          />
          {editingId && (
            <label>
              <input
                type="checkbox"
                name="completed"
                checked={form.completed}
                onChange={handleInputChange}
              />
              Hoàn thành
            </label>
          )}
          <button onClick={handleSave} disabled={status === 'loading'}>
            {editingId ? 'Lưu công việc' : 'Thêm công việc'}
          </button>
          {status === 'failed' && <p style={{ color: 'red' }}>Lỗi: {error}</p>}
        </div>

        <div className="task-filter">
          <label>Ưu tiên:</label>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as PriorityFilter)}
          >
            <option value="all">Tất cả</option>
            {Object.keys(PRIORITY_LABELS).map((p) => (
              <option key={p} value={p}>
                {PRIORITY_LABELS[p as Priority]}
              </option>
            ))}
          </select>

          <label>Trạng thái:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          >
            <option value="all">Tất cả</option>
            <option value="completed">Hoàn thành</option>
            <option value="incomplete">Chưa hoàn thành</option>
          </select>

          <input
            placeholder="Tìm kiếm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <ul className="task-list">
          {status === 'loading' && <p>Đang tải dữ liệu...</p>}

          {filteredTasks.map((task) => (
            <li key={task._id} className={`task-item ${task.priority}`}>
              <label>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggle(task)}
                />
                <strong
                  style={{
                    textDecoration: task.completed ? 'line-through' : 'none',
                  }}
                >
                  {task.title}
                </strong>
              </label>
              <em> ({PRIORITY_LABELS[task.priority]})</em>
              <div>Bắt đầu: {task.startDate}</div>
              <div>Kết thúc: {task.endDate}</div>
              <div>Ghi chú: {task.note || 'Không có'}</div>
              <button onClick={() => handleEdit(task._id!)}>Sửa</button>
              <button onClick={() => handleDelete(task._id!)}>Xoá</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
