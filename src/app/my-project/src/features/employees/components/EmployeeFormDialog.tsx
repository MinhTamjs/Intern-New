// src/features/employees/components/EmployeeFormDialog.tsx
import { useState, useEffect } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import type { Employee } from '../types';

interface EmployeeFormDialogProps {
  triggerLabel: string;
  initialData?: Employee;
  onSubmit: (data: Omit<Employee, 'id'>) => void;
}

export function EmployeeFormDialog({
  triggerLabel,
  initialData,
  onSubmit,
}: EmployeeFormDialogProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [position, setPosition] = useState<'admin' | 'manager' | 'employee'>('employee');
  const [department, setDepartment] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setEmail(initialData.email);
      setPosition(initialData.position);
      setDepartment(initialData.department);
    }
  }, [initialData]);

  const handleSubmit = () => {
    if (!name.trim() || !email.trim() || !department.trim()) return;
    onSubmit({ 
      name, 
      email, 
      position, 
      department, 
      avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}` 
    });
    setName('');
    setEmail('');
    setPosition('employee');
    setDepartment('');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">{triggerLabel}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? 'Cập nhật nhân viên' : 'Thêm nhân viên mới'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Input
            placeholder="Tên nhân viên"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            placeholder="Phòng ban"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />
          <select
            value={position}
            onChange={(e) => setPosition(e.target.value as 'admin' | 'manager' | 'employee')}
            className="w-full p-2 border rounded"
          >
            <option value="employee">Nhân viên</option>
            <option value="manager">Quản lý</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>
            {initialData ? 'Cập nhật' : 'Thêm'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
