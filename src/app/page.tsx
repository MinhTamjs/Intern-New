'use client';

import { useState } from 'react';

type User = {
  name: string;
  age: number;
  isOnline: boolean;
};

export default function HomePage() {
  const [userList, setUserList] = useState<User[]>([
    { name: 'Minh', age: 30, isOnline: true },
    { name: 'Lan', age: 24, isOnline: false },
    { name: 'Huy', age: 27, isOnline: true },
  ]);
  const [form, setForm] = useState<User>({ name: '', age: 0, isOnline: false });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [error, setError] = useState<string>('');

  const handleSubmit = () => {
    if (!form.name.trim()) {
      setError('Tên không được để trống.');
      return;
    }

    if (form.age <= 0 || isNaN(form.age)) {
      setError('Tuổi phải lớn hơn 0.');
      return;
    }

    setError('');

    if (editIndex !== null) {
      const newList = [...userList];
      newList[editIndex] = form;
      setUserList(newList);
      setEditIndex(null);
    } else {
      setUserList([...userList, form]);
    }

    setForm({ name: '', age: 0, isOnline: false });
  };

  const handleEdit = (index: number) => {
    setForm(userList[index]);
    setEditIndex(index);
    setError('');
  };

  const handleDelete = (index: number) => {
    const newList = userList.filter((_, i) => i !== index);
    setUserList(newList);
    setError('');
  };

  return (
    <main style={{ padding: 20, fontFamily: 'Arial' }}>
      <h1> Giao diện quản lý người dùng</h1>

      <div style={{ marginBottom: 20, border: '1px solid #ccc', padding: 15, borderRadius: 8 }}>
        <h2>{editIndex !== null ? '✏️ Sửa người dùng' : '➕ Thêm người dùng'}</h2>
        <input
          type="text"
          placeholder="Tên"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          style={{ marginRight: 10, padding: 5 }}
        />
        <input
          type="number"
          placeholder="Tuổi"
          value={form.age}
          onChange={(e) => setForm({ ...form, age: parseInt(e.target.value) })}
          style={{ marginRight: 10, padding: 5, width: 80 }}
        />
        <label style={{ marginRight: 10 }}>
          <input
            type="checkbox"
            checked={form.isOnline}
            onChange={(e) => setForm({ ...form, isOnline: e.target.checked })}
          />{' '}
          Online
        </label>
        <button onClick={handleSubmit} style={{ padding: '5px 12px' }}>
          {editIndex !== null ? 'Cập nhật' : 'Thêm'}
        </button>

        {error && <p style={{ color: 'red', marginTop: 10 }}>{error}</p>}
      </div>

      <h2> Danh sách người dùng</h2>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={cellStyle}>#</th>
            <th style={cellStyle}>Tên</th>
            <th style={cellStyle}>Tuổi</th>
            <th style={cellStyle}>Trạng thái</th>
            <th style={cellStyle}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {userList.map((user, index) => (
            <tr key={index}>
              <td style={cellStyle}>{index + 1}</td>
              <td style={cellStyle}>{user.name}</td>
              <td style={cellStyle}>{user.age}</td>
              <td style={{ ...cellStyle, color: user.isOnline ? 'green' : 'gray' }}>
                {user.isOnline ? 'Online' : 'Offline'}
              </td>
              <td style={cellStyle}>
                <button onClick={() => handleEdit(index)} style={{ marginRight: 5 }}>
                  Sửa
                </button>
                <button onClick={() => handleDelete(index)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

const cellStyle = {
  border: '1px solid #ccc',
  padding: '8px',
  textAlign: 'center' as const,
};
