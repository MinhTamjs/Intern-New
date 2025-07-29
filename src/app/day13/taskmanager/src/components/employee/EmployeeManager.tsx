import { useState } from 'react';
import type { Employee } from '@/features/employees/employeesAPI';
import { Button } from '@/components/ui/button';
import { Input } from '../ui/input';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PencilIcon, TrashIcon, PlusIcon } from 'lucide-react';

interface EmployeeManagerProps {
  employees: Employee[];
  currentUser: { id: string; role: string };
  onAdd: (employee: Omit<Employee, 'id'>) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, update: Partial<Employee>) => void;
}

export function EmployeeManager({
  employees,
  currentUser,
  onAdd,
  onDelete,
  onEdit,
}: EmployeeManagerProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Omit<Employee, 'id'>>({
    name: '',
    email: '',
    position: 'employee',
  });

  const [editing, setEditing] = useState<Employee | null>(null);

  const handleSave = () => {
    if (editing) {
      onEdit(editing.id, form);
    } else {
      onAdd(form);
    }
    setForm({ name: '', email: '', position: 'employee' });
    setEditing(null);
    setOpen(false);
  };

  const canManage = currentUser.role === 'admin';

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Danh sách nhân viên</h2>
        {canManage && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button >
                <PlusIcon className="w-5 h-5 mr-1" />
                Thêm nhân viên
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editing ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <Input
                  placeholder="Họ tên"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <Input
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <select
                  className="w-full border rounded px-3 py-2"
                  value={form.position}
                  onChange={(e) =>
                    setForm({ ...form, position: e.target.value as Employee['position'] })
                  }
                >
                  <option value="employee">Nhân viên</option>
                  <option value="manager">Quản lý</option>
                  <option value="admin">Admin</option>
                </select>
                <div className="flex justify-end">
                  <Button onClick={handleSave}>
                    {editing ? 'Lưu thay đổi' : 'Thêm mới'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="space-y-2">
        {employees.map((emp) => (
          <div
            key={emp.id}
            className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded border"
          >
            <div>
              <p className="font-medium">{emp.name}</p>
              <p className="text-sm text-gray-600">{emp.email}</p>
              <p className="text-sm text-gray-500 italic">({emp.position})</p>
            </div>
            {canManage && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setEditing(emp);
                    setForm({
                      name: emp.name,
                      email: emp.email,
                      position: emp.position,
                    });
                    setOpen(true);
                  }}
                >
                  <PencilIcon className="w-4 h-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => onDelete(emp.id)}
                >
                  <TrashIcon className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
