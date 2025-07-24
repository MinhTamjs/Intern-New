import { useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  website: string;
  address: { street: string; city: string };
  company: { name: string };
}

const fetchUser = async (id: string): Promise<User> => {
  const res = await axios.get<User>(`http://localhost:3001/api/users/${id}`);
  return res.data;
};

export default function UserDetail() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery<User>({
    queryKey: ['user', id],
    queryFn: () => fetchUser(id!),
    enabled: !!id,
  });

  const handleDelete = async () => {
    await axios.delete(`http://localhost:3001/api/users/${id}`);
    queryClient.invalidateQueries({ queryKey: ['users'] });
    window.history.back();
  };

  // Sửa user (ví dụ: chỉ sửa tên và email)
  const handleUpdate = async () => {
    const name = prompt('Tên mới:', data?.name);
    const email = prompt('Email mới:', data?.email);
    if (name && email) {
      await axios.put(`http://localhost:3001/api/users/${id}`, { name, email });
      queryClient.invalidateQueries({ queryKey: ['user', id] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  };

  if (isLoading) return <div>Đang tải thông tin người dùng...</div>;
  if (error) return <div>Lỗi tải dữ liệu!</div>;
  if (!data) return <div>Không tìm thấy người dùng!</div>;

  return (
    <div>
      <h2>{data.name}</h2>
      <p>Email: {data.email}</p>
      <p>Phone: {data.phone}</p>
      <p>Website: {data.website}</p>
      <p>Địa chỉ: {data.address.street}, {data.address.city}</p>
      <p>Công ty: {data.company.name}</p>
      <button onClick={handleUpdate}>Sửa</button>
      <button onClick={handleDelete} style={{ marginLeft: 8 }}>Xoá</button>
    </div>
  );
} 