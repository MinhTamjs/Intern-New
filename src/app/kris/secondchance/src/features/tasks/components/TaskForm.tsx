import { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';


import type { CreateTaskData } from '../types';
import type { Employee } from '../../employees/types';

// Props interface for the TaskForm component
interface TaskFormProps {
  employees: Employee[]; // List of available employees for assignment
  onSubmit: (data: CreateTaskData) => void; // Callback when form is submitted
  onCancel: () => void; // Callback when form is cancelled
  isLoading?: boolean; // Loading state for form submission
}

/**
 * TaskForm component provides a form for creating new tasks
 * Includes validation, error handling, employee assignment, and color customization for admins
 */
export function TaskForm({ employees, onSubmit, onCancel, isLoading = false }: TaskFormProps) {
  // Form data state with default values
  const [formData, setFormData] = useState<CreateTaskData>({
    title: '',
    description: '',
    assigneeIds: [],
    status: 'pending', // Default status for new tasks
    customColor: undefined, // Optional custom color for task cards
  });

  // Validation errors state
  const [errors, setErrors] = useState<Record<string, string>>({});

  /**
   * Validates form data and sets error messages
   * @returns True if form is valid, false otherwise
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate title (required, length constraints)
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    } else if (formData.title.trim().length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    // Validate description (optional, length constraint)
    if (formData.description && formData.description.trim().length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handles form submission with validation and data cleaning
   * @param e - Form submission event
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    // Clean up the data before submitting (trim whitespace, set defaults)
    const cleanData: CreateTaskData = {
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim() || '',
      assigneeIds: formData.assigneeIds,
    };

    onSubmit(cleanData);
  };

  /**
   * Handles input changes and clears validation errors
   * @param field - Field name to update
   * @param value - New value for the field
   */
  const handleInputChange = (field: keyof CreateTaskData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing in the field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Task Title Field */}
      <div className="space-y-1">
        <Label htmlFor="title" className="text-sm font-medium">
          Title *
        </Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          placeholder="Enter task title"
          className={errors.title ? 'border-red-500' : ''} // Show error styling
          disabled={isLoading}
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title}</p>
        )}
      </div>

      {/* Task Description Field */}
      <div className="space-y-1">
        <Label htmlFor="description" className="text-sm font-medium">
          Description
        </Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Enter task description (optional)"
          rows={2}
          className={errors.description ? 'border-red-500' : ''} // Show error styling
          disabled={isLoading}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description}</p>
        )}
      </div>

      {/* Assignee Selection Field */}
      <div className="space-y-1">
        <Label htmlFor="assignees" className="text-sm font-medium">
          Assignees
        </Label>
        <div className="space-y-1 max-h-32 overflow-y-auto border rounded-md p-2">
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
                disabled={isLoading}
              />
              <label htmlFor={employee.id} className="text-sm">
                {employee.name} ({employee.role})
              </label>
            </div>
          ))}
        </div>
        {formData.assigneeIds.length > 0 && (
          <div className="flex justify-between items-center pt-1">
            <span className="text-xs text-gray-600">
              {formData.assigneeIds.length} assignee{formData.assigneeIds.length !== 1 ? 's' : ''} selected
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setFormData({ ...formData, assigneeIds: [] })}
              disabled={isLoading}
              className="text-xs"
            >
              Clear All
            </Button>
          </div>
        )}
      </div>



      {/* Form Action Buttons */}
      <div className="flex justify-end space-x-2 pt-2">
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
          disabled={isLoading || !formData.title.trim()} // Disable if loading or no title
        >
          {isLoading ? 'Creating...' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
} 