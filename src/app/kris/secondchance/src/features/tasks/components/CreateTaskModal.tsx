import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
import { TaskForm } from './TaskForm';
import type { CreateTaskData } from '../types';
import type { Employee } from '../../employees/types';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTaskData) => void;
  employees: Employee[];
  isLoading?: boolean;
}

export function CreateTaskModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  employees, 
  isLoading = false 
}: CreateTaskModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        
        <TaskForm
          employees={employees}
          onSubmit={onSubmit}
          onCancel={onClose}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
} 