import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { useEmployees, useCreateEmployee, useUpdateEmployee, useDeleteEmployee } from '../features/employees';
import { getRolePermissions } from '../lib/roleManager';
import { auditLogHelpers } from '../lib/auditLog';
import { ZiraLogo } from '../components/ZiraLogo';
import { EmptyState } from '../components/EmptyState';
import type { Role } from '../features/employees/types';

interface EmployeeFormData {
  name: string;
  email: string;
  role: Role;
}

interface EmployeeManagementProps {
  currentRole: Role;
}

export function EmployeeManagement({ currentRole }: EmployeeManagementProps) {
  const navigate = useNavigate();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<{ id: string; data: EmployeeFormData } | null>(null);
  const [deletingEmployee, setDeletingEmployee] = useState<{ id: string; name: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const permissions = getRolePermissions(currentRole);

  const { data: employees = [], isLoading, error } = useEmployees();
  const createEmployeeMutation = useCreateEmployee();
  const updateEmployeeMutation = useUpdateEmployee();
  const deleteEmployeeMutation = useDeleteEmployee();

  // Check if user has admin access
  if (!permissions.canCreateEmployee) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <ZiraLogo size={48} variant="sky" />
        <h2 className="text-2xl font-bold text-red-600">ZIRA Access Denied</h2>
        <p className="text-gray-600 text-center max-w-md">
          You don't have permission to access the Employee Management page.
        </p>
        <Button onClick={() => navigate('/')}>
          Return to ZIRA Dashboard
        </Button>
      </div>
    );
  }

  // Filter employees based on search term
  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate role statistics
  const roleStats = employees.reduce((acc, employee) => {
    acc[employee.role] = (acc[employee.role] || 0) + 1;
    return acc;
  }, {} as Record<Role, number>);

  const handleAddEmployee = (data: EmployeeFormData) => {
    createEmployeeMutation.mutate(data, {
      onSuccess: (newEmployee) => {
        auditLogHelpers.employeeCreated(newEmployee.id, newEmployee.name, currentRole);
        toast.success('Employee added successfully');
        setIsAddDialogOpen(false);
      },
      onError: (error) => {
        toast.error('Failed to add employee');
        console.error('Employee creation error:', error);
      },
    });
  };

  const handleUpdateEmployee = (id: string, data: Partial<EmployeeFormData>) => {
    updateEmployeeMutation.mutate(
      { id, data },
      {
        onSuccess: (updatedEmployee) => {
          auditLogHelpers.employeeRoleChanged(id, updatedEmployee.name, 'previous', updatedEmployee.role, currentRole);
          toast.success('Employee updated successfully');
          setEditingEmployee(null);
        },
        onError: (error) => {
          toast.error('Failed to update employee');
          console.error('Employee update error:', error);
        },
      }
    );
  };

  const handleDeleteEmployee = (id: string) => {
    const employee = employees.find(emp => emp.id === id);
    if (!employee) return;

    deleteEmployeeMutation.mutate(id, {
      onSuccess: () => {
        auditLogHelpers.employeeDeleted(id, employee.name, currentRole);
        toast.success('Employee deleted successfully');
        setDeletingEmployee(null);
      },
      onError: (error) => {
        toast.error('Failed to delete employee');
        console.error('Employee deletion error:', error);
      },
    });
  };

  const getRoleColor = (role: Role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'manager':
        return 'bg-blue-100 text-blue-800';
      case 'employee':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
              <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
          <ZiraLogo size={48} variant="sky" />
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto"></div>
          <span className="text-xl font-semibold text-muted-foreground">Loading ZIRA...</span>
          <p className="text-gray-600">Loading employee data</p>
        </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <ZiraLogo size={48} variant="sky" />
        <h2 className="text-2xl font-bold text-red-600">ZIRA Error</h2>
        <p className="text-gray-600 text-center max-w-md">
          Failed to load employee data. Please try again.
        </p>
        <Button onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate('/')}>
                ← Back to ZIRA Dashboard
              </Button>
              <ZiraLogo size={24} showText={false} variant="sky" />
              <h1 className="text-xl font-semibold text-gray-900">ZIRA Employee Management</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">
                {employees.length} Total Employees
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Role Statistics */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">ZIRA Team Role Distribution</h2>
          <div className="flex space-x-4">
            <Badge className="bg-red-100 text-red-800">
              {roleStats.admin || 0} Admins
            </Badge>
            <Badge className="bg-blue-100 text-blue-800">
              {roleStats.manager || 0} Managers
            </Badge>
            <Badge className="bg-green-100 text-green-800">
              {roleStats.employee || 0} Employees
            </Badge>
          </div>
        </div>

        {/* Search and Add Employee */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1 max-w-sm">
            <Input
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            Add Team Member
          </Button>
        </div>

        {/* Employees Table */}
        <Card>
          <CardHeader>
            <CardTitle>ZIRA Team Members</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-12">
                      <EmptyState
                        title={searchTerm ? "No employees found" : "No team members yet"}
                        description={searchTerm 
                          ? "No employees match your search criteria. Try adjusting your search terms."
                          : "Start building your ZIRA team by adding the first team member."
                        }
                        variant="employees"
                        action={!searchTerm ? {
                          label: "Add First Team Member",
                          onClick: () => setIsAddDialogOpen(true)
                        } : undefined}
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">{employee.name}</TableCell>
                      <TableCell>{employee.email}</TableCell>
                      <TableCell>
                        <Badge className={getRoleColor(employee.role)}>
                          {employee.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingEmployee({
                              id: employee.id,
                              data: {
                                name: employee.name,
                                email: employee.email,
                                role: employee.role,
                              }
                            })}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setDeletingEmployee({
                              id: employee.id,
                              name: employee.name,
                            })}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Add Employee Dialog */}
      <AddEmployeeDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleAddEmployee}
        isLoading={createEmployeeMutation.isPending}
      />

      {/* Edit Employee Dialog */}
      {editingEmployee && (
        <EditEmployeeDialog
          employee={editingEmployee}
          onClose={() => setEditingEmployee(null)}
          onSubmit={(data) => handleUpdateEmployee(editingEmployee.id, data)}
          isLoading={updateEmployeeMutation.isPending}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingEmployee} onOpenChange={() => setDeletingEmployee(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete ZIRA Team Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingEmployee?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingEmployee && handleDeleteEmployee(deletingEmployee.id)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Add Employee Dialog Component
interface AddEmployeeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EmployeeFormData) => void;
  isLoading: boolean;
}

function AddEmployeeDialog({ isOpen, onClose, onSubmit, isLoading }: AddEmployeeDialogProps) {
  const [formData, setFormData] = useState<EmployeeFormData>({
    name: '',
    email: '',
    role: 'employee',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ name: '', email: '', role: 'employee' });
  };

  const handleClose = () => {
    setFormData({ name: '', email: '', role: 'employee' });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New ZIRA Team Member</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="block">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
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
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add Team Member'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Edit Employee Dialog Component
interface EditEmployeeDialogProps {
  employee: { id: string; data: EmployeeFormData };
  onClose: () => void;
  onSubmit: (data: Partial<EmployeeFormData>) => void;
  isLoading: boolean;
}

function EditEmployeeDialog({ employee, onClose, onSubmit, isLoading }: EditEmployeeDialogProps) {
  const [formData, setFormData] = useState<EmployeeFormData>(employee.data);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit ZIRA Team Member</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name" className="block">Name</Label>
            <Input
              id="edit-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-email" className="block">Email</Label>
            <Input
              id="edit-email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-role" className="block">Role</Label>
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
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 