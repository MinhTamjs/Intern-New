import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import type { CreateTaskData } from '../types';
import type { Employee } from '../../employees/types';

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTaskData) => void;
  isLoading?: boolean;
  employees: Employee[];
}

export function TaskForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isLoading,
  employees
}: TaskFormProps) {
  const [formData, setFormData] = useState<CreateTaskData>({
    title: '',
    description: '',
    assigneeId: '', // Will be empty by default (Unassigned)
    status: 'pending', // Set default status to pending
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ title: '', description: '', assigneeId: '', status: 'pending' });
  };

  const handleClose = () => {
    setFormData({ title: '', description: '', assigneeId: '', status: 'pending' });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-left space-y-2">
            <Label htmlFor="title" className="text-left block">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="text-left"
            />
          </div>

          <div className="text-left space-y-2">
            <Label htmlFor="description" className="text-left block">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              required
              className="text-left"
            />
          </div>

          <div className="text-left space-y-2">
            <Label htmlFor="assignee" className="text-left block">Assignee</Label>
            <Select
              value={formData.assigneeId || "unassigned"}
              onValueChange={(value) => setFormData({ ...formData, assigneeId: value === "unassigned" ? "" : value })}
            >
              <SelectTrigger className="text-left">
                <SelectValue placeholder="Select assignee (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                {employees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.name} ({employee.role})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !formData.title.trim()}>
              {isLoading ? 'Creating...' : 'Create Task'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 