import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { Role } from '../features/employees/types';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: Role[];
  requireAuth?: boolean;
}

export const ProtectedRoute = ({ 
  children, 
  allowedRoles = [], 
  requireAuth = true 
}: ProtectedRouteProps) => {
  const { isAuthenticated, currentRole } = useAuth();

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If specific roles are required but user doesn't have permission
  if (allowedRoles.length > 0 && !allowedRoles.includes(currentRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}; 