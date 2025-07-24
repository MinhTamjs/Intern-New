import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { openAddUserModal, setSelectedUserId } from './userSlice';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

interface User {
  id: number;
  name: string;
  email: string;
}

const fetchUsers = async (): Promise<User[]> => {
  const res = await axios.get<User[]>('http://localhost:3001/api/users');
  return res.data;
};

export default function UserList() {
  const { data = [], isLoading, error } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleDelete = async (id: number) => {
    await axios.delete(`http://localhost:3001/api/users/${id}`);
    queryClient.invalidateQueries({ queryKey: ['users'] });
  };

  if (isLoading) return <div>Đang tải danh sách người dùng...</div>;
  if (error) return <div>Lỗi tải dữ liệu!</div>;

  return (
    <div>
      <button onClick={() => dispatch(openAddUserModal())}>Thêm người dùng</button>
      <ul>
        {data.map((user) => (
          <li key={user.id} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span onClick={() => {
              dispatch(setSelectedUserId(user.id));
              navigate(`/users/${user.id}`);
            }}>
              {user.name} ({user.email})
            </span>
            <button onClick={() => handleDelete(user.id)} style={{ marginLeft: 8 }}>Xoá</button>
          </li>
        ))}
      </ul>
    </div>
  );
} 