import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { ZiraLogo } from '../components/ZiraLogo';
import { useEmployees, useCreateEmployee, useUpdateEmployee, useDeleteEmployee } from '../features/employees';
import { useAuth } from '../contexts/AuthContext';
import type { Role, Employee } from '../features/employees/types';

/**
 * EmployeeManagement page - handles employee CRUD operations
 * Shows employee list, allows creating/editing/deleting employees
 */
export function EmployeeManagement() {
  const { currentRole } = useAuth();
  const navigate = useNavigate();
  
  // Form state for creating/editing employees
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'employee' as Role
  });
  
  // Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  // Role filter state
  const [roleFilter, setRoleFilter] = useState<string>('all');

  // Data fetching hooks
  const { data: employees = [], isLoading, error } = useEmployees();
  const createEmployeeMutation = useCreateEmployee();
  const updateEmployeeMutation = useUpdateEmployee();
  const deleteEmployeeMutation = useDeleteEmployee();

  // Check if user has permission to manage employees
  const canManageEmployees = currentRole === 'admin' || currentRole === 'manager';
  const canAssignRoles = currentRole === 'admin';

  // Redirect if no permission
  useEffect(() => {
    if (!canManageEmployees) {
      toast.error('Access denied. Admin or Manager privileges required.');
      navigate('/unauthorized');
    }
  }, [canManageEmployees, navigate]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#121212] flex flex-col items-center justify-center gap-4">
        <ZiraLogo size={48} />
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto"></div>
        <span className="text-xl font-semibold text-muted-foreground">Loading ZIRA...</span>
        <p className="text-gray-600 dark:text-gray-400">Loading employee data</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#121212] flex flex-col items-center justify-center gap-4">
        <ZiraLogo size={48} />
        <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">ZIRA Error</h2>
        <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
          Failed to load employee data. Please try again later.
        </p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  // Filter employees based on search term and role
  const filteredEmployees = (employees as Employee[]).filter((employee: Employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || employee.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Get color for role badge
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'manager':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'employee':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle create employee
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    createEmployeeMutation.mutate(formData, {
      onSuccess: () => {
        toast.success('Employee created successfully');
        setIsCreateModalOpen(false);
        setFormData({ name: '', email: '', role: 'employee' });
      },
      onError: (error) => {
        toast.error('Failed to create employee');
        console.error('Create employee error:', error);
      },
    });
  };

  // Handle edit employee
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingEmployee || !formData.name.trim() || !formData.email.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    updateEmployeeMutation.mutate(
      { id: editingEmployee.id, data: formData },
      {
        onSuccess: () => {
          toast.success('Employee updated successfully');
          setIsEditModalOpen(false);
          setEditingEmployee(null);
          setFormData({ name: '', email: '', role: 'employee' });
        },
        onError: (error) => {
          toast.error('Failed to update employee');
          console.error('Update employee error:', error);
        },
      }
    );
  };

  // Handle delete employee
  const handleDelete = (employeeId: string) => {
    deleteEmployeeMutation.mutate(employeeId, {
      onSuccess: () => {
        toast.success('Employee deleted successfully');
      },
      onError: (error) => {
        toast.error('Failed to delete employee');
        console.error('Delete employee error:', error);
      },
    });
  };

  // Handle edit button click
  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormData({
      name: employee.name,
      email: employee.email,
      role: employee.role
    });
    setIsEditModalOpen(true);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Employee Management</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage your team members and their roles
        </p>
      </div>

      {/* Controls */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative">
            <Input
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
            />
          </div>

          {/* Role filter */}
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full sm:w-40 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="employee">Employee</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Add employee button */}
        <Button onClick={() => setIsCreateModalOpen(true)}>
          Add Employee
        </Button>
      </div>

      {/* Employee table */}
      <Card>
        <CardHeader>
          <CardTitle>Employees ({filteredEmployees.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">{employee.name}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>
                    <Badge className={getRoleColor(employee.role)}>
                      {employee.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(employee)}
                      >
                        Edit
                      </Button>
                      {currentRole === 'admin' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(employee.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Employee Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle>Add New Employee</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
                className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value: Role) => handleInputChange('role', value)}
                disabled={!canAssignRoles}
              >
                <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employee">Employee</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  {canAssignRoles && <SelectItem value="admin">Admin</SelectItem>}
                </SelectContent>
              </Select>
              {!canAssignRoles && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Only admins can assign roles
                </p>
              )}
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1">
                Create Employee
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateModalOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Employee Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
                className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value: Role) => handleInputChange('role', value)}
                disabled={!canAssignRoles}
              >
                <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employee">Employee</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  {canAssignRoles && <SelectItem value="admin">Admin</SelectItem>}
                </SelectContent>
              </Select>
              {!canAssignRoles && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Only admins can modify roles
                </p>
              )}
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1">
                Update Employee
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 