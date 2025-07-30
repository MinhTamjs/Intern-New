import { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { EmployeeList } from './EmployeeList';
import { EmployeeFormDialog } from './EmployeeFormDialog';
import { useEmployees, useCreateEmployee } from '../hooks/useEmployees';
import type { Employee, CreateEmployeeData } from '../types';

// Props interface for the EmployeeManager component
interface EmployeeManagerProps {
  onEmployeeSelect?: (employee: Employee) => void; // Optional callback when employee is selected
}

/**
 * EmployeeManager component provides the main interface for managing employees
 * Handles employee listing, creation, and selection functionality
 */
export function EmployeeManager({ onEmployeeSelect }: EmployeeManagerProps) {
  // State for controlling the create employee dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Fetch employees data with loading state
  const { data: employees = [], isLoading } = useEmployees();
  
  // Mutation for creating new employees
  const createEmployeeMutation = useCreateEmployee();

  /**
   * Handles employee creation and closes dialog on success
   * @param data - Employee data to create
   */
  const handleCreateEmployee = (data: CreateEmployeeData) => {
    createEmployeeMutation.mutate(data, {
      onSuccess: () => {
        setIsDialogOpen(false); // Close dialog after successful creation
      },
    });
  };

  return (
    <div className="space-y-4">
      {/* Header with title and add button */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Employees</h2>
        <Button onClick={() => setIsDialogOpen(true)}>
          Add Employee
        </Button>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading employees...</p>
        </div>
      ) : (
        /* Employee list with click handler */
        <EmployeeList 
          employees={employees} 
          onEmployeeClick={onEmployeeSelect}
        />
      )}

      {/* Create employee dialog */}
      <EmployeeFormDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleCreateEmployee}
        isLoading={createEmployeeMutation.isPending}
      />
    </div>
  );
} 