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
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium text-gray-700">Demo Role:</span>
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