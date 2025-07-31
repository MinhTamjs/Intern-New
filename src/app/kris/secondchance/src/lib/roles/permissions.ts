import type { Role } from '../../features/employees/types';

export function canManageUser(actorRole: Role, targetRole: Role): boolean {
  if (actorRole === 'admin') return true;
  if (actorRole === 'manager' && targetRole === 'employee') return true;
  return false;
}