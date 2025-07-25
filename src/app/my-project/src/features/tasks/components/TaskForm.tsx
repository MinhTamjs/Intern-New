import { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import type { Employee } from '../../employees/types';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
import { useCreateTask } from '../hooks/useCreateTask';
import { useEmployees } from '../../employees/hooks/useEmployees';
import { Textarea } from '../../../components/ui/textarea';
import { Label } from '../../../components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../../../components/ui/select';
import { toast } from 'sonner';
import { useAuth } from '../../../lib/auth';

export function TaskForm() {
  const [open, setOpen] = useState(false); // 🔹 Điều khiển mở/đóng Dialog
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assigneeId, setAssigneeId] = useState('');

  const currentUser = useAuth(); // 🔹 Lấy user role
  const { data: employees = [] } = useEmployees();
  const createTask = useCreateTask();

  const isAllowed = ['admin', 'manager'].includes(currentUser.role);

  const handleSubmit = () => {
    if (!title.trim()) return;

    createTask.mutate(
      {
        title,
        description,
        assigneeId,
        status: 'pending',
      },
      {
        onSuccess: () => {
          toast({
            title: '✅ Tạo task thành công!',
          });
          // Clear form
          setTitle('');
          setDescription('');
          setAssigneeId('');
          setOpen(false); // 🔹 Tự động đóng form
        },
        onError: () => {
          toast({
            title: '❌ Lỗi khi tạo task!',
            variant: 'destructive',
          });
        },
      }
    );
  };

  if (!isAllowed) return null; // 🔹 Ẩn hoàn toàn nếu không phải ADMIN/MANAGER

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">+ Thêm Task</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm Công Việc Mới</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div>
            <Label>Tiêu đề</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div>
            <Label>Mô tả</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <Label>Giao cho</Label>
            <Select value={assigneeId} onValueChange={setAssigneeId}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn nhân viên" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((emp: Employee) => (
                  <SelectItem key={emp.id} value={emp.id}>
                    {emp.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={handleSubmit}>Tạo task</Button>
      </DialogContent>
    </Dialog>
  );
}
