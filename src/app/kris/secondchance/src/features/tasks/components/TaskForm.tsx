import { useState, useMemo, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Badge } from '../../../components/ui/badge';
import { ScrollArea } from '../../../components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '../../../components/ui/popover';
import { Check, ChevronsUpDown, Tag, X } from 'lucide-react';
import type { Employee } from '../../employees/types';
import type { CreateTaskData } from '../types';
import type { TaskLabel } from '../types';
import { PREDEFINED_LABELS } from '../labels';

// Props interface for the TaskForm component
interface TaskFormProps {
  employees: Employee[];
  currentUserRole: 'admin' | 'manager' | 'employee';
  onSubmit: (data: CreateTaskData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function TaskForm({ employees, currentUserRole, onSubmit, onCancel, isLoading = false }: TaskFormProps) {
  // Form data state with default values
  const [formData, setFormData] = useState({
    description: '',
    assigneeIds: [] as string[],
    status: 'pending' as 'pending' | 'in-progress' | 'in-review' | 'done',
    dueDate: '',
    labels: [] as TaskLabel[],
    priority: 'medium' as 'low' | 'medium' | 'high',
    customColor: ''
  });

  // Validation errors state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Filter employees based on current user role
  const availableEmployees = useMemo(() => {
    if (currentUserRole === 'admin' || currentUserRole === 'manager') {
      // Admins and managers can assign to anyone
      return employees;
    } else {
      // Employees can only assign to other employees
      return employees.filter(employee => employee.role === 'employee');
    }
  }, [employees, currentUserRole]);

  // Filter out invalid assignees based on role restrictions
  useEffect(() => {
    if (currentUserRole === 'employee') {
      const validAssigneeIds = formData.assigneeIds.filter(assigneeId => {
        const employee = employees.find(emp => emp.id === assigneeId);
        return employee && employee.role === 'employee';
      });
      
      if (validAssigneeIds.length !== formData.assigneeIds.length) {
        setFormData(prev => ({ ...prev, assigneeIds: validAssigneeIds }));
      }
    }
  }, [currentUserRole, employees, formData.assigneeIds]);

  /**
   * Validates form data and sets error messages
   * @returns True if form is valid, false otherwise
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate description (required, length constraints)
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 3) {
      newErrors.description = 'Description must be at least 3 characters';
    } else if (formData.description.trim().length > 500) {
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
      description: formData.description?.trim() || '',
      assigneeIds: formData.assigneeIds,
      status: formData.status,
      dueDate: formData.dueDate?.trim() || '',
      labels: formData.labels,
      priority: formData.priority,
    };

    console.log('Submitting task with data:', cleanData);

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
      {/* Task Description Field */}
      <div className="space-y-1">
        <Label htmlFor="description" className="text-sm font-medium">
          Description *
        </Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Enter task description"
          rows={3}
          className={errors.description ? 'border-red-500' : ''} // Show error styling
          disabled={isLoading}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description}</p>
        )}
      </div>

      {/* Assignees Field */}
      <div className="space-y-1">
        <Label htmlFor="assignees" className="text-sm font-medium">
          Assignees *
        </Label>
        {currentUserRole === 'employee' && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            Note: As an employee, you can only assign tasks to other employees.
          </p>
        )}
        <div className="space-y-1 max-h-32 overflow-y-auto border rounded-md p-2">
          {availableEmployees.map((employee) => (
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
        {formData.assigneeIds.length === 0 && (
          <p className="text-sm text-red-500">Please select at least one assignee</p>
        )}
      </div>

      {/* Status Field */}
      <div className="space-y-1">
        <Label htmlFor="status" className="text-sm font-medium">
          Status *
        </Label>
        <Select
          value={formData.status}
          onValueChange={(value: 'pending' | 'in-progress' | 'in-review' | 'done') => setFormData({ ...formData, status: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="in-review">In Review</SelectItem>
            <SelectItem value="done">Done</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Due Date Field */}
      <div className="space-y-1">
        <Label htmlFor="dueDate" className="text-sm font-medium">
          Due Date
        </Label>
        <Input
          type="date"
          id="dueDate"
          value={formData.dueDate}
          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          placeholder="Enter due date"
          disabled={isLoading}
        />
      </div>

      {/* Priority Field */}
      <div className="space-y-1">
        <Label htmlFor="priority" className="text-sm font-medium">
          Priority
        </Label>
        <Select
          value={formData.priority}
          onValueChange={(value: 'low' | 'medium' | 'high') => setFormData({ ...formData, priority: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Labels Field */}
      <div className="space-y-1">
        <Label className="text-sm font-medium">
          Labels
        </Label>
        <div className="space-y-2">
          {/* Selected Labels Display */}
          {formData.labels.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {formData.labels.map((label) => (
                <Badge
                  key={label.id}
                  variant="secondary"
                  className="text-xs"
                  style={{
                    backgroundColor: label.bgColor,
                    color: label.textColor,
                    borderColor: label.color
                  }}
                >
                  {label.name}
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        labels: formData.labels.filter(l => l.id !== label.id)
                      });
                    }}
                    className="ml-1 hover:opacity-70"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {/* Label Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="w-full justify-between"
                disabled={isLoading}
              >
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  <span>Select labels...</span>
                </div>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Select Labels
                  </h3>
                </div>
                <ScrollArea className="h-64">
                  <div className="space-y-2">
                    {Object.entries(PREDEFINED_LABELS).map(([category, labels]) => (
                      <div key={category} className="space-y-1">
                        <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          {category}
                        </h4>
                        <div className="space-y-1">
                          {labels.map((label) => {
                            const isSelected = formData.labels.some(l => l.id === label.id);
                            return (
                              <div
                                key={label.id}
                                className="flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
                                onClick={() => {
                                  if (isSelected) {
                                    setFormData({
                                      ...formData,
                                      labels: formData.labels.filter(l => l.id !== label.id)
                                    });
                                  } else {
                                    setFormData({
                                      ...formData,
                                      labels: [...formData.labels, label]
                                    });
                                  }
                                }}
                              >
                                <div className="flex items-center gap-2">
                                  <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: label.color }}
                                  />
                                  <span className="text-sm">{label.name}</span>
                                </div>
                                {isSelected && (
                                  <Check className="h-4 w-4 text-green-600" />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </PopoverContent>
          </Popover>
        </div>
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
          disabled={isLoading || !formData.description.trim()} // Disable if loading or no description
        >
          {isLoading ? 'Creating...' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
} 