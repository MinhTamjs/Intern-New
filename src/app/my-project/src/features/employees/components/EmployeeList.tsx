import { useEmployees } from '../hooks/useEmployees';
import { Avatar, AvatarImage, AvatarFallback } from '../../../components/ui/avatar';
import { Card } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Plus, Mail, MapPin, Calendar } from 'lucide-react';

export function EmployeeList() {
  const { data: employees = [], isLoading } = useEmployees();

  if (isLoading) return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span className="ml-3 text-gray-600">Loading team members...</span>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Team Members</h1>
            <p className="text-sm text-gray-600">Manage your team and their roles</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Member
          </Button>
        </div>
        
        {/* Team Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm font-medium text-blue-600">Total Members</p>
            <p className="text-2xl font-bold text-blue-900">{employees.length}</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm font-medium text-green-600">Active</p>
            <p className="text-2xl font-bold text-green-900">{employees.length}</p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-sm font-medium text-purple-600">Departments</p>
            <p className="text-2xl font-bold text-purple-900">3</p>
          </div>
        </div>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.map((emp) => (
          <Card key={emp.id} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-4">
              <Avatar className="w-12 h-12">
                <AvatarImage src={emp.avatar} alt={emp.name} />
                <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                  {emp.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 truncate">{emp.name}</h3>
                  <Badge 
                    variant={emp.position === 'admin' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {emp.position}
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{emp.department}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Mail className="w-3 h-3" />
                    <span className="truncate">{emp.email}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <MapPin className="w-3 h-3" />
                    <span>Remote</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    <span>Joined 2024</span>
                  </div>
                </div>
                
                <div className="mt-4 flex space-x-2">
                  <Button variant="outline" size="sm" className="text-xs">
                    View Profile
                  </Button>
                  <Button variant="ghost" size="sm" className="text-xs">
                    Message
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}