import { Card, CardContent } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Avatar, AvatarFallback } from '../../../components/ui/avatar';
import type { Employee } from '../types';

interface EmployeeListProps {
  employees: Employee[];
  onEmployeeClick?: (employee: Employee) => void;
}

export function EmployeeList({ employees, onEmployeeClick }: EmployeeListProps) {
  const getRoleColor = (role: string) => {
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

  return (
    <div className="space-y-3">
      {employees.map((employee) => (
        <Card
          key={employee.id}
          className={`cursor-pointer hover:shadow-md transition-shadow ${
            onEmployeeClick ? 'hover:bg-gray-50' : ''
          }`}
          onClick={() => onEmployeeClick?.(employee)}
        >
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback>
                  {employee.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 truncate">{employee.name}</h3>
                <p className="text-sm text-gray-500 truncate">{employee.email}</p>
              </div>
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