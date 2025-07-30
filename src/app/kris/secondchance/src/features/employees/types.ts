export type Role = 'admin' | 'manager' | 'employee';

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface CreateEmployeeData {
  name: string;
  email: string;
  role: Role;
} 