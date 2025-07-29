// src/features/employees/types.ts

export interface Employee {
  id: string;
  name: string;
  email: string;
  avatar: string;
  position: 'admin' | 'manager' | 'employee';
  department: string;
}
