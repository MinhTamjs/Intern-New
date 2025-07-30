import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
import { TaskForm } from './TaskForm';
import type { CreateTaskData } from '../types';
import type { Employee, Role } from '../../employees/types';

// Props interface for the CreateTaskModal component
interface CreateTaskModalProps {
  isOpen: boolean; // Controls modal visibility
  onClose: () => void; // Callback when modal is closed
  onSubmit: (data: CreateTaskData) => void; // Callback when task is submitted
  employees: Employee[]; // List of available employees for assignment
  isLoading?: boolean; // Loading state for form submission
  currentRole?: Role; // Current user role for permission-based features
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
  isLoading = false,
  currentRole
}: CreateTaskModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        
        {/* Task form with all necessary props */}
        <TaskForm
          employees={employees}
          onSubmit={onSubmit}
          onCancel={onClose}
          isLoading={isLoading}
          currentRole={currentRole}
        />
      </DialogContent>
    </Dialog>
  );
} 