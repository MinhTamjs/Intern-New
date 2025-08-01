import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
import { TaskForm } from './TaskForm';
import type { CreateTaskData } from '../types';
import type { Employee } from '../../employees/types';

// Props interface for the CreateTaskModal component
interface CreateTaskModalProps {
  isOpen: boolean; // Controls modal visibility
  onClose: () => void; // Callback when modal is closed
  onSubmit: (data: CreateTaskData) => void; // Callback when task is submitted
  employees: Employee[]; // List of available employees for assignment
  currentUserRole: 'admin' | 'manager' | 'employee'; // Current user's role
  isLoading?: boolean; // Loading state for form submission
}

/**
 * CreateTaskModal component wraps TaskForm in a dialog for creating new tasks
 * Provides a modal interface for task creation with form validation
 */
export function CreateTaskModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  employees, 
  currentUserRole,
  isLoading = false
}: CreateTaskModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-lg">Create New Task</DialogTitle>
        </DialogHeader>
        
        {/* Task form with all necessary props */}
        <TaskForm
          employees={employees}
          currentUserRole={currentUserRole}
          onSubmit={onSubmit}
          onCancel={onClose}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
} 