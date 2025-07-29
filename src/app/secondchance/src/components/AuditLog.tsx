import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { formatAuditLogDate } from '../lib/utils';
import type { AuditLogEntry, AuditActionType } from '../lib/auditLog';

interface AuditLogProps {
  logs: AuditLogEntry[];
}

export function AuditLog({ logs }: AuditLogProps) {
  const [filterType, setFilterType] = useState<'all' | 'task' | 'employee'>('all');
  const [filterAction, setFilterAction] = useState<AuditActionType | 'all'>('all');
  const [storageStatus, setStorageStatus] = useState<'available' | 'unavailable'>('available');

  // Check localStorage availability
  useEffect(() => {
    try {
      const testKey = '__test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      setStorageStatus('available');
    } catch (error) {
      setStorageStatus('unavailable');
    }
  }, []);

  const filteredLogs = logs.filter(log => {
    const typeMatch = filterType === 'all' || 
      (filterType === 'task' && log.actionType.includes('TASK')) ||
      (filterType === 'employee' && log.actionType.includes('EMPLOYEE'));
    
    const actionMatch = filterAction === 'all' || log.actionType === filterAction;
    
    return typeMatch && actionMatch;
  });

  const getActionColor = (actionType: AuditActionType) => {
    switch (actionType) {
      case 'TASK_CREATED':
        return 'bg-green-100 text-green-800';
      case 'TASK_DELETED':
        return 'bg-red-100 text-red-800';
      case 'TASK_STATUS_CHANGED':
        return 'bg-blue-100 text-blue-800';
      case 'TASK_MOVED':
        return 'bg-purple-100 text-purple-800'; // Distinct color for task movements
      case 'TASK_ASSIGNEE_UPDATED':
        return 'bg-indigo-100 text-indigo-800';
      case 'TASK_UPDATED':
        return 'bg-yellow-100 text-yellow-800';
      case 'EMPLOYEE_CREATED':
        return 'bg-green-100 text-green-800';
      case 'EMPLOYEE_DELETED':
        return 'bg-red-100 text-red-800';
      case 'EMPLOYEE_ROLE_CHANGED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: string) => {
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
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Audit Log</CardTitle>
            <div className="flex items-center space-x-2 mt-1">
              <p className="text-xs text-gray-500">
                {logs.length} entries
              </p>
              <span className="text-gray-300">•</span>
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${storageStatus === 'available' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-xs text-gray-500">
                  {storageStatus === 'available' ? 'localStorage' : 'No storage'}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Select value={filterType} onValueChange={(value) => setFilterType(value as 'all' | 'task' | 'employee')}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="task">Tasks</SelectItem>
                <SelectItem value="employee">Employees</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterAction} onValueChange={(value) => setFilterAction(value as AuditActionType | 'all')}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="TASK_CREATED">Task Created</SelectItem>
                <SelectItem value="TASK_DELETED">Task Deleted</SelectItem>
                <SelectItem value="TASK_STATUS_CHANGED">Status Changed</SelectItem>
                <SelectItem value="TASK_MOVED">Task Moved</SelectItem>
                <SelectItem value="TASK_ASSIGNEE_UPDATED">Assignee Updated</SelectItem>
                <SelectItem value="TASK_UPDATED">Task Updated</SelectItem>
                <SelectItem value="EMPLOYEE_CREATED">Employee Created</SelectItem>
                <SelectItem value="EMPLOYEE_ROLE_CHANGED">Role Changed</SelectItem>
                <SelectItem value="EMPLOYEE_DELETED">Employee Deleted</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="max-h-96 overflow-y-auto space-y-2">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No audit logs found
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div key={log.id} className="border rounded-lg p-4 space-y-3 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge className={`${getActionColor(log.actionType)} font-medium`}>
                      {log.actionType === 'TASK_MOVED' ? 'Task Moved' : log.actionType.replace(/_/g, ' ')}
                    </Badge>
                    <Badge className={`${getRoleColor(log.userRole)} font-medium`}>
                      {log.userRole}
                    </Badge>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">
                    {formatAuditLogDate(log.timestamp, "Time not available")}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-900 leading-relaxed">
                    {log.actionType === 'TASK_MOVED' && (
                      <span className="inline-block mr-2 text-purple-600">🔄</span>
                    )}
                    {log.details}
                  </p>
                  
                  {log.previousValue && log.newValue && (
                    <div className="flex items-center space-x-2 text-xs text-gray-600 bg-gray-50 px-3 py-2 rounded-md">
                      <span className="font-medium">Change:</span>
                      <span className="text-red-600 font-medium">"{log.previousValue}"</span>
                      <span className="text-gray-400">→</span>
                      <span className="text-green-600 font-medium">"{log.newValue}"</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
} 