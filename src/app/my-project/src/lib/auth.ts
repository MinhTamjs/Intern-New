export type UserRole = 'admin' | 'manager' | 'employee';

export interface User {
  id: string;
  name: string;
  email: string;
  position: UserRole;
  department: string;
  avatar: string;
}

// ✅ Mock user giả lập (có thể thay bằng auth thực sau)
const mockUser: User = {
  id: 'admin-001',
  name: 'Admin User',
  email: 'admin@example.com',
  position: 'admin',
  department: 'Engineering',
  avatar: 'https://i.pravatar.cc/150?img=10',
};

// ✅ Hook giả lập useAuth (có thể thay bằng context/auth thực)
export function useAuth(): User {
  return mockUser;
}

// ✅ Các hàm tiện ích phân quyền
export function isAdmin(user: User): boolean {
  return user.position === 'admin';
}

export function isManager(user: User): boolean {
  return user.position === 'manager';
}

export function isEmployee(user: User): boolean {
  return user.position === 'employee';
}
