import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ThemeProvider } from './lib/theme/theme';
import { AuthProvider } from './contexts/AuthContext';
import { AppProvider } from './providers/AppProvider';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { EmployeeManagement } from './pages/EmployeeManagement';
import { AuditLog } from './pages/AuditLog';
import { Unauthorized } from './pages/Unauthorized';
import { ErrorBoundary } from './components/ErrorBoundary';

/**
 * Main App component - ZIRA task management system
 * Handles routing and global providers
 */
function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <AppProvider>
            <Router>
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                
                {/* Protected routes */}
                <Route path="/" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Dashboard />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/employees" element={
                  <ProtectedRoute allowedRoles={['admin', 'manager']}>
                    <AppLayout>
                      <EmployeeManagement />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/audit-log" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <AuditLog />
                    </AppLayout>
                  </ProtectedRoute>
                } />
              </Routes>
            </Router>
            <Toaster position="top-right" />
          </AppProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
