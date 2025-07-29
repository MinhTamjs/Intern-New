// src/features/employees/EmployeeManager.tsx

import { useState } from 'react';
import { useEmployees } from '../hooks/useEmployees';
import { useDeleteEmployee } from '../hooks/useDeleteEmployee';
import { useCreateEmployee } from '../hooks/useCreateEmployee';
import { useUpdateEmployee } from '../hooks/useUpdateEmployee';
import type { Employee } from '../types';
import { EmployeeFormDialog } from './EmployeeFormDialog';
import { Button } from '../../../components/ui/button';
import { TrashIcon } from 'lucide-react';

export function EmployeeManager() {
  const { data: employees = [] } = useEmployees();
  const deleteEmployee = useDeleteEmployee();
  const createEmployee = useCreateEmployee();
  const updateEmployee = useUpdateEmployee();
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const handleCreateEmployee = (data: Omit<Employee, 'id'>) => {
    createEmployee.mutate(data);
  };

  const handleUpdateEmployee = (data: Omit<Employee, 'id'>) => {
    if (editingEmployee) {
      updateEmployee.mutate({ id: editingEmployee.id, ...data });
      setEditingEmployee(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Add Employee Button */}
      <EmployeeFormDialog 
        triggerLabel="Thêm nhân viên"
        onSubmit={handleCreateEmployee}
      />

      {/* Employee List */}
      <div className="space-y-2">
        {employees.map((employee) => (
          <div
            key={employee.id}
            className="flex items-center justify-between border p-3 rounded-md bg-white shadow"
          >
            <div>
              <p className="font-medium">{employee.name}</p>
              <p className="text-sm text-gray-500">{employee.position}</p>
            </div>

            <div className="flex gap-2">
              {/* Edit Button */}
              <EmployeeFormDialog 
                triggerLabel="Sửa"
                initialData={employee}
                onSubmit={handleUpdateEmployee}
              />

              {/* Delete Button */}
              <Button
                variant="destructive"
                size="icon"
                onClick={() => deleteEmployee.mutate(employee.id)}
              >
                <TrashIcon size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
