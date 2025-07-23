import { useDispatch } from 'react-redux';
import { closeAddUserModal } from './userSlice';
import { useState } from 'react';
import axios from 'axios';
import { useQueryClient } from '@tanstack/react-query';

export default function AddUserModal() {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post('http://localhost:3001/api/users', { name, email });
    queryClient.invalidateQueries({ queryKey: ['users'] });
    dispatch(closeAddUserModal());
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: '#0008', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', padding: 24, borderRadius: 8, minWidth: 300 }}>
        <h2>Thêm người dùng</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Tên: <input type="text" required value={name} onChange={e => setName(e.target.value)} /></label>
          </div>
          <div>
            <label>Email: <input type="email" required value={email} onChange={e => setEmail(e.target.value)} /></label>
          </div>
          <button type="submit">Thêm</button>
          <button type="button" onClick={() => dispatch(closeAddUserModal())}>Đóng</button>
        </form>
      </div>
    </div>
  );
} 