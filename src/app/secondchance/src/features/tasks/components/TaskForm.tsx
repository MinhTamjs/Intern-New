import { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import type { CreateTaskData } from '../types';
import type { Employee } from '../../employees/types';

interface TaskFormProps {
  employees: Employee[];
  onSubmit: (data: CreateTaskData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function TaskForm({ employees, onSubmit, onCancel, isLoading = false }: TaskFormProps) {
  const [formData, setFormData] = useState<CreateTaskData>({
    title: '',
    description: '',
    assigneeId: '',
    status: 'pending',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    } else if (formData.title.trim().length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    if (formData.description && formData.description.trim().length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Clean up the data before submitting
    const cleanData: CreateTaskData = {
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim() || '',
      assigneeId: formData.assigneeId || '',
    };

    onSubmit(cleanData);
  };

  const handleInputChange = (field: keyof CreateTaskData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-medium">
          Title *
        </Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          placeholder="Enter task title"
          className={errors.title ? 'border-red-500' : ''}
          disabled={isLoading}
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-medium">
          Description
        </Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Enter task description (optional)"
          rows={3}
          className={errors.description ? 'border-red-500' : ''}
          disabled={isLoading}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="assignee" className="text-sm font-medium">
          Assignee
        </Label>
        <Select
          value={formData.assigneeId}
          onValueChange={(value) => handleInputChange('assigneeId', value === 'unassigned' ? '' : value)}
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select assignee" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="unassigned">Unassigned</SelectItem>
            {employees.map((employee) => (
              <SelectItem key={employee.id} value={employee.id}>
                {employee.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading || !formData.title.trim()}
        >
          {isLoading ? 'Creating...' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
} 