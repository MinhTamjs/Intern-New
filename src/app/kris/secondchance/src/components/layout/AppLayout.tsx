/**
 * AppLayout Component
 * 
 * Main application layout wrapper that provides consistent navigation,
 * header structure, and responsive design across all pages.
 * 
 * Features:
 * - Responsive navigation header
 * - Role-based navigation items
 * - Theme toggle functionality
 * - User authentication display
 * - Consistent branding
 */

import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ThemeToggle } from '../ThemeToggle';
import { ConditionalLogo } from '../ConditionalLogo';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/button';
import { LogOut, Users, FileText } from 'lucide-react';
import { getRolePermissions } from '../../lib/roles/roleManager';

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const { logout, currentRole } = useAuth();
  const location = useLocation();
  const permissions = getRolePermissions(currentRole);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#121212]">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-[#5ce7ff] dark:border-gray-700">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3 ml-60">
              <ConditionalLogo size={62} className="mt-0" />
            </div>

            {/* Right-side controls */}
            <div className="flex items-center gap-4 ml-auto">
              {/* Navigation buttons */}
              <div className="flex items-center gap-2">
                {(currentRole === 'admin' || currentRole === 'manager') && (
                  <Link
                    to="/employees"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === '/employees'
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Users className="h-4 w-4 inline mr-2" />
                    Manage Employees
                  </Link>
                )}

                {permissions.canViewAuditLog && (
                  <Link
                    to="/audit-log"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === '/audit-log'
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <FileText className="h-4 w-4 inline mr-2" />
                    Audit Log
                  </Link>
                )}
              </div>

              {/* Theme toggle */}
              <ThemeToggle />

              {/* Logout */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2 ml-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">{children}</main>
    </div>
  );
};
