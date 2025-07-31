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
  onSave: (taskId: string, data: { title?: string; description?: string; assigneeIds?: string[]; status?: TaskStatus }) => void;
  onDelete: (taskId: string) => void;
  openInEditMode?: boolean;
}

export function TaskModal({ 
  task, 
  employees, 
  currentUserRole, 
  isOpen, 
  onClose, 
  onSave, 
  onDelete,
  openInEditMode = false
}: TaskModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assigneeIds: [] as string[],
    status: 'pending' as TaskStatus,
  });

  // Reset form data when task changes or modal opens
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        assigneeIds: task.assigneeIds,
        status: task.status,
      });
      // Set editing state based on openInEditMode prop
      setIsEditing(openInEditMode);
    }
  }, [task?.id, openInEditMode]); // Reset when task ID or edit mode changes

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
      const changedData: { title?: string; description?: string; assigneeIds?: string[]; status?: TaskStatus } = {};
      
      if (formData.title !== task.title) {
        changedData.title = formData.title;
      }
      
      if (formData.description !== task.description) {
        changedData.description = formData.description;
      }
      
      if (JSON.stringify(formData.assigneeIds) !== JSON.stringify(task.assigneeIds)) {
        changedData.assigneeIds = formData.assigneeIds;
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

  const assignees = task?.assigneeIds.map(id => employees.find(emp => emp.id === id)).filter(Boolean) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case 'in-progress':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      case 'in-review':
        return 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200';
      case 'done':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose} key={task?.id || 'no-task'}>
      <DialogContent className="max-w-2xl">
        <DialogHeader className="relative">
          <DialogTitle className="flex items-center justify-between pr-12">
            <div className="flex items-center space-x-2">
              <span>{isEditing ? 'Edit Task' : 'Task Details'}</span>
              {isEmployee && (
                <Badge variant="outline" className="text-xs text-gray-500 dark:text-gray-400">
                  Read Only
                </Badge>
              )}
            </div>
            {task && (
              <Badge className={`${getStatusColor(task.status)} mr-4`}>
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
                  <Label htmlFor="assignees" className="block">Assignees</Label>
                  <div className="space-y-2">
                    {employees.map((employee) => (
                      <div key={employee.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={employee.id}
                          checked={formData.assigneeIds.includes(employee.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({ ...formData, assigneeIds: [...formData.assigneeIds, employee.id] });
                            } else {
                              setFormData({ ...formData, assigneeIds: formData.assigneeIds.filter(id => id !== employee.id) });
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                        <label htmlFor={employee.id} className="text-sm">
                          {employee.name} ({employee.role})
                        </label>
                      </div>
                    ))}
                  </div>
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
                  <Label className="text-sm font-medium text-gray-500 dark:text-gray-400 text-left">Title</Label>
                  <p className="text-lg font-medium text-left mt-1">{task.title}</p>
                </div>

                <div className="text-left">
                  <Label className="text-sm font-medium text-gray-500 dark:text-gray-400 text-left">Description</Label>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap text-left mt-1">{task.description}</p>
                </div>

                <div className="text-left">
                  <Label className="text-sm font-medium text-gray-500 dark:text-gray-400 text-left">Assignees</Label>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    {assignees.length > 0 ? (
                      assignees.map((assignee) => assignee && (
                        <div key={assignee.id} className="flex items-center space-x-2">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback>
                              {assignee.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="text-left">
                            <p className="font-medium text-left">{assignee.name}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 border border-gray-200 dark:border-gray-600 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">U</span>
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-left">Unassigned</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-left">
                  <Label className="text-sm font-medium text-gray-500 dark:text-gray-400 text-left">Created</Label>
                  <p className="text-gray-700 dark:text-gray-300 text-left mt-1">
                    {task.createdAt ? formatDate(task.createdAt) : 
                     task.dueData ? formatUnixTimestamp(task.dueData, "Not set") : "Not set"}
                  </p>
                </div>

                <div className="text-left">
                  <Label className="text-sm font-medium text-gray-500 dark:text-gray-400 text-left">Last Updated</Label>
                  <p className="text-gray-700 dark:text-gray-300 text-left mt-1">
                    {task.updatedAt ? formatDate(task.updatedAt) : 
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