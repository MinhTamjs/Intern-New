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
import type { Role, Employee } from '../features/employees/types';

// Props for the EmployeeManagement component
interface EmployeeManagementProps {
  currentRole: Role; // Current user's role for permission checks
}

/**
 * EmployeeManagement page - handles employee CRUD operations
 * Shows employee list, allows creating/editing/deleting employees
 */
export function EmployeeManagement({ currentRole }: EmployeeManagementProps) {
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
  const canManageEmployees = currentRole === 'admin';

  // Redirect if no permission
  useEffect(() => {
    if (!canManageEmployees) {
      toast.error('Access denied. Admin privileges required.');
      navigate('/');
    }
  }, [canManageEmployees, navigate]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#121212] flex flex-col items-center justify-center gap-4">
        <ZiraLogo size={48} variant="sky" />
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
        <ZiraLogo size={48} variant="sky" />
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
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      case 'manager':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      case 'employee':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    }
  };

  // Handle form submission for creating employee
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createEmployeeMutation.mutate(formData, {
      onSuccess: () => {
        toast.success('Employee created successfully');
        setIsCreateModalOpen(false);
        setFormData({ name: '', email: '', role: 'employee' });
      },
      onError: () => {
        toast.error('Failed to create employee');
      },
    });
  };

  // Handle form submission for editing employee
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEmployee) return;

    updateEmployeeMutation.mutate(
      { id: editingEmployee.id, data: formData },
      {
        onSuccess: () => {
          toast.success('Employee updated successfully');
          setIsEditModalOpen(false);
          setEditingEmployee(null);
          setFormData({ name: '', email: '', role: 'employee' });
        },
        onError: () => {
          toast.error('Failed to update employee');
        },
      }
    );
  };

  // Handle employee deletion
  const handleDelete = (employeeId: string) => {
    deleteEmployeeMutation.mutate(employeeId, {
      onSuccess: () => {
        toast.success('Employee deleted successfully');
      },
      onError: () => {
        toast.error('Failed to delete employee');
      },
    });
  };

  // Open edit modal
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
    <div className="min-h-screen bg-gray-50 dark:bg-[#121212]">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button variant="outline" onClick={() => navigate('/')}>Back to Dashboard</Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Role filter chips */}
        <div className="mb-6 flex items-center gap-4">
          <span className="font-medium text-gray-700 dark:text-gray-200">Filter by role:</span>
          <button
            className={`px-3 py-1 rounded-full border text-sm font-medium transition-colors ${roleFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200'}`}
            onClick={() => setRoleFilter('all')}
          >
            All
          </button>
          <button
            className={`px-3 py-1 rounded-full border text-sm font-medium transition-colors ${roleFilter === 'admin' ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200'}`}
            onClick={() => setRoleFilter('admin')}
          >
            Admin
          </button>
          <button
            className={`px-3 py-1 rounded-full border text-sm font-medium transition-colors ${roleFilter === 'manager' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200'}`}
            onClick={() => setRoleFilter('manager')}
          >
            Manager
          </button>
          <button
            className={`px-3 py-1 rounded-full border text-sm font-medium transition-colors ${roleFilter === 'employee' ? 'bg-green-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200'}`}
            onClick={() => setRoleFilter('employee')}
          >
            Employee
          </button>
        </div>

        {/* Employee list */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-gray-900 dark:text-white">ZIRA Team Members</CardTitle>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                Add Employee
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search input */}
            <div className="mb-4">
              <Input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>

            {/* Employee table */}
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200 dark:border-gray-700">
                  <TableHead className="text-gray-900 dark:text-white">Name</TableHead>
                  <TableHead className="text-gray-900 dark:text-white">Email</TableHead>
                  <TableHead className="text-gray-900 dark:text-white">Role</TableHead>
                  <TableHead className="text-right text-gray-900 dark:text-white">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee: Employee) => (
                  <TableRow key={employee.id} className="border-gray-200 dark:border-gray-700">
                    <TableCell className="font-medium text-gray-900 dark:text-white">{employee.name}</TableCell>
                    <TableCell className="text-gray-700 dark:text-gray-300">{employee.email}</TableCell>
                    <TableCell>
                      <Badge className={getRoleColor(employee.role)}>
                        {employee.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(employee)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(employee.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Create employee modal */}
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="block text-gray-900 dark:text-white">Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="block text-gray-900 dark:text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role" className="block text-gray-900 dark:text-white">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: Role) => setFormData({ ...formData, role: value })}
                >
                  <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="employee">Employee</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  Add Employee
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

        {/* Edit employee modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Employee</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name" className="block text-gray-900 dark:text-white">Name</Label>
                <Input
                  id="edit-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email" className="block text-gray-900 dark:text-white">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role" className="block text-gray-900 dark:text-white">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: Role) => setFormData({ ...formData, role: value })}
                >
                  <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="employee">Employee</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
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
    </div>
  );
} 