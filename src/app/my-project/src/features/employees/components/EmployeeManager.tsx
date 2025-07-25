// src/features/employees/EmployeeManager.tsx

import { useState } from 'react';
import { useEmployees } from '../hooks/useEmployees';
import { useDeleteEmployee } from '../hooks/useDeleteEmployee';
import { Employee } from '../types';
import { EmployeeFormDialog } from './EmployeeFormDialog';
import { Button } from '../../../components/ui/button';
import { Dialog, DialogTrigger } from '../../../components/ui/dialog';
import { PencilIcon, TrashIcon, PlusIcon } from 'lucide-react';

export function EmployeeManager() {
  const { data: employees = [] } = useEmployees();
  const deleteEmployee = useDeleteEmployee();
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  return (
    <div className="space-y-4">
      {/* Add Employee Button */}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="flex items-center gap-2">
            <PlusIcon size={16} />
            Add Employee
          </Button>
        </DialogTrigger>
        <EmployeeFormDialog />
      </Dialog>

      {/* Employee List */}
      <div className="space-y-2">
        {employees.map((employee) => (
          <div
            key={employee.id}
            className="flex items-center justify-between border p-3 rounded-md bg-white shadow"
          >
            <div>
              <p className="font-medium">{employee.name}</p>
              <p className="text-sm text-gray-500">{employee.role}</p>
            </div>

            <div className="flex gap-2">
              {/* Edit Button */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setEditingEmployee(employee)}
                  >
                    <PencilIcon size={16} />
                  </Button>
                </DialogTrigger>
                <EmployeeFormDialog employee={editingEmployee} />
              </Dialog>

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
