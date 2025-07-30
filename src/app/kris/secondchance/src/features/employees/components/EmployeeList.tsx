import { Card, CardContent } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Avatar, AvatarFallback } from '../../../components/ui/avatar';
import type { Employee } from '../types';

// Props interface for the EmployeeList component
interface EmployeeListProps {
  employees: Employee[]; // List of employees to display
  onEmployeeClick?: (employee: Employee) => void; // Optional click handler for employee selection
}

/**
 * EmployeeList component displays a list of employees with their details
 * Shows employee name, email, role, and avatar with role-based color coding
 */
export function EmployeeList({ employees, onEmployeeClick }: EmployeeListProps) {
  /**
   * Returns appropriate color classes for role badges
   * @param role - Employee role to get color for
   * @returns Tailwind CSS classes for badge styling
   */
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800'; // Red for admin role
      case 'manager':
        return 'bg-blue-100 text-blue-800'; // Blue for manager role
      case 'employee':
        return 'bg-green-100 text-green-800'; // Green for employee role
      default:
        return 'bg-gray-100 text-gray-800'; // Gray for unknown roles
    }
  };

  return (
    <div className="space-y-3">
      {/* Map employees to individual cards */}
      {employees.map((employee) => (
        <Card
          key={employee.id}
          className={`cursor-pointer hover:shadow-md transition-shadow ${
            onEmployeeClick ? 'hover:bg-gray-50' : '' // Add hover effect if clickable
          }`}
          onClick={() => onEmployeeClick?.(employee)} // Handle employee selection
        >
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              {/* Employee avatar with initials */}
              <Avatar className="w-10 h-10">
                <AvatarFallback>
                  {employee.name.split(' ').map(n => n[0]).join('')} {/* Generate initials from name */}
                </AvatarFallback>
              </Avatar>
              
              {/* Employee information */}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 truncate">{employee.name}</h3>
                <p className="text-sm text-gray-500 truncate">{employee.email}</p>
              </div>
              
              {/* Role badge with color coding */}
              <Badge className={getRoleColor(employee.role)}>
                {employee.role}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 