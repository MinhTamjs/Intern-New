import { useState, useEffect } from 'react';
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
import { Avatar, AvatarFallback } from '../../../components/ui/avatar';
import { Badge } from '../../../components/ui/badge';
import { formatDate, formatUnixTimestamp, debugDate } from '../../../lib/utils';
import type { Task, TaskStatus } from '../types';
import type { Employee, Role } from '../../employees/types';

interface TaskModalProps {
  task: Task | null;
  employees: Employee[];
  currentUserRole: Role;
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskId: string, data: { title?: string; description?: string; assigneeId?: string; status?: TaskStatus }) => void;
  onDelete: (taskId: string) => void;
}

export function TaskModal({ 
  task, 
  employees, 
  currentUserRole, 
  isOpen, 
  onClose, 
  onSave, 
  onDelete 
}: TaskModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assigneeId: '',
    status: 'pending' as TaskStatus,
  });

  // Reset form data when task changes or modal opens
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        assigneeId: task.assigneeId,
        status: task.status,
      });
      // Reset editing state when opening a new task
      setIsEditing(false);
    }
  }, [task?.id]); // Only reset when task ID changes

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsEditing(false);
      // Don't reset formData here to preserve user input if they reopen the same task
    }
  }, [isOpen]);

  // Debug logging for date issues
  useEffect(() => {
    if (task) {
      console.log('TaskModal: Task data received:', {
        id: task.id,
        title: task.title,
        dueData: task.dueData,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
        dueDataDebug: task.dueData ? debugDate(new Date(task.dueData * 1000).toISOString()) : null,
        createdAtDebug: debugDate(task.createdAt),
        updatedAtDebug: debugDate(task.updatedAt),
        hasDueData: 'dueData' in task,
        hasCreatedAt: 'createdAt' in task,
        hasUpdatedAt: 'updatedAt' in task,
      });
    }
  }, [task]);

  const canEdit = currentUserRole === 'admin' || currentUserRole === 'manager';
  const canDelete = currentUserRole === 'admin' || currentUserRole === 'manager';
  const isEmployee = currentUserRole === 'employee';

  const handleSave = () => {
    if (task) {
      // Only include fields that have actually changed from the original task
      const changedData: { title?: string; description?: string; assigneeId?: string; status?: TaskStatus } = {};
      
      if (formData.title !== task.title) {
        changedData.title = formData.title;
      }
      
      if (formData.description !== task.description) {
        changedData.description = formData.description;
      }
      
      if (formData.assigneeId !== task.assigneeId) {
        changedData.assigneeId = formData.assigneeId;
      }
      
      if (formData.status !== task.status) {
        changedData.status = formData.status;
      }
      
      onSave(task.id, changedData);
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    if (task && canDelete) {
      onDelete(task.id);
      onClose();
    }
  };

  const handleClose = () => {
    setIsEditing(false);
    onClose();
  };

  const assignee = employees.find(emp => emp.id === task?.assigneeId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'in-review':
        return 'bg-purple-100 text-purple-800';
      case 'done':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose} key={task?.id || 'no-task'}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span>{isEditing ? 'Edit Task' : 'Task Details'}</span>
              {isEmployee && (
                <Badge variant="outline" className="text-xs text-gray-500">
                  Read Only
                </Badge>
              )}
            </div>
            {task && (
              <Badge className={getStatusColor(task.status)}>
                {task.status.replace('-', ' ')}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        {task && (
          <div className="space-y-6">
            {isEditing ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="block">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description" className="block">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assignee" className="block">Assignee</Label>
                  <Select
                    value={formData.assigneeId || "unassigned"}
                    onValueChange={(value) => setFormData({ ...formData, assigneeId: value === "unassigned" ? "" : value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select assignee" />
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

                <div className="space-y-2">
                  <Label htmlFor="status" className="block">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value as TaskStatus })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="in-review">In Review</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-left">
                  <Label className="text-sm font-medium text-gray-500 text-left">Title</Label>
                  <p className="text-lg font-medium text-left mt-1">{task.title}</p>
                </div>

                <div className="text-left">
                  <Label className="text-sm font-medium text-gray-500 text-left">Description</Label>
                  <p className="text-gray-700 whitespace-pre-wrap text-left mt-1">{task.description}</p>
                </div>

                <div className="text-left">
                  <Label className="text-sm font-medium text-gray-500 text-left">Assignee</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    {assignee ? (
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>
                          {assignee.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="w-8 h-8 border border-gray-200 rounded-full bg-gray-100 flex items-center justify-center">
                        <span className="text-xs text-gray-500 font-medium">U</span>
                      </div>
                    )}
                    <div className="text-left">
                      <p className="font-medium text-left">{assignee?.name || 'Unassigned'}</p>
                      <p className="text-sm text-gray-500 text-left">{assignee?.email || 'No email'}</p>
                    </div>
                  </div>
                </div>

                <div className="text-left">
                  <Label className="text-sm font-medium text-gray-500 text-left">Created</Label>
                  <p className="text-gray-700 text-left mt-1">
                    {task.createdAt ? formatDate(task.createdAt, "Not set") : 
                     task.dueData ? formatUnixTimestamp(task.dueData, "Not set") : "Not set"}
                  </p>
                </div>

                <div className="text-left">
                  <Label className="text-sm font-medium text-gray-500 text-left">Last Updated</Label>
                  <p className="text-gray-700 text-left mt-1">
                    {task.updatedAt ? formatDate(task.updatedAt, "Not set") : 
                     task.dueData ? formatUnixTimestamp(task.dueData, "Not set") : "Not set"}
                  </p>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-2">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>
                    Save Changes
                  </Button>
                </>
              ) : (
                <>
                  {canEdit && (
                    <Button variant="outline" onClick={() => setIsEditing(true)}>
                      Edit
                    </Button>
                  )}
                  {canDelete && (
                    <Button variant="destructive" onClick={handleDelete}>
                      Delete
                    </Button>
                  )}
                  <Button onClick={handleClose}>
                    Close
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
} 