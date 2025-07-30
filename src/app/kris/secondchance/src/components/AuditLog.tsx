import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { toast } from 'sonner';
import { formatAuditLogDate } from '../lib/utils';
import { updateTaskStatus, canRestoreStatusChange } from '../lib/taskUtils';
import type { AuditLogEntry, AuditActionType } from '../lib/auditLog';
import type { Role } from '../features/employees/types';

interface AuditLogProps {
  logs: AuditLogEntry[];
  currentUserRole?: Role; // Current user role for restore permissions
  onTaskUpdate?: () => void; // Callback when a task is restored
}

export function AuditLog({ logs, currentUserRole, onTaskUpdate }: AuditLogProps) {
  const [filterType, setFilterType] = useState<'all' | 'task' | 'employee'>('all');
  const [filterAction, setFilterAction] = useState<AuditActionType | 'all'>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table'); // Default to table view
  const [storageStatus, setStorageStatus] = useState<'available' | 'unavailable'>('available');
  const [restoringLogs, setRestoringLogs] = useState<Set<string>>(new Set()); // Track which logs are being restored

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
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'TASK_DELETED':
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      case 'TASK_STATUS_CHANGED':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      case 'TASK_MOVED':
        return 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200'; // Distinct color for task movements
      case 'TASK_ASSIGNEE_UPDATED':
        return 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200';
      case 'TASK_UPDATED':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case 'EMPLOYEE_CREATED':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'EMPLOYEE_DELETED':
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      case 'EMPLOYEE_ROLE_CHANGED':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    }
  };

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

  /**
   * Handles the restore action for a task status change
   * Reverses the status change and creates a new audit log entry
   * @param log - The audit log entry to restore
   */
  const handleRestore = async (log: AuditLogEntry) => {
    if (!currentUserRole || !canRestoreStatusChange(log)) {
      return;
    }

    // Add log to restoring set to show loading state
    setRestoringLogs(prev => new Set(prev).add(log.id));

    try {
      // Restore the task status (reverse the change)
      const restoredTask = updateTaskStatus(
        log.entityId, 
        log.previousValue as any, // previousValue becomes the new status
        currentUserRole
      );

      if (restoredTask) {
        console.log(`Successfully restored task ${log.entityId} status`);
        
        // Show success toast
        toast.success(`Task status restored from "${log.newValue}" to "${log.previousValue}"`);
        
        // Notify parent component that a task was updated
        if (onTaskUpdate) {
          onTaskUpdate();
        }
      } else {
        console.error('Failed to restore task status');
        toast.error('Failed to restore task status');
      }
    } catch (error) {
      console.error('Error restoring task status:', error);
      toast.error('Error restoring task status');
    } finally {
      // Remove log from restoring set
      setRestoringLogs(prev => {
        const newSet = new Set(prev);
        newSet.delete(log.id);
        return newSet;
      });
    }
  };

  /**
   * Checks if the current user can restore a specific log entry
   * Only admins and managers can restore status changes
   * @param log - The audit log entry to check
   * @returns True if the user can restore this log
   */
  const canRestore = (log: AuditLogEntry): boolean => {
    if (!currentUserRole) return false;
    if (currentUserRole === 'employee') return false;
    return canRestoreStatusChange(log);
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
            <Select value={viewMode} onValueChange={(value) => setViewMode(value as 'cards' | 'table')}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="table">Table</SelectItem>
                <SelectItem value="cards">Cards</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="max-h-96 overflow-y-auto">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No audit logs found
            </div>
          ) : viewMode === 'table' ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>Entity</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Change</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <Badge className={`${getActionColor(log.actionType)} font-medium`}>
                        {log.actionType === 'TASK_MOVED' ? 'Task Moved' : log.actionType.replace(/_/g, ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{log.entityName}</TableCell>
                    <TableCell>
                      <Badge className={`${getRoleColor(log.userRole)} font-medium`}>
                        {log.userRole}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="text-sm">
                        {log.actionType === 'TASK_MOVED' && (
                          <span className="inline-block mr-1 text-purple-600">🔄</span>
                        )}
                        {log.details}
                      </div>
                    </TableCell>
                    <TableCell>
                      {log.previousValue && log.newValue ? (
                        <div className="flex items-center space-x-1 text-xs">
                          <span className="text-red-600 dark:text-red-400 font-medium">"{log.previousValue}"</span>
                          <span className="text-gray-400 dark:text-gray-500">→</span>
                          <span className="text-green-600 dark:text-green-400 font-medium">"{log.newValue}"</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500 text-xs">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-gray-500 dark:text-gray-400">
                      {formatAuditLogDate(log.timestamp, "Time not available")}
                    </TableCell>
                    <TableCell>
                      {canRestore(log) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRestore(log)}
                          disabled={restoringLogs.has(log.id)}
                          className="text-xs h-6 px-2"
                        >
                          {restoringLogs.has(log.id) ? 'Restoring...' : 'Restore'}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="space-y-2">
              {filteredLogs.map((log) => (
                <div key={log.id} className="border rounded-lg p-4 space-y-3 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge className={`${getActionColor(log.actionType)} font-medium`}>
                        {log.actionType === 'TASK_MOVED' ? 'Task Moved' : log.actionType.replace(/_/g, ' ')}
                      </Badge>
                      <Badge className={`${getRoleColor(log.userRole)} font-medium`}>
                        {log.userRole}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                        {formatAuditLogDate(log.timestamp, "Time not available")}
                      </span>
                      {canRestore(log) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRestore(log)}
                          disabled={restoringLogs.has(log.id)}
                          className="text-xs h-6 px-2"
                        >
                          {restoringLogs.has(log.id) ? 'Restoring...' : 'Restore'}
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-white leading-relaxed">
                      {log.actionType === 'TASK_MOVED' && (
                        <span className="inline-block mr-2 text-purple-600 dark:text-purple-400">🔄</span>
                      )}
                      {log.details}
                    </p>
                    
                    {log.previousValue && log.newValue && (
                      <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md">
                        <span className="font-medium">Change:</span>
                        <span className="text-red-600 dark:text-red-400 font-medium">"{log.previousValue}"</span>
                        <span className="text-gray-400 dark:text-gray-500">→</span>
                        <span className="text-green-600 dark:text-green-400 font-medium">"{log.newValue}"</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 