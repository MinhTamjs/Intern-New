// src/features/employees/components/EmployeeFormDialog.tsx
import { useState, useEffect } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Employee } from '../types';

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
  const [role, setRole] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setRole(initialData.role);
    }
  }, [initialData]);

  const handleSubmit = () => {
    if (!name.trim() || !role.trim()) return;
    onSubmit({ name, role });
    setName('');
    setRole('');
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
            placeholder="Vai trò (Admin, Staff...)"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
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
