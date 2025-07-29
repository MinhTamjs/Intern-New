import { useState } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Label } from '../../../components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../../components/ui/select';
import { useEmployees } from '../../employees/hooks/useEmployees';
import { useAssignTask } from '../hooks/useAssignTask';
import { useDeleteTask } from '../hooks/useDeleteTask';
import { TASK_STATUSES, type TaskStatus } from '../../../lib/constants';
import { toast } from 'sonner';
import { isAdmin } from '../../../lib/auth';
import type { User } from '../../../lib/auth';

interface TaskModalProps {
  task: {
    id: string;
    title: string;
    description: string;
    assigneeId: string;
    status: TaskStatus;
  };
  currentUser: User;
  trigger: React.ReactNode;
}

export function TaskModal({ task, currentUser, trigger }: TaskModalProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [assigneeId, setAssigneeId] = useState(task.assigneeId);
  const [status, setStatus] = useState<TaskStatus>(task.status);

  const { data: employees = [] } = useEmployees();
  const assignTask = useAssignTask();
  const deleteTask = useDeleteTask();

  const canEdit = isAdmin(currentUser);

  const handleUpdate = () => {
    assignTask.mutate(
      { id: task.id, status },
      {
        onSuccess: () => {
          toast.success('Cập nhật task thành công!');
          setOpen(false);
        },
        onError: () => toast.error('Cập nhật thất bại'),
      }
    );
  };

  const handleDelete = () => {
    deleteTask.mutate(task.id, {
      onSuccess: () => {
        toast.success('Xoá task thành công!');
        setOpen(false);
      },
      onError: () => toast.error('Xoá thất bại'),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chi tiết công việc</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div>
            <Label>Tiêu đề</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} disabled />
          </div>

          <div>
            <Label>Mô tả</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} disabled />
          </div>

          <div>
            <Label>Người nhận</Label>
            <Select value={assigneeId} onValueChange={setAssigneeId} disabled>
              <SelectTrigger>
                <SelectValue placeholder="Chọn nhân viên" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((emp) => (
                  <SelectItem key={emp.id} value={emp.id}>
                    {emp.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Trạng thái</Label>
            <Select value={status} onValueChange={(val) => setStatus(val as TaskStatus)} disabled={!canEdit}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TASK_STATUSES.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-between">
          {canEdit && (
            <>
              <Button onClick={handleUpdate}>Lưu thay đổi</Button>
              <Button variant="destructive" onClick={handleDelete}>
                Xoá
              </Button>
            </>
          )}
          <Button variant="outline" onClick={() => setOpen(false)}>
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
