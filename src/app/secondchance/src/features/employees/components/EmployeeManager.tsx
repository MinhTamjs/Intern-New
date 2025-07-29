import { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { EmployeeList } from './EmployeeList';
import { EmployeeFormDialog } from './EmployeeFormDialog';
import { useEmployees, useCreateEmployee } from '../hooks/useEmployees';
import type { Employee, CreateEmployeeData } from '../types';

interface EmployeeManagerProps {
  onEmployeeSelect?: (employee: Employee) => void;
}

export function EmployeeManager({ onEmployeeSelect }: EmployeeManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: employees = [], isLoading } = useEmployees();
  const createEmployeeMutation = useCreateEmployee();

  const handleCreateEmployee = (data: CreateEmployeeData) => {
    createEmployeeMutation.mutate(data, {
      onSuccess: () => {
        setIsDialogOpen(false);
      },
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Employees</h2>
        <Button onClick={() => setIsDialogOpen(true)}>
          Add Employee
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading employees...</p>
        </div>
      ) : (
        <EmployeeList 
          employees={employees} 
          onEmployeeClick={onEmployeeSelect}
        />
      )}

      <EmployeeFormDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleCreateEmployee}
        isLoading={createEmployeeMutation.isPending}
      />
    </div>
  );
} 