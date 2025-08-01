import { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Role } from '../features/employees/types';

interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
  currentRole: Role;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [currentRole, setCurrentRole] = useState<Role>('employee');

  // Check for existing user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    const storedRole = localStorage.getItem('currentRole') as Role;
    
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setCurrentRole(userData.role || storedRole || 'employee');
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('currentUser');
        localStorage.removeItem('currentRole');
      }
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    setCurrentRole(userData.role);
    localStorage.setItem('currentUser', JSON.stringify(userData));
    localStorage.setItem('currentRole', userData.role);
  };

  const logout = () => {
    setUser(null);
    setCurrentRole('employee');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentRole');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    currentRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 