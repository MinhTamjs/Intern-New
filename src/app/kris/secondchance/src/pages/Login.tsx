import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ZiraLogo } from '../components/ZiraLogo';
import type { Role } from '../features/employees/types';

// Mock user database
const MOCK_USERS = [
  {
    id: '1',
    email: 'admin@zira.com',
    password: 'admin123',
    name: 'John Admin',
    role: 'admin' as Role
  },
  {
    id: '2',
    email: 'manager@zira.com',
    password: 'manager123',
    name: 'Sarah Manager',
    role: 'manager' as Role
  },
  {
    id: '3',
    email: 'user@zira.com',
    password: 'user123',
    name: 'Mike Employee',
    role: 'employee' as Role
  }
];

export const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      navigate('/');
    }
  }, [navigate]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email.trim() || !formData.password.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const user = MOCK_USERS.find(
        u => u.email === formData.email && u.password === formData.password
      );

      if (user) {
        // Store user data in localStorage
        const userData = {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        };
        
        localStorage.setItem('currentUser', JSON.stringify(userData));
        localStorage.setItem('currentRole', user.role);
        
        toast.success(`Welcome back, ${user.name}!`);
        navigate('/');
      } else {
        toast.error('Invalid email or password');
      }
      
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#121212] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <ZiraLogo size={64} />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome to ZIRA
          </CardTitle>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Sign in to your account
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-base font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white text-base"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-base font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
                className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white text-base"
              />
            </div>
            
            <Button
              type="submit"
              className="w-full text-base font-medium"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          
          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 className="text-base font-medium text-gray-900 dark:text-white mb-2">
              Demo Credentials:
            </h4>
            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <div><strong>Admin:</strong> admin@zira.com / admin123</div>
              <div><strong>Manager:</strong> manager@zira.com / manager123</div>
              <div><strong>Employee:</strong> user@zira.com / user123</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 