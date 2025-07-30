import { Button } from './ui/button';
import { Badge } from './ui/badge';
import type { Role } from '../features/employees/types';

interface RoleSwitcherProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
}

export function RoleSwitcher({ currentRole, onRoleChange }: RoleSwitcherProps) {
  const roles: Role[] = ['admin', 'manager', 'employee'];

  const getRoleColor = (role: Role) => {
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

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Demo Role:</span>
      <div className="flex space-x-1">
        {roles.map((role) => (
          <Button
            key={role}
            variant={currentRole === role ? 'default' : 'outline'}
            size="sm"
            onClick={() => onRoleChange(role)}
            className="text-xs"
          >
            {role.charAt(0).toUpperCase() + role.slice(1)}
            {currentRole === role && (
              <Badge className={`ml-1 text-xs ${getRoleColor(role)}`}>
                Active
              </Badge>
            )}
          </Button>
        ))}
      </div>
    </div>
  );
} 