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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import type { CreateEmployeeData, Role } from '../types';

// Props interface for the EmployeeFormDialog component
interface EmployeeFormDialogProps {
  isOpen: boolean; // Controls dialog visibility
  onClose: () => void; // Callback when dialog is closed
  onSubmit: (data: CreateEmployeeData) => void; // Callback when form is submitted
  isLoading?: boolean; // Loading state for form submission
}

/**
 * EmployeeFormDialog component provides a modal form for creating new employees
 * Handles form state, validation, and submission with proper cleanup
 */
export function EmployeeFormDialog({ isOpen, onClose, onSubmit, isLoading }: EmployeeFormDialogProps) {
  // Form data state with default values
  const [formData, setFormData] = useState<CreateEmployeeData>({
    name: '',
    email: '',
    role: 'employee', // Default role for new employees
  });

  /**
   * Handles form submission and resets form data
   * @param e - Form submission event
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData); // Submit the form data
    setFormData({ name: '', email: '', role: 'employee' }); // Reset form
  };

  /**
   * Handles dialog close and resets form data
   */
  const handleClose = () => {
    setFormData({ name: '', email: '', role: 'employee' }); // Reset form
    onClose(); // Close dialog
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Employee</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Employee Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name" className="block">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          {/* Employee Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="block">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          {/* Employee Role Selection */}
          <div className="space-y-2">
            <Label htmlFor="role" className="block">Role</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => setFormData({ ...formData, role: value as Role })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="employee">Employee</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Form Action Buttons */}
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add Employee'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 