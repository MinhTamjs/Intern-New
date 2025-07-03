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
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
  {/* Left side: Image + logo */}
  <div className="hidden md:block relative">
    <img
      src="/bt.jpg"
      alt="Login background"
      className="absolute inset-0 object-cover w-full h-full"
    />
    <div className="absolute inset-0 bg-black/40" />
    <div className="relative z-10 flex h-full items-center justify-center">
      <img src="/logo.svg" alt="Logo" className="w-24 h-24" />
    </div>
  </div>

  {/* Right side: Login form */}
  <div className="flex flex-col justify-center items-center px-6 sm:px-12 py-12">
    <div className="w-full max-w-md">
      <h1 className="text-2xl font-bold">Login</h1>
      <p className="text-gray-500 mt-2">
        Enter your email below to login to your account
      </p>

      {/* Email */}
      <div className="mt-6">
        <label className="block text-sm font-medium">Email</label>
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

      {/* Error message */}
      <p className="text-sm text-red-500 mt-3">
        ❌ Incorrect username or password.
      </p>

      {/* Login button */}
      <button className="mt-4 w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600">
        Login
      </button>

      {/* Google login */}
      <button className="mt-3 w-full border py-2 rounded flex items-center justify-center gap-2 hover:bg-gray-100">
        <img src="/th.jpg" alt="Google" className="w-5 h-5" />
        Login with Google
      </button>

      {/* Sign up link */}
      <p className="mt-6 text-center text-sm">
        Don’t have an account?{" "}
        <a href="#" className="text-orange-500 font-medium">
          Sign up
        </a>
      </p>

      {/* Footer */}
      <p className="mt-10 text-center text-xs text-gray-400">
        Crafted with ❤️ by OneXAPIs team
      </p>
    </div>
  </div>
</div>

  );
}
