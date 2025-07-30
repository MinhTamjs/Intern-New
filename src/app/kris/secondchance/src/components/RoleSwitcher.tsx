import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import type { Role } from '../features/employees/types';

// Role switcher props
interface RoleSwitcherProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
}

/**
 * Role switcher component
 * Allows switching between demo user roles
 */
export function RoleSwitcher({ currentRole, onRoleChange }: RoleSwitcherProps) {
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

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600 dark:text-gray-400">Demo Role:</span>
      <Select value={currentRole} onValueChange={onRoleChange}>
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="admin">
            <div className="flex items-center gap-2">
              <Badge className={getRoleColor('admin')}>Admin</Badge>
            </div>
          </SelectItem>
          <SelectItem value="manager">
            <div className="flex items-center gap-2">
              <Badge className={getRoleColor('manager')}>Manager</Badge>
            </div>
          </SelectItem>
          <SelectItem value="employee">
            <div className="flex items-center gap-2">
              <Badge className={getRoleColor('employee')}>Employee</Badge>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
} 