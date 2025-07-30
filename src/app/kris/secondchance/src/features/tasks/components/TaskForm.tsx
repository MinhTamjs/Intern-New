import { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { ColorPicker } from '../../../components/ColorPicker';
import type { CreateTaskData } from '../types';
import type { Employee, Role } from '../../employees/types';

// Props interface for the TaskForm component
interface TaskFormProps {
  employees: Employee[]; // List of available employees for assignment
  onSubmit: (data: CreateTaskData) => void; // Callback when form is submitted
  onCancel: () => void; // Callback when form is cancelled
  isLoading?: boolean; // Loading state for form submission
  currentRole?: Role; // Current user role for permission-based features
}

/**
 * TaskForm component provides a form for creating new tasks
 * Includes validation, error handling, employee assignment, and color customization for admins
 */
export function TaskForm({ employees, onSubmit, onCancel, isLoading = false, currentRole }: TaskFormProps) {
  // Form data state with default values
  const [formData, setFormData] = useState<CreateTaskData>({
    title: '',
    description: '',
    assigneeId: '',
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
      assigneeId: formData.assigneeId || '',
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
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Task Title Field */}
      <div className="space-y-2">
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
          className={errors.description ? 'border-red-500' : ''} // Show error styling
          disabled={isLoading}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description}</p>
        )}
      </div>

      {/* Assignee Selection Field */}
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
            {/* Map employees to select options */}
            {employees.map((employee) => (
              <SelectItem key={employee.id} value={employee.id}>
                {employee.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Color picker for admin users */}
      {currentRole === 'admin' && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Task Color (Optional)
          </Label>
          <ColorPicker
            selectedColor={formData.customColor}
            onColorChange={(color) => handleInputChange('customColor', color || '')}
            disabled={isLoading}
          />
        </div>
      )}

      {/* Form Action Buttons */}
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
          disabled={isLoading || !formData.title.trim()} // Disable if loading or no title
        >
          {isLoading ? 'Creating...' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
} 